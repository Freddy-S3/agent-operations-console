# Agent Operations Console

Discovery seed for a possible control plane that gives teams a usable UI for safe, auditable AI-agent software delivery.

Status: discovery only.

## Why this exists

The sibling Agent-Agnostic Harness already carries portable instructions, skills, agents, hooks, memory, approvals, and host projections across Codex, Claude Code, and Copilot.

The commercial question is whether that operating model should become a product that teams can use through a UI, rather than another generic swarm framework.

## Working hypothesis

The product is an agent operations console: a place where a team can submit a software task, fan work out to agents, supervise progress, approve risky actions, inspect diffs and verification evidence, and resume interrupted work.

The product should make agent work safer and more repeatable.

It should not make “swarm” the customer-facing promise.

Swarm behavior is an implementation technique; the customer value is lower rework, safer automation, faster delivery, and operational control.

## Initial customer hypothesis

The first likely customers are small software teams and AI consultancies that are actively using coding or workflow agents but lack reliable operating practices around them.

This is a hypothesis to test, not a settled market decision.

## Initial product wedge

The first paid moment should be supervising and recovering multi-agent work in software repositories, with governance and evidence included.

Possible first-screen capabilities include:

- a task inbox and run status;
- isolated worktree and worker assignment;
- human approval gates;
- live progress, failure, and recovery state;
- diff, test, build, and review evidence;
- durable context and resumable handoffs.

The first version should answer one question clearly: “What are my agents doing, what can I safely approve, and how do I recover when one fails?”

## Business goal

The business should be a low-cost path toward approximately $100,000 CAD/year of personal pre-tax income, not a venture-scale company by default.

The current business-model hypothesis is productized consulting first, with software extraction after multiple customers pay for the same repeated problem.

The working revenue cushion is approximately $150,000-$200,000 CAD/year in business revenue, subject to tax, operating-cost, and runway validation.

## Proposed validation sequence

1. Complete the discovery interview in [`docs/INTERVIEW.md`](docs/INTERVIEW.md).
2. Interview potential buyers before building a broad UI.
3. Deliver a concierge version of the workflow using the existing harness.
4. Charge for a narrow pilot or implementation sprint.
5. Build only the smallest console capability that removes repeated delivery work.
6. Revisit the product, pricing, and build decision after evidence from several paying users.

## Explicit non-goals for discovery

- Building a generic visual prompt or agent workflow canvas.
- Competing directly with model-provider agent platforms.
- Building a large autonomous swarm runtime before customer validation.
- Choosing infrastructure, pricing, or a permanent architecture before the interview.

## Parked future direction

### Meta-harness

A future higher-order layer could create, adapt, validate, and manage other harnesses.
This is a parked business idea, not part of the first console wedge.
Revisit it only after the initial buyer, paid problem, and concierge economics are validated.

## Provisional future stack

If the interview supports a prototype, the provisional stack is a TypeScript/Next.js control plane, Postgres for durable run state, and a small Python worker or adapter service for agent execution.

This is deliberately provisional: it fits a cross-provider developer tool and provides useful portfolio range, but it is not an implementation commitment.

## Current market context

Generic agent orchestration is becoming a platform capability.

- [OpenAI AgentKit](https://openai.com/index/introducing-agentkit/) describes visual multi-agent workflows, connectors, guardrails, and evaluation capabilities.
- [OpenAI Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/) describes sandboxed, resumable, parallel agent execution.
- [Google ADK](https://developers.googleblog.com/agent-development-kit-easy-to-build-multi-agent-applications/) describes multi-agent composition, evaluation, and deployment.
- [LangGraph Agent Server](https://langchain-ai.github.io/langgraph/concepts/langgraph_server/) describes persistence, task queues, and deployable agent runtimes.

The opportunity therefore appears stronger at the operating, governance, evidence, and cross-provider layer than at the generic orchestration layer.

## Project documents

- [`CONTEXT.md`](CONTEXT.md) - the current domain vocabulary.
- [`docs/INTERVIEW.md`](docs/INTERVIEW.md) - the staged founder and product interview.
- [`docs/COMPETITIVE-LANDSCAPE.md`](docs/COMPETITIVE-LANDSCAPE.md) - the public competitive scan and positioning hypotheses.
- [`docs/PAID-PILOT.md`](docs/PAID-PILOT.md) - the first paid concierge offer and validation boundary.

No architecture decision record exists yet because the product direction is still a working hypothesis.
