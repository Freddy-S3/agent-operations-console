function optional(value) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export function readRuntimeConfig(env = process.env) {
  const jiraBaseUrl = optional(env.JIRA_BASE_URL ?? env.ATLASSIAN_JIRA_BASE_URL);
  const confluenceBaseUrl = optional(env.CONFLUENCE_BASE_URL ?? env.ATLASSIAN_CONFLUENCE_BASE_URL);
  const bitbucketBaseUrl = optional(env.BITBUCKET_BASE_URL ?? env.ATLASSIAN_BITBUCKET_BASE_URL);
  return {
    atlassian: {
      email: optional(env.ATLASSIAN_EMAIL),
      token: optional(env.ATLASSIAN_API_TOKEN ?? env.ATLASSIAN_TOKEN),
      jiraBaseUrl,
      confluenceBaseUrl,
      bitbucketBaseUrl,
    },
    webhookSecret: optional(env.WEBHOOK_SECRET) ?? "local-demo-secret",
  };
}
