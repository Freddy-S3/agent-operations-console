import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { AgentOperationsOrchestrator } from "./orchestrator.js";
import { readRuntimeConfig } from "./config.js";
import { sampleJiraWebhook } from "./demo.js";
import { createLogger } from "./logging.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PUBLIC = join(ROOT, "public");
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function body(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 1_000_000) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function requestIdFor(request) {
  const candidate = request.headers["x-correlation-id"];
  return typeof candidate === "string" && /^[A-Za-z0-9._:-]{1,128}$/.test(candidate)
    ? candidate
    : randomUUID();
}

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret) return true;
  if (!signature?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = signature.slice("sha256=".length);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export function webhookSignatureFromHeaders(headers) {
  return headers["x-hub-signature"] ?? headers["x-agent-operations-signature"] ?? null;
}

async function serveStatic(request, response) {
  const requested = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const safePath = normalize(requested).replace(/^([/\\])+/, "");
  const filePath = resolve(PUBLIC, safePath);
  const publicRoot = `${PUBLIC}${sep}`;
  if (filePath !== PUBLIC && !filePath.startsWith(publicRoot)) {
    json(response, 403, { error: "Forbidden" });
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": MIME_TYPES[extname(filePath)] ?? "application/octet-stream" });
    response.end(content);
  } catch {
    json(response, 404, { error: "Not found" });
  }
}

function actionFor(orchestrator, id, action, payload, requestId) {
  switch (action) {
    case "approve": return orchestrator.approve(id, payload?.operator ?? "operator", { requestId });
    case "execute": return orchestrator.execute(id, { requestId });
    case "fail": return orchestrator.fail(id, payload?.reason, { requestId });
    case "recover": return orchestrator.recover(id, { requestId });
    case "complete": return orchestrator.complete(id, { requestId });
    default: {
      const error = new Error(`Unsupported run action: ${action}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

export function createServer({
  orchestrator: suppliedOrchestrator,
  logger = createLogger({ service: "agent-operations-console.http" }),
  webhookSecret = null,
} = {}) {
  const resolvedWebhookSecret = webhookSecret ?? readRuntimeConfig().webhookSecret;
  const orchestrator = suppliedOrchestrator ?? new AgentOperationsOrchestrator({
    logger,
    defaultRepository: {
      provider: "bitbucket-stash",
      defaultBranch: "main",
    },
  });
  return createHttpServer(async (request, response) => {
    const requestId = requestIdFor(request);
    const startedAt = performance.now();
    response.setHeader("X-Correlation-ID", requestId);
    response.once("finish", () => logger.info("http.request", {
      requestId,
      method: request.method,
      path: request.url?.split("?")[0],
      statusCode: response.statusCode,
      durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
    }));
    try {
      const url = new URL(request.url, "http://localhost");
      if (request.method === "GET" && url.pathname === "/health") {
        json(response, 200, { ok: true, mode: "dry-run" });
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/config") {
        json(response, 200, {
          mode: "dry-run",
          integrations: ["Atlassian Jira", "Atlassian Confluence", "Bitbucket/Stash", "client-selected model"],
          sideEffects: "disabled",
        });
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/runs") {
        json(response, 200, { runs: orchestrator.listRuns() });
        return;
      }
      if (request.method === "GET" && url.pathname.startsWith("/api/runs/") && url.pathname.endsWith("/events")) {
        const id = url.pathname.split("/")[3];
        if (!orchestrator.getRun(id)) {
          json(response, 404, { error: "Run not found" });
          return;
        }
        json(response, 200, { events: orchestrator.listEvents(id) });
        return;
      }
      if (request.method === "GET" && url.pathname.startsWith("/api/runs/")) {
        const id = url.pathname.split("/").pop();
        const run = orchestrator.getRun(id);
        if (!run) {
          json(response, 404, { error: "Run not found" });
          return;
        }
        json(response, 200, { run });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/demo/ingest") {
        const result = await orchestrator.ingestJiraWebhook(sampleJiraWebhook(), { requestId });
        json(response, result.accepted ? 202 : 422, result);
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/demo/reset") {
        orchestrator.clearRuns();
        json(response, 200, { ok: true });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/hooks/jira") {
        const raw = await body(request);
        if (!verifyWebhookSignature(raw, webhookSignatureFromHeaders(request.headers), resolvedWebhookSecret)) {
          json(response, 401, { error: "Invalid webhook signature" });
          return;
        }
        const result = await orchestrator.ingestJiraWebhook(JSON.parse(raw.toString("utf8")), { requestId });
        json(response, result.accepted ? 202 : 422, result);
        return;
      }
      if (request.method === "POST" && url.pathname.startsWith("/api/runs/") && url.pathname.endsWith("/actions")) {
        const pieces = url.pathname.split("/");
        const id = pieces[3];
        const payload = JSON.parse((await body(request)).toString("utf8") || "{}");
        const run = await actionFor(orchestrator, id, payload.action, payload, requestId);
        json(response, 200, { run });
        return;
      }
      if (request.method === "GET") {
        await serveStatic(request, response);
        return;
      }
      json(response, 404, { error: "Not found" });
    } catch (error) {
      const status = error instanceof SyntaxError ? 400 : error.statusCode ?? 500;
      logger.error("http.request_failed", {
        requestId,
        path: request.url?.split("?")[0],
        statusCode: status,
        error,
      });
      json(response, status, { error: error.message });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4310);
  const logger = createLogger({ service: "agent-operations-console.http" });
  createServer({ logger }).listen(port, "127.0.0.1", () => {
    logger.info("server.started", { host: "127.0.0.1", port });
  });
}
