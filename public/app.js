const state = {
  runs: [],
  selectedId: null,
  activeView: "runs",
  filter: "all",
  query: "",
};

const STATUS_LABELS = {
  received: "Received",
  provisioning: "Preparing",
  awaiting_approval: "Needs approval",
  approved: "Approved",
  executing: "Running",
  awaiting_review: "Needs review",
  failed: "Recovery needed",
  recovered: "Recovered",
  completed: "Complete",
};

const STAGE_NAMES = ["Intake", "Context", "Gate", "First pass", "Handoff"];
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

function runMatchesFilter(run) {
  if (state.filter === "attention") return ["awaiting_approval", "failed"].includes(run.status);
  if (state.filter === "active") return ["provisioning", "approved", "executing", "awaiting_review", "recovered"].includes(run.status);
  return true;
}

function runMatchesQuery(run) {
  if (!state.query) return true;
  const haystack = [run.ticket.key, run.ticket.summary, run.environment?.workingBranch, run.ticket.repository?.slug].join(" ").toLowerCase();
  return haystack.includes(state.query.toLowerCase());
}

function visibleRuns() {
  return state.runs.filter((run) => runMatchesFilter(run) && runMatchesQuery(run));
}

function stageFor(run) {
  if (["received", "provisioning"].includes(run.status)) return 1;
  if (run.status === "awaiting_approval") return 3;
  if (["approved", "executing", "awaiting_review", "failed", "recovered"].includes(run.status)) return 4;
  if (run.status === "completed") return 5;
  return 0;
}

function renderChrome() {
  document.querySelectorAll("[data-view-tab]").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.viewTab === state.activeView);
  });
  document.querySelectorAll(".view-panel").forEach((panel) => {
    const visible = panel.id === `${state.activeView}-view`;
    panel.hidden = !visible;
    panel.classList.toggle("is-visible", visible);
  });
}

function renderMetrics() {
  const recovered = state.runs.filter((run) => run.events.some((event) => event.type === "run.recovery_started")).length;
  const evidence = state.runs.reduce((total, run) => total + run.evidence.length, 0);
  $("#metric-runs").textContent = state.runs.length;
  $("#metric-runs-note").textContent = state.runs.length === 1 ? "one run in the queue" : state.runs.length ? "across this rehearsal" : "nothing in the queue yet";
  $("#metric-gates").textContent = state.runs.filter((run) => run.status === "awaiting_approval").length;
  $("#metric-recovered").textContent = recovered;
  $("#metric-evidence").textContent = evidence;
  $("#run-count").textContent = state.runs.length;
  $("#nav-run-count").textContent = state.runs.length;
}

function renderRunList() {
  const list = $("#run-list");
  const runs = visibleRuns();
  if (!state.runs.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">+</span><strong>No runs yet</strong><p>Simulate the Jira intake above to create the first isolated run.</p></div>';
    return;
  }
  if (!runs.length) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">⌕</span><strong>No matching runs</strong><p>Try another filter or clear the search to see the full queue.</p><button class="button button-quiet" data-action="clear-filter">Clear filters</button></div>';
    return;
  }
  list.innerHTML = runs.map((run) => `
    <button class="run-row ${run.id === state.selectedId ? "is-selected" : ""}" data-select-run="${escapeHtml(run.id)}">
      <span class="run-row-top"><strong>${escapeHtml(run.ticket.key)}</strong>${statusChip(run.status)}</span>
      <span class="run-row-title">${escapeHtml(run.ticket.summary)}</span>
      <span class="run-row-meta"><span>${escapeHtml(run.environment?.workingBranch ?? "Preparing environment")}</span><time>${formatTime(run.updatedAt)}</time></span>
    </button>`).join("");
}

function renderActionBar(run) {
  if (run.status === "awaiting_approval") return actionButton("approve", "Approve first pass");
  if (run.status === "approved" || run.status === "recovered") return actionButton("execute", "Run restricted first pass");
  if (run.status === "awaiting_review") return `${actionButton("complete", "Record review complete")} ${actionButton("fail", "Simulate failure", "button button-danger")}`;
  if (run.status === "failed") return actionButton("recover", "Recover preserved run");
  if (run.status === "completed") return '<span class="completion-note"><span class="status-dot"></span> Ready for engineer review.</span>';
  return '<span class="completion-note">The intake hook is preparing this run.</span>';
}

