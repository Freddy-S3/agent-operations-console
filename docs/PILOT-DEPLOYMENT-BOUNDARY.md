# First External Pilot Deployment Boundary

Status: implementation boundary draft.

This document records the selected deployment boundary for the first external paid pilot of Agent Operations Console.
It is not a full enterprise deployment model and does not authorize a customer-hosted product distribution.

Decision: use a Faruk-controlled hosted core for the first external pilot.
Add a thin customer-side runner only when repository access requires code execution inside the customer's network or workstation boundary.
Full customer-hosted deployment is deferred until the IP, update, support, tenant-isolation, and security model are mature enough to operate outside Faruk's control.

## Pilot scope

The first external pilot is intentionally narrow:

- one customer workspace;
- one Jira project;
- one repository;
- one ticket class;
- one approved base-branch policy;
- one approved draft-PR or handoff workflow;
- optional selected wiki pages only when the customer explicitly approves them;
- no broad crawl of source, Jira, Confluence, chat, or drive content;
- no production deployment permissions;
- no autonomous background execution beyond approved intake and draft-preparation rules.

Founder-guided synthetic demos may still run from Faruk's always-on PC.
An external paid pilot should not depend on that PC as the production control plane.
The pilot core should run in a Faruk-controlled hosted environment so updates, revocation, logging, kill-switch behavior, and proprietary orchestration logic remain under operator control.

## Runtime placement

| Component | First-pilot placement | Boundary |
| --- | --- | --- |
| Operator UI | Faruk-controlled hosted core | Customer accesses it through an authenticated web session. |
| Orchestration logic | Faruk-controlled hosted core | Routing, policy evaluation, approval state, recovery logic, and evidence assembly remain server-side. |
| Model calls | Faruk-controlled hosted core | Model adapters run from configured server-side profiles and never expose provider keys to the customer-side runner. |
| Credentials | Split by need | OAuth or API references are stored server-side where possible; repository-local credentials stay on the customer side when policy requires it. |
| Repository access | Prefer customer-side runner for private code execution | The runner can clone, inspect, patch, test, and push only within the approved repository and branch policy. |
| Evidence | Faruk-controlled hosted core with redacted runner uploads | The runner uploads structured evidence and artifacts allowed by policy, not arbitrary filesystem contents. |
| Logs | Split and redacted | Server logs stay in the hosted core; runner logs stay local unless explicitly uploaded as evidence. |

The hosted core owns the workflow state.
The customer-side runner is a capability-limited executor, not a copy of the product.

## Tenant isolation

The first pilot should use a dedicated customer workspace with its own configuration records, connection references, policy settings, run records, and evidence storage prefix.

Minimum isolation requirements:

- workspace ID on every run, approval, evidence item, connection reference, and audit event;
- deny-by-default lookup that rejects cross-workspace IDs;
- per-workspace route policy for model profiles and budgets;
- per-workspace repository allowlist;
- per-workspace Jira project allowlist;
- per-workspace evidence retention setting;
- separate synthetic-demo data from paid-pilot data.

A single database is acceptable for the first pilot only if every query is scoped by workspace ID and this is covered by tests before live customer data enters the system.
Separate infrastructure per customer is deferred until the pilot proves a need or a contract requires it.

## Least privilege

The pilot should grant only the permissions required for the selected workflow.

Jira permissions:

- read one project;
- read one approved ticket class and required fields;
- write comments only if the pilot explicitly includes status comments;
- no project administration;
- no bulk issue access.

Repository permissions:

- read one repository;
- create branches only under an approved prefix;
- push only to the created working branch;
- open a draft pull request or merge request only against the approved base branch;
- read checks for the created branch;
- write PR comments only when evidence publishing is part of the pilot;
- no merge permission;
- no release or deployment permission.

Wiki permissions:

- disabled by default;
- selected pages only if enabled;
- write only to the agreed page or child-page area;
- no space-wide crawl;
- no broad search unless separately approved.

Model-provider permissions:

- model calls run through server-side profiles;
- customer-side runner receives no provider key;
- route selection follows the model routing and budget policy;
- raw prompts and private reasoning are not stored by default.

## Credential handling

Credentials are referenced by connection ID in run state.
Tokens, cookies, private keys, SSH keys, OAuth refresh tokens, and API tokens must not be stored inside normalized tickets, repository references, evidence records, or queue logs.

Server-side credential records should include:

- workspace ID;
- provider family;
- host;
- auth mode;
- allowed projects, repositories, pages, or operations;
- expiry or rotation metadata;
- human owner;
- revocation status;
- last-used timestamp.

Customer-side runner credentials should remain in the customer's environment where possible.
The hosted core should send short-lived run instructions and receive structured results.
It should not ask the runner to upload credential material.

If a pilot requires a hosted secret for a customer provider, the customer must approve that explicitly before live integration begins.

## Customer-side runner

The runner should be small and inspectable.
It should not contain the full orchestration product, pricing logic, proprietary routing policy implementation, or model-provider credentials.

Permitted runner responsibilities:

