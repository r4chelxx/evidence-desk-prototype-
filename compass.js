const COMPASS_MARKER = "investigation-compass";

function findMetricValue(index, label) {
  const cards = Array.from(document.querySelectorAll(".metrics-grid div"));
  const card = cards[index] || cards.find((item) => item.textContent.toLowerCase().includes(label));
  return card?.querySelector("strong")?.textContent.trim() || "0";
}

function openTab(tab) {
  document.querySelector(`[data-action="tab"][data-tab="${tab}"]`)?.click();
}

function buildCompass() {
  const overviewHeader = document.querySelector(".content-header");
  const executiveSummary = document.querySelector(".executive-summary");
  if (!overviewHeader || !executiveSummary || document.querySelector(`.${COMPASS_MARKER}`)) return;

  const title = overviewHeader.querySelector("h2")?.textContent.trim() || "Investigação";
  const evidence = Number(findMetricValue(1, "blocos de evidência")) + Number(findMetricValue(0, "hipóteses"));
  const requests = Number(findMetricValue(2, "pedidos")) + Number(findMetricValue(5, "acompanhamentos"));
  const risk = Number(findMetricValue(6, "lacunas abertas")) + Number(findMetricValue(11, "bloqueios de qa"));
  const claims = Number(findMetricValue(7, "afirmações"));

  const compass = document.createElement("section");
  compass.className = COMPASS_MARKER;
  compass.innerHTML = `
    <div class="compass-core">
      <p class="eyebrow">Bússola da investigação</p>
      <h3>Quatro leituras rápidas do mesmo caso: prova, transparência, risco e publicação.</h3>
      <span>${title}</span>
    </div>
    <div class="compass-orbit">
      ${compassCard("plan", evidence, "Linha de prova", "Hipóteses, fontes e blocos de evidência já mapeados.", evidence ? "success" : "warning")}
      ${compassCard("requests", requests, "Transparência", "Pedidos, respostas, comparações e follow-ups sob controle.", requests ? "warning" : "neutral")}
      ${compassCard("editorial", risk, "Risco editorial", "Lacunas, afirmações frágeis e bloqueios de QA antes de avançar.", risk ? "danger" : "success")}
      ${compassCard("claims", claims, "Publicação", "Afirmações e decisões prontas para revisão editorial.", claims ? "success" : "warning")}
    </div>
  `;

  executiveSummary.insertAdjacentElement("afterend", compass);
}

function compassCard(tab, value, title, copy, tone) {
  return `
    <button class="compass-card ${tone}" type="button" data-compass-tab="${tab}">
      <span class="compass-value">${value}</span>
      <strong>${title}</strong>
      <small>${copy}</small>
      <em>Ver área</em>
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