function renderStageRail(run) {
  const activeStage = stageFor(run);
  return `<div class="stage-rail" aria-label="Run stage">${STAGE_NAMES.map((name, index) => {
    const stage = index + 1;
    const className = stage < activeStage || run.status === "completed" ? "is-complete" : stage === activeStage ? "is-active" : "";
    return `<span class="stage-item ${className}"><i>${String(stage).padStart(2, "0")}</i>${name}</span>${stage < STAGE_NAMES.length ? '<b class="stage-line"></b>' : ""}`;
  }).join("")}</div>`;
}

function eventLabel(type) {
  return type.replaceAll(".", " ").replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function renderHandoff(run) {
  if (run.status === "completed") {
    return '<div class="handoff-card handoff-ready"><div class="handoff-mark">✓</div><div><p class="eyebrow">Engineer handoff</p><strong>Evidence bundle is ready to review.</strong><p>Open the branch, run the normal PR checks, and invoke Freddy only if the draft needs correction or continuation.</p></div></div>';
  }
  if (run.status === "failed") {
    return '<div class="handoff-card handoff-blocked"><div class="handoff-mark">!</div><div><p class="eyebrow">Engineer handoff</p><strong>Handoff is paused until recovery.</strong><p>The run identity and environment are preserved so the operator can resume without rebuilding context.</p></div></div>';
  }
  return '<div class="handoff-card"><div class="handoff-mark">→</div><div><p class="eyebrow">Engineer handoff</p><strong>Handoff stays behind the review gate.</strong><p>The first pass can prepare evidence, but an engineer still owns testing, review, and any PR changes.</p></div></div>';
}

function renderDetail() {
  const run = selectedRun();
  const detail = $("#run-detail");
  if (!run) {
    detail.innerHTML = '<div class="detail-empty"><span class="empty-orbit">AO</span><p class="eyebrow">Selected run</p><h2>Choose a run to inspect its evidence.</h2><p>The detail view will show the ticket, branch decision, human gate, recovery trail, and engineer handoff.</p></div>';
    return;
  }
  const evidence = run.evidence.map((item) => `<li><span class="evidence-type">${escapeHtml(item.type)}</span><div><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.value)}</p></div><time>${formatTime(item.at)}</time></li>`).join("");
  const events = [...run.events].reverse().map((event) => `<li><span class="timeline-dot"></span><div><strong>${escapeHtml(eventLabel(event.type))}</strong><p>${escapeHtml(event.detail)}</p></div><time>${formatTime(event.at)}</time></li>`).join("");
  const repository = run.ticket.repository ?? {};
  detail.innerHTML = `
    <div class="detail-header"><div><p class="eyebrow">Agent run / ${escapeHtml(run.id.slice(0, 8))}</p><h2>${escapeHtml(run.ticket.key)} <span class="muted-slash">/</span> ${escapeHtml(run.ticket.summary)}</h2></div>${statusChip(run.status)}</div>
    ${renderStageRail(run)}
    <div class="detail-actions">${renderActionBar(run)}</div>
    <div class="ticket-summary"><div><span class="field-label">Ticket</span><strong>${escapeHtml(run.ticket.key)}</strong><span>${escapeHtml(run.ticket.issueType)} · ${escapeHtml(run.ticket.priority)} priority</span></div><div><span class="field-label">Repository</span><strong>${escapeHtml(repository.slug ?? "Not designated")}</strong><span>${escapeHtml(repository.provider ?? "Provider pending")}</span></div><div><span class="field-label">Operator gate</span><strong>${run.approval ? escapeHtml(run.approval.operator) : "Pending"}</strong><span>${run.approval ? `Approved at ${formatTime(run.approval.at)}` : "Required before execution"}</span></div></div>
    ${run.failure ? `<div class="alert alert-danger"><strong>Recovery required</strong><span>${escapeHtml(run.failure.reason)}</span></div>` : ""}
    <div class="decision-grid"><article class="decision-card"><div class="card-topline"><span class="card-icon">↗</span><span class="field-label">Branch decision</span></div><strong>${escapeHtml(run.branchRecommendation?.baseBranch ?? "Pending")}</strong><p>${escapeHtml(run.branchRecommendation?.rationale ?? "The intake hook has not selected a base branch yet.")}</p><span class="source-label">${escapeHtml(run.branchRecommendation?.source ?? "pending")} · human review required</span></article><article class="decision-card"><div class="card-topline"><span class="card-icon">⌂</span><span class="field-label">Isolated worktree</span></div><strong>${escapeHtml(run.environment?.workingBranch ?? "Preparing")}</strong><p>${escapeHtml(run.environment?.note ?? "No environment has been provisioned yet.")}</p><span class="source-label">${escapeHtml(run.environment?.provider ?? "pending")} · ${escapeHtml(run.environment?.state ?? "pending")}</span></article></div>
    ${renderHandoff(run)}
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
  renderChrome();
}

function setFeedback(message) {
  $("#feedback").textContent = message;
}

async function ingest() {
  const result = await request("/api/demo/ingest", { method: "POST", body: "{}" });
  await refresh(result.run?.id);
  setFeedback(`Intake accepted: ${result.run.ticket.key}`);
}

async function reset() {
  await request("/api/demo/reset", { method: "POST", body: "{}" });
  state.selectedId = null;
  state.filter = "all";
  state.query = "";
  $("#run-search").value = "";
  document.querySelectorAll("[data-run-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.runFilter === "all"));
  await refresh(null);
  setFeedback("Rehearsal reset");
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

function switchView(view) {
  state.activeView = view;
  renderChrome();
  setFeedback(`${view[0].toUpperCase()}${view.slice(1)} view`);
}

function setFilter(filter) {
  state.filter = filter;
  document.querySelectorAll("[data-run-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.runFilter === filter));
  renderRunList();
  setFeedback(filter === "all" ? "Showing all runs" : `Showing ${filter === "attention" ? "runs needing attention" : "active runs"}`);
}

function clearFilter() {
  state.filter = "all";
  state.query = "";
  $("#run-search").value = "";
  document.querySelectorAll("[data-run-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.runFilter === "all"));
  renderRunList();
  setFeedback("Filters cleared");
}

document.addEventListener("click", async (event) => {
  const tab = event.target.closest("[data-view-tab]");
  const ingestButton = event.target.closest("[data-action='ingest']");
  const resetButton = event.target.closest("[data-action='reset']");
  const refreshButton = event.target.closest("[data-action='refresh']");
  const clearFilterButton = event.target.closest("[data-action='clear-filter']");
  const filterButton = event.target.closest("[data-run-filter]");
  const selectButton = event.target.closest("[data-select-run]");
  const actionButtonElement = event.target.closest("[data-run-action]");
  try {
    if (tab) return switchView(tab.dataset.viewTab);
    if (ingestButton) return await ingest();
    if (resetButton) return await reset();
    if (refreshButton) { await refresh(); return setFeedback(`Refreshed at ${formatTime(new Date().toISOString())}`); }
    if (clearFilterButton) return clearFilter();
    if (filterButton) return setFilter(filterButton.dataset.runFilter);
    if (selectButton) {
      state.selectedId = selectButton.dataset.selectRun;
      renderRunList();
      renderDetail();
      return setFeedback(`Selected ${selectedRun().ticket.key}`);
    }
    if (actionButtonElement) return await runAction(actionButtonElement.dataset.runAction);
  } catch (error) {
    setFeedback(`Error: ${error.message}`);
  }
});

$("#run-search").addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  renderRunList();
});

refresh().catch((error) => {
  setFeedback(`Error: ${error.message}`);
  $("#run-list").innerHTML = `<div class="empty-state"><strong>Console unavailable</strong><p>${escapeHtml(error.message)}</p></div>`;
});
