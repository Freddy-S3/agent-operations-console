import {
  RUN_STATUS,
  addEvidence,
  createRun,
  isEligibleTicket,
  normalizeJiraIssue,
  recordEvent,
  setApproval,
  setFailure,
  clearFailure,
  transitionRun,
} from "./domain.js";
import {
  DryRunEnvironmentProvider,
  MemoryRunStore,
  RulesBasedBranchAdvisor,
} from "./adapters.js";
import { createLogger, JsonlAuditEventStore } from "./logging.js";

export class AgentOperationsOrchestrator {
  constructor({
    store = new MemoryRunStore(),
    eventStore = new JsonlAuditEventStore({ path: process.env.AUDIT_LOG_PATH ?? ".scratch/audit-events.jsonl" }),
    logger = createLogger(),
    branchAdvisor = new RulesBasedBranchAdvisor(),
    environmentProvider = new DryRunEnvironmentProvider(),
    defaultRepository = {},
    requiredLabel = "agent-ready",
    clock = () => new Date(),
    idFactory,
  } = {}) {
    this.store = store;
    this.eventStore = eventStore;
    this.logger = logger;
    this.publishedEventIds = new Set();
    this.branchAdvisor = branchAdvisor;
    this.environmentProvider = environmentProvider;
    this.defaultRepository = defaultRepository;
    this.requiredLabel = requiredLabel;
    this.clock = clock;
    this.idFactory = idFactory;
  }

  listRuns() {
    return this.store.list();
  }

  getRun(id) {
    return this.store.get(id);
  }

  listEvents(id) {
    return this.eventStore.list({ runId: id });
  }

  clearRuns() {
    this.store.clear();
    this.eventStore.clear();
    this.publishedEventIds.clear();
  }

  async ingestJiraWebhook(payload, { requestId = null } = {}) {
    const ticket = normalizeJiraIssue(payload, { defaultRepository: this.defaultRepository });
    if (!isEligibleTicket(ticket, this.requiredLabel)) {
      this.logger.warn("intake.rejected", {
        requestId,
        ticketKey: ticket.key,
        requiredLabel: this.requiredLabel,
        reason: "ticket_not_eligible",
      });
      return {
        accepted: false,
        reason: `Ticket must carry the ${this.requiredLabel} label before it can enter the first-pass workflow.`,
        ticket,
      };
    }

    let run = createRun(ticket, { clock: this.clock, idFactory: this.idFactory, correlationId: requestId });
    this.#save(run, { requestId });
    try {
      run = transitionRun(run, RUN_STATUS.PROVISIONING, "The intake hook is preparing an isolated environment.", { clock: this.clock });
      const branchRecommendation = await this.branchAdvisor.recommend(ticket);
      run = { ...run, branchRecommendation };
      run = addEvidence(run, {
        type: "branch-plan",
        label: "Branch decision",
        value: `${branchRecommendation.baseBranch} (${branchRecommendation.source}; confidence ${branchRecommendation.confidence})`,
      }, { clock: this.clock });
      const environment = await this.environmentProvider.provision({
        runId: run.id,
        ticket,
        branchRecommendation,
      });
      run = { ...run, environment };
      run = addEvidence(run, {
        type: "environment",
        label: "Isolated environment",
        value: `${environment.provider} environment ready on ${environment.workingBranch}`,
      }, { clock: this.clock });
      run = transitionRun(run, RUN_STATUS.AWAITING_APPROVAL, "Environment is ready; an operator must approve the bounded first pass.", { clock: this.clock });
      this.#save(run, { requestId });
      return { accepted: true, run };
    } catch (error) {
      run = setFailure(run, error.message, { clock: this.clock });
      if (run.status !== RUN_STATUS.FAILED) {
        run = transitionRun(run, RUN_STATUS.FAILED, "The intake hook could not prepare the run.", { clock: this.clock });
      }
      this.logger.error("run.intake_failed", { requestId, runId: run.id, ticketKey: ticket.key, error });
      this.#save(run, { requestId });
      return { accepted: true, run, error: error.message };
    }
  }

  approve(id, operator = "operator", { requestId = null } = {}) {
    let run = this.#requireRun(id);
    run = transitionRun(run, RUN_STATUS.APPROVED, "The operator approved the environment and branch plan.", { clock: this.clock });
    run = setApproval(run, operator, { clock: this.clock });
    run = addEvidence(run, {
      type: "approval",
      label: "Human approval",
      value: `${operator} approved the first pass.`,
    }, { clock: this.clock });
    return this.#save(run, { requestId });
  }

  execute(id, { requestId = null } = {}) {
    let run = this.#requireRun(id);
    run = transitionRun(run, RUN_STATUS.EXECUTING, "The restricted first pass is running in the isolated environment.", { clock: this.clock });
    run = addEvidence(run, {
      type: "execution",
      label: "First pass started",
      value: "Worker launch is represented; no external agent or repository mutation occurs in dry-run mode.",
    }, { clock: this.clock });
    run = transitionRun(run, RUN_STATUS.AWAITING_REVIEW, "The dry-run worker completed its preflight and is waiting for review evidence.", { clock: this.clock });
    run = addEvidence(run, {
      type: "verification",
      label: "Verification checkpoint",
      value: "Preflight complete; reviewer action is required before completion.",
    }, { clock: this.clock });
    return this.#save(run, { requestId });
  }

  fail(id, reason = "The worker lost context during execution.", { requestId = null } = {}) {
    let run = this.#requireRun(id);
    run = setFailure(run, reason, { clock: this.clock });
    run = transitionRun(run, RUN_STATUS.FAILED, "The worker execution failed; recovery is required.", { clock: this.clock });
    return this.#save(run, { requestId });
  }

  async recover(id, { requestId = null } = {}) {
    let run = this.#requireRun(id);
    run = transitionRun(run, RUN_STATUS.RECOVERED, "The operator accepted recovery from the preserved run state.", { clock: this.clock });
    if (run.environment && this.environmentProvider.recover) {
      run = { ...run, environment: await this.environmentProvider.recover({ environment: run.environment, run }) };
    }
    run = clearFailure(run, { clock: this.clock });
    run = addEvidence(run, {
      type: "recovery",
      label: "Recovery checkpoint",
      value: "The same run identity and isolated environment were preserved for a safe resume.",
    }, { clock: this.clock });
    return this.#save(run, { requestId });
  }

  complete(id, { requestId = null } = {}) {
    let run = this.#requireRun(id);
    run = transitionRun(run, RUN_STATUS.COMPLETED, "The operator recorded the review checkpoint as complete.", { clock: this.clock });
    run = addEvidence(run, {
      type: "completion",
      label: "Completion record",
      value: "The first-pass evidence bundle is ready for handoff or draft-PR creation.",
    }, { clock: this.clock });
    return this.#save(run, { requestId });
  }

  #save(run, { requestId = null } = {}) {
    const saved = this.store.save(run);
    for (const event of saved.events) {
      if (this.publishedEventIds.has(event.eventId)) continue;
      this.eventStore.append(event);
      this.publishedEventIds.add(event.eventId);
      this.logger.info("audit.event", {
        requestId,
        eventId: event.eventId,
        eventType: event.type,
        runId: event.runId,
        correlationId: event.correlationId,
        causationId: event.causationId,
        actor: event.actor,
        severity: event.severity,
        detail: event.detail,
        metadata: event.metadata,
      });
    }
    return saved;
  }

  #requireRun(id) {
    const run = this.store.get(id);
    if (!run) {
      const error = new Error(`Run ${id} was not found.`);
      error.statusCode = 404;
      throw error;
    }
    return run;
  }
}
