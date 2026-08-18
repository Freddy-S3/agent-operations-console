import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { sampleJiraWebhook } from "../src/demo.js";
import { RUN_STATUS, normalizeJiraIssue } from "../src/domain.js";
import { AtlassianHttpAdapter, DryRunEnvironmentProvider, MemoryRunStore, RulesBasedBranchAdvisor } from "../src/adapters.js";
import { AgentOperationsOrchestrator } from "../src/orchestrator.js";
import { verifyWebhookSignature } from "../src/server.js";

function createOrchestrator() {
  let counter = 0;
  const clock = () => new Date("2026-08-18T04:00:00.000Z");
  return new AgentOperationsOrchestrator({
    store: new MemoryRunStore(),
    branchAdvisor: new RulesBasedBranchAdvisor(),
    environmentProvider: new DryRunEnvironmentProvider({ idFactory: () => `fixed-${++counter}`, clock }),
    clock,
    idFactory: () => "run-fixed",
  });
}

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
