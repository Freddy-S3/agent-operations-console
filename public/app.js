const state = { runs: [], selectedId: null };

const STATUS_LABELS = {
  received: "Received",
  provisioning: "Provisioning",
  awaiting_approval: "Awaiting approval",
  approved: "Approved",
  executing: "Executing",
  awaiting_review: "Awaiting review",
  failed: "Failed",
  recovered: "Recovered",
  completed: "Completed",
};

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function statusChip(status) {
  return `<span class="status-chip status-${escapeHtml(status)}"><span class="status-dot"></span>${escapeHtml(STATUS_LABELS[status] ?? status)}</span>`;
}

function actionButton(action, label, className = "button button-primary") {
  return `<button class="${className}" data-run-action="${escapeHtml(action)}">${escapeHtml(label)}</button>`;
}

function selectedRun() {
  return state.runs.find((run) => run.id === state.selectedId) ?? state.runs[0] ?? null;
}

function renderMetrics() {
  $("#metric-runs").textContent = state.runs.length;
  $("#metric-gates").textContent = state.runs.filter((run) => run.status === "awaiting_approval").length;
  $("#metric-recovered").textContent = state.runs.filter((run) => run.events.some((event) => event.type === "run.recovery_started")).length;
  $("#metric-evidence").textContent = state.runs.reduce((total, run) => total + run.evidence.length, 0);
  $("#run-count").textContent = state.runs.length;
}

function renderRunList() {
  const list = $("#run-list");
  if (!state.runs.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">+</span><strong>No runs yet</strong><p>Ingest the synthetic ticket to rehearse the workflow.</p></div>';
    return;
  }
  list.innerHTML = state.runs.map((run) => `
    <button class="run-row ${run.id === state.selectedId ? "is-selected" : ""}" data-select-run="${escapeHtml(run.id)}">
      <span class="run-row-top"><strong>${escapeHtml(run.ticket.key)}</strong>${statusChip(run.status)}</span>
      <span class="run-row-title">${escapeHtml(run.ticket.summary)}</span>
      <span class="run-row-meta">${escapeHtml(run.environment?.workingBranch ?? "Preparing environment")} · ${formatTime(run.updatedAt)}</span>
    </button>`).join("");
}

function renderActionBar(run) {
  if (run.status === "awaiting_approval") return actionButton("approve", "Approve first pass");
  if (run.status === "approved" || run.status === "recovered") return actionButton("execute", "Run restricted first pass");
  if (run.status === "awaiting_review") return `${actionButton("complete", "Record review complete")} ${actionButton("fail", "Simulate failure", "button button-danger")}`;
  if (run.status === "failed") return actionButton("recover", "Recover preserved run");
  if (run.status === "completed") return '<span class="completion-note">Evidence bundle ready for handoff.</span>';
  return '<span class="completion-note">The hook is preparing this run.</span>';
}

