import { createHmac, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { AgentOperationsOrchestrator } from "./orchestrator.js";
import { sampleJiraWebhook } from "./demo.js";

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

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret) return true;
  if (!signature?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = signature.slice("sha256=".length);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
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

function actionFor(orchestrator, id, action, payload) {
  switch (action) {
    case "approve": return orchestrator.approve(id, payload?.operator ?? "operator");
    case "execute": return orchestrator.execute(id);
    case "fail": return orchestrator.fail(id, payload?.reason);
    case "recover": return orchestrator.recover(id);
    case "complete": return orchestrator.complete(id);
    default: {
      const error = new Error(`Unsupported run action: ${action}`);
      error.statusCode = 400;
      throw error;
    }
  }
}

export function createServer({
  orchestrator = new AgentOperationsOrchestrator({
    defaultRepository: {
      provider: "bitbucket-stash",
      defaultBranch: "main",
    },
  }),
  webhookSecret = process.env.WEBHOOK_SECRET ?? "local-demo-secret",
} = {}) {
  return createHttpServer(async (request, response) => {
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
        const result = await orchestrator.ingestJiraWebhook(sampleJiraWebhook());
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
        if (!verifyWebhookSignature(raw, request.headers["x-agent-operations-signature"], webhookSecret)) {
          json(response, 401, { error: "Invalid webhook signature" });
          return;
        }
        const result = await orchestrator.ingestJiraWebhook(JSON.parse(raw.toString("utf8")));
        json(response, result.accepted ? 202 : 422, result);
        return;
      }
      if (request.method === "POST" && url.pathname.startsWith("/api/runs/") && url.pathname.endsWith("/actions")) {
        const pieces = url.pathname.split("/");
        const id = pieces[3];
        const payload = JSON.parse((await body(request)).toString("utf8") || "{}");
        const run = await actionFor(orchestrator, id, payload.action, payload);
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
      json(response, status, { error: error.message });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4310);
  createServer().listen(port, "127.0.0.1", () => {
    console.log(`Agent Operations Console listening at http://127.0.0.1:${port}`);
  });
}