- register itself to one workspace with a short-lived pairing code;
- receive one run assignment at a time;
- clone or open the approved repository;
- create or reuse the approved worktree;
- run configured commands;
- apply a prepared patch or execute an approved agent step;
- collect structured evidence;
- redact configured sensitive fields;
- push only the approved branch when enabled;
- return status, logs, and evidence to the hosted core.

Runner restrictions:

- no general command shell exposed through the UI;
- no arbitrary filesystem traversal;
- no credential exfiltration endpoint;
- no self-update without signature or checksum verification;
- no customer-side access to server-only policy code;
- no offline autonomous queue.

The runner should fail closed when it receives an instruction outside its declared capability profile.

## Proprietary logic boundary

Server-side only:

- workflow routing;
- tenant policy evaluation;
- model routing and budget decisions;
- approval-gate state machine;
- recovery decision logic;
- evidence verdict rules;
- pricing and entitlement logic;
- customer workspace administration;
- kill-switch evaluation;
- audit retention policy.

Customer-side runner:

- capability declaration;
- local repository operations;
- local command execution;
- local redaction pass;
- local evidence packaging;
- short-lived assignment execution.

This split reduces the risk of client-side copying while keeping customer source code and repository credentials inside the customer's boundary when required.

## Revocation and kill switch

The hosted core must be able to stop the pilot quickly.

Minimum revocation controls:

- disable a workspace;
- disable a connection;
- disable a runner;
- cancel a run before the next side effect;
- revoke route profiles;
- block branch push and PR creation;
- stop background intake for the workspace.

The runner must check for cancellation before each side-effecting step:

1. repository clone or fetch;
2. branch creation;
3. patch application;
4. test command execution when it may mutate state;
5. push;
6. PR or MR creation;
7. evidence upload.

If the runner cannot reach the hosted core for a cancellation check, it should stop before side effects and report `control-plane-unreachable`.

## Auditability

The hosted core should be the audit source of truth.
Every pilot run should record:

- workspace ID;
- actor;
- ticket key;
- selected repository and base branch;
- selected route policy;
- approval gate outcome;
- runner ID when used;
- side-effect intent;
- cancellation checks;
- evidence uploaded;
- fallback and recovery events;
- final handoff status.

Audit records should be append-only and redacted.
They should include enough context to explain what the system did without storing raw credentials, raw private source content, or full prompts by default.

Customer-side runner logs should stay local unless the customer approves upload.
When uploaded, they become evidence and must be redacted before storage.

## Update delivery

The hosted core can be updated centrally by Faruk.
Every release should keep a rollback path and a pilot changelog.

The customer-side runner should update more conservatively:

- versioned release artifact;
- signed or checksummed package;
- explicit minimum supported version in the hosted core;
- runner reports its version at registration and before each run;
- incompatible runner versions are paused before work starts;
- emergency disable can block all runner assignments.

For the first pilot, manual runner upgrade instructions are acceptable.
Silent automatic updates are deferred until signing, rollback, and customer notification are in place.

## Data and deletion boundary

The pilot should store only data needed to operate and evaluate the agreed workflow.

Allowed by default:

- workspace configuration;
- connection references;
- ticket key, title, status, labels, and acceptance criteria;
- selected repository reference;
- branch and PR metadata;
- approvals;
- structured evidence;
- redacted logs;
- run timing and cost metadata;
- recovery and handoff state.

Not allowed by default:

- full repository contents;
- broad Jira export;
- broad wiki export;
- credentials or tokens;
- raw prompt history;
- private model reasoning;
- unrelated customer files;
- chat or drive data.

Deletion should remove workspace configuration, run state, evidence, uploaded logs, and connection records unless a signed agreement requires retention.

## Failure modes

The pilot should prefer visible pauses over silent downgrade.

Required failures:

- missing workspace policy pauses before intake;
- missing repository allowlist pauses before repository access;
- missing credential pauses before provider calls;
- model route unavailable follows the model routing fallback policy;
- runner unavailable pauses before repository side effects;
- cancellation check unavailable pauses before side effects;
- unsupported provider capability fails during negotiation;
- evidence upload failure leaves the run awaiting recovery.

Each failure should name the blocked capability and the safe recovery path without exposing secrets.

## First implementation sequence

1. Add workspace-scoped pilot configuration.
2. Add repository, Jira project, ticket-class, and optional wiki allowlists.
3. Add connection records by ID with revocation state.
4. Add a dry-run runner capability profile before live runner execution.
5. Add hosted-core run events for side-effect intent and cancellation checks.
6. Add a manual kill switch for workspace, connection, runner, and run.
7. Add tests for workspace isolation, allowlist enforcement, revocation, runner capability negotiation, and cancellation-before-side-effect behavior.
8. Enable a live runner only in a disposable sandbox before using customer systems.

## Deferred work

This boundary deliberately defers:

- full customer-hosted deployment;
- self-serve installation;
- broad plugin marketplace distribution;
- automatic runner updates;
- multi-tenant enterprise administration;
- cross-repository execution;
- production deployment permissions;
- customer-managed model-provider keys;
- broad Confluence or repository indexing.
