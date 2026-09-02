# Agent Workflow Reliability Setup and Team Enablement

Status: validation draft.

This document defines the first paid concierge offer for the Agent Operations Console discovery effort.

It is a business hypothesis for customer interviews and paid-pilot testing, not a promise of validated results.

## Customer

The initial buyer is a 5-20 person software product team in English-speaking Canada or the United States that already uses coding agents to ship production software.

The likely buyer is an engineering leader, technical founder, or senior engineer who is accountable for delivery quality and can approve a small fixed-scope engagement.

The first operator is the person who decides whether an agent-assisted task may proceed, needs intervention, or is complete.

The initial offer is not aimed at AI consultancies as direct buyers, although consultancies may become partners or white-label channels later.

## Customer-facing promise

Make one agent-assisted software delivery workflow recoverable, reviewable, and safe to approve.

The offer should be explained through outcomes rather than through the terms “harness,” “swarm,” or “AI consultancy.”

The customer should understand that Faruk will configure and teach a practical operating workflow around one repository before any broad software platform is proposed.

## Provisional scope

The pilot covers one Jira project, one operator workflow, and one repository for code work, with selected wiki pages for documentation work when explicitly connected.

For the first pilot, automatic intake is current-sprint-only and ticket-type agnostic.
Code, documentation, wiki, and investigation tickets in the current sprint may create Intake Candidates, but a candidate proceeds only when its output route, capability, dependency, budget, and approval checks pass.
This broadens the pilot's observation window; it does not promise that every ticket will produce a completed change.

The pilot is designed for two to four weeks, depending on repository access, workflow complexity, and client availability.

The pilot includes:

- A short fit and scope call.
- A baseline of the current workflow, including failure, rework, approval, and recovery behavior where measurable.
- Configuration of the existing Agent-Agnostic Harness around the agreed workflow.
- One explicit human approval gate.
- A durable evidence bundle containing the task intent, relevant changes, checks, review result, and approval history.
- A controlled recovery demonstration using a test branch, staging environment, or other agreed safe boundary.
- Two founder-led teaching sessions for the operator and relevant team members.
- A concise runbook covering startup, approval, intervention, recovery, and handoff.
- Limited post-handoff support for fourteen days, subject to the agreed contract.

## Candidate asynchronous extension

The pilot may validate an asynchronous Jira intake workflow alongside the concierge delivery.

For this first pilot, current-sprint membership is the default readiness signal.
The restricted Faruk first pass prepares an initial draft and evidence bundle without opening a PR automatically.

Code work uses the approved repository branch and worktree route.
Documentation and wiki work use the selected documentation route, and pause visibly when the required page connection or permission is unavailable.
Investigation work produces a concise report with findings, uncertainty, evidence references, and trace drill-down so the engineer can scan the result without reading the full conversation.

The simple initial product does not write labels back to Jira.
Label write-back and other trigger customizations are later paid support options, and any such label improves visibility but is never the authority to start work or create a self-triggering hook.

The first pass may use a narrowly scoped bot identity to read the repository and create its isolated branch, but it must not have broad engineer credentials, merge rights, deployment rights, or production access.

The engineer tests and reviews the first draft before invoking the permissioned Freddy second pass for corrections or continuation.

Completed tickets can feed a weekly documentation skill that updates the customer's Confluence or other documentation system through the relevant MCP server.

This extension is intentionally bounded and experimental.

### Future paid customization

The initial product keeps intake simple: current-sprint assignment is the trigger, and supported code, documentation, wiki, and investigation routes are evaluated from there.

Additional trigger customization is reserved for paid support.
It can select the intake window, included output routes, selected wiki scope, label write-back, support profile behavior, and queue or approval limits.

Later customers may pay for a narrower ticket filter, a current-plus-next-sprint window, a support-specific ready state, or other workspace-specific behavior.

Recurring support remains a separate future offer for validated ongoing value such as compatibility updates, skill updates, model-policy tuning, or operational support.

The pilot should measure time from current-sprint assignment to usable first draft, route-specific first-draft rate, engineer rework, review cycles, documentation coverage, and model cost per ticket.

