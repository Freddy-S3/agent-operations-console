# Concierge Rehearsal Record

Status: complete.

Date: 2026-09-02.

This record captures one public-safe, synthetic run of the local Agent Operations Console.

## Scenario

Ticket: `PAY-142`.

Summary: Add an idempotency key to payment retries.

Repository fixture: `payments-service`.

Run ID: `7b9a1e66-efe0-4c20-89dd-5db63d6dd168`.

Working branch identity: `agent/pay-142-0aacb946`.

Environment: local dry-run.

External side effects: disabled.

No Jira, repository, model, cloud, pull-request, or wiki operation was contacted or created.

## Rehearsed path

1. Reset the in-memory rehearsal state.
2. Ingest the synthetic Jira-shaped ticket.
3. Confirm that intake stopped at `awaiting_approval`.
4. Confirm that execution before approval was rejected with HTTP 500.
5. Approve the bounded first pass as Faruk.
6. Run the restricted first pass and confirm it reached `awaiting_review`.
7. Simulate context loss during verification.
8. Recover the run and confirm that the original run ID and working branch were preserved.
9. Rerun the first pass and record completion.

## Evidence bundle

The final run reached `completed` with nine evidence records.

Evidence types: branch plan, isolated environment, approval, execution, verification, recovery, execution, verification, and completion.

The final failure field was cleared.

The audit trail contained 23 events, including approval, failure, recovery, and completion events.

The local configuration reported `mode: dry-run` and `sideEffects: disabled`.

No tracked application files were modified by the rehearsal.
The only new worktree file is this public-safe rehearsal record.

## Operator teaching guide

1. Start the local console and choose the Runs view.
2. Select `Simulate Jira intake` to create the synthetic `PAY-142` run.
3. Inspect the branch decision and isolated worktree before approving anything.
4. Use `Approve first pass` only after the operator understands the bounded action.
5. Use `Run restricted first pass` to produce the review evidence.
6. Use `Simulate failure` to practice recognizing a recoverable interruption.
7. Use `Recover preserved run` and verify that the run identity is unchanged.
8. Run the recovered pass again and record the review as complete.
9. Treat the final state as engineer-review ready, not as an automatic merge or deployment.

## Manual versus UI boundary

The console makes intake, approval, execution, failure, recovery, completion, and evidence visible.

The rehearsal still requires an operator to judge approval, review the evidence, and decide whether an engineer should continue.

The dry-run adapters do not create branches, modify repositories, invoke models, call cloud environments, open pull requests, or publish wiki pages.

## Validation note

`npm test` and `npm run check` passed.

The in-app browser could not render the local page because the host browser policy verification was unavailable.

The API-level rehearsal therefore verifies the state machine and audit boundary, while rendered-browser verification remains an explicit follow-up if browser access becomes available.
