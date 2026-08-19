# Dogfood First-Client Rehearsal

Status: first pass complete.

## Purpose

Use Faruk's own agent-assisted repository workflow as the first customer and design partner before claiming external validation.

This validates operator fit for one familiar workflow.

It does not validate willingness to pay outside Faruk's own use case.

## Selected Workflow

Workflow: queue-dashboard blocker visibility after a formatter or parser change in the Agent-Agnostic Harness.

Why this workflow is low risk:

- The ticket can use synthetic queue data instead of real private backlog contents.
- The expected behavior is inspectable from the browser and the queue file format.
- A failure is recoverable by reverting a branch or updating the formatter contract.
- No credentials, live customer data, payments, production deploys, or outbound messages are required.

## Sanitized Ticket

Ticket key: `HARNESS-117`.

Summary: verify queue dashboard blocker visibility after a formatter change.

Repository: `agent-agnostic-harness`.

Intake label: `agent-ready`.

Operator: Faruk.

The fixture is implemented as `sampleHarnessDogfoodWebhook()` in `src/demo.js`.

It uses the real harness problem shape, but only synthetic identifiers and no private queue contents.

## Current Approval And Recovery Path

Current manual path:

1. An agent edits queue/dashboard formatter behavior in a branch.
2. The agent writes a blocked queue item with a `Blocked reason:` field and one-line `Options:` bullets.
3. The agent runs parser and browser checks against synthetic queue data.
4. Faruk reviews the PR, screenshots, and rendered dashboard behavior.
5. If a run fails or loses context, the next agent reads the queue item, tracker line, branch, PR, and test output to resume.

Rehearsed console path:

1. The synthetic Jira-shaped ticket enters the local console through the explicit `agent-ready` intake gate.
2. The console records a branch recommendation and dry-run isolated environment.
3. The run stops at human approval before the restricted first pass.
4. The run records execution and verification evidence.
5. The operator simulates a failed verification pass.
6. Recovery preserves the same run identity and environment record.
7. The recovered run completes with a single evidence bundle.

## Measurement

Baseline context Faruk or a later agent has to rebuild manually:

- Which repository and branch contain the work.
- Which queue item and dashboard behavior are under test.
- Whether approval happened before execution.
- Which evidence exists and which check failed.
- Whether recovery resumed the same run or created a duplicate.

What the local console reduces:

- Repository and branch choice are attached to the run.
- The approval gate is a first-class event.
- Failure and recovery are recorded on the same run.
- Evidence records stay grouped with the ticket instead of scattered across chat, queue logs, and PR comments.

What remains manual service work:

- Choosing a genuinely low-risk workflow.
- Creating the synthetic fixture from a real workflow.
- Judging whether the evidence is persuasive enough for Faruk or a customer.
- Reviewing and merging the resulting PR.

## Result

The dogfood path passes as an executable regression test.

The first-client value signal is strongest around context rebuilding and recovery evidence, not around autonomous implementation.

The next dogfood step should use the browser console with the same scenario and compare how long it takes to answer: what happened, what failed, who approved it, and what evidence is ready for review.
