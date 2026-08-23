import { randomUUID } from "node:crypto";

function clone(value) {
  return structuredClone(value);
}

export class MemoryRunStore {
  #runs = new Map();

  save(run) {
    this.#runs.set(run.id, clone(run));
    return clone(run);
  }

  get(id) {
    const run = this.#runs.get(id);
    return run ? clone(run) : null;
  }

  list() {
    return [...this.#runs.values()]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map(clone);
  }

  clear() {
    this.#runs.clear();
  }
}

export class RulesBasedBranchAdvisor {
  async recommend(ticket) {
    const repository = ticket.repository;
    if (ticket.targetBranch) {
      return {
        baseBranch: ticket.targetBranch,
        rationale: "The ticket supplied an explicit target branch.",
        confidence: 1,
        source: "ticket",
        requiresReview: true,
      };
    }
    if (ticket.labels.some((label) => label.toLowerCase() === "release")) {
      return {
        baseBranch: repository.releaseBranch ?? repository.defaultBranch,
        rationale: "The release label routes the first pass to the repository release line.",
        confidence: 0.82,
        source: "rules",
        requiresReview: true,
      };
    }
    if (ticket.labels.some((label) => label.toLowerCase() === "development")) {
      return {
        baseBranch: repository.developmentBranch ?? repository.defaultBranch,
        rationale: "The development label routes the first pass to the development line.",
        confidence: 0.82,
        source: "rules",
        requiresReview: true,
      };
    }
    return {
      baseBranch: repository.defaultBranch,
      rationale: "No explicit branch signal was present; the repository default is the reversible fallback.",
      confidence: 0.55,
      source: "rules",
      requiresReview: true,
    };
  }
}

export class ModelBackedBranchAdvisor {
  constructor({ client, fallback = new RulesBasedBranchAdvisor() } = {}) {
    this.client = client;
    this.fallback = fallback;
  }

  async recommend(ticket) {
    const fallback = await this.fallback.recommend(ticket);
    if (!this.client) return fallback;
    try {
      const recommendation = await this.client.recommendBranch({ ticket, repository: ticket.repository });
      if (!recommendation?.baseBranch || typeof recommendation.baseBranch !== "string") {
        throw new Error("The configured model returned no usable base branch.");
      }
      return {
        ...fallback,
        ...recommendation,
        source: "model",
        requiresReview: true,
      };
    } catch (error) {
      return {
        ...fallback,
        source: "rules-fallback",
        rationale: `${fallback.rationale} Model advisory unavailable: ${error.message}`,
        requiresReview: true,
      };
    }
  }
}

export class DryRunEnvironmentProvider {
  constructor({ clock = () => new Date(), idFactory = randomUUID } = {}) {
    this.clock = clock;
    this.idFactory = idFactory;
  }

  async provision({ runId, ticket, branchRecommendation }) {
    const branchName = `agent/${ticket.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${this.idFactory().slice(0, 8)}`;
    return {
      id: `env-${this.idFactory().slice(0, 8)}`,
      provider: "dry-run",
      state: "ready",
      repository: ticket.repository,
      baseBranch: branchRecommendation.baseBranch,
      workingBranch: branchName,
      url: `http://localhost:4310/runs/${runId}/environment`,
      createdAt: this.clock().toISOString(),
      note: "No cloud resources or repository writes were made.",
    };
  }

  async recover({ environment }) {
    return {
      ...environment,
      state: "ready",
      recoveredAt: this.clock().toISOString(),
      note: "Dry-run recovery reused the same isolated environment identity.",
    };
  }
}

export class AtlassianHttpAdapter {
  constructor({ baseUrl, jiraBaseUrl, confluenceBaseUrl, bitbucketBaseUrl, email, token, authMode, fetchImpl = globalThis.fetch } = {}) {
    this.baseUrls = {
      jira: (jiraBaseUrl ?? baseUrl)?.replace(/\/$/, "") ?? null,
      confluence: (confluenceBaseUrl ?? baseUrl)?.replace(/\/$/, "") ?? null,
      bitbucket: (bitbucketBaseUrl ?? baseUrl)?.replace(/\/$/, "") ?? null,
    };
    this.email = email ?? null;
    this.token = token ?? null;
    this.authMode = authMode ?? (this.email ? "basic" : "bearer");
    this.fetchImpl = fetchImpl;
  }

  #assertConfigured(baseUrl) {
    if (!baseUrl || !this.token) {
      throw new Error("Atlassian adapter requires a provider base URL and ATLASSIAN_API_TOKEN.");
    }
    if (this.authMode === "basic" && !this.email) {
      throw new Error("Basic Atlassian Cloud authentication requires ATLASSIAN_EMAIL.");
    }
    if (this.authMode !== "basic" && this.authMode !== "bearer") {
      throw new Error(`Unsupported Atlassian authentication mode: ${this.authMode}.`);
    }
  }

  #authorizationHeader() {
    if (this.authMode === "basic") {
      return `Basic ${Buffer.from(`${this.email}:${this.token}`, "utf8").toString("base64")}`;
    }
    return `Bearer ${this.token}`;
  }

  async #request(baseUrl, path, options = {}) {
    this.#assertConfigured(baseUrl);
    const response = await this.fetchImpl(`${baseUrl}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        Authorization: this.#authorizationHeader(),
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`Atlassian request failed with HTTP ${response.status}.`);
    }
    return response.json();
  }

  readJiraIssue(issueKey) {
    return this.#request(this.baseUrls.jira, `/rest/api/3/issue/${encodeURIComponent(issueKey)}`);
  }

  readBitbucketRepository(projectKey, slug) {
    return this.#request(this.baseUrls.bitbucket, `/rest/api/1.0/projects/${encodeURIComponent(projectKey)}/repos/${encodeURIComponent(slug)}`);
  }

  createConfluenceDraft({ spaceId, parentPageId, title, body }) {
    return this.#request(this.baseUrls.confluence, "/wiki/api/v2/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spaceId,
        parentId: parentPageId,
        title,
        status: "draft",
        body: { representation: "storage", value: body },
      }),
    });
  }
}
