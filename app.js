import { investigations } from "./data.js";

const state = {
  view: "dashboard",
  currentId: investigations[0].id,
  currentTab: "overview",
};

const app = document.querySelector("#app");

function getCurrentInvestigation() {
  return investigations.find((item) => item.id === state.currentId) || investigations[0];
}

function statusClass(value = "") {
  const normalized = value.toLowerCase();
  if (normalized.includes("critica") || normalized.includes("high") || normalized.includes("alto")) return "danger";
  if (normalized.includes("parcial") || normalized.includes("partial") || normalized.includes("media")) return "warning";
  if (normalized.includes("sustentada") || normalized.includes("supported") || normalized.includes("forte")) return "success";
  if (normalized.includes("atrasado") || normalized.includes("broken") || normalized.includes("fraca")) return "danger";
  return "neutral";
}

function countOpenClaims(investigation) {
  return investigation.claims.filter((claim) => {
    const status = claim.status.toLowerCase();
    return status.includes("precisa") || status.includes("needs") || status.includes("partial");
  }).length;
}

function countOpenGaps(investigation) {
  return investigation.gaps.filter((gap) => !["resolvida", "resolved"].includes(gap.status.toLowerCase())).length;
}

function countRequestFollowUps(investigation) {
  return investigation.requestComparisons.filter((comparison) => {
    const decision = comparison.editorialDecision.toLowerCase();
    return decision.includes("ressalva") || decision.includes("nao usar") || decision.includes("partial");
  }).length;
}

function renderShell(content) {
  app.innerHTML = `
    <header class="topbar">
      <button class="brand" data-action="dashboard" aria-label="Go to dashboard">
        <span class="brand-mark">E</span>
        <span>
          <strong>Evidence Desk</strong>
          <small>prototype</small>
        </span>
      </button>
      <div class="topbar-note">Investigation workflow for public-interest reporting</div>
    </header>
    ${content}
  `;
  bindActions();
}

function renderDashboard() {
  const cards = investigations
    .map(
      (item) => `
        <article class="investigation-card">
          <div class="card-kicker">${item.country} / ${item.jurisdiction}</div>
          <h2>${item.title}</h2>
          <p>${item.centralQuestion}</p>
          <div class="metrics-grid compact">
            <div><strong>${item.requests.length}</strong><span>requests</span></div>
            <div><strong>${countRequestFollowUps(item)}</strong><span>follow-ups</span></div>
            <div><strong>${countOpenGaps(item)}</strong><span>open gaps</span></div>
          </div>
          <div class="card-footer">
            <span class="pill ${statusClass(item.status)}">${item.status}</span>
            <button class="button" data-action="open" data-id="${item.id}">Open investigation</button>
          </div>
        </article>
      `,
    )
    .join("");

  renderShell(`
    <main class="page dashboard">
      <section class="hero">
        <div>
          <p class="eyebrow">MVP v0.1</p>
          <h1>Turn investigative questions into evidence, gaps and publishable claims.</h1>
          <p>
            This static prototype tests the core workflow before backend, login or AI:
            map evidence, track requests, compare responses and link claims to proof.
          </p>
        </div>
        <div class="hero-panel">
          <strong>Prototype goal</strong>
          <span>Validate whether the method helps journalists work with less chaos.</span>
        </div>
      </section>
      <section class="section-header">
        <div>
          <p class="eyebrow">Investigations</p>
          <h2>Test cases</h2>
        </div>
        <button class="button secondary" disabled>New investigation coming later</button>
      </section>
      <section class="cards-grid">${cards}</section>
    </main>
  `);
}

function renderInvestigation() {
  const item = getCurrentInvestigation();
  const tabs = [
    ["overview", "Overview"],
    ["hypotheses", "Hypotheses"],
    ["evidence", "Evidence blocks"],
    ["sources", "Sources"],
    ["requests", "Requests"],
    ["comparison", "Request comparison"],
    ["gaps", "Gaps"],
    ["claims", "Claims"],
    ["methodology", "Methodology"],
  ];

  const nav = tabs
    .map(
      ([id, label]) => `
        <button class="tab ${state.currentTab === id ? "active" : ""}" data-action="tab" data-tab="${id}">
          ${label}
        </button>
      `,
    )
    .join("");

  renderShell(`
    <main class="workspace">
      <aside class="sidebar">
        <button class="back-link" data-action="dashboard">Back to all investigations</button>
        <div class="project-card">
          <p class="eyebrow">${item.country} / ${item.language}</p>
          <h1>${item.title}</h1>
          <span class="pill ${statusClass(item.status)}">${item.status}</span>
        </div>
        <nav class="tabs">${nav}</nav>
      </aside>
      <section class="content">
        ${renderTab(item)}
      </section>
    </main>
  `);
}

