# Agent Operations Console Context

This context defines the vocabulary for a proposed product that helps teams operate AI-agent work safely and repeatably.

## Core concepts

**Harness**:
A portable set of instructions, skills, agents, hooks, memory, and host projection rules that shapes how agents perform work.
_Avoid_: Wrapper, prompt pack

**Agent Operations Console**:
A proposed product surface for starting, supervising, approving, recovering, and proving agent work.
_Avoid_: Swarm dashboard, chatbot admin

**Agent Run**:
One bounded execution of a task by an agent or coordinated group of agents, with state and evidence that can be inspected later.
_Avoid_: Chat, session

**Swarm**:
Multiple agents working on related parts of one task under an explicit coordination model.
_Avoid_: Any collection of agents, autonomous magic

**Operator**:
A person responsible for deciding whether an agent run may proceed, needs intervention, or is complete.
_Avoid_: User, supervisor

**Work Item**:
A tracked unit of requested work from an external planning system, such as a ticket, incident, or task.
_Avoid_: Job, prompt

**Intake Candidate**:
An observed work-item event that has not yet passed trigger-scope and revalidation checks, and therefore has no agent or repository side effect.
_Avoid_: Pending run, queued agent

**Trigger Scope**:
The policy-defined boundary that determines which work items may create an Agent Run based on planning state, readiness, relationships, and workspace rules.
_Avoid_: Webhook filter, backlog scan

**Intake Profile**:
A workspace-scoped choice of trigger window, included work-item types, output routes, label visibility, and safety limits.
_Avoid_: Global default, customer fork

**Output Route**:
The kind of draft or handoff a work item receives, such as a code change, documentation update, wiki draft, or a paused capability request.
_Avoid_: Ticket class, code path

**Label Write-Back**:
An optional Jira metadata update that makes candidate state visible to people without granting permission to start an Agent Run.
_Avoid_: Trigger label, automation permission

**Related Work**:
Work items connected by a dependency, hierarchy, duplicate relationship, or informational link that may affect scheduling or review.
_Avoid_: Ticket family, shared backlog

**Epic Context**:
Explicitly approved goals, constraints, decisions, glossary, and evidence references shared by selected related work items.
_Avoid_: Automatic history, inherited everything

## Delivery concepts

**Human Gate**:
An explicit point where an operator must approve, reject, or redirect an agent action before the workflow continues.
_Avoid_: Confirmation popup, manual step

**Delivery Evidence**:
Verifiable information about an agent run, such as a diff, test result, build result, review finding, or approval record.
_Avoid_: Activity log, agent output

**Recovery**:
The act of continuing, rerouting, or restarting an agent run after interruption, failure, or an operator decision.
_Avoid_: Retry, refresh

**Worktree**:
An isolated repository checkout in which an agent can make changes without colliding with another active writer.
_Avoid_: Workspace, branch copy

**Concierge Pilot**:
A paid, partly manual delivery of the proposed workflow used to learn the customer problem before building general software.
_Avoid_: Free trial, demo

**Faruk First Pass**:
A restricted execution mode that prepares an initial draft PR from an eligible Jira ticket without broad engineer, merge, deployment, or production permissions.
_Avoid_: Autonomous production change

**Freddy Second Pass**:
An engineer-invoked, permissioned execution mode that revises or continues the initial draft after human testing and review.
_Avoid_: Automatic approval

**Automated Documentation**:
A scheduled workflow that converts completed-ticket evidence into updates for a customer documentation system through an MCP server.
_Avoid_: Unreviewed knowledge publication
