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
