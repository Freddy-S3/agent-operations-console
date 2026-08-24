# Guided Free Trial Offer and Validation Plan

Status: discovery-backed offer draft.

This document translates the approved guided free-trial assumptions into an offer that can be tested in customer conversations.
It does not authorize live billing, telemetry, customer integrations, or pricing claims.

## Target customer and buyer

The first customer remains a 5-20 person software product team in English-speaking Canada or the United States that already uses coding agents in repository work.

The trial is initiated by an engineering leader or technical founder who owns delivery quality and purchase authority.
The first hands-on operator is likely a staff engineer, delivery owner, or senior engineer who decides whether an agent-assisted task can proceed, needs intervention, or is ready for review.

The painful workflow is not starting an agent.
The painful workflow is making agent-assisted repository work recoverable, reviewable, and safe to approve after a run spans chats, terminals, worktrees, pull requests, checks, and human review.

## Trial job

The trial helps the operator complete one safe rehearsal of an agent-assisted repository workflow:

1. Ingest a Jira-shaped ticket with clear acceptance criteria.
2. Plan the branch and worktree boundary.
3. Pause for human approval before execution.
4. Produce evidence the operator can inspect.
5. Deliberately trigger and recover from one failure.
6. Hand the result to an engineer with enough context to review it.

The first guided job should be a small, low-risk bug fix or maintenance task.
It should have clear acceptance criteria, limited blast radius, and no production access.

A larger-ticket showcase may be offered later as a second synthetic path, but it should not be the activation path.
The first learning path should prove trust and recovery before promising time savings on complex work.

## Sandbox journey

The default trial workspace is synthetic-by-default.
It uses a sample repository, sample tickets, and public or generated harness material.
It does not require client source code, credentials, prompt history, run logs, customer contracts, or private wiki content.

The guided journey is:

1. Fit check: confirm the team already uses coding agents and has a real review, approval, or recovery pain.
2. Trial setup: create a synthetic workspace and select the small maintenance-task path.
3. Activation run: walk through ticket intake, branch planning, approval, evidence review, deliberate recovery, and engineer handoff.
4. Optional second path: run up to four additional synthetic tickets in the same workspace, including one larger-ticket showcase only if the operator understands the recovery path.
5. Debrief: compare the operator's current workaround against the trial run and decide whether live integration is worth a paid pilot.

The working usage limit is up to five synthetic tickets per trial workspace.
That limit protects support time, AI execution cost, and abuse risk while giving the operator enough repetition to judge the workflow.

## Activation event

Activation occurs when the operator completes one guided end-to-end synthetic run and can answer these questions from the evidence bundle:

- What task was attempted?
- What branch or worktree boundary was selected?
- What approval was required before execution?
- What evidence proves the run outcome?
- What failed, how was it recovered, and what remains for the engineer?

The observable activation event is a completed synthetic run with an inspected evidence bundle and a deliberate recovery step.
Account creation, page views, or ticket import alone do not count as activation.

## Paid unlocks

The free trial demonstrates the operating model with synthetic data.
The paid version should unlock the work needed to make the same workflow useful in a real team environment:

- Live Jira and repository integrations for one agreed workflow.
- Team-scoped policies for approvals, permissions, and safe task classes.
- Persistent evidence bundles for plans, diffs, checks, approvals, recovery, and handoff.
- Optional wiki-page connections for selected pages only.
- Founder-led setup, operator teaching, runbook creation, and post-handoff support.

Wiki access must be explicit and page-scoped.
The system should not crawl an entire Confluence space by default.

The handoff from trial to paid integration is a readiness review:

1. The operator names the workflow they would want connected to real systems.
2. The buyer names the business reason to pay for that workflow.
3. The team confirms the permission boundary, data boundary, and success measure.
4. The paid pilot starts only after those boundaries are agreed.

## Data, consent, and deletion

The trial does not collect prompts, source code, repository contents, credentials, run logs, uploads, free-form customer text, or wiki content by default.

Synthetic ticket choices, run state, approval events, recovery events, completion state, and aggregate usage counts may be recorded only when they are needed to operate the trial and improve the offer.
If optional research telemetry is introduced, it must be consent-first, disabled by default where practical, and documented before collection.

The customer-facing boundary should state:

- What data is collected.
- Why it is collected.
- Where it is stored.
- Who can access it.
- How long it is retained.
- How the customer can request deletion.
- Which data is never collected unless a paid pilot explicitly changes the boundary.

Deletion should remove the trial workspace, synthetic run history tied to the customer, and contact-level research notes unless retention is required for a signed paid engagement.

## Cost and abuse controls

The trial should contain AI execution cost and abuse with product and operational limits:

- One workspace per team during the trial period.
- Up to five synthetic tickets per workspace.
- No production repository execution.
- No customer credentials in the free trial.
- No background autonomous runs after the guided session ends.
- Rate limits on run creation and model-backed analysis.
- Human approval before any future live integration path.

The trial should prefer deterministic fixtures and low-cost models where possible.
Stronger model calls should be reserved for guided analysis, recovery explanation, or evidence review that materially affects the operator's understanding.

## Conversion signals

The strongest upgrade signal is not praise for the demo.
It is the buyer or operator naming a real workflow they want connected to their systems.

Positive conversion signals:

- The operator recognizes the recovery and evidence problem from current work.
- The buyer can name the cost of abandoned runs, missing context, or review uncertainty.
- The team asks to connect one real ticket class, repository, or approval policy.
- The operator wants persistent evidence or policy controls for future runs.
- The team can identify who would own the workflow after handoff.

Weak or negative signals:

- The team is mainly curious about agents but has no repeated workflow.
- The operator only wants a visual demo or generic workflow builder.
- Existing tools already provide enough evidence and recovery.
- The buyer will not pay for setup, governance, or evidence.
- The team will not accept any integration boundary that a small paid pilot can support.

## First validation experiment

Hypothesis: engineering leaders or technical founders at 5-20 person software product teams that already use coding agents will see enough value in a guided synthetic recovery-and-evidence run to request a paid pilot for one real repository workflow.

Audience: five to ten buyer or operator conversations in English-speaking Canada and the United States, including at least two people with purchase authority.

Method:

1. Use the discovery outreach kit to recruit conversations.
2. Show the guided synthetic journey as a conversation aid, not a self-serve product claim.
3. Ask the operator to describe their current agent-work recovery and review workflow.
4. Ask whether the synthetic activation path maps to a real workflow they would pay to connect.
5. Record the real workflow, owner, approval boundary, success measure, and objections.

Success threshold: at least three conversations describe the same recoverability, reviewability, or approval-evidence pain, and at least one qualified buyer agrees to discuss a paid pilot for a real workflow.

Stop or redirect condition: stop pushing the free-trial path if most qualified teams do not have repeated agent-work recovery pain, cannot name an expensive failure mode, or treat the trial as an interesting demo with no paid next step.

## Open decisions

These decisions should wait for customer evidence:

- Whether the free trial becomes self-serve or remains founder-guided.
- Whether the larger-ticket showcase belongs in the trial or in sales collateral.
- Whether epic-level shared context is a free preview, paid pilot feature, or later product capability.
- Which repository provider adapter, Bitbucket/Stash or GitHub, should be implemented first.
- Whether Confluence belongs in the core workflow or only in a documentation extension.
