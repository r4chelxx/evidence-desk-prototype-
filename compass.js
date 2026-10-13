const COMPASS_MARKER = "investigation-compass";

const compassCopy = {
  PT: {
    compass: "Bússola da investigação",
    heading: "Quatro leituras rápidas do mesmo caso: prova, transparência, risco e publicação.",
    proof: "Linha de prova",
    proofCopy: "Hipóteses, fontes e blocos de evidência já mapeados.",
    access: "Transparência",
    accessCopy: "Pedidos, respostas, comparações e follow-ups sob controle.",
    risk: "Risco editorial",
    riskCopy: "Lacunas, afirmações frágeis e bloqueios de QA antes de avançar.",
    publish: "Publicação",
    publishCopy: "Afirmações e decisões prontas para revisão editorial.",
    open: "Ver área",
    spine: "Fio da investigação",
    question: "Pergunta",
    questionCopy: "O que precisa ser respondido com evidência?",
    proofSpine: "Prova",
    proofReady: (value) => `${value} itens mapeados para sustentar a apuração.`,
    gap: "Lacuna",
    gapReady: "Sem bloqueio crítico registrado.",
    gapAlert: (value) => `${value} pontos ainda pedem cuidado editorial.`,
    claim: "Afirmação",
    claimReady: (value) => `${value} afirmações para revisar antes de publicar.`,
    claimPending: "Ainda sem afirmação publicável mapeada.",
  },
  EN: {
    compass: "Investigation compass",
    heading: "Four quick readings of the same story: proof, transparency, risk and publication.",
    proof: "Proof line",
    proofCopy: "Hypotheses, sources and evidence blocks already mapped.",
    access: "Transparency",
    accessCopy: "Requests, responses, comparisons and follow-ups under control.",
    risk: "Editorial risk",
    riskCopy: "Gaps, fragile claims and QA blockers before moving forward.",
    publish: "Publication",
    publishCopy: "Claims and decisions ready for editorial review.",
    open: "View area",
    spine: "Investigation thread",
    question: "Question",
    questionCopy: "What must be answered with evidence?",
    proofSpine: "Proof",
    proofReady: (value) => `${value} mapped items supporting the reporting.`,
    gap: "Gap",
    gapReady: "No critical blocker recorded.",
    gapAlert: (value) => `${value} points still need editorial care.`,
    claim: "Claim",
    claimReady: (value) => `${value} claims to review before publishing.`,
    claimPending: "No publishable claim mapped yet.",
  },
  ES: {
    compass: "Brújula de la investigación",
    heading: "Cuatro lecturas rápidas del mismo caso: prueba, transparencia, riesgo y publicación.",
    proof: "Línea de prueba",
    proofCopy: "Hipótesis, fuentes y bloques de evidencia ya mapeados.",
    access: "Transparencia",
    accessCopy: "Solicitudes, respuestas, comparaciones y seguimientos bajo control.",
    risk: "Riesgo editorial",
    riskCopy: "Vacíos, afirmaciones frágiles y bloqueos de QA antes de avanzar.",
    publish: "Publicación",
    publishCopy: "Afirmaciones y decisiones listas para revisión editorial.",
    open: "Ver área",
    spine: "Hilo de la investigación",
    question: "Pregunta",
    questionCopy: "¿Qué debe responderse con evidencia?",
    proofSpine: "Prueba",
    proofReady: (value) => `${value} ítems mapeados para sostener la reportería.`,
    gap: "Vacío",
    gapReady: "Sin bloqueo crítico registrado.",
    gapAlert: (value) => `${value} puntos aún piden cuidado editorial.`,
    claim: "Afirmación",
    claimReady: (value) => `${value} afirmaciones para revisar antes de publicar.`,
    claimPending: "Aún no hay afirmación publicable mapeada.",
  },
};

function activeLocale() {
  const active = document.querySelector(".locale-button.active")?.textContent.trim().toUpperCase();
  return compassCopy[active] ? active : "PT";
}

function findMetricValue(index) {
  const cards = Array.from(document.querySelectorAll(".metrics-grid div"));
  const card = cards[index];
  return card?.querySelector("strong")?.textContent.trim() || "0";
}

function findSummaryValue(index) {
  const cards = Array.from(document.querySelectorAll(".executive-summary .summary-tile"));
  const card = cards[index];
  return card?.querySelector("strong")?.textContent.trim() || "0";
}

function openTab(tab) {
  document.querySelector(`[data-action="tab"][data-tab="${tab}"]`)?.click();
}

function buildCompass() {
  const overviewHeader = document.querySelector(".content-header");
  const executiveSummary = document.querySelector(".executive-summary");
  if (!overviewHeader || !executiveSummary || document.querySelector(`.${COMPASS_MARKER}`)) return;

  const copy = compassCopy[activeLocale()];
  const title = overviewHeader.querySelector("h2")?.textContent.trim() || "Investigação";
  const evidence = Number(findSummaryValue(0));
  const requests = Number(findSummaryValue(1));
  const risk = Number(findSummaryValue(2));
  const claims = Number(findMetricValue(7));

  const compass = document.createElement("section");
  compass.className = COMPASS_MARKER;
  compass.innerHTML = `
    <div class="compass-core">
      <p class="eyebrow">${copy.compass}</p>
      <h3>${copy.heading}</h3>
      <span>${title}</span>
    </div>
    <div class="compass-orbit">
      ${compassCard("plan", evidence, copy.proof, copy.proofCopy, evidence ? "success" : "warning", copy)}
      ${compassCard("requests", requests, copy.access, copy.accessCopy, requests ? "warning" : "neutral", copy)}
      ${compassCard("editorial", risk, copy.risk, copy.riskCopy, risk ? "danger" : "success", copy)}
      ${compassCard("claims", claims, copy.publish, copy.publishCopy, claims ? "success" : "warning", copy)}
    </div>
    <div class="investigation-spine" aria-label="${copy.spine}">
      ${spineNode(copy.question, copy.questionCopy, "current")}
      ${spineNode(copy.proofSpine, copy.proofReady(evidence), evidence ? "ready" : "pending")}
      ${spineNode(copy.gap, risk ? copy.gapAlert(risk) : copy.gapReady, risk ? "alert" : "ready")}
      ${spineNode(copy.claim, claims ? copy.claimReady(claims) : copy.claimPending, claims ? "ready" : "pending")}
    </div>
  `;

  executiveSummary.insertAdjacentElement("afterend", compass);
}

function spineNode(label, copy, tone) {
  return `
    <article class="spine-node ${tone}">
      <strong>${label}</strong>
      <span>${copy}</span>
    </article>
  `;
}

function compassCard(tab, value, title, body, tone, copy) {
  return `
    <button class="compass-card ${tone}" type="button" data-compass-tab="${tab}">
      <span class="compass-value">${value}</span>
      <strong>${title}</strong>
      <small>${body}</small>
      <em>${copy.open}</em>
    </button>
  `;
}

document.addEventListener("click", (event) => {
  const card = event.target.closest("[data-compass-tab]");
  if (!card) return;
  openTab(card.dataset.compassTab);
});

const observer = new MutationObserver(buildCompass);
observer.observe(document.querySelector("#app"), { childList: true, subtree: true });
buildCompass();
