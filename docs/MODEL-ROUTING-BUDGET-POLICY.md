# Model Routing and Budget Policy

Status: implementation policy draft.

This document defines how Agent Operations Console should choose model adapters, effort levels, latency budgets, and spending limits for the ticket-to-code workflow.
It is a policy and validation artifact, not a live model integration.

No vendor, model name, benchmark score, customer credential, customer repository, Jira issue, wiki page, or private prompt is authorized by this document.
The current local prototype should keep using deterministic dry-run behavior until a paid pilot supplies an explicit sandbox, model account, and permission boundary.

## Design goal

The console should route work by workflow stage.
Slow, inexpensive, token-efficient configurations are appropriate when the system is preparing asynchronous work before an engineer opens the ticket.
Faster and stronger configurations are appropriate when an engineer is interacting with a run, deciding whether to continue, or reviewing final evidence.

Routing should be configurable by policy.
The product should not hard-code vendor names, public benchmark rankings, or benchmark scores into the workflow.
Benchmarks, including DeepSWE-style evaluations, may shape routing hypotheses, but production routing must be validated against the console's own outcomes.

## Policy objects

The orchestrator should eventually read model routing from a workspace-scoped policy object:

```ts
type ModelRoutePolicy = {
  routeId: string;
  stage: WorkflowStage;
  modelProfile: string;
  effortProfile: "low" | "standard" | "high" | string;
  maxWallClockSeconds: number;
  maxInputTokens?: number;
  maxOutputTokens?: number;
  maxEstimatedCostUsd?: number;
  qualityGate: string;
  cancellationRule: string;
  fallbackRouteId: string;
  operatorOverride: "never" | "within-approved-profiles" | "requires-admin";
};
```

`modelProfile` points to separately configured model-adapter settings.
It must not be a secret-bearing value.
Examples include `async-draft-economy`, `interactive-recovery`, or `evidence-review-high-precision`.

The console should record the selected `routeId`, `modelProfile`, `effortProfile`, budget envelope, fallback use, and operator override state in run evidence.
It should not record raw prompts, hidden chain-of-thought, credentials, provider tokens, or vendor-specific private metadata.

## Default routes

| Workflow stage | Default route | Time budget | Token or cost budget | Quality guardrail | Cancellation rule | Fallback |
| --- | --- | ---: | --- | --- | --- | --- |
| Asynchronous intake | `async-intake-economy` | 3 minutes | Workspace daily budget share plus low output cap | Extract ticket intent, acceptance criteria, dependencies, and missing context without modifying code | Cancel when the ticket is no longer in the agreed intake state or the operator disables background preparation | Fall back to deterministic parsing and mark model assistance unavailable |
| First-draft generation | `async-first-draft-economy` | 20 minutes | Per-ticket draft budget with hard cap before repository writes | Produce a bounded plan, candidate patch, test list, and risk note suitable for engineer review | Cancel when a newer ticket revision arrives, the branch policy changes, or budget reaches the hard cap | Fall back to a cheaper planning-only route; if unavailable, create a draft handoff with no generated patch |
| Recovery | `recovery-standard` | 8 minutes | Moderate output cap, retry budget limited to one automatic attempt | Explain the failure, preserved state, next safe action, and what evidence is missing | Cancel when the run state changes underneath the recovery attempt or a human takes over | Fall back to deterministic recovery checklist and require operator review |
| Interactive `/ship` follow-up | `interactive-strong-low-latency` | 60 seconds for first response, 5 minutes for a complete step | Higher per-action budget with operator-visible estimate | Answer or continue with enough context for an engineer to decide now | Cancel when latency exceeds the interactive threshold or the operator switches route | Fall back to `interactive-standard`; if unavailable, pause and ask the operator to resume later |
| Final evidence review | `evidence-review-high-precision` | 5 minutes | Moderate input budget with strict output cap | Check that evidence supports the claimed status, tests, blockers, approvals, and handoff | Cancel when required evidence is missing or the run is reopened | Fall back to deterministic evidence checklist and mark model review unavailable |

The default route names are examples.
Production configuration should map them to model adapters selected by the customer workspace, region, contract, and data boundary.

## Stage rules

Asynchronous intake runs before an engineer opens the ticket in the console.
Its job is to reduce empty waiting time, not to promise a correct implementation.
It may summarize the ticket, normalize acceptance criteria, identify missing context, classify likely risk, estimate whether the ticket fits the restricted first-pass policy, prepare a draft branch and worktree recommendation, and estimate model cost and elapsed time for the next route.
It must not create live branches, push commits, open draft pull requests or merge requests, write Jira or wiki comments, claim that a benchmark proves production success, or continue running after the ticket no longer matches the intake policy.

First-draft generation may run asynchronously when the ticket is eligible, policy allows draft preparation, and the workspace has remaining budget.
It should prefer cheaper configurations because the engineer has not yet committed attention to the task.
The route should produce selected repository and branch evidence, a proposed implementation plan, a generated patch or no-patch explanation, a test plan, known risks, model route metadata, elapsed time, estimated cost, and fallback state.
The draft is usable only after an engineer or operator reviews it.
The console should label it as a model-produced draft, not an accepted delivery result.

