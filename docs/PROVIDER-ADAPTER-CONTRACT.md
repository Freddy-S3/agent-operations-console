# Provider-Neutral Ticket and Repository Adapter Contract

Status: implementation specification.

This document defines the next adapter boundary for the ticket-to-code workflow.
It is agent-ready design work, not a live integration change.

No customer credentials, customer source code, repository writes, branches, pull requests, or merge requests are authorized by this document.
The current dry-run behavior should remain the default until a paid pilot supplies an explicit sandbox and permission boundary.

## Design goal

The orchestrator should consume normalized work-item and repository contracts.
It should not branch on Jira, Bitbucket, Stash, GitHub, or Confluence names.

Provider-specific code belongs behind adapters that declare their capabilities before the orchestrator tries to resolve a repository, prepare a branch, push changes, open a draft PR or MR, read checks, write comments, or attach evidence.

The first explicit repository examples are:

- Bitbucket Server or Data Center, including Stash-era deployments.
- GitHub, including GitHub.com and a future GitHub Enterprise Server boundary.

Jira remains the first work-item provider example.
Other ticket systems should fit the same work-item contract later.

## Normalized work item

The work-item provider produces this shape before the orchestrator creates a run:

```ts
type NormalizedWorkItem = {
  provider: "jira" | "github-issue" | "linear" | string;
  providerHost: string;
  id: string;
  key: string;
  url?: string;
  summary: string;
  description: string;
  status: string;
  type: string;
  priority: string;
  labels: string[];
  project?: {
    key?: string;
    name?: string;
  };
  requestedRepository?: NormalizedRepositoryReference;
  requestedBaseBranch?: string;
  acceptanceCriteria: string[];
  evidenceTargets: EvidenceTarget[];
  rawProviderRef: {
    connectionId: string;
    objectType: string;
    objectId: string;
  };
};
```

The current `normalizeJiraIssue` function can migrate toward this shape.
Its existing `ticket.repository` field becomes `requestedRepository`, and its existing `targetBranch` becomes `requestedBaseBranch`.

The raw provider payload should not be stored in run state by default.
Store only stable provider references, normalized fields, and redacted metadata.

## Normalized repository reference

Every repository reference should include enough information to resolve the repository without storing secrets:

```ts
type NormalizedRepositoryReference = {
  provider: "bitbucket-stash" | "github" | string;
  host: string;
  projectKey?: string;
  owner?: string;
  slug: string;
  displayName?: string;
  defaultBranch: string;
  developmentBranch?: string;
  releaseBranch?: string;
  connectionId: string;
};
```

Rules:

- `provider` selects the adapter family.
- `host` is the provider host, such as `https://stash.example.test` or `https://github.com`.
- `projectKey` is used by Bitbucket Server and Stash-style project routing.
- `owner` is used by GitHub organization or user routing.
- `slug` is the repository slug or name as the provider expects it.
- `connectionId` points to a separately configured credential or installation record.
- Tokens, API keys, SSH keys, cookies, and OAuth refresh tokens must never be stored in this reference.

The repository reference is not proof that the adapter can perform every operation.
The orchestrator must ask the provider registry for capabilities before enabling a live path.

## Provider capability matrix

Each repository adapter exposes a capability descriptor:

```ts
type RepositoryProviderCapabilities = {
  provider: string;
  host: string;
  supportsRepositoryRead: boolean;
  supportsBranchRead: boolean;
  supportsBranchCreate: boolean;
  supportsWorktreePreparation: boolean;
  supportsPush: boolean;
  supportsDraftChangeRequest: boolean;
  changeRequestName: "pull-request" | "merge-request";
  supportsChecksRead: boolean;
  supportsCommentsWrite: boolean;
  supportsEvidenceAttachment: boolean;
  supportsWebhookVerification: boolean;
};
```

Capability negotiation should fail before execution when a required operation is unavailable.
The failure should name the missing capability and the selected provider.

Example failure:

```text
Repository provider github on https://github.com cannot create a draft pull request with the configured connection.
```

Unsupported hosts should fail at negotiation rather than falling through to dry-run behavior while appearing live.

## Adapter responsibilities

The repository adapter owns provider-specific API calls and URL construction.
It should expose provider-neutral methods:

```ts
interface RepositoryProviderAdapter {
  capabilities(): RepositoryProviderCapabilities;
  resolveRepository(ref: NormalizedRepositoryReference): Promise<ResolvedRepository>;
  readBranch(repository: ResolvedRepository, branch: string): Promise<ResolvedBranch>;
  createWorkingBranch(input: CreateWorkingBranchInput): Promise<WorkingBranch>;
  prepareWorktree(input: PrepareWorktreeInput): Promise<PreparedWorkspace>;
  pushChanges(input: PushChangesInput): Promise<PushResult>;
  createDraftChangeRequest(input: DraftChangeRequestInput): Promise<DraftChangeRequest>;
  readChecks(input: ReadChecksInput): Promise<CheckSummary>;
  writeComment(input: WriteCommentInput): Promise<CommentResult>;
  attachEvidence(input: AttachEvidenceInput): Promise<EvidenceReference>;
}
```

