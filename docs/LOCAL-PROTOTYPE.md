# Local prototype boundary

This repository now contains a dependency-light rehearsal of the first operator workflow.

Run it with:

```powershell
npm test
npm start
```

Then open `http://127.0.0.1:4310` and ingest the synthetic `PAY-142` ticket.

The local console is organized around the operator's path:

- `Runs` shows the queue, branch and worktree decisions, approval gate, evidence, recovery trail, and engineer handoff.
- `Playbook` explains the Faruk first pass and the boundary between automatic preparation and engineer-owned review.
- `Connections` makes the Jira, repository, Confluence, and model adapter seams explicit.

The controls are deliberately rehearsal-only: intake, approval, execution, failure, recovery, completion, search, filters, and reset all operate against the in-memory dry-run API.

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