function renderDetail() {
  const run = selectedRun();
  const detail = $("#run-detail");
  if (!run) {
    detail.innerHTML = '<div class="detail-empty"><p class="eyebrow">Selected run</p><h2>Choose a run to inspect its evidence</h2><p>The detail view will show the ticket, branch decision, environment, human gate, and recovery trail.</p></div>';
    return;
  }
  const evidence = run.evidence.map((item) => `<li><span class="evidence-type">${escapeHtml(item.type)}</span><div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.value)}</p></div><time>${formatTime(item.at)}</time></li>`).join("");
  const events = [...run.events].reverse().map((event) => `<li><span class="timeline-dot"></span><div><strong>${escapeHtml(event.type.replaceAll(".", " "))}</strong><p>${escapeHtml(event.detail)}</p></div><time>${formatTime(event.at)}</time></li>`).join("");
  detail.innerHTML = `
    <div class="detail-header"><div><p class="eyebrow">Agent run / ${escapeHtml(run.id.slice(0, 8))}</p><h2>${escapeHtml(run.ticket.key)} <span class="muted-slash">/</span> ${escapeHtml(run.ticket.summary)}</h2></div>${statusChip(run.status)}</div>
    <div class="detail-actions">${renderActionBar(run)}</div>
    <div class="ticket-summary"><div><span class="field-label">Ticket</span><strong>${escapeHtml(run.ticket.key)}</strong><span>${escapeHtml(run.ticket.issueType)} · ${escapeHtml(run.ticket.priority)} priority</span></div><div><span class="field-label">Repository</span><strong>${escapeHtml(run.ticket.repository.slug ?? "Not designated")}</strong><span>${escapeHtml(run.ticket.repository.provider)}</span></div><div><span class="field-label">Operator gate</span><strong>${run.approval ? escapeHtml(run.approval.operator) : "Pending"}</strong><span>${run.approval ? `Approved at ${formatTime(run.approval.at)}` : "Required before execution"}</span></div></div>
    ${run.failure ? `<div class="alert alert-danger"><strong>Recovery required</strong><span>${escapeHtml(run.failure.reason)}</span></div>` : ""}
    <div class="decision-grid"><article class="decision-card"><div class="card-topline"><span class="card-icon">↗</span><span class="field-label">Branch decision</span></div><strong>${escapeHtml(run.branchRecommendation?.baseBranch ?? "Pending")}</strong><p>${escapeHtml(run.branchRecommendation?.rationale ?? "The intake hook has not selected a base branch yet.")}</p><span class="source-label">${escapeHtml(run.branchRecommendation?.source ?? "pending")} · human review required</span></article><article class="decision-card"><div class="card-topline"><span class="card-icon">⌂</span><span class="field-label">Isolated environment</span></div><strong>${escapeHtml(run.environment?.workingBranch ?? "Preparing")}</strong><p>${escapeHtml(run.environment?.note ?? "No environment has been provisioned yet.")}</p><span class="source-label">${escapeHtml(run.environment?.provider ?? "pending")} · ${escapeHtml(run.environment?.state ?? "pending")}</span></article></div>
    <div class="evidence-layout"><article class="subpanel"><div class="subpanel-heading"><div><p class="eyebrow">Delivery evidence</p><h3>${run.evidence.length} records</h3></div><span class="mini-label">portable</span></div><ul class="evidence-list">${evidence || '<li class="subpanel-empty">Evidence appears as the run advances.</li>'}</ul></article><article class="subpanel"><div class="subpanel-heading"><div><p class="eyebrow">Recovery trail</p><h3>${run.events.length} events</h3></div><span class="mini-label">durable</span></div><ul class="timeline">${events}</ul></article></div>`;
}

async function request(path, options = {}) {
  const response = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

async function refresh(preferredId = state.selectedId) {
  const data = await request("/api/runs");
  state.runs = data.runs;
  state.selectedId = state.runs.some((run) => run.id === preferredId) ? preferredId : state.runs[0]?.id ?? null;
  renderMetrics();
  renderRunList();
  renderDetail();
}

function setFeedback(message) {
  $("#feedback").textContent = message;
}

async function ingest() {
  const result = await request("/api/demo/ingest", { method: "POST", body: "{}" });
  await refresh(result.run?.id);
  setFeedback(`Ingested ${result.run.ticket.key}`);
}

async function runAction(action) {
  const run = selectedRun();
  if (!run) return;
  const payload = { action };
  if (action === "fail") payload.reason = "Simulated context loss: the worker stopped after preflight.";
  const result = await request(`/api/runs/${encodeURIComponent(run.id)}/actions`, { method: "POST", body: JSON.stringify(payload) });
  await refresh(result.run.id);
  setFeedback(`${STATUS_LABELS[result.run.status]} at ${formatTime(result.run.updatedAt)}`);
}

document.addEventListener("click", async (event) => {
  const ingestButton = event.target.closest("[data-action='ingest']");
  const refreshButton = event.target.closest("[data-action='refresh']");
  const selectButton = event.target.closest("[data-select-run]");
  const actionButtonElement = event.target.closest("[data-run-action]");
  try {
    if (ingestButton) await ingest();
    if (refreshButton) { await refresh(); setFeedback(`Refreshed at ${formatTime(new Date().toISOString())}`); }
    if (selectButton) { state.selectedId = selectButton.dataset.selectRun; renderRunList(); renderDetail(); }
    if (actionButtonElement) await runAction(actionButtonElement.dataset.runAction);
  } catch (error) {
    window.alert(error.message);
  }
});

refresh().catch((error) => {
  $("#run-list").innerHTML = `<div class="empty-state"><strong>Console unavailable</strong><p>${escapeHtml(error.message)}</p></div>`;
});
