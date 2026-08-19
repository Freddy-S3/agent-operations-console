export function sampleJiraWebhook() {
  return {
    issue: {
      id: "10001",
      key: "PAY-142",
      fields: {
        project: { key: "PAY" },
        summary: "Add an idempotency key to payment retries",
        description: "Prevent duplicate charges when a payment provider retries a request.",
        status: { name: "Ready for Agent" },
        issuetype: { name: "Task" },
        priority: { name: "High" },
        labels: ["agent-ready", "development"],
      },
    },
    repository: {
      provider: "bitbucket-stash",
      host: "https://stash.example.test",
      projectKey: "PAY",
      slug: "payments-service",
      defaultBranch: "main",
      developmentBranch: "develop",
      releaseBranch: "release/current",
    },
    confluence: {
      spaceKey: "PAY",
      parentPageId: "123456",
    },
  };
}

export function sampleHarnessDogfoodWebhook() {
  return {
    issue: {
      id: "20001",
      key: "HARNESS-117",
      fields: {
        project: { key: "HARNESS" },
        summary: "Verify queue dashboard blocker visibility after a formatter change",
        description: "Use a sanitized queue-dashboard workflow to prove that blockers remain visible, options render as phone actions, and a failed verification pass can be resumed with the same evidence bundle.",
        status: { name: "Ready for Agent" },
        issuetype: { name: "Task" },
        priority: { name: "Medium" },
        labels: ["agent-ready", "dogfood", "reliability"],
      },
    },
    repository: {
      provider: "github",
      host: "https://github.com",
      projectKey: "HARNESS",
      slug: "agent-agnostic-harness",
      defaultBranch: "main",
      developmentBranch: null,
      releaseBranch: null,
    },
    confluence: {
      spaceKey: "OPS",
      parentPageId: "dogfood-evidence",
    },
  };
}
