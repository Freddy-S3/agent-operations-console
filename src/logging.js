import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

const MAX_STRING_LENGTH = 2_000;
const MAX_ARRAY_ITEMS = 100;
const SENSITIVE_KEY = /(authorization|cookie|password|secret|token|access[_-]?token|refresh[_-]?token|api[_-]?key|credential|private[_-]?key|prompt|source[_-]?code|upload|file[_-]?content)/i;

function redactString(value) {
  const redacted = value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/-----BEGIN [^-]+ PRIVATE KEY-----[\s\S]*?-----END [^-]+ PRIVATE KEY-----/g, "[REDACTED PRIVATE KEY]");
  if (redacted.length <= MAX_STRING_LENGTH) return redacted;
  return `${redacted.slice(0, MAX_STRING_LENGTH)}...[truncated]`;
}

export function redact(value, key = null, seen = new WeakSet()) {
  if (key && SENSITIVE_KEY.test(key)) return "[REDACTED]";
  if (typeof value === "string") return redactString(value);
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (Array.isArray(value)) {
    return value.slice(0, MAX_ARRAY_ITEMS).map((item) => redact(item, null, seen));
  }
  return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [
    entryKey,
    redact(entryValue, entryKey, seen),
  ]));
}

function serializeError(error) {
  if (!(error instanceof Error)) return error;
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}

export class StructuredLogger {
  constructor({
    service = "agent-operations-console",
    clock = () => new Date(),
    baseFields = {},
    sink = (line) => process.stdout.write(`${line}\n`),
  } = {}) {
    this.service = service;
    this.clock = clock;
    this.baseFields = redact(baseFields);
    this.sink = sink;
  }

  child(fields = {}) {
    return new StructuredLogger({
      service: this.service,
      clock: this.clock,
      baseFields: { ...this.baseFields, ...redact(fields) },
      sink: this.sink,
    });
  }

  log(level, message, fields = {}) {
    const { error, ...rest } = fields;
    const record = {
      timestamp: this.clock().toISOString(),
      level,
      service: this.service,
      ...this.baseFields,
      message,
      ...redact(rest),
    };
    if (error) record.error = redact(serializeError(error), "error");
    this.sink(JSON.stringify(record));
    return record;
  }

  debug(message, fields = {}) {
    return this.log("debug", message, fields);
  }

  info(message, fields = {}) {
    return this.log("info", message, fields);
  }

  warn(message, fields = {}) {
    return this.log("warn", message, fields);
  }

  error(message, fields = {}) {
    return this.log("error", message, fields);
  }
}

export function createLogger(options = {}) {
  return new StructuredLogger(options);
}

export function createAuditEvent({
  eventId = randomUUID(),
  type,
  at,
  runId,
  correlationId = runId,
  causationId = null,
  actor = { type: "system", id: null },
  severity = "info",
  detail,
  metadata = {},
} = {}) {
  return redact({
    eventId,
    type,
    at,
    runId,
    correlationId,
    causationId,
    actor,
    severity,
    detail,
    metadata,
  });
}

export class JsonlAuditEventStore {
  #events = new Map();

  constructor({ path = ".scratch/audit-events.jsonl" } = {}) {
    this.path = path;
    this.#load();
  }

  append(event) {
    if (!event?.eventId) throw new Error("Audit events require an eventId.");
    if (this.#events.has(event.eventId)) return structuredClone(this.#events.get(event.eventId));
    mkdirSync(dirname(this.path), { recursive: true });
    const persisted = redact(event);
    appendFileSync(this.path, `${JSON.stringify(persisted)}\n`, "utf8");
    this.#events.set(event.eventId, persisted);
    return structuredClone(persisted);
  }

  list({ runId } = {}) {
    return [...this.#events.values()]
      .filter((event) => !runId || event.runId === runId)
      .sort((left, right) => left.at.localeCompare(right.at) || left.eventId.localeCompare(right.eventId))
      .map((event) => structuredClone(event));
  }

  clear() {
    this.#events.clear();
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, "", "utf8");
  }

  #load() {
    let contents;
    try {
      contents = readFileSync(this.path, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }
    for (const [index, line] of contents.split("\n").filter(Boolean).entries()) {
      try {
        const event = JSON.parse(line);
        if (!event.eventId) throw new Error("missing eventId");
        this.#events.set(event.eventId, event);
      } catch (error) {
        throw new Error(`Invalid audit event at ${this.path}:${index + 1}: ${error.message}`);
      }
    }
  }
}