Model routing can use lower-cost models for ticket triage, context gathering, and routine first-pass work, reserving stronger models for difficult corrections, review findings, or recovery.

The pilot should not claim that every ticket can be completed without engineering implementation work.

The delivery is partly manual by design.

Manual configuration and teaching are part of the value proposition, not an embarrassing temporary substitute for software.

## Provisional price hypothesis

Test a fixed pilot price of CAD 2,500, or the equivalent amount invoiced in USD for a U.S. customer.

The price is a hypothesis, not a final rate card.

The price is intended to cover a narrow, outcome-oriented setup with teaching and handoff while remaining understandable to a small software team.

The fit call is free and limited to determining whether the workflow is appropriate for the pilot.

No unpaid implementation, repository audit, or custom architecture work is included in the fit call.

If the pilot repeatedly expands beyond one Jira project, repository workflow, or explicitly selected wiki scope, pause and re-scope rather than silently absorbing additional work.

## Success measures

The pilot should measure a small baseline before changing the workflow and compare it with the pilot result.

Candidate measures include:

- Time required to recover from a deliberately interrupted or failed run.
- Percentage of pilot runs with a complete evidence bundle.
- Percentage of pilot runs reaching an explicit human approval decision.
- Number of abandoned or manually restarted runs.
- Review rework caused by missing context, unsafe changes, or unverifiable output.
- Operator confidence and time required to understand the current run state.

These measures are used to learn whether the workflow creates value.

They are not guaranteed performance improvements in the first engagement.

The pilot should stop or change direction if the team does not experience the problem often enough, existing tools already solve it adequately, or the buyer will not pay for the outcome.

## Customer responsibilities

The customer supplies a suitable repository, a named operator, a safe branch or environment for the pilot, and access needed to configure the agreed workflow.

The customer decides what code, data, credentials, and systems may be accessed.

The customer attends the teaching sessions and provides timely feedback on the workflow.

The customer remains responsible for production approvals, legal compliance, security decisions, and its own code and infrastructure.

The pilot should not accept regulated or highly sensitive data until the contract, insurance, security boundary, and data-handling requirements have been reviewed professionally.

## Trust and data boundary

Client code, prompts, run logs, credentials, contracts, and private business records remain private.

The default design should avoid sending client secrets or unnecessary repository content to external systems.

The engagement agreement should define access, retention, deletion, ownership, confidentiality, incident handling, and any permitted use of operational data.

The public portfolio should use only synthetic data, public harness material, or explicitly approved client proof.

The pilot does not authorize collecting prompts, source code, repository contents, credentials, run logs, uploads, or free-form text for product research.

## Explicit exclusions

The pilot does not include a generic visual workflow builder.

The pilot does not replace the customer's model provider, source-control provider, CI system, or agent runtime.

The pilot does not promise autonomous production deployment.

The pilot does not provide legal, tax, security, compliance, or export-control certification.

The pilot does not include broad multi-provider product development or a permanent SaaS architecture.

The pilot does not authorize Faruk or an agent to contact prospects, send outbound messages, or make commitments without approval.

## What may become software later

The first software extraction should come from repeated manual work observed in paid delivery.

Candidate UI capabilities include:

- A run list with current state and operator ownership.
- A clear approval gate with the action, risk, and evidence visible together.
- A portable evidence bundle for plans, diffs, tests, reviews, approvals, and recovery history.
- A recovery view that shows what failed, what can be resumed, and what must be restarted safely.
- A teaching and handoff surface that helps a small team operate the workflow without Faruk present.

These are candidate directions, not implementation commitments.

## Pilot decision gate

After the first paid pilot, record whether the correct next step is to build a narrow UI slice, continue concierge delivery, revise the offer, or stop.

Build only if repeated manual work and willingness to pay justify the specific slice.

### Important disclaimer

This document is business-planning material, not legal, tax, accounting, insurance, privacy, export-control, or professional-liability advice.

Before signing a paid engagement, obtain appropriate Ontario contract and insurance guidance and confirm cross-border requirements for any U.S. customer.