The current `DryRunEnvironmentProvider` remains the default implementation for `prepareWorktree`.
A future live adapter may split branch preparation, cloud workspace provisioning, and agent execution into separate services, but the orchestrator should still see one provider-neutral workspace result.

## Bitbucket and Stash mapping

Bitbucket Server and Stash repository references map as:

```json
{
  "provider": "bitbucket-stash",
  "host": "https://stash.example.test",
  "projectKey": "PAY",
  "slug": "payments-service",
  "defaultBranch": "main",
  "connectionId": "customer-a-stash-readwrite"
}
```

Provider-specific routes are hidden behind the adapter:

- Repository read: `/rest/api/1.0/projects/{projectKey}/repos/{slug}`.
- Branch read and branch creation: Bitbucket Server branch APIs or git transport, depending on customer version and permissions.
- Draft change request: pull request creation with a draft marker only when the deployment supports it; otherwise create a normal pull request with a clear title prefix such as `Draft:`.
- Checks: provider build status APIs where available, otherwise CI links attached as evidence.
- Comments: pull request comments or task comments, depending on support.
- Evidence: pull request description, comments, or an external evidence bundle linked from the pull request.

The adapter must tolerate Stash-era naming and older Bitbucket Server deployments by negotiating capabilities from the configured host version when possible.

## GitHub mapping

GitHub repository references map as:

```json
{
  "provider": "github",
  "host": "https://github.com",
  "owner": "customer-org",
  "slug": "payments-service",
  "defaultBranch": "main",
  "connectionId": "customer-a-github-app"
}
```

Provider-specific routes are hidden behind the adapter:

- Repository read: REST or GraphQL repository lookup by owner and name.
- Branch read and creation: git refs API or git transport.
- Push: git transport using a scoped installation token or deploy key.
- Draft change request: GitHub draft pull request.
- Checks: Checks API and commit status summary.
- Comments: pull request comments and review comments where authorized.
- Evidence: pull request body, comments, check output, or linked evidence bundle.

GitHub Enterprise Server should be treated as the same provider family with a different host and version-negotiated capability profile.

## Work-item to repository resolution

Resolution order should be explicit:

1. Use a repository reference supplied by the work item when present and allowed by policy.
2. Use a project-to-repository routing rule configured for the customer workspace.
3. Use a single configured default repository only in local dry-run or single-repository pilot mode.
4. Fail with a clear operator-visible error when no repository can be resolved.

The orchestrator should record resolution evidence:

- Work item key.
- Selected repository provider, host, and slug.
- Resolution source: work item, routing rule, or default.
- Selected base branch and recommendation source.
- Capability profile used for the run.

The evidence should not include tokens, private clone URLs with embedded credentials, webhook secrets, or raw provider payloads.

## Authentication references

Connections should be referenced by ID, not embedded in normalized objects.

Connection records should eventually include:

- Provider family.
- Host.
- Auth mode, such as GitHub App installation, OAuth app, API token, SSH deploy key, or Bitbucket personal access token.
- Allowed repositories or projects.
- Allowed operations.
- Expiry or rotation metadata.
- Human owner.

The free trial and local prototype should keep using dry-run adapters and sample data.
Live connection records belong to a paid pilot or disposable sandbox only.

## Orchestrator changes

The orchestrator should migrate in small steps:

1. Rename internal concepts from `ticket` to `workItem` where practical, while preserving current API compatibility.
2. Add `RepositoryProviderRegistry` that selects an adapter by `repository.provider` and `repository.host`.
3. Add a capability negotiation step before environment preparation.
4. Record repository-resolution and capability evidence before the approval gate.
5. Keep `DryRunEnvironmentProvider` as the default provider for local demo runs.
6. Add live adapter seams behind feature flags or explicit connection configuration only.

The current dry-run path should continue to pass when no live adapter is configured.

## Minimum tests before live adapters

Add tests before enabling any live provider:

- Jira payload normalization preserves provider-neutral work-item fields and repository references.
- Missing repository reference fails clearly when no routing rule or default repository exists.
- Repository resolution chooses work-item repository before project routing before default repository.
- Capability negotiation blocks draft PR or MR creation when the provider cannot support it.
- Bitbucket/Stash mapping builds the expected project-key and slug repository reference without storing secrets.
- GitHub mapping builds the expected owner and slug repository reference without storing secrets.
- Dry-run execution still creates no external branches, pull requests, merge requests, comments, checks, or evidence attachments.
- Evidence records the selected repository, branch source, capability profile, and dry-run/live mode.
- Logs redact connection IDs only if they are sensitive in a customer deployment; credentials and tokens are always redacted.

The first live adapter test should run against a disposable sandbox, not a customer repository.

## Deferred work

This specification deliberately defers:

- Live Bitbucket, Stash, GitHub, or GitHub Enterprise Server API implementation.
- Customer credential storage.
- Cloud workspace provisioning.
- Real draft PR or MR creation.
- CI provider integration beyond provider-reported checks.
- Confluence output, except as an optional later evidence destination.
- Broad support for other ticket systems.

Those should wait for the paid workflow boundary or a disposable sandbox with explicit credentials.
