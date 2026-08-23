# Local prototype boundary

This repository now contains a dependency-light rehearsal of the first operator workflow.

Run it with:

```powershell
npm test
npm start
```

Then open `http://127.0.0.1:4310` and ingest the synthetic `PAY-142` ticket.

The rehearsal demonstrates this sequence:

1. A Jira-shaped webhook is normalized and admitted only when it has the `agent-ready` label.
2. A replaceable branch advisor chooses a base branch, with the repository default as the safe fallback.
3. A dry-run environment adapter creates an isolated working-branch identity without touching a cloud account or repository.
4. The run waits at a human approval gate before the restricted first pass.
5. Execution records verification evidence, and the UI can simulate failure, recover the same run, and complete the evidence bundle.

The provider seams are intentionally explicit:

- `AtlassianHttpAdapter` is the future Jira, Confluence, and Bitbucket/Stash boundary.
- `ModelBackedBranchAdvisor` can accept a client-selected model adapter, while rules remain the fallback.
- `DryRunEnvironmentProvider` is the safe stand-in for a cloud workspace provisioner.
- `MemoryRunStore` is the stand-in for durable run state.

No live Atlassian, repository, model, cloud, draft-PR, or Confluence side effect is enabled by this prototype.
The next production decision should follow a paid-pilot workflow and define the customer's authentication, data residency, repository permission, cloud provider, and model-client boundaries before replacing these adapters.

## Local Atlassian credential setup

The repository includes [`.env.example`](../.env.example) as the local configuration template.
Copy it to `.env` and paste the Atlassian API token into `ATLASSIAN_API_TOKEN`.
The `.env` file is gitignored and must never be pasted into chat or committed.
Use the Atlassian site root for both `JIRA_BASE_URL` and `CONFLUENCE_BASE_URL`; the Confluence adapter adds its `/wiki` API path.

The current adapter supports direct Jira and Confluence Cloud requests with `ATLASSIAN_EMAIL` plus `ATLASSIAN_API_TOKEN` using HTTP Basic authentication.
For this direct-site adapter, use a short-lived classic API token; scoped tokens require the Atlassian API gateway path, which is not wired into this dry-run prototype yet.
Jira Cloud admin webhooks are verified with the `X-Hub-Signature` HMAC header.
The local prototype header remains accepted for existing rehearsal tests.

The adapter is still not invoked by the dry-run workflow, so adding credentials does not create Jira issues, repository branches, cloud environments, or Confluence pages.
