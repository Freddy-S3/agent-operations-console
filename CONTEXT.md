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
