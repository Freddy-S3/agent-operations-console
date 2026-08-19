import { randomUUID } from "node:crypto";

export const RUN_STATUS = Object.freeze({
  RECEIVED: "received",
  PROVISIONING: "provisioning",
  AWAITING_APPROVAL: "awaiting_approval",
  APPROVED: "approved",
  EXECUTING: "executing",
  AWAITING_REVIEW: "awaiting_review",
  FAILED: "failed",
  RECOVERED: "recovered",
  COMPLETED: "completed",
});

const TRANSITIONS = Object.freeze({
  [RUN_STATUS.RECEIVED]: [RUN_STATUS.PROVISIONING, RUN_STATUS.FAILED],
  [RUN_STATUS.PROVISIONING]: [RUN_STATUS.AWAITING_APPROVAL, RUN_STATUS.FAILED],
  [RUN_STATUS.AWAITING_APPROVAL]: [RUN_STATUS.APPROVED, RUN_STATUS.FAILED],
  [RUN_STATUS.APPROVED]: [RUN_STATUS.EXECUTING, RUN_STATUS.FAILED],
  [RUN_STATUS.EXECUTING]: [RUN_STATUS.AWAITING_REVIEW, RUN_STATUS.FAILED],
  [RUN_STATUS.AWAITING_REVIEW]: [RUN_STATUS.COMPLETED, RUN_STATUS.FAILED],
  [RUN_STATUS.FAILED]: [RUN_STATUS.RECOVERED],
  [RUN_STATUS.RECOVERED]: [RUN_STATUS.EXECUTING, RUN_STATUS.FAILED],
  [RUN_STATUS.COMPLETED]: [],
});

function timestamp(clock) {
  return clock().toISOString();
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function flattenAtlassianDocument(value) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) return value.map(flattenAtlassianDocument).filter(Boolean).join(" ");
  if (value.type === "text" && typeof value.text === "string") return value.text;
  return flattenAtlassianDocument(value.content);
}

function normalizeRepository(value, fallback = {}) {
  const repository = value && typeof value === "object" ? value : {};
  const defaultRepository = fallback && typeof fallback === "object" ? fallback : {};
  return {
    provider: repository.provider ?? defaultRepository.provider ?? "bitbucket-stash",
    host: repository.host ?? defaultRepository.host ?? null,
    projectKey: repository.projectKey ?? defaultRepository.projectKey ?? null,
    slug: repository.slug ?? defaultRepository.slug ?? null,
    defaultBranch: repository.defaultBranch ?? defaultRepository.defaultBranch ?? "main",
    developmentBranch: repository.developmentBranch ?? defaultRepository.developmentBranch ?? null,
    releaseBranch: repository.releaseBranch ?? defaultRepository.releaseBranch ?? null,
  };
}

export function normalizeJiraIssue(payload, { defaultRepository = {} } = {}) {
  const issue = payload?.issue ?? payload ?? {};
  const fields = issue.fields ?? {};
  const repository = payload?.repository ?? fields.repository ?? fields.customfield_repository;
  const confluence = payload?.confluence ?? fields.confluence ?? null;
  const labels = asArray(fields.labels ?? payload?.labels);

  return {
    id: String(issue.id ?? issue.key ?? randomUUID()),
    key: String(issue.key ?? payload?.key ?? "UNKNOWN-0"),
    summary: String(fields.summary ?? payload?.summary ?? "Untitled ticket"),
    description: flattenAtlassianDocument(fields.description ?? payload?.description),
    status: String(fields.status?.name ?? payload?.status ?? "Unknown"),
    issueType: String(fields.issuetype?.name ?? payload?.issueType ?? "Task"),
    priority: String(fields.priority?.name ?? payload?.priority ?? "Normal"),
    labels,
    projectKey: String(fields.project?.key ?? payload?.projectKey ?? "UNKNOWN"),
    targetBranch: fields.targetBranch ?? payload?.targetBranch ?? null,
    repository: normalizeRepository(repository, defaultRepository),
    confluence: confluence && typeof confluence === "object" ? {
      spaceKey: confluence.spaceKey ?? null,
      parentPageId: confluence.parentPageId ?? null,
    } : null,
  };
}

export function isEligibleTicket(ticket, requiredLabel = "agent-ready") {
  return ticket.labels.some((label) => label.toLowerCase() === requiredLabel.toLowerCase());
}

export function createRun(ticket, { idFactory = randomUUID, clock = () => new Date() } = {}) {
  const createdAt = timestamp(clock);
  return {
    id: idFactory(),
    status: RUN_STATUS.RECEIVED,
    ticket,
    branchRecommendation: null,
    environment: null,
    evidence: [],
    events: [{
      type: "ticket.received",
      at: createdAt,
      detail: `${ticket.key} entered the agent-ready intake path.`,
    }],
    failure: null,
    approval: null,
    createdAt,
    updatedAt: createdAt,
  };
}

export function transitionRun(run, nextStatus, detail, { clock = () => new Date() } = {}) {
  if (!Object.hasOwn(TRANSITIONS, run.status)) {
    throw new Error(`Unknown run status: ${run.status}`);
  }
  if (!TRANSITIONS[run.status].includes(nextStatus)) {
    throw new Error(`Cannot transition run from ${run.status} to ${nextStatus}`);
  }
  const at = timestamp(clock);
  return {
    ...run,
    status: nextStatus,
    updatedAt: at,
    events: [...run.events, { type: `run.${nextStatus}`, at, detail }],
  };
}

export function recordEvent(run, type, detail, { clock = () => new Date() } = {}) {
  const at = timestamp(clock);
  return {
    ...run,
    updatedAt: at,
    events: [...run.events, { type, at, detail }],
  };
}

export function addEvidence(run, evidence, { clock = () => new Date() } = {}) {
  const at = timestamp(clock);
  return {
    ...run,
    updatedAt: at,
    evidence: [...run.evidence, { ...evidence, at }],
    events: [...run.events, {
      type: "evidence.recorded",
      at,
      detail: evidence.label,
    }],
  };
}

export function setApproval(run, operator, { clock = () => new Date() } = {}) {
  const at = timestamp(clock);
  return {
    ...run,
    updatedAt: at,
    approval: { operator, at },
    events: [...run.events, {
      type: "approval.granted",
      at,
      detail: `${operator} approved the bounded first pass.`,
    }],
  };
}

export function setFailure(run, reason, { clock = () => new Date() } = {}) {
  const at = timestamp(clock);
  return {
    ...run,
    updatedAt: at,
    failure: { reason, at },
  };
}

export function clearFailure(run, { clock = () => new Date() } = {}) {
  const at = timestamp(clock);
  return {
    ...run,
    updatedAt: at,
    failure: null,
    events: [...run.events, {
      type: "run.recovery_started",
      at,
      detail: "The operator resumed the run from its preserved environment and evidence.",
    }],
  };
}

export function listTransitions(status) {
  return [...(TRANSITIONS[status] ?? [])];
}
