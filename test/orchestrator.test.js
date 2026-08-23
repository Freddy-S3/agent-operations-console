import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { test } from "node:test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sampleHarnessDogfoodWebhook, sampleJiraWebhook } from "../src/demo.js";
import { RUN_STATUS, normalizeJiraIssue } from "../src/domain.js";
import { AtlassianHttpAdapter, DryRunEnvironmentProvider, MemoryAuditEventStore, MemoryRunStore, RulesBasedBranchAdvisor } from "../src/adapters.js";
import { AgentOperationsOrchestrator } from "../src/orchestrator.js";
import { createServer, verifyWebhookSignature } from "../src/server.js";
import { JsonlAuditEventStore, createLogger } from "../src/logging.js";

function createOrchestrator(overrides = {}) {
  let counter = 0;
  const clock = () => new Date("2026-08-18T04:00:00.000Z");
  return new AgentOperationsOrchestrator({
    store: new MemoryRunStore(),
    eventStore: new MemoryAuditEventStore(),
    logger: createLogger({ sink: () => {} }),
    branchAdvisor: new RulesBasedBranchAdvisor(),
    environmentProvider: new DryRunEnvironmentProvider({ idFactory: () => `fixed-${++counter}`, clock }),
    clock,
    idFactory: () => "run-fixed",
    ...overrides,
  });
}

function createCaptureLogger(clock = () => new Date("2026-08-18T04:00:00.000Z")) {
  const lines = [];
  return {
    lines,
    logger: createLogger({ clock, sink: (line) => lines.push(line) }),
  };
}

async function withServer(server, callback) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("redacts sensitive structured log fields and preserves correlation context", () => {
  const { lines, logger } = createCaptureLogger();
  logger.info("worker.started", {
    runId: "run-1",
    correlationId: "request-1",
    token: "do-not-write",
    prompt: "private prompt",
    nested: { apiKey: "also-private", api_key: "also-private-too", client_secret: "and-private" },
    authorization: "Bearer secret-token",
  });
  const record = JSON.parse(lines[0]);
  assert.equal(record.runId, "run-1");
  assert.equal(record.correlationId, "request-1");
  assert.equal(record.token, "[REDACTED]");
  assert.equal(record.prompt, "[REDACTED]");
  assert.equal(record.nested.apiKey, "[REDACTED]");
  assert.equal(record.nested.api_key, "[REDACTED]");
  assert.equal(record.nested.client_secret, "[REDACTED]");
  assert.equal(record.authorization, "[REDACTED]");
  assert.doesNotMatch(lines[0], /do-not-write|private prompt|secret-token|also-private/);
});