function renderTab(item) {
  const renderers = {
    overview: renderOverview,
    hypotheses: renderHypotheses,
    evidence: renderEvidenceBlocks,
    sources: renderSources,
    requests: renderRequests,
    comparison: renderRequestComparison,
    gaps: renderGaps,
    claims: renderClaims,
    methodology: renderMethodology,
  };
  return renderers[state.currentTab](item);
}

function renderOverview(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Overview</p>
      <h2>${item.centralQuestion}</h2>
      <p>${item.description}</p>
    </section>
    <section class="metrics-grid">
      <div><strong>${item.hypotheses.length}</strong><span>hypotheses</span></div>
      <div><strong>${item.evidenceBlocks.length}</strong><span>evidence blocks</span></div>
      <div><strong>${item.requests.length}</strong><span>requests</span></div>
      <div><strong>${countRequestFollowUps(item)}</strong><span>follow-ups</span></div>
      <div><strong>${countOpenGaps(item)}</strong><span>open gaps</span></div>
      <div><strong>${countOpenClaims(item)}</strong><span>claims to review</span></div>
    </section>
    <section class="two-column">
      <article class="panel">
        <h3>Project scope</h3>
        <dl class="detail-list">
          <div><dt>Topic</dt><dd>${item.topic}</dd></div>
          <div><dt>Territory</dt><dd>${item.territory}</dd></div>
          <div><dt>Period</dt><dd>${item.period}</dd></div>
          <div><dt>Updated</dt><dd>${item.updatedAt}</dd></div>
        </dl>
      </article>
      <article class="panel accent">
        <h3>Editorial safety rule</h3>
        <p>
          Gaps are not conclusions. They are unresolved evidence problems that need
          follow-up, a methodological limit, or a rewritten claim.
        </p>
      </article>
    </section>
  `;
}

function renderHypotheses(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Questions and hypotheses</p>
      <h2>Break the central question into testable parts.</h2>
    </section>
    <div class="stack">
      ${item.hypotheses
        .map(
          (hypothesis) => `
            <article class="row-card">
              <div>
                <h3>${hypothesis.text}</h3>
                <p>Related evidence: ${hypothesis.evidence}</p>
              </div>
              <span class="pill ${statusClass(hypothesis.status)}">${hypothesis.status}</span>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderEvidenceBlocks(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Evidence blocks</p>
      <h2>What types of proof are needed?</h2>
      <p>Blocks help separate what must be proven from where the information might be found.</p>
    </section>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Block</th><th>Priority</th><th>Status</th></tr></thead>
        <tbody>
          ${item.evidenceBlocks
            .map(
              (block) => `
                <tr>
                  <td>${block.type}</td>
                  <td>${block.priority}</td>
                  <td><span class="pill ${statusClass(block.status)}">${block.status}</span></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSources(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Sources and databases</p>
      <h2>Separate verified sources from likely paths.</h2>
    </section>
    <div class="stack">
      ${item.sources
        .map(
          (source) => `
            <article class="panel source-card">
              <div class="card-footer top">
                <h3>${source.name}</h3>
                <span class="pill ${statusClass(source.status)}">${source.status}</span>
              </div>
              <p><strong>${source.type}</strong></p>
              <p>${source.use}</p>
              <p class="muted">Limits: ${source.limits}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRequests(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Requests</p>
      <h2>Track requests made outside the platform.</h2>
    </section>
    <div class="stack">
      ${item.requests
        .map(
          (request) => `
            <article class="panel">
              <div class="card-footer top">
                <div>
                  <h3>${request.title}</h3>
                  <p>${request.agency} / ${request.channel}</p>
                </div>
                <span class="pill ${statusClass(request.status)}">${request.status}</span>
              </div>
              <dl class="detail-list grid">
                <div><dt>Protocol</dt><dd>${request.protocol}</dd></div>
                <div><dt>Sent</dt><dd>${request.sentDate}</dd></div>
                <div><dt>Due</dt><dd>${request.dueDate}</dd></div>
              </dl>
              <p><strong>Requested:</strong> ${request.requestedItems}</p>
              <p class="muted"><strong>Response:</strong> ${request.responseSummary}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRequestComparison(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Request comparison</p>
      <h2>Compare what was asked, what arrived and what still needs action.</h2>
    </section>
    <div class="comparison-grid">
      ${item.requestComparisons
        .map(
          (comparison) => `
            <article class="panel comparison-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">Request</p>
                  <h3>${comparison.requestTitle}</h3>
                </div>
                <span class="pill ${statusClass(comparison.deadlineStatus)}">${comparison.deadlineStatus}</span>
              </div>
              <div class="comparison-lane">
                <div>
                  <strong>Expected</strong>
                  <p>${comparison.expected}</p>
                </div>
                <div>
                  <strong>Received</strong>
                  <p>${comparison.received}</p>
                </div>
                <div>
                  <strong>Missing or unclear</strong>
                  <p>${comparison.missing}</p>
                </div>
              </div>
              <dl class="detail-list">
                <div>
                  <dt>Editorial decision</dt>
                  <dd>${comparison.editorialDecision}</dd>
                </div>
                <div>
                  <dt>Next step</dt>
                  <dd>${comparison.nextStep}</dd>
                </div>
              </dl>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderGaps(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Gaps and next steps</p>
      <h2>Turn missing evidence into follow-up actions.</h2>
    </section>
    <div class="stack">
      ${item.gaps
        .map(
          (gap) => `
            <article class="row-card">
              <div>
                <h3>${gap.description}</h3>
                <p>Origin: ${gap.origin}</p>
                <p class="muted">Next step: ${gap.nextStep}</p>
              </div>
              <div class="pill-column">
                <span class="pill ${statusClass(gap.severity)}">${gap.severity}</span>
                <span class="pill neutral">${gap.status}</span>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderClaims(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">Claim-to-evidence matrix</p>
      <h2>Check whether publishable claims are supported.</h2>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Claim</th><th>Type</th><th>Evidence</th><th>Strength</th><th>Risk</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${item.claims
            .map(
              (claim) => `
                <tr>
                  <td>${claim.text}</td>
                  <td>${claim.type}</td>
                  <td>${claim.evidence}</td>
                  <td><span class="pill ${statusClass(claim.strength)}">${claim.strength}</span></td>
                  <td><span class="pill ${statusClass(claim.risk)}">${claim.risk}</span></td>
                  <td>${claim.status}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function methodologyMarkdown(item) {
  const requests = item.requests.map((request) => `- ${request.title}: ${request.status}`).join("\n");
  const comparisons = item.requestComparisons
    .map((comparison) => `- ${comparison.requestTitle}: ${comparison.editorialDecision}; next step: ${comparison.nextStep}`)
    .join("\n");
  const gaps = item.gaps.map((gap) => `- ${gap.description} (${gap.status})`).join("\n");
  const claims = item.claims.map((claim) => `- ${claim.text} - ${claim.status}`).join("\n");

  return `# Methodological note: ${item.title}

## Central question
${item.centralQuestion}

## Scope
- Country/jurisdiction: ${item.country} / ${item.jurisdiction}
- Territory: ${item.territory}
- Period: ${item.period}

## Requests tracked
${requests}

## Request comparison
${comparisons}

## Open gaps and limitations
${gaps}

## Main claims
${claims}
`;
}

function renderMethodology(item) {
  const markdown = methodologyMarkdown(item);
  return `
    <section class="content-header">
      <p class="eyebrow">Methodological note</p>
      <h2>Export a transparent summary of evidence, requests and limits.</h2>
      <button class="button" data-action="copy-methodology">Copy Markdown</button>
    </section>
    <pre class="methodology" id="methodology-text">${markdown}</pre>
  `;
}

function bindActions() {
  document.querySelectorAll("[data-action='dashboard']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "dashboard";
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-action='open']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "investigation";
      state.currentId = button.dataset.id;
      state.currentTab = "overview";
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='tab']").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentTab = button.dataset.tab;
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='copy-methodology']").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = document.querySelector("#methodology-text")?.innerText || "";
      await navigator.clipboard.writeText(text);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy Markdown";
      }, 1500);
    });
  });
}

renderDashboard();