Recovery is more time-sensitive than first-draft generation because an operator is usually looking at a failed run.
It should use a standard or stronger configuration when needed to preserve confidence and reduce repeated attempts.
The recovery route should explain what failed, what state is preserved, what evidence exists, what can be safely retried, what requires human judgment, and whether the run should return to first-draft generation, interactive follow-up, or final evidence review.
One automatic model retry is allowed only when the failure is transient and the previous attempt produced no external side effect.
Repeated recovery attempts require operator approval.

Interactive follow-up is the premium latency path.
When an engineer invokes the stronger workflow, the route should prioritize responsiveness and correctness over low cost.
The policy should allow operators to choose from approved interactive profiles.
The console should show the expected latency and cost envelope before the route starts when practical.
Interactive routes should pause rather than silently downgrade when the fallback would materially change answer quality, repository access, or evidence review strength.

Final evidence review checks whether the run's evidence supports the handoff.
It does not replace tests, code review, or a human approval gate.
The route should inspect ticket summary and acceptance criteria, repository and branch decisions, approval events, generated patch or no-patch reason, test and build outputs, recovery trail, handoff text, and explicit blockers.
It should return one concise verdict: `ready-for-engineer-review`, `needs-more-evidence`, `blocked-by-policy`, `blocked-by-missing-context`, or `model-review-unavailable`.

## Operator visibility and override

Every model-assisted draft or review must show:

- route ID;
- model profile;
- effort profile;
- start and finish time;
- elapsed time;
- budget cap used for the attempt;
- estimated cost where available;
- whether a fallback route was used;
- whether an operator override changed the route;
- whether the output passed the route's quality guardrail.

Operators may override routes only within policy.
The initial safe rule is:

- asynchronous intake and first-draft generation can be downgraded to cheaper approved profiles;
- recovery can be upgraded within approved profiles after a failure;
- interactive follow-up can be upgraded or downgraded by the operator;
- final evidence review can be rerun with a stronger approved profile;
- any route outside approved profiles requires admin configuration, not an ad hoc prompt.

Overrides should be recorded as evidence.

## Fallback behavior

When a model adapter or configuration is unavailable, the console should fail visibly and preserve the run state.
It should not pretend that a deterministic fallback had the same quality as a model-assisted route.

Fallbacks should follow this order:

1. Use the route's configured fallback profile.
2. Use a deterministic checklist for stages where deterministic behavior is useful.
3. Pause the run and record `model-route-unavailable` when neither fallback is safe.

The operator-facing failure should name the route and missing profile without exposing provider credentials.

Example:

```text
Model route async-first-draft-economy is unavailable because profile async-draft-economy is not configured for this workspace.
The run was paused before repository writes.
```

## Validation metrics

The policy is valid only if the console measures real workflow outcomes.
Model benchmarks can suggest where to start, but customer-facing claims should come from the console's own data.

Track these measures for synthetic trials and paid pilots:

- cost per usable first draft;
- wall-clock time before engineer review;
- time saved before the engineer opens the ticket;
- first interactive response latency;
- total interactive step latency;
- retry count;
- fallback count;
- rework required after model output;
- accepted handoff rate;
- rejected handoff rate;
- evidence-review findings per run;
- operator override frequency;
- budget exhaustion frequency.

A usable first draft is one that an engineer can review without restarting the task from scratch.
It is not necessarily a correct or mergeable patch.

## Synthetic trial demonstration

The synthetic trial can demonstrate the cost-versus-latency tradeoff without customer credentials, repositories, Jira, or wiki content.

The local demo should be able to show:

- a cheap asynchronous route preparing a draft from fixture data;
- a stronger interactive route producing faster operator-facing recovery or follow-up;
- visible route ID, model profile, effort profile, elapsed time, and estimated cost;
- a forced model-unavailable fallback;
- a budget-exhausted pause before any external side effect;
- final evidence review marking a handoff as ready or missing evidence.

The synthetic demonstration may use fixed timings and estimated costs.
If it does, the UI and evidence should label them as synthetic estimates.
They must not be presented as provider pricing, benchmark results, or expected customer savings.

## DeepSWE and other benchmark inputs

DeepSWE results and similar public evaluations are research inputs.
They can support a hypothesis that some configurations may be better suited for software-engineering drafts or recovery.
They do not prove production performance for a customer's repository, ticket quality, data boundary, latency requirement, or budget envelope.

The product should treat benchmark findings as candidate profiles to test, evaluation scenarios to compare against, reasons to run a synthetic trial, and research context for future adapter choices.
The product should not treat benchmark findings as a customer-facing guarantee, a hard-coded routing rule, a substitute for trial or pilot metrics, or permission to use a vendor or model outside the customer's configured policy.

## Implementation sequence

1. Add a static model-route policy fixture to the local prototype.
2. Record route metadata in run evidence for synthetic runs.
3. Add a model-unavailable fallback path in the dry-run workflow.
4. Show route, effort, elapsed time, and estimated cost in the operator UI.
5. Add tests for route selection, fallback, budget exhaustion, and evidence recording.
6. Keep live model adapter implementation behind explicit workspace configuration.
7. Revisit route defaults after synthetic trials and the first paid pilot.

## Deferred work

This policy deliberately defers:

- live model-provider integration;
- vendor-specific model naming;
- dynamic pricing lookup;
- customer-specific budget enforcement;
- autonomous background execution beyond approved intake rules;
- use of customer source code, Jira, wiki, or repository credentials in a free trial;
- public performance claims based on external benchmarks.