test("persists idempotent JSONL audit events and reloads them", () => {
  const directory = mkdtempSync(join(tmpdir(), "aoc-audit-"));
  const path = join(directory, "events.jsonl");
  try {
    const event = {
      eventId: "event-1",
      type: "approval.granted",
      at: "2026-08-18T04:00:00.000Z",
      runId: "run-1",
      correlationId: "request-1",
      causationId: null,
      actor: { type: "operator", id: "Faruk" },
      severity: "info",
      detail: "Faruk approved the bounded first pass.",
      metadata: {},
    };
    const store = new JsonlAuditEventStore({ path });
    store.append(event);
    store.append(event);
    assert.equal(readFileSync(path, "utf8").trim().split("\n").length, 1);
    const reopened = new JsonlAuditEventStore({ path });
    assert.deepEqual(reopened.list({ runId: "run-1" }), [event]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("publishes correlated audit events without exposing failure secrets", async () => {
  const capture = createCaptureLogger();
  const eventStore = new MemoryAuditEventStore();
  const orchestrator = createOrchestrator({ eventStore, logger: capture.logger });
  const result = await orchestrator.ingestJiraWebhook(sampleJiraWebhook(), { requestId: "request-1" });
  orchestrator.approve(result.run.id, "Faruk", { requestId: "request-2" });
  orchestrator.execute(result.run.id, { requestId: "request-3" });
  const failed = orchestrator.fail(result.run.id, "Authorization: Bearer do-not-write", { requestId: "request-4" });

  const events = eventStore.list({ runId: result.run.id });
  const logs = capture.lines.map((line) => JSON.parse(line));
  assert.equal(events.length, failed.events.length);
  assert.ok(events.every((event) => event.runId === result.run.id && event.correlationId === "request-1"));
  assert.ok(logs.some((record) => record.eventType === "approval.granted" && record.requestId === "request-2"));
  assert.doesNotMatch(capture.lines.join("\n"), /do-not-write/);
});

test("logs HTTP requests, returns their correlation ID, and exposes durable events", async () => {
  const capture = createCaptureLogger();
  const orchestrator = createOrchestrator({ logger: capture.logger });
  const server = createServer({ orchestrator, logger: capture.logger });
  await withServer(server, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/demo/ingest`, {
      method: "POST",
      headers: { "X-Correlation-ID": "request-http-1" },
      body: JSON.stringify({ prompt: "never record request bodies" }),
    });
    assert.equal(response.status, 202);
    assert.equal(response.headers.get("x-correlation-id"), "request-http-1");
    const { run } = await response.json();
    const eventsResponse = await fetch(`${baseUrl}/api/runs/${run.id}/events`);
    assert.equal(eventsResponse.status, 200);
    const { events } = await eventsResponse.json();
    assert.equal(events.length, run.events.length);
  });
  const requestLog = capture.lines.map((line) => JSON.parse(line)).find((record) => record.message === "http.request" && record.path === "/api/demo/ingest");
  assert.equal(requestLog.requestId, "request-http-1");
  assert.equal(requestLog.statusCode, 202);
  assert.doesNotMatch(capture.lines.join("\n"), /never record request bodies/);
});

test("keeps startup diagnostics on the structured log path", () => {
  const { logger, lines } = createCaptureLogger();
  logger.info("server.started", { host: "127.0.0.1", port: 4310 });
  const record = JSON.parse(lines[0]);
  assert.equal(record.message, "server.started");
  assert.equal(record.port, 4310);
});

test("normalizes an Atlassian document and preserves repository routing data", () => {
  const ticket = normalizeJiraIssue(sampleJiraWebhook());
  assert.equal(ticket.key, "PAY-142");
  assert.equal(ticket.description, "Prevent duplicate charges when a payment provider retries a request.");
  assert.equal(ticket.repository.slug, "payments-service");
  assert.deepEqual(ticket.labels, ["agent-ready", "development"]);
});

test("verifies Jira hook signatures with an HMAC and rejects tampering", () => {
  const raw = Buffer.from('{"issue":{"key":"PAY-142"}}');
  const signature = createHmac("sha256", "secret").update(raw).digest("hex");
  assert.equal(verifyWebhookSignature(raw, `sha256=${signature}`, "secret"), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{"issue":{"key":"PAY-143"}}'), `sha256=${signature}`, "secret"), false);
  assert.equal(verifyWebhookSignature(raw, "sha256=not-a-real-signature", "secret"), false);
});

test("keeps Jira, Confluence, and Bitbucket provider hosts independently configurable", async () => {
  const requests = [];
  const adapter = new AtlassianHttpAdapter({
    jiraBaseUrl: "https://jira.example.test",
    confluenceBaseUrl: "https://wiki.example.test",
    bitbucketBaseUrl: "https://stash.example.test",
    token: "test-token",
    fetchImpl: async (url) => {
      requests.push(url);
      return { ok: true, status: 200, json: async () => ({ ok: true }) };
    },
  });
  await adapter.readJiraIssue("PAY-142");
  await adapter.readBitbucketRepository("PAY", "payments-service");
  await adapter.createConfluenceDraft({ spaceId: "123", parentPageId: "456", title: "Evidence", body: "<p>ready</p>" });
  assert.deepEqual(requests, [
    "https://jira.example.test/rest/api/3/issue/PAY-142",
    "https://stash.example.test/rest/api/1.0/projects/PAY/repos/payments-service",
    "https://wiki.example.test/wiki/api/v2/pages",
  ]);
});

test("rejects tickets that have not reached the explicit intake label", async () => {
  const orchestrator = createOrchestrator();
  const payload = sampleJiraWebhook();
  payload.issue.fields.labels = ["backlog"];
  const result = await orchestrator.ingestJiraWebhook(payload);
  assert.equal(result.accepted, false);
  assert.equal(orchestrator.listRuns().length, 0);
});

test("provisions a dry-run environment and waits for approval", async () => {
  const orchestrator = createOrchestrator();
  const result = await orchestrator.ingestJiraWebhook(sampleJiraWebhook());
  assert.equal(result.accepted, true);
  assert.equal(result.run.status, RUN_STATUS.AWAITING_APPROVAL);
  assert.equal(result.run.branchRecommendation.baseBranch, "develop");
  assert.equal(result.run.environment.provider, "dry-run");
  assert.match(result.run.environment.workingBranch, /^agent\/pay-142-/);
  assert.equal(result.run.evidence.length, 2);
});

test("requires approval, then records execution, failure, recovery, and completion", async () => {
  const orchestrator = createOrchestrator();
  const created = await orchestrator.ingestJiraWebhook(sampleJiraWebhook());
  assert.throws(() => orchestrator.execute(created.run.id), /Cannot transition run from awaiting_approval/);
  orchestrator.approve(created.run.id, "Faruk");
  const executing = orchestrator.execute(created.run.id);
  assert.equal(executing.status, RUN_STATUS.AWAITING_REVIEW);
  const failed = orchestrator.fail(created.run.id, "simulated context loss");
  assert.equal(failed.status, RUN_STATUS.FAILED);
  const recovered = await orchestrator.recover(created.run.id);
  assert.equal(recovered.status, RUN_STATUS.RECOVERED);
  assert.equal(recovered.environment.recoveredAt, "2026-08-18T04:00:00.000Z");
  orchestrator.execute(created.run.id);
  const completed = orchestrator.complete(created.run.id);
  assert.equal(completed.status, RUN_STATUS.COMPLETED);
  assert.ok(completed.evidence.some((item) => item.type === "recovery"));
  assert.ok(completed.evidence.some((item) => item.type === "completion"));
});

test("rehearses Faruk first-client workflow with sanitized harness data", async () => {
  const orchestrator = createOrchestrator();
  const created = await orchestrator.ingestJiraWebhook(sampleHarnessDogfoodWebhook());
  assert.equal(created.accepted, true);
  assert.equal(created.run.ticket.key, "HARNESS-117");
  assert.equal(created.run.ticket.repository.slug, "agent-agnostic-harness");
  assert.equal(created.run.status, RUN_STATUS.AWAITING_APPROVAL);

  orchestrator.approve(created.run.id, "Faruk");
  orchestrator.execute(created.run.id);
  orchestrator.fail(created.run.id, "Simulated regression: blocked item did not render phone-safe options.");
  const recovered = await orchestrator.recover(created.run.id);
  assert.equal(recovered.status, RUN_STATUS.RECOVERED);
  assert.ok(recovered.evidence.some((item) => item.type === "recovery"));

  orchestrator.execute(created.run.id);
  const completed = orchestrator.complete(created.run.id);
  assert.equal(completed.status, RUN_STATUS.COMPLETED);
  assert.equal(completed.failure, null);
  assert.ok(completed.events.some((event) => event.type === "run.recovery_started"));
  assert.ok(completed.evidence.length >= 7);
});
