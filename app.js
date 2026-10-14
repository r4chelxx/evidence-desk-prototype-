import { investigations as seedInvestigations, mvpCoverage, prototypeLimits, qaModel, roadmap, testPlan } from "./data.js?v=20261014-qa37";
import { getDeadlineInfo, LAI_REFERENCE, parseDate } from './lai-deadlines.mjs?v=20261014-qa37';

const STORAGE_KEY = "evidence-desk-investigations-v1";
const UI_STORAGE_KEY = "evidence-desk-ui-v1";
const SEED_DATA_REVISION = "20261014-lai-assistant";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readLocalStorage(key) {
  try {
    return window.localStorage?.getItem(key) || null;
  } catch (error) {
    console.warn(`Could not read ${key}`, error);
    return null;
  }
}

function writeLocalStorage(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save ${key}`, error);
  }
}

function removeLocalStorage(key) {
  try {
    window.localStorage?.removeItem(key);
  } catch (error) {
    console.warn(`Could not remove ${key}`, error);
  }
}

function loadInvestigations() {
  try {
    const stored = readLocalStorage(STORAGE_KEY);
    if (!stored) return clone(seedInvestigations);
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.length) return clone(seedInvestigations);
    let changed = false;
    const seedById = new Map(seedInvestigations.map((item) => [item.id, item]));
    const merged = parsed.map((item) => {
      const seed = seedById.get(item.id);
      if (!seed) return item;
      if (item.seedRevision === SEED_DATA_REVISION) return item;
      changed = true;
      return { ...clone(seed), seedRevision: SEED_DATA_REVISION };
    });
    seedInvestigations.forEach((seed) => {
      if (!merged.some((item) => item.id === seed.id)) {
        changed = true;
        merged.push({ ...clone(seed), seedRevision: SEED_DATA_REVISION });
      }
    });
    if (changed) writeLocalStorage(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.warn("Could not load saved investigations", error);
    return clone(seedInvestigations);
  }
}

let investigations = loadInvestigations();

function loadUiState() {
  try {
    const stored = readLocalStorage(UI_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not load saved interface state", error);
    return {};
  }
}

const savedUiState = loadUiState();
const savedCurrentId = investigations.some((item) => item.id === savedUiState.currentId)
  ? savedUiState.currentId
  : investigations[0].id;

const state = {
  view: savedUiState.view || "dashboard",
  currentId: savedCurrentId,
  currentTab: savedUiState.currentTab || "overview",
  locale: savedUiState.locale || "pt",
  filters: {
    status: "all",
    country: "all",
    language: "all",
    topic: "all",
    ...(savedUiState.filters || {}),
  },
  draft: {
    title: "",
    country: "",
    jurisdiction: "",
    language: "",
    topic: "",
    territory: "",
    period: "",
    centralQuestion: "",
    description: "",
  },
  draftErrors: [],
  draftNotice: "",
  planDraft: {
    hypothesisText: "",
    hypothesisEvidence: "",
    hypothesisStatus: "",
    evidenceType: "",
    evidencePriority: "",
    evidenceStatus: "",
    sourceName: "",
    sourceType: "",
    sourceStatus: "",
    sourceUse: "",
    sourceLimits: "",
  },
  planNotice: "",
  requestDraft: {
    title: "",
    agency: "",
    channel: "",
    protocol: "",
    sentDate: "",
    dueDate: "",
    status: "",
    requestedItems: "",
    responseSummary: "",
  },
  requestNotice: "",
  comparisonDraft: {
    requestTitle: "",
    deadlineStatus: "",
    expected: "",
    received: "",
    missing: "",
    editorialDecision: "",
    nextStep: "",
  },
  comparisonNotice: "",
  followUpDraft: {
    title: "",
    type: "",
    request: "",
    status: "",
    riskNote: "",
    draft: "",
  },
  followUpNotice: "",
  transparencyDraft: {
    date: "",
    actor: "",
    event: "",
    status: "",
    nextStep: "",
  },
  transparencyNotice: "",
  actionDraft: {
    action: "",
    source: "",
    priority: "",
    status: "",
    owner: "",
    dueDate: "",
    type: "",
    rationale: "",
    output: "",
  },
  actionNotice: "",
  gapDraft: {
    description: "",
    origin: "",
    severity: "",
    status: "",
    nextStep: "",
  },
  gapNotice: "",
  claimDraft: {
    text: "",
    type: "",
    evidence: "",
    relation: "",
    strength: "",
    risk: "",
    status: "",
  },
  claimNotice: "",
};

if (state.view === "investigation" && !investigations.some((item) => item.id === state.currentId)) {
  state.view = "dashboard";
  state.currentId = investigations[0].id;
  state.currentTab = "overview";
}

const app = document.querySelector("#app");

const dictionary = {
  pt: {
    all: "Todos",
    languageToggle: "Idioma da interface",
    topbarNote: "Fluxo de investigação para jornalismo de interesse público",
    goDashboard: "Voltar ao painel",
    heroEyebrow: "MVP v0.1",
    heroTitle: "Transforme perguntas investigativas em evidências, lacunas e afirmações publicáveis.",
    heroCopy:
      "Este protótipo estático testa o fluxo central antes de backend, login ou IA: mapear evidências, acompanhar pedidos, comparar respostas e ligar afirmações a provas.",
    prototypeGoal: "Objetivo do protótipo",
    prototypeGoalText: "Validar se o método ajuda jornalistas a trabalhar com menos caos.",
    investigations: "Investigações",
    testCases: "Casos de teste",
    shown: "investigações exibidas",
    newInvestigation: "Nova investigação",
    status: "Status",
    country: "País",
    language: "Idioma",
    topic: "Tema",
    reset: "Limpar",
    openInvestigation: "Abrir investigação",
    requests: "Pedidos",
    responses: "Respostas",
    followUps: "Acompanhamentos",
    qaBlockers: "bloqueios de QA",
    emptyTitle: "Nenhuma investigação corresponde aos filtros.",
    emptyCopy: "Tente outro país, idioma, tema ou status. Isso testa o estado vazio previsto no MVP.",
    clearFilters: "Limpar filtros",
    buildRoadmap: "Roadmap do produto",
    roadmapTitle: "O que este protótipo testa antes de a engenharia ficar cara",
    fellowshipScope: "escopo fellowship",
    validationQuestion: "Pergunta de validação",
    mvpCoverage: "Cobertura do MVP",
    mvpCoverageTitle: "Checklist contra o documento original",
    mvpCoverageBadge: "revisão PRD",
    expectedInDoc: "Previsto no documento",
    implementedInPrototype: "No protótipo",
    testingGuide: "Guia de teste",
    testingTitle: "O que QA e jornalistas devem testar primeiro",
    testScript: "roteiro v0.1",
    coreTasks: "Tarefas centrais",
    feedbackQuestions: "Perguntas de feedback",
    acceptanceCriteria: "Critérios de aceitação",
    back: "Voltar para investigações",
    overview: "Visão geral",
    context: "Contexto",
    planTab: "Plano de apuração",
    requestsWorkspace: "LAI e respostas",
    editorialWorkspace: "Fila e lacunas",
    jurisdiction: "Jurisdição",
    languageTab: "Idioma",
    hypotheses: "Hipóteses",
    evidenceBlocks: "Blocos de evidência",
    sources: "Fontes",
    deadlines: "Prazos",
    actionPlan: "Plano de ação",
    editorialQueue: "Fila editorial",
    transparencyLog: "Diário de transparência",
    requestComparison: "Comparação de pedidos",
    gaps: "Lacunas",
    claims: "Afirmações",
    storyTab: "Matéria",
    qaChecklist: "Checklist QA",
    methodology: "Metodologia",
    evidenceBlocksMetric: "blocos de evidência",
    lateRequests: "pedidos atrasados",
    openGaps: "lacunas abertas",
    claimsReview: "afirmações a revisar",
    reviewItems: "itens de revisão",
    actionItems: "ações",
    queueItems: "itens na fila",
    centralQuestion: "Pergunta central",
    quickActions: "Ações rápidas",
    quickActionsCopy: "Atalhos para testar o fluxo central previsto no wireframe.",
    currentArea: "Área atual",
    mobileNavHint: "Use as abas acima para mudar de etapa.",
    desktopTestRail: "Teste no desktop",
    desktopTestRailHeading: "Use esta barra para navegar o fluxo sem perder o contexto.",
    tabProgress: "Etapa",
    nextArea: "Próxima área",
    openQaCheck: "Abrir QA",
    openMethodologyNote: "Abrir metodologia",
    desktopHint:
      "Percorra da visão geral à metodologia e observe se cada decisão aponta para evidência, pedido ou lacuna.",
    storyBuilderTitle: "Matéria em construção",
    storyBuilderHeading: "Da pauta ao texto publicável",
    storyBuilderCopy:
      "Esta área mostra o que a investigação já consegue dizer, o que ainda é hipótese e o que bloqueia a publicação.",
    workingThesis: "Tese provisória",
    publishableAngle: "Caminho de publicação",
    editorQuestion: "Pergunta editorial",
    storySectionRole: "Papel na matéria",
    storySectionEvidence: "Base usada",
    storySectionBlocker: "O que ainda trava",
    storyNoDraft:
      "A ferramenta ainda está montando uma leitura editorial desta pauta a partir de hipóteses, pedidos, lacunas e claims.",
    storyWorkspaceTitle: "Mesa da matéria",
    storyWorkspaceHeading: "Monte a publicação a partir do que já está provado.",
    storyWorkspaceCopy:
      "Use esta etapa para separar texto publicável, ressalvas necessárias e lacunas que ainda impedem conclusões.",
    storyPackageTitle: "Pacote de publicação",
    storyPackageHeading: "O que entra, o que entra com ressalva e o que fica fora por enquanto.",
    storyOutlineTitle: "Estrutura narrativa",
    storyOutlineHeading: "Transforme apuração em blocos de texto revisáveis.",
    publishableClaimsTitle: "Afirmações para o texto",
    publishableClaimsHeading: "Decida como cada afirmação deve aparecer na matéria.",
    storyClaimReady: "Pode entrar no texto",
    storyClaimCaveat: "Usar com ressalva",
    storyClaimHold: "Segurar por enquanto",
    publicationBlockersTitle: "Travas de publicação",
    publicationBlockersHeading: "Pontos que ainda impedem uma versão final segura.",
    noPublicationBlockers: "Nenhuma trava crítica registrada para a publicação.",
    methodologyBridgeTitle: "Fechar método",
    methodologyBridgeCopy: "Depois de decidir o que entra no texto, exporte a nota metodológica com limites, pedidos e evidências.",
    openStoryWorkspace: "Abrir matéria",
    openClaimsBoard: "Abrir afirmações",
    mobileFocusTitle: "Modo foco",
    mobileFocusHeading: "O que fazer agora",
    mobileNextDecision: "Próxima decisão",
    mobilePublicationBlocker: "Trava principal",
    mobileOpenStory: "Ver matéria",
    mobileContinueReporting: "Continuar apuração",
    mobileReviewClaims: "Revisar afirmações",
    executiveSummary: "Resumo executivo",
    investigationCompass: "Bússola da investigação",
    investigationCompassHeading: "Quatro leituras rápidas do mesmo caso: prova, transparência, risco e publicação.",
    compassEvidenceTitle: "Linha de prova",
    compassEvidenceCopy: "Hipóteses, fontes e blocos de evidência já mapeados.",
    compassAccessTitle: "Transparência",
    compassAccessCopy: "Pedidos, respostas, comparações e follow-ups sob controle.",
    compassRiskTitle: "Risco editorial",
    compassRiskCopy: "Lacunas, claims frágeis e bloqueios de QA antes de avançar.",
    compassPublishTitle: "Publicação",
    compassPublishCopy: "Afirmações fortes, metodologia e decisões prontas para revisão.",
    compassOpen: "Ver área",
    investigationThread: "Fio da investigação",
    threadQuestion: "Pergunta",
    threadQuestionCopy: "O que precisa ser respondido com evidência?",
    threadProof: "Prova",
    threadProofReady: "itens mapeados para sustentar a apuração.",
    threadGap: "Lacuna",
    threadGapReady: "Sem bloqueio crítico registrado.",
    threadGapAlert: "pontos ainda pedem cuidado editorial.",
    threadClaim: "Afirmação",
    threadClaimReady: "afirmações para revisar antes de publicar.",
    threadClaimPending: "Ainda sem afirmação publicável mapeada.",
    dataAuditTitle: "Auditoria do caso",
    dataAuditHeading: "Antes do teste editorial, confira vínculos, prazos e riscos estruturais.",
    dataAuditOk: "Sem bloqueio estrutural detectado.",
    dataAuditReview: "Atenção",
    dataAuditBlocked: "Bloqueio",
    dataAuditReady: "OK",
    auditDuplicateIds: "Há IDs duplicados nos dados carregados.",
    auditNoRequests: "A investigação ainda não tem pedidos registrados.",
    auditRequestWithoutComparison: "pedido(s) ainda não têm comparação pedido-resposta.",
    auditComparisonWithoutRequest: "comparação(ões) não batem com nenhum pedido registrado.",
    auditClaimWithoutEvidence: "afirmação(ões) ainda não apontam evidência.",
    auditClaimWeak: "afirmação(ões) têm sustentação insuficiente ou relação indefinida.",
    auditHighRiskClaim: "afirmação(ões) de alto risco exigem revisão antes de publicação.",
    auditOverdueRequests: "pedido(s) passaram do prazo/checkpoint.",
    auditOpenQaBlockers: "bloqueio(s) de QA seguem abertos.",
    readinessTitle: "Prontidão da investigação",
    readinessHeading: "Veja o que já está estruturado e o que ainda precisa de decisão antes dos testes.",
    readinessReady: "Pronto",
    readinessReview: "Revisar",
    readinessAction: "Agir",
    readinessBlocked: "Bloqueado",
    openStep: "Abrir etapa",
    summaryEvidence: "Evidências mapeadas",
    summaryRequests: "Pedidos monitorados",
    summaryRisk: "Riscos abertos",
    summaryNext: "Próxima decisão",
    noImmediateAction: "Nenhuma ação crítica no momento",
    addHypothesis: "Adicionar hipótese",
    mapEvidence: "Mapear evidência",
    registerRequest: "Registrar pedido",
    reviewResponse: "Revisar resposta",
    openQueue: "Abrir fila",
    addClaim: "Adicionar afirmação",
    exportMethodology: "Exportar metodologia",
    exportJson: "Exportar JSON",
    exportedJson: "JSON exportado",
    importJson: "Importar JSON",
    resetLocalData: "Restaurar exemplos",
    localSaveNote: "Salvo neste navegador",
    importedJson: "JSON importado",
    importJsonError: "Não foi possível importar este JSON.",
    createInvestigation: "Criar investigação",
    investigationCreated: "Investigação criada e salva neste navegador.",
    deadlinesNext: "Prazos e próximos passos",
    deadlinesTitle: "Saiba quando esperar, checar, contestar ou escalar.",
    sent: "Enviado",
    originalDue: "Prazo original",
    currentCheckpoint: "Checkpoint atual",
    checkpointSource: "Fonte do checkpoint",
    suggestedAction: "Ação sugerida",
    noDate: "Sem data definida",
    priorityPrefix: "Prioridade",
    owner: "Responsável",
    dueCheckpoint: "Prazo/checkpoint",
    type: "Tipo",
    whyItMatters: "Por que importa",
    output: "Saída esperada",
    actionPlanTitle: "Transforme o log da apuração em uma fila controlada de próximos passos.",
    actionPlanCopy: "Cada ação deve estar ligada a uma fonte, protocolo ou evento procedimental documentado.",
    editorialQueueTitle: "Fila editorial",
    editorialQueueHeading: "Veja o que precisa de decisão humana antes de públicar ou automatizar.",
    editorialQueueCopy: "A fila combina checkpoints, revisões e ações prioritárias sem transformar pendência em conclusão.",
    queueDeadlines: "Checkpoints ativos",
    queueReviews: "Revisões editoriais",
    queueActions: "Ações prioritárias",
    queueEmpty: "Nenhum item prioritário registrado.",
    queueRule: "Regra da fila",
    queueRuleCopy: "Cada item precisa apontar para protocolo, fonte, prazo ou lacuna antes de virar tarefa de reportagem.",
    priority: "prioridade",
    requestLabel: "Pedido",
    protocol: "Protocolo",
    due: "Prazo",
    requested: "Solicitado",
    response: "Resposta",
    responsesTitle: "Respostas recebidas",
    responsesHeading: "Revise o que chegou antes de transformar resposta em evidência.",
    responseStatus: "Status da resposta",
    receivedMaterials: "Material recebido",
    identifiedGaps: "Lacunas identificadas",
    reviewDecision: "Decisão de revisão",
    noReceivedMaterial: "Nenhum material recebido ou verificável ainda.",
    noComparisonYet: "Comparação detalhada ainda não registrada.",
    responseReviewRule: "Regra de revisão",
    responseReviewRuleCopy: "Uma resposta só vira evidência depois de abrir arquivos, conferir anexos, checar campos e registrar limites.",
    ifNothingArrives: "Se nada chegar",
    requestsEyebrow: "Pedidos",
    requestsTitle: "Acompanhe pedidos feitos fora da plataforma.",
    requestsCommandCenter: "Painel de pedidos",
    requestsCommandCopy: "Resumo do que já foi pedido, recebido, comparado e precisa de follow-up.",
    totalRequests: "Pedidos registrados",
    reviewedResponses: "Respostas revisadas",
    nextFollowUp: "Próximo follow-up",
    noFollowUpNeeded: "Nenhum follow-up prioritário",
    attentionNeeded: "Atenção agora",
    methodSafeguards: "Salvaguardas metodológicas",
    methodSafeguardsTitle: "Regras que impedem a ferramenta de exagerar evidências.",
    processGuide: "Guia de processo",
    processGuideTitle: "Fluxo atento à jurisdição, ainda controlado pela repórter.",
    laiAssistantTitle: "Assistente LAI",
    laiAssistantHeading: "Acompanhe cada pedido e confira a resposta recebida.",
    laiAssistantCopy:
      "Registre o que foi pedido, o que chegou e o que faltou. A ferramenta organiza completude, diário, próximos passos, prazos, canais e ressalvas para a repórter agir fora da plataforma quando necessário.",
    laiComplete: "Resposta aproveitável",
    laiPartial: "Resposta parcial",
    laiBlocked: "Não usar ainda",
    laiNextAction: "Próxima ação sugerida",
    laiCompleteness: "Completude",
    transparencyLogTitle: "Histórico de transparência da reportagem",
    transparencyLogHeading: "O diário nasce da análise de pedidos e respostas, não como aba editorial separada.",
    transparencyLogCopy: "Use este histórico para separar pedido, encaminhamento, resposta parcial, recurso e entrega real de documentos.",
    noTransparencyTitle: "Ainda não há diário de transparência.",
    noTransparencyCopy: "Adicione eventos processuais conforme pedidos avancem por recursos ou revisão.",
    nextStep: "Próximo passo",
    requestComparisonTitle: "Comparação de pedidos",
    requestComparisonHeading: "Compare o que foi pedido, o que chegou e o que ainda exige ação.",
    expected: "Esperado",
    received: "Recebido",
    missingUnclear: "Ausente ou pouco claro",
    editorialDecision: "Decisão editorial",
    followUpDraftsTitle: "Rascunhos de follow-up",
    followUpDraftsHeading: "Prepare mensagens e recursos sem enviar nada automaticamente.",
    followUpDraftsCopy: "Cada rascunho é ponto de partida para revisão humana, não orientação jurídica nem petição pronta.",
    relatedRequest: "Pedido relacionado",
    reporterCheck: "Checagem da repórter",
    gapsTitle: "Lacunas e próximos passos",
    gapsHeading: "Transforme evidências ausentes em ações de follow-up.",
    origin: "Origem",
    claimMatrixTitle: "Matriz afirmação-evidência",
    claimMatrixHeading: "Verifique se afirmações publicáveis estão sustentadas.",
    claimDashboardTitle: "Painel de afirmações",
    claimDashboardCopy: "Veja rapidamente o que pode avançar, o que precisa de cautela e o que ainda depende de evidência.",
    totalClaims: "Afirmações mapeadas",
    claimsWithSupport: "Com sustentação forte",
    claimsNeedingCare: "Exigem cautela",
    highRiskClaims: "Alto risco",
    noHighRiskClaims: "Nenhuma afirmação de alto risco",
    reportingMapTitle: "Mapa de apuração",
    reportingMapHeading: "Conecte hipótese, evidência necessária e caminho provável de fonte.",
    reportingMapCopy: "Use este mapa para enxergar se uma hipótese já tem prova, fonte e limite antes de virar afirmação.",
    evidencePath: "Caminho de evidência",
    sourcePath: "Caminho de fonte",
    evidenceInventoryTitle: "Inventário de evidências",
    evidenceInventoryHeading: "Veja todos os blocos mapeados, inclusive os que ainda não entraram no mapa.",
    evidenceCoverage: "Cobertura",
    caseTestTitle: "Pré-teste editorial",
    caseTestHeading: "Roteiro rápido para testar esta investigação antes de mexer nos dados reais.",
    caseTestReady: "Pronto para testar",
    caseTestReview: "Revisar antes do teste",
    fullFlowTestTitle: "Roteiro de teste completo",
    fullFlowTestHeading: "Execute uma rodada guiada do início à nota metodológica.",
    testStepOpen: "Abrir estado do caso",
    testStepPlan: "Traçar uma hipótese",
    testStepRequests: "Classificar um pedido",
    testStepClaims: "Decidir uma afirmação",
    testStepMethod: "Conferir exportação",
    testExpected: "O que observar",
    testStepOpenExpected: "A pessoa entende situação, risco e próxima etapa sem explicação externa.",
    testStepPlanExpected: "A pessoa consegue seguir hipótese, evidência e fonte provável.",
    testStepRequestsExpected: "A pessoa identifica status do pedido e próxima ação segura.",
    testStepClaimsExpected: "A pessoa diferencia avançar, ressalvar ou segurar uma afirmação.",
    testStepMethodExpected: "A pessoa encontra limites, QA e nota exportável.",
    testContextCheck: "Contexto e jurisdição estão legíveis.",
    testPlanCheck: "Hipóteses, evidências e fontes aparecem como caminho de apuração.",
    testRequestCheck: "Pedidos têm status, prazo/checkpoint e próxima ação.",
    testClaimCheck: "Afirmações têm decisão editorial e vínculo com evidência.",
    testMethodCheck: "Metodologia exportável e QA estão disponíveis.",
    requestBoardTitle: "Quadro de pedidos",
    requestBoardHeading: "Veja o processo por situação, não apenas como lista.",
    requestStageWaiting: "Aguardando",
    requestStageProblem: "Atenção",
    requestStageReceived: "Material recebido",
    requestStageSeparate: "Fluxo separado",
    requestStageNext: "Próxima ação",
    noRequestsInStage: "Nenhum pedido nesta coluna.",
    claimDecisionTitle: "Decisão editorial",
    claimDecisionHeading: "Leia cada afirmação como uma decisão: avançar, limitar ou segurar.",
    decisionAdvance: "Pode avançar",
    decisionLimit: "Usar com ressalva",
    decisionHold: "Segurar",
    decisionEvidence: "Base",
    decisionWhy: "Por quê",
    claim: "Afirmação",
    evidence: "Evidência",
    evidenceRelation: "Relação",
    strength: "Força",
    risk: "Risco",
    qaModelTitle: "Modelo QA v0.2",
    qaModelHeading: "Glossário, status fechados e evidências contraditórias.",
    qaModelCopy: "Rodada baseada na revisão de QA: o protótipo agora registra se uma evidência sustenta, contradiz ou limita uma afirmação.",
    glossaryTerms: "Glossário operacional",
    statusRegistry: "Lista fechada de status",
    evidenceRelations: "Relações de evidência",
    strengthScale: "Escala de força",
    riskScale: "Escala de risco",
    publishRule: "Regra de publicação",
    requiredAction: "Ação obrigatória",
    dataModel: "Modelo de dados",
    relationship: "Relação",
    accessibilityChecks: "Acessibilidade",
    functionalCoverage: "Cobertura funcional",
    qaExpectation: "Critério QA",
    prototypeCoverage: "Cobertura no protótipo",
    methodologyNote: "Nota metodológica",
    methodologyHeading: "Exporte um resumo transparente de evidências, pedidos e limites.",
    qaChecklistHeading: "Revise riscos antes de tratar evidências como publicáveis.",
    qaNoBlockers: "Nenhum bloqueio de QA registrado.",
    qaBlockerSingular: "bloqueio precisa de atenção antes de demo ou publicação.",
    qaBlockerPlural: "bloqueios precisam de atenção antes de demo ou publicação.",
    riskSuffix: "risco",
    action: "Ação",
    editorialSafeguards: "Salvaguardas editoriais",
    editorialSafeguardsHeading: "Não transforme problemas de acesso em afirmações sem evidência.",
    noActionTitle: "Ainda não há plano de ação.",
    noActionCopy: "Adicione tarefas revisadas pela repórter depois de cada pedido, recurso ou revisão de resposta.",
    separateTrackAction: "Mantenha este fluxo em um log separado e atualize somente quando o próprio canal retornar resposta.",
    checkpointPassed: "Checkpoint ultrapassado.",
    partialAction: "Compare os campos solicitados com os registros entregues e envie follow-up focado nos itens ausentes.",
    brokenAction: "Documente o problema de acesso com prints e solicite link válido ou reenvio do arquivo.",
    overdueAction: "Prepare uma nota de escalonamento com protocolo, datas, texto do pedido e prova da ausência de resposta.",
    nearDeadlineAction: "Prepare agora a checklist de recebimento para revisar rapidamente o material quando chegar.",
    waitAction: "Aguarde, mantenha o protocolo organizado e confirme a próxima data de revisão no log da apuração.",
    jurisdictionAccess: "Jurisdição e regras de acesso",
    jurisdictionHeading: "Defina prazos e caminhos de fonte antes de usar assistência por IA.",
    jurisdictionCopy: "A ferramenta deve guiar a repórter por regras conhecidas, não inventa-las.",
    deadline: "Prazo",
    requestChannels: "Canais de pedido",
    escalation: "Escalonamento",
    reporterWarning: "Alerta para repórter",
    productRule: "Regra do produto",
    productRuleCopy:
      "Evidence Desk só pode sugerir próximos passos depois que a repórter seleciona jurisdição, confirma o canal do pedido e revisa a regra de acesso relevante.",
    sourceDiscovery: "Descoberta de fontes",
    sourceDiscoveryHeading: "Comece por caminhos controlados, depois deixe a repórter verificar.",
    verify: "Verificar",
    languageLocalization: "Idioma e localização",
    languageHeading: "Separe tradução de localização juridica e editorial.",
    languageCopy: "Uma ferramenta global precisa de acesso multilingue, mas orientação sobre lei de acesso ainda depende da jurisdição.",
    languagePlan: "Plano de idioma",
    workingLanguage: "Idioma de trabalho",
    interfaceOptions: "Opções de interface",
    publicationLanguages: "Idiomas de publicação",
    localizationRule: "Regra de localização",
    localizationRuleCopy:
      "Traduza livremente os rótulos da interface, mas localize leis, prazos, órgãos e tipos de fonte somente quando a jurisdição for conhecida e revisada pela repórter.",
    translationNotes: "Notas de tradução",
    translationNotesHeading: "Termos que exigem revisão humana.",
    notes: "Notas",
    glossary: "Glossário",
    secondaryQuestions: "Perguntas secundárias",
    block: "Bloco",
    priorityLabel: "Prioridade",
    sourcesTitle: "Fontes e bases de dados",
    sourcesHeading: "Separe fontes verificadas de caminhos prováveis.",
    limits: "Limites",
    copyMarkdown: "Copiar Markdown",
    copied: "Copiado",
    projectScope: "Escopo do projeto",
    topicLabel: "Tema",
    territory: "Território",
    period: "Período",
    updated: "Atualizado",
    editorialSafetyRule: "Regra de segurança editorial",
    editorialSafetyCopy:
      "Lacunas não são conclusões. Elas são problemas de evidência em aberto que exigem follow-up, limite metodológico ou reescrita da afirmação.",
    freshnessCheck: "Checagem de atualidade",
    reviewRecommended: "Revisão recomendada",
    reviewLog: "Revise o log da investigação antes de confiar neste caso.",
    separateTrack: "Fluxo separado",
    partialResponse: "Resposta parcial recebida",
    responseReceived: "Resposta recebida",
    daysToCheckpoint: "dias até o checkpoint",
    dayToCheckpoint: "dia até o checkpoint",
    daysLeft: "dias restantes",
    dayLeft: "dia restante",
    daysPastCheckpoint: "dias depois do checkpoint",
    dayPastCheckpoint: "dia depois do checkpoint",
    daysOverdue: "dias de atraso",
    dayOverdue: "dia de atraso",
    prototypeLimits: "Limites do protótipo",
    prototypeLimitsTitle: "O que está testável agora e o que ainda não deve ser prometido",
    currentBehavior: "Comportamento atual",
    nextProductStep: "Próximo passo de produto",
    createTitle: "Comece com uma pergunta que a evidência consegue responder.",
    createCopy:
      "Este formulário simulado testa o fluxo inicial do MVP. Ele valida campos obrigatórios, mostra a estrutura do projeto e mantém o salvamento desativado até existir backend.",
    cancel: "Cancelar",
    reviewBeforeContinue: "Revise antes de continuar",
    investigationTitle: "Título da investigação",
    investigationTitlePlaceholder: "ex.: Violência obstétrica e transparência de dados públicos",
    countryPlaceholder: "ex.: Brasil, Estados Unidos, México",
    jurisdictionLocality: "Jurisdição/localidade",
    jurisdictionPlaceholder: "ex.: Bahia, Cook County, Cidade do México",
    primaryLanguage: "Idioma principal",
    primaryLanguagePlaceholder: "ex.: Português, Inglês, Espanhol",
    generalTopic: "Tema geral",
    topicPlaceholder: "ex.: Saúde pública, educação, meio ambiente",
    investigatedTerritory: "Território investigado",
    territoryPlaceholder: "ex.: Salvador e interior da Bahia",
    investigatedPeriod: "Período investigado",
    periodPlaceholder: "ex.: 2020-2026",
    centralInvestigativeQuestion: "Pergunta investigativa central",
    centralQuestionPlaceholder: "Que pergunta esta investigação deve responder com evidências?",
    centralQuestionHelp: "Obrigatório. Prefira uma pergunta que possa ser respondida com documentos, dados, entrevistas ou respostas oficiais.",
    shortDescription: "Descrição curta",
    descriptionPlaceholder: "O que a pauta tenta entender?",
    validateStructure: "Validar estrutura",
    saveDraftAfterBackend: "Salvar rascunho local",
    workspacePreview: "Prévia do espaço de trabalho",
    untitledInvestigation: "Investigação sem título",
    countryJurisdiction: "País/jurisdição",
    starterStructure: "Estrutura inicial",
    sourcesDatabases: "Fontes/bases",
    notSet: "Não definido",
    draftReady: "Estrutura pronta para a próxima etapa do MVP: mapear hipóteses e blocos de evidência.",
    errorTitleRequired: "Adicione um título para a investigação.",
    errorCountryRequired: "Adicione um país.",
    errorLanguageRequired: "Adicione o idioma principal.",
    errorQuestionRequired: "Adicione uma pergunta investigativa central.",
    errorTitleSpecific: "Deixe o título mais específico para QA entender o caso.",
    errorQuestionMark: "Formule a pergunta central como pergunta.",
    startHere: "Comece por aqui",
    startHereTitle: "Fluxo de trabalho recomendado",
    startHereBadge: "4 etapas",
    workflowContextTitle: "Confirme contexto e jurisdição",
    workflowContextCopy: "Veja idioma, território, regra de acesso e limites antes de confiar em prazos ou fontes.",
    workflowPlanTitle: "Mapeie perguntas, hipóteses e evidências",
    workflowPlanCopy: "Transforme a pauta em blocos verificáveis e fontes possíveis, sem deixar a IA escolher sozinha.",
    workflowRequestsTitle: "Acompanhe pedidos e respostas",
    workflowRequestsCopy: "Registre prazos, materiais recebidos, anexos ausentes e próximos passos.",
    workflowClaimsTitle: "Revise afirmações publicáveis",
    workflowClaimsCopy: "Só avance quando cada afirmação tiver evidência, relação, força, risco e ressalva.",
    navGroupStart: "Comece",
    navGroupInvestigate: "Apure",
    navGroupDecide: "Decida",
    navGroupExport: "Publique",
    tabGuideTitle: "Como usar esta área",
    tabGuideOverview: "Use a visão geral para entender o estado da pauta e decidir onde entrar primeiro.",
    tabGuideContext: "Confirme território, idioma e regra de acesso antes de confiar em prazos, bases ou fontes.",
    tabGuidePlan: "Transforme a pergunta em hipóteses, blocos de evidência e fontes verificáveis.",
    tabGuideRequests: "Registre pedidos feitos fora da plataforma, compare respostas e acompanhe próximos passos.",
    tabGuideEditorial: "Converta lacunas, prazos e riscos em ações humanas controladas.",
    tabGuideClaims: "Só avance afirmações quando relação, força, risco e evidência estiverem explícitos.",
    tabGuideStory: "Monte a matéria com tese provisória, blocos narrativos, afirmações aproveitáveis e travas finais.",
    tabGuideQa: "Use o checklist para encontrar bloqueios antes de demo, publicação ou automação.",
    tabGuideMethodology: "Exporte uma nota transparente sobre evidências, limites, pedidos e decisões.",
    addToPlan: "Adicionar ao plano",
    addHypothesisTitle: "Adicionar hipótese de trabalho",
    hypothesisTextLabel: "Hipótese",
    hypothesisTextPlaceholder: "ex.: Falhas de transparência impedem comparar maternidades",
    hypothesisEvidenceLabel: "Evidência necessária",
    hypothesisEvidencePlaceholder: "ex.: Dados por unidade, protocolo e resposta oficial",
    hypothesisStatusLabel: "Status da hipótese",
    addEvidenceBlockTitle: "Adicionar bloco de evidência",
    evidenceTypeLabel: "Tipo de evidência",
    evidenceTypePlaceholder: "ex.: série histórica por maternidade",
    evidencePriorityLabel: "Prioridade",
    evidenceStatusLabel: "Status do bloco",
    addSourceTitle: "Adicionar fonte ou base",
    sourceNameLabel: "Nome da fonte/base",
    sourceNamePlaceholder: "ex.: DATASUS, ministério, tribunal, prefeitura",
    sourceTypeLabel: "Tipo",
    sourceStatusLabel: "Status da fonte",
    sourceUseLabel: "Uso na investigação",
    sourceUsePlaceholder: "Que pergunta esta fonte pode ajudar a responder?",
    sourceLimitsLabel: "Limites conhecidos",
    sourceLimitsPlaceholder: "O que esta fonte não resolve ou precisa de checagem?",
    itemAdded: "Item adicionado e salvo neste navegador.",
    fillRequiredPlanFields: "Preencha os campos principais antes de adicionar.",
    addRequestTitle: "Registrar pedido externo",
    requestTitleLabel: "Título do pedido",
    requestTitlePlaceholder: "ex.: Óbitos maternos por maternidade",
    agencyLabel: "Órgão ou instituição",
    agencyPlaceholder: "ex.: SESAB, prefeitura, ministério",
    channelLabel: "Canal",
    channelPlaceholder: "ex.: e-SIC, FOIA portal, e-mail",
    protocolPlaceholder: "ex.: protocolo, ID público ou controle interno",
    sentDateLabel: "Data de envio",
    dueDateLabel: "Prazo esperado",
    requestStatusLabel: "Status do pedido",
    requestedItemsLabel: "Itens solicitados",
    requestedItemsPlaceholder: "Liste os campos, documentos ou bases solicitadas.",
    responseSummaryLabel: "Resumo da resposta",
    responseSummaryPlaceholder: "Registre se não houve resposta, se veio parcial ou o que foi entregue.",
    addRequest: "Adicionar pedido",
    requestAdded: "Pedido adicionado e salvo neste navegador.",
    addComparisonTitle: "Comparar pedido e resposta",
    comparisonRequestLabel: "Pedido comparado",
    comparisonRequestPlaceholder: "Digite o título do pedido ou selecione pelo mesmo nome já registrado.",
    deadlineStatusLabel: "Status do prazo/resposta",
    expectedLabel: "O que foi solicitado",
    expectedPlaceholder: "Liste os campos, documentos, recortes ou anexos que deveriam chegar.",
    receivedLabel: "O que foi recebido",
    receivedPlaceholder: "Registre exatamente o que chegou, incluindo links, anexos, arquivos ou ausência de entrega.",
    missingLabel: "Ausente ou pouco claro",
    missingPlaceholder: "O que ainda falta, veio incompleto ou não permite comparação?",
    editorialDecisionLabel: "Decisão editorial",
    editorialDecisionPlaceholder: "ex.: usar com ressalva, não usar, recorrer, fazer novo pedido",
    comparisonNextStepPlaceholder: "Qual ação vem agora?",
    addComparison: "Salvar comparação",
    comparisonAdded: "Comparação adicionada e salva neste navegador.",
    addFollowUpTitle: "Criar rascunho de follow-up",
    followUpTitleLabel: "Título do rascunho",
    followUpTitlePlaceholder: "ex.: Solicitar reenvio dos anexos",
    followUpTypeLabel: "Tipo de follow-up",
    followUpTypePlaceholder: "ex.: recurso, pedido complementar, contestação, checagem",
    followUpRequestLabel: "Pedido relacionado",
    followUpRequestPlaceholder: "Use o título ou protocolo do pedido relacionado.",
    followUpStatusLabel: "Status do rascunho",
    riskNoteLabel: "Checagem obrigatória",
    riskNotePlaceholder: "O que a repórter precisa revisar antes de enviar?",
    draftTextLabel: "Texto do rascunho",
    draftTextPlaceholder: "Escreva o texto-base do follow-up para revisão humana.",
    addFollowUp: "Salvar rascunho",
    followUpAdded: "Rascunho adicionado e salvo neste navegador.",
    addTransparencyEventTitle: "Adicionar evento ao diário",
    transparencyDateLabel: "Data do evento",
    transparencyActorLabel: "Ator/órgão",
    transparencyActorPlaceholder: "ex.: SESAB, OGE, CGAI, Ouvidoria, MP",
    transparencyEventLabel: "Evento processual",
    transparencyEventPlaceholder: "Descreva o que aconteceu sem transformar movimentação em evidência.",
    transparencyStatusLabel: "Status do evento",
    transparencyNextStepLabel: "Próximo passo",
    transparencyNextStepPlaceholder: "O que precisa ser checado, cobrado, aguardado ou escalado?",
    addTransparencyEvent: "Adicionar evento",
    transparencyEventAdded: "Evento adicionado ao diário e salvo neste navegador.",
    addActionTitle: "Adicionar ação editorial",
    actionLabel: "Ação",
    actionPlaceholder: "ex.: reenviar pedido, checar anexos, preparar recurso, buscar base alternativa",
    actionSourceLabel: "Fonte/protocolo relacionado",
    actionSourcePlaceholder: "ex.: VO-LAI-02, diário de transparência, resposta parcial",
    actionPriorityLabel: "Prioridade",
    actionStatusLabel: "Status da ação",
    actionOwnerPlaceholder: "ex.: repórter, QA, editoria, jurídico",
    actionTypePlaceholder: "ex.: LAI, checagem, análise de dados, entrevista, revisão",
    actionRationalePlaceholder: "Por que essa ação precisa existir?",
    actionOutputPlaceholder: "Qual saída concreta essa ação deve produzir?",
    addAction: "Adicionar ação",
    actionAdded: "Ação adicionada e salva neste navegador.",
    addGapTitle: "Adicionar lacuna",
    gapDescriptionLabel: "Descrição da lacuna",
    gapDescriptionPlaceholder: "ex.: O órgão informou envio, mas anexos não estão disponíveis",
    gapOriginLabel: "Origem da lacuna",
    gapOriginPlaceholder: "ex.: resposta parcial, base incompleta, pedido sem retorno",
    gapSeverityLabel: "Gravidade",
    gapStatusLabel: "Status da lacuna",
    gapNextStepLabel: "Próximo passo",
    gapNextStepPlaceholder: "O que precisa ser feito antes de usar esta informação?",
    addGap: "Adicionar lacuna",
    gapAdded: "Lacuna adicionada e salva neste navegador.",
    addClaimTitle: "Adicionar afirmação verificável",
    claimTextLabel: "Afirmação",
    claimTextPlaceholder: "Escreva uma afirmação que poderia entrar no texto, ainda sujeita a revisão.",
    claimTypeLabel: "Tipo de afirmação",
    claimEvidenceLabel: "Evidência vinculada",
    claimEvidencePlaceholder: "Qual dado, documento, resposta ou entrevista sustenta/limita a afirmação?",
    claimRelationLabel: "Relação com a evidência",
    claimStrengthLabel: "Força",
    claimRiskLabel: "Risco",
    claimStatusLabel: "Status editorial",
    addClaimButton: "Adicionar afirmação",
    claimAdded: "Afirmação adicionada e salva neste navegador.",
  },
  en: {
    all: "All",
    languageToggle: "Interface language",
    topbarNote: "Investigation workflow for public-interest reporting",
    goDashboard: "Go to dashboard",
    heroEyebrow: "MVP v0.1",
    heroTitle: "Turn investigative questions into evidence, gaps and publishable claims.",
    heroCopy:
      "This static prototype tests the core workflow before backend, login or AI: map evidence, track requests, compare responses and link claims to proof.",
    prototypeGoal: "Prototype goal",
    prototypeGoalText: "Validate whether the method helps journalists work with less chaos.",
    investigations: "Investigations",
    testCases: "Test cases",
    shown: "investigations shown",
    newInvestigation: "New investigation",
    status: "Status",
    country: "Country",
    language: "Language",
    topic: "Topic",
    reset: "Reset",
    openInvestigation: "Open investigation",
    requests: "requests",
    responses: "Responses",
    followUps: "follow-ups",
    qaBlockers: "QA blockers",
    emptyTitle: "No investigations match these filters.",
    emptyCopy: "Try another country, language, topic or status. This tests the empty state described in the MVP wireframe.",
    clearFilters: "Clear filters",
    buildRoadmap: "Build roadmap",
    roadmapTitle: "What this prototype tests before engineering gets expensive",
    fellowshipScope: "fellowship scope",
    validationQuestion: "Validation question",
    mvpCoverage: "MVP coverage",
    mvpCoverageTitle: "Checklist against the original document",
    mvpCoverageBadge: "PRD review",
    expectedInDoc: "Expected in the document",
    implementedInPrototype: "In the prototype",
    testingGuide: "Testing guide",
    testingTitle: "What QA and journalists should try first",
    testScript: "v0.1 test script",
    coreTasks: "Core tasks",
    feedbackQuestions: "Feedback questions",
    acceptanceCriteria: "Acceptance criteria",
    back: "Back to all investigations",
    overview: "Overview",
    jurisdiction: "Jurisdiction",
    languageTab: "Language",
    hypotheses: "Hypotheses",
    evidenceBlocks: "Evidence blocks",
    sources: "Sources",
    deadlines: "Deadlines",
    actionPlan: "Action plan",
    editorialQueue: "Editorial queue",
    transparencyLog: "Transparency log",
    requestComparison: "Request comparison",
    gaps: "Gaps",
    claims: "Claims",
    storyTab: "Story",
    qaChecklist: "QA checklist",
    methodology: "Methodology",
    evidenceBlocksMetric: "evidence blocks",
    lateRequests: "late requests",
    openGaps: "open gaps",
    claimsReview: "claims to review",
    reviewItems: "review items",
    actionItems: "action items",
    queueItems: "queue items",
    centralQuestion: "Central question",
    quickActions: "Quick actions",
    quickActionsCopy: "Shortcuts to test the core workflow described in the wireframe.",
    currentArea: "Current area",
    mobileNavHint: "Use the tabs above to switch steps.",
    desktopTestRail: "Desktop test",
    desktopTestRailHeading: "Use this rail to move through the flow without losing context.",
    tabProgress: "Step",
    nextArea: "Next area",
    openQaCheck: "Open QA",
    openMethodologyNote: "Open methodology",
    desktopHint:
      "Move from overview to methodology and check whether each decision points to evidence, request or gap.",
    storyBuilderTitle: "Story in progress",
    storyBuilderHeading: "From pitch to publishable story",
    storyBuilderCopy:
      "This area shows what the investigation can say now, what remains a hypothesis and what blocks publication.",
    workingThesis: "Working thesis",
    publishableAngle: "Publication path",
    editorQuestion: "Editorial question",
    storySectionRole: "Role in the story",
    storySectionEvidence: "Evidence used",
    storySectionBlocker: "What still blocks it",
    storyNoDraft:
      "The tool is still building an editorial reading of this story from hypotheses, requests, gaps and claims.",
    storyWorkspaceTitle: "Story desk",
    storyWorkspaceHeading: "Build the publication from what is already proved.",
    storyWorkspaceCopy:
      "Use this step to separate publishable text, necessary caveats and gaps that still block conclusions.",
    storyPackageTitle: "Publication package",
    storyPackageHeading: "What goes in, what goes in with caveat and what stays out for now.",
    storyOutlineTitle: "Narrative structure",
    storyOutlineHeading: "Turn reporting into reviewable story blocks.",
    publishableClaimsTitle: "Claims for the story",
    publishableClaimsHeading: "Decide how each claim should appear in the article.",
    storyClaimReady: "Can enter the story",
    storyClaimCaveat: "Use with caveat",
    storyClaimHold: "Hold for now",
    publicationBlockersTitle: "Publication blockers",
    publicationBlockersHeading: "Issues still preventing a safe final version.",
    noPublicationBlockers: "No critical publication blocker recorded.",
    methodologyBridgeTitle: "Close the method",
    methodologyBridgeCopy: "After deciding what enters the story, export the methodology note with limits, requests and evidence.",
    openStoryWorkspace: "Open story",
    openClaimsBoard: "Open claims",
    mobileFocusTitle: "Focus mode",
    mobileFocusHeading: "What to do now",
    mobileNextDecision: "Next decision",
    mobilePublicationBlocker: "Main blocker",
    mobileOpenStory: "View story",
    mobileContinueReporting: "Continue reporting",
    mobileReviewClaims: "Review claims",
    executiveSummary: "Executive summary",
    investigationCompass: "Investigation compass",
    investigationCompassHeading: "Four quick readings of the same story: proof, transparency, risk and publication.",
    compassEvidenceTitle: "Proof line",
    compassEvidenceCopy: "Hypotheses, sources and evidence blocks already mapped.",
    compassAccessTitle: "Transparency",
    compassAccessCopy: "Requests, responses, comparisons and follow-ups under control.",
    compassRiskTitle: "Editorial risk",
    compassRiskCopy: "Gaps, fragile claims and QA blockers before moving forward.",
    compassPublishTitle: "Publication",
    compassPublishCopy: "Strong claims, methodology and decisions ready for review.",
    compassOpen: "View area",
    investigationThread: "Investigation thread",
    threadQuestion: "Question",
    threadQuestionCopy: "What must be answered with evidence?",
    threadProof: "Proof",
    threadProofReady: "mapped items supporting the reporting.",
    threadGap: "Gap",
    threadGapReady: "No critical blocker recorded.",
    threadGapAlert: "points still need editorial care.",
    threadClaim: "Claim",
    threadClaimReady: "claims to review before publishing.",
    threadClaimPending: "No publishable claim mapped yet.",
    dataAuditTitle: "Case audit",
    dataAuditHeading: "Before editorial testing, check links, deadlines and structural risks.",
    dataAuditOk: "No structural blocker detected.",
    dataAuditReview: "Attention",
    dataAuditBlocked: "Blocker",
    dataAuditReady: "OK",
    auditDuplicateIds: "Loaded data has duplicate IDs.",
    auditNoRequests: "The investigation has no tracked requests yet.",
    auditRequestWithoutComparison: "request(s) still lack request-response comparison.",
    auditComparisonWithoutRequest: "comparison(s) do not match any registered request.",
    auditClaimWithoutEvidence: "claim(s) still lack linked evidence.",
    auditClaimWeak: "claim(s) have insufficient support or undefined relation.",
    auditHighRiskClaim: "high-risk claim(s) need review before publication.",
    auditOverdueRequests: "request(s) passed the deadline/checkpoint.",
    auditOpenQaBlockers: "open QA blocker(s) remain.",
    readinessTitle: "Investigation readiness",
    readinessHeading: "See what is already structured and what still needs a decision before testing.",
    readinessReady: "Ready",
    readinessReview: "Review",
    readinessAction: "Act",
    readinessBlocked: "Blocked",
    openStep: "Open step",
    summaryEvidence: "Mapped evidence",
    summaryRequests: "Tracked requests",
    summaryRisk: "Open risks",
    summaryNext: "Next decision",
    noImmediateAction: "No critical action right now",
    addHypothesis: "Add hypothesis",
    mapEvidence: "Map evidence",
    registerRequest: "Register request",
    reviewResponse: "Review response",
    openQueue: "Open queue",
    addClaim: "Add claim",
    exportMethodology: "Export methodology",
    exportJson: "Export JSON",
    exportedJson: "JSON exported",
    importJson: "Import JSON",
    resetLocalData: "Restore examples",
    localSaveNote: "Saved in this browser",
    importedJson: "JSON imported",
    importJsonError: "Could not import this JSON.",
    createInvestigation: "Create investigation",
    investigationCreated: "Investigation created and saved in this browser.",
    deadlinesNext: "Deadlines and next steps",
    deadlinesTitle: "Know when to wait, check, contest or escalate.",
    sent: "Sent",
    originalDue: "Original due",
    currentCheckpoint: "Current checkpoint",
    checkpointSource: "Checkpoint source",
    suggestedAction: "Suggested action",
    noDate: "No date set",
    priorityPrefix: "Priority",
    owner: "Owner",
    dueCheckpoint: "Due/checkpoint",
    type: "Type",
    whyItMatters: "Why it matters",
    output: "Output",
    actionPlanTitle: "Turn the reporting log into a controlled next-step queue.",
    actionPlanCopy: "Each action must stay tied to a source, protocol or documented procedural event.",
    editorialQueueTitle: "Editorial queue",
    editorialQueueHeading: "See what needs a human decision before publishing or automating.",
    editorialQueueCopy: "The queue combines checkpoints, reviews and priority actions without turning pending work into a conclusion.",
    queueDeadlines: "Active checkpoints",
    queueReviews: "Editorial reviews",
    queueActions: "Priority actions",
    queueEmpty: "No priority item recorded.",
    queueRule: "Queue rule",
    queueRuleCopy: "Each item must point to a protocol, source, deadline or gap before becoming a reporting task.",
    priority: "priority",
    requestLabel: "Request",
    protocol: "Protocol",
    due: "Due",
    requested: "Requested",
    response: "Response",
    responsesTitle: "Received responses",
    responsesHeading: "Review what arrived before turning a response into evidence.",
    responseStatus: "Response status",
    receivedMaterials: "Received material",
    identifiedGaps: "Identified gaps",
    reviewDecision: "Review decision",
    noReceivedMaterial: "No received or verifiable material yet.",
    noComparisonYet: "No detailed comparison recorded yet.",
    responseReviewRule: "Review rule",
    responseReviewRuleCopy: "A response becomes evidence only after opening files, checking attachments, reviewing fields and recording limits.",
    ifNothingArrives: "If nothing arrives",
    requestsEyebrow: "Requests",
    requestsTitle: "Track requests made outside the platform.",
    requestsCommandCenter: "Request dashboard",
    requestsCommandCopy: "Summary of what was requested, received, compared and needs follow-up.",
    totalRequests: "Registered requests",
    reviewedResponses: "Reviewed responses",
    nextFollowUp: "Next follow-up",
    noFollowUpNeeded: "No priority follow-up",
    attentionNeeded: "Needs attention now",
    methodSafeguards: "Method safeguards",
    methodSafeguardsTitle: "Rules that keep the tool from overstating evidence.",
    processGuide: "Process guide",
    processGuideTitle: "Jurisdiction-aware workflow, still controlled by the reporter.",
    laiAssistantTitle: "Access-request assistant",
    laiAssistantHeading: "The tool reads request and response as an operational flow.",
    laiAssistantCopy:
      "Log what was requested, what arrived and what is missing. The tool organizes completeness, diary, next steps, deadlines, channels and caveats for the reporter to act outside the platform when needed.",
    laiComplete: "Usable response",
    laiPartial: "Partial response",
    laiBlocked: "Do not use yet",
    laiNextAction: "Suggested next action",
    laiCompleteness: "Completeness",
    transparencyLogTitle: "Story transparency history",
    transparencyLogHeading: "The diary comes from request-response analysis, not as a separate editorial tab.",
    transparencyLogCopy: "Use this history to separate request, forwarding, partial response, appeal and actual document delivery.",
    noTransparencyTitle: "No transparency log yet.",
    noTransparencyCopy: "Add procedural events as requests move through appeals or review.",
    nextStep: "Next step",
    requestComparisonTitle: "Request comparison",
    requestComparisonHeading: "Compare what was asked, what arrived and what still needs action.",
    expected: "Expected",
    received: "Received",
    missingUnclear: "Missing or unclear",
    editorialDecision: "Editorial decision",
    followUpDraftsTitle: "Follow-up drafts",
    followUpDraftsHeading: "Prepare messages and appeals without sending anything automatically.",
    followUpDraftsCopy: "Every draft is a starting point for human review, not legal advice or a finished filing.",
    relatedRequest: "Related request",
    reporterCheck: "Reporter check",
    gapsTitle: "Gaps and next steps",
    gapsHeading: "Turn missing evidence into follow-up actions.",
    origin: "Origin",
    claimMatrixTitle: "Claim-to-evidence matrix",
    claimMatrixHeading: "Check whether publishable claims are supported.",
    claimDashboardTitle: "Claims dashboard",
    claimDashboardCopy: "Quickly see what can move forward, what needs caution and what still depends on evidence.",
    totalClaims: "Mapped claims",
    claimsWithSupport: "Strongly supported",
    claimsNeedingCare: "Need caution",
    highRiskClaims: "High risk",
    noHighRiskClaims: "No high-risk claim",
    reportingMapTitle: "Reporting map",
    reportingMapHeading: "Connect hypothesis, required evidence and likely source path.",
    reportingMapCopy: "Use this map to see whether a hypothesis already has proof, source and limit before becoming a claim.",
    evidencePath: "Evidence path",
    sourcePath: "Source path",
    evidenceInventoryTitle: "Evidence inventory",
    evidenceInventoryHeading: "See all mapped blocks, including those not yet shown in the map.",
    evidenceCoverage: "Coverage",
    caseTestTitle: "Editorial pre-test",
    caseTestHeading: "Quick script to test this investigation before editing real data.",
    caseTestReady: "Ready to test",
    caseTestReview: "Review before testing",
    fullFlowTestTitle: "Full-flow test script",
    fullFlowTestHeading: "Run a guided round from opening status to methodology note.",
    testStepOpen: "Open case status",
    testStepPlan: "Trace one hypothesis",
    testStepRequests: "Classify one request",
    testStepClaims: "Decide one claim",
    testStepMethod: "Check export",
    testExpected: "What to observe",
    testStepOpenExpected: "The tester understands status, risk and next step without external explanation.",
    testStepPlanExpected: "The tester can follow hypothesis, evidence and likely source.",
    testStepRequestsExpected: "The tester identifies request status and safe next action.",
    testStepClaimsExpected: "The tester distinguishes advance, caveat or hold for a claim.",
    testStepMethodExpected: "The tester finds limits, QA and an exportable note.",
    testContextCheck: "Context and jurisdiction are readable.",
    testPlanCheck: "Hypotheses, evidence and sources appear as a reporting path.",
    testRequestCheck: "Requests have status, deadline/checkpoint and next action.",
    testClaimCheck: "Claims have editorial decision and linked evidence.",
    testMethodCheck: "Exportable methodology and QA are available.",
    requestBoardTitle: "Request board",
    requestBoardHeading: "See the process by situation, not only as a list.",
    requestStageWaiting: "Waiting",
    requestStageProblem: "Attention",
    requestStageReceived: "Material received",
    requestStageSeparate: "Separate track",
    requestStageNext: "Next action",
    noRequestsInStage: "No request in this column.",
    claimDecisionTitle: "Editorial decision",
    claimDecisionHeading: "Read each claim as a decision: advance, limit or hold.",
    decisionAdvance: "Can advance",
    decisionLimit: "Use with caveat",
    decisionHold: "Hold",
    decisionEvidence: "Basis",
    decisionWhy: "Why",
    claim: "Claim",
    evidence: "Evidence",
    evidenceRelation: "Relation",
    strength: "Strength",
    risk: "Risk",
    qaModelTitle: "QA model v0.2",
    qaModelHeading: "Glossary, closed status lists and contradictory evidence.",
    qaModelCopy: "QA-review update: the prototype now records whether evidence supports, contradicts or limits a claim.",
    glossaryTerms: "Operational glossary",
    statusRegistry: "Closed status list",
    evidenceRelations: "Evidence relations",
    strengthScale: "Strength scale",
    riskScale: "Risk scale",
    publishRule: "Publishing rule",
    requiredAction: "Required action",
    dataModel: "Data model",
    relationship: "Relationship",
    accessibilityChecks: "Accessibility",
    functionalCoverage: "Functional coverage",
    qaExpectation: "QA criterion",
    prototypeCoverage: "Prototype coverage",
    methodologyNote: "Methodological note",
    methodologyHeading: "Export a transparent summary of evidence, requests and limits.",
    qaChecklistHeading: "Review risk before treating evidence as publishable.",
    qaNoBlockers: "No blocking QA issues recorded.",
    qaBlockerSingular: "blocker needs attention before demo or publication.",
    qaBlockerPlural: "blockers need attention before demo or publication.",
    riskSuffix: "risk",
    action: "Action",
    editorialSafeguards: "Editorial safeguards",
    editorialSafeguardsHeading: "Do not let access problems become unsupported claims.",
    noActionTitle: "No action plan yet.",
    noActionCopy: "Add reporter-reviewed tasks after each request, appeal or response review.",
    separateTrackAction: "Keep this flow in a separate log and update it only when its own channel returns a response.",
    checkpointPassed: "Checkpoint passed.",
    partialAction: "Compare requested fields with delivered records, then send a focused follow-up for missing items.",
    brokenAction: "Document the access problem with screenshots and request a valid link or file resend.",
    overdueAction: "Prepare an escalation note with protocol, dates, request text and proof of non-response.",
    nearDeadlineAction: "Prepare the response checklist now so the received material can be reviewed quickly.",
    waitAction: "Wait, keep the protocol organized and confirm the next review date in the reporting log.",
    jurisdictionAccess: "Jurisdiction and access rules",
    jurisdictionHeading: "Make deadlines and source paths explicit before using AI assistance.",
    jurisdictionCopy: "The tool should guide the reporter through known rules, not invent them.",
    deadline: "Deadline",
    requestChannels: "Request channels",
    escalation: "Escalation",
    reporterWarning: "Reporter warning",
    productRule: "Product rule",
    productRuleCopy:
      "Evidence Desk can suggest next steps only after the reporter selects a jurisdiction, confirms the request channel and reviews the relevant access-law rule.",
    sourceDiscovery: "Source discovery",
    sourceDiscoveryHeading: "Start from controlled paths, then let the reporter verify.",
    verify: "Verify",
    languageLocalization: "Language and localization",
    languageHeading: "Separate translation from legal and editorial localization.",
    languageCopy: "A global tool needs multilingual access, but access-law guidance still depends on jurisdiction.",
    languagePlan: "Language plan",
    workingLanguage: "Working language",
    interfaceOptions: "Interface options",
    publicationLanguages: "Publication languages",
    localizationRule: "Localization rule",
    localizationRuleCopy:
      "Translate interface labels freely, but localize laws, deadlines, agencies and source types only when the jurisdiction is known and reviewed by the reporter.",
    translationNotes: "Translation notes",
    translationNotesHeading: "Terms that need human review.",
    notes: "Notes",
    glossary: "Glossary",
    secondaryQuestions: "Secondary questions",
    block: "Block",
    priorityLabel: "Priority",
    sourcesTitle: "Sources and databases",
    sourcesHeading: "Separate verified sources from likely paths.",
    limits: "Limits",
    copyMarkdown: "Copy Markdown",
    copied: "Copied",
    projectScope: "Project scope",
    topicLabel: "Topic",
    territory: "Territory",
    period: "Period",
    updated: "Updated",
    editorialSafetyRule: "Editorial safety rule",
    editorialSafetyCopy:
      "Gaps are not conclusions. They are unresolved evidence problems that need follow-up, a methodological limit, or a rewritten claim.",
    freshnessCheck: "Freshness check",
    reviewRecommended: "Review recommended",
    reviewLog: "Review the investigation log before relying on this case.",
    separateTrack: "Separate track",
    partialResponse: "Partial response received",
    responseReceived: "Response received",
    daysToCheckpoint: "days to checkpoint",
    dayToCheckpoint: "day to checkpoint",
    daysLeft: "days left",
    dayLeft: "day left",
    daysPastCheckpoint: "days past checkpoint",
    dayPastCheckpoint: "day past checkpoint",
    daysOverdue: "days overdue",
    dayOverdue: "day overdue",
    prototypeLimits: "Prototype limits",
    prototypeLimitsTitle: "What is testable now and what should not be promised yet",
    currentBehavior: "Current behavior",
    nextProductStep: "Next product step",
    createTitle: "Start with a question the evidence can actually answer.",
    createCopy:
      "This simulated form tests the MVP onboarding flow. It validates required fields, shows the project structure and keeps saving disabled until a backend exists.",
    cancel: "Cancel",
    reviewBeforeContinue: "Review before continuing",
    investigationTitle: "Investigation title",
    investigationTitlePlaceholder: "e.g. Obstetric violence and public data transparency",
    countryPlaceholder: "e.g. Brazil, United States, México",
    jurisdictionLocality: "Jurisdiction/locality",
    jurisdictionPlaceholder: "e.g. Bahia, Cook County, México City",
    primaryLanguage: "Primary language",
    primaryLanguagePlaceholder: "e.g. Portuguese, English, Spanish",
    generalTopic: "General topic",
    topicPlaceholder: "e.g. Public health, education, environment",
    investigatedTerritory: "Investigated territory",
    territoryPlaceholder: "e.g. Salvador and Bahia interior",
    investigatedPeriod: "Investigated period",
    periodPlaceholder: "e.g. 2020-2026",
    centralInvestigativeQuestion: "Central investigative question",
    centralQuestionPlaceholder: "What question should this investigation answer with evidence?",
    centralQuestionHelp: "Required. Prefer a question that can be answered with documents, data, interviews or official responses.",
    shortDescription: "Short description",
    descriptionPlaceholder: "What is the story trying to understand?",
    validateStructure: "Validate project structure",
    saveDraftAfterBackend: "Save draft after backend",
    workspacePreview: "Generated workspace preview",
    untitledInvestigation: "Untitled investigation",
    countryJurisdiction: "Country/jurisdiction",
    starterStructure: "Starter structure",
    sourcesDatabases: "Sources/databases",
    notSet: "Not set",
    draftReady: "Structure looks ready for the next MVP step: mapping hypotheses and evidence blocks.",
    errorTitleRequired: "Add an investigation title.",
    errorCountryRequired: "Add a country.",
    errorLanguageRequired: "Add the primary language.",
    errorQuestionRequired: "Add a central investigative question.",
    errorTitleSpecific: "Make the title more specific so QA can understand the case.",
    errorQuestionMark: "Phrase the central question as a question.",
    context: "Context",
    planTab: "Reporting plan",
    requestsWorkspace: "FOIA/LAI and responses",
    editorialWorkspace: "Queue and gaps",
    startHere: "Start here",
    startHereTitle: "Recommended workflow",
    startHereBadge: "4 steps",
    workflowContextTitle: "Confirm context and jurisdiction",
    workflowContextCopy: "Review language, territory, access rules and limits before trusting deadlines or sources.",
    workflowPlanTitle: "Map questions, hypotheses and evidence",
    workflowPlanCopy: "Turn the story into verifiable evidence blocks and source paths, without letting AI choose alone.",
    workflowRequestsTitle: "Track requests and responses",
    workflowRequestsCopy: "Log deadlines, received material, missing attachments and next steps.",
    workflowClaimsTitle: "Review publishable claims",
    workflowClaimsCopy: "Move forward only when each claim has evidence, relation, strength, risk and caveat.",
    navGroupStart: "Start",
    navGroupInvestigate: "Report",
    navGroupDecide: "Decide",
    navGroupExport: "Publish",
    tabGuideTitle: "How to use this area",
    tabGuideOverview: "Use the overview to understand the story status and choose where to enter first.",
    tabGuideContext: "Confirm territory, language and access rules before trusting deadlines, datasets or sources.",
    tabGuidePlan: "Turn the question into hypotheses, evidence blocks and verifiable source paths.",
    tabGuideRequests: "Log requests made outside the platform, compare responses and track next steps.",
    tabGuideEditorial: "Turn gaps, deadlines and risks into controlled human actions.",
    tabGuideClaims: "Move claims forward only when relation, strength, risk and evidence are explicit.",
    tabGuideStory: "Build the story with working thesis, narrative blocks, usable claims and final blockers.",
    tabGuideQa: "Use the checklist to catch blockers before demo, publication or automation.",
    tabGuideMethodology: "Export a transparent note about evidence, limits, requests and decisions.",
    addToPlan: "Add to plan",
    addHypothesisTitle: "Add working hypothesis",
    hypothesisTextLabel: "Hypothesis",
    hypothesisTextPlaceholder: "e.g. Transparency failures prevent comparing facilities",
    hypothesisEvidenceLabel: "Required evidence",
    hypothesisEvidencePlaceholder: "e.g. Data by facility, protocol and official response",
    hypothesisStatusLabel: "Hypothesis status",
    addEvidenceBlockTitle: "Add evidence block",
    evidenceTypeLabel: "Evidence type",
    evidenceTypePlaceholder: "e.g. historical series by facility",
    evidencePriorityLabel: "Priority",
    evidenceStatusLabel: "Block status",
    addSourceTitle: "Add source or database",
    sourceNameLabel: "Source/database name",
    sourceNamePlaceholder: "e.g. data portal, ministry, court, city hall",
    sourceTypeLabel: "Type",
    sourceStatusLabel: "Source status",
    sourceUseLabel: "Use in the investigation",
    sourceUsePlaceholder: "Which question can this source help answer?",
    sourceLimitsLabel: "Known limits",
    sourceLimitsPlaceholder: "What does this source not solve or still require checking?",
    itemAdded: "Item added and saved in this browser.",
    fillRequiredPlanFields: "Fill the main fields before adding.",
    addRequestTitle: "Register external request",
    requestTitleLabel: "Request title",
    requestTitlePlaceholder: "e.g. Maternal deaths by facility",
    agencyLabel: "Agency or institution",
    agencyPlaceholder: "e.g. health department, city hall, ministry",
    channelLabel: "Channel",
    channelPlaceholder: "e.g. FOIA portal, email, public records form",
    protocolPlaceholder: "e.g. protocol, public ID or internal tracking code",
    sentDateLabel: "Sent date",
    dueDateLabel: "Expected deadline",
    requestStatusLabel: "Request status",
    requestedItemsLabel: "Requested items",
    requestedItemsPlaceholder: "List the fields, documents or datasets requested.",
    responseSummaryLabel: "Response summary",
    responseSummaryPlaceholder: "Log no response, partial delivery or what was received.",
    addRequest: "Add request",
    requestAdded: "Request added and saved in this browser.",
    addComparisonTitle: "Compare request and response",
    comparisonRequestLabel: "Compared request",
    comparisonRequestPlaceholder: "Type the request title or match an already registered title.",
    deadlineStatusLabel: "Deadline/response status",
    expectedLabel: "What was requested",
    expectedPlaceholder: "List the fields, documents, cuts or attachments that should have arrived.",
    receivedLabel: "What was received",
    receivedPlaceholder: "Record exactly what arrived, including links, attachments, files or no delivery.",
    missingLabel: "Missing or unclear",
    missingPlaceholder: "What is still missing, incomplete or not comparable?",
    editorialDecisionLabel: "Editorial decision",
    editorialDecisionPlaceholder: "e.g. use with caveat, do not use, appeal, file new request",
    comparisonNextStepPlaceholder: "What action comes next?",
    addComparison: "Save comparison",
    comparisonAdded: "Comparison added and saved in this browser.",
    addFollowUpTitle: "Create follow-up draft",
    followUpTitleLabel: "Draft title",
    followUpTitlePlaceholder: "e.g. Request attachment resend",
    followUpTypeLabel: "Follow-up type",
    followUpTypePlaceholder: "e.g. appeal, narrowed request, correction, check",
    followUpRequestLabel: "Related request",
    followUpRequestPlaceholder: "Use the title or protocol of the related request.",
    followUpStatusLabel: "Draft status",
    riskNoteLabel: "Required check",
    riskNotePlaceholder: "What must the reporter review before sending?",
    draftTextLabel: "Draft text",
    draftTextPlaceholder: "Write the base follow-up text for human review.",
    addFollowUp: "Save draft",
    followUpAdded: "Draft added and saved in this browser.",
    addTransparencyEventTitle: "Add log event",
    transparencyDateLabel: "Event date",
    transparencyActorLabel: "Actor/agency",
    transparencyActorPlaceholder: "e.g. agency, appeal office, ombuds office, records officer",
    transparencyEventLabel: "Procedural event",
    transparencyEventPlaceholder: "Describe what happened without turning movement into evidence.",
    transparencyStatusLabel: "Event status",
    transparencyNextStepLabel: "Next step",
    transparencyNextStepPlaceholder: "What needs to be checked, requested, waited for or escalated?",
    addTransparencyEvent: "Add event",
    transparencyEventAdded: "Event added to the log and saved in this browser.",
    addActionTitle: "Add editorial action",
    actionLabel: "Action",
    actionPlaceholder: "e.g. resend request, check attachments, prepare appeal, find alternate dataset",
    actionSourceLabel: "Related source/protocol",
    actionSourcePlaceholder: "e.g. request ID, transparency log, partial response",
    actionPriorityLabel: "Priority",
    actionStatusLabel: "Action status",
    actionOwnerPlaceholder: "e.g. reporter, QA, editor, legal",
    actionTypePlaceholder: "e.g. FOIA, verification, data analysis, interview, review",
    actionRationalePlaceholder: "Why does this action need to exist?",
    actionOutputPlaceholder: "What concrete output should this action produce?",
    addAction: "Add action",
    actionAdded: "Action added and saved in this browser.",
    addGapTitle: "Add gap",
    gapDescriptionLabel: "Gap description",
    gapDescriptionPlaceholder: "e.g. Agency says files were sent, but attachments are not available",
    gapOriginLabel: "Gap origin",
    gapOriginPlaceholder: "e.g. partial response, incomplete dataset, no reply",
    gapSeverityLabel: "Severity",
    gapStatusLabel: "Gap status",
    gapNextStepLabel: "Next step",
    gapNextStepPlaceholder: "What must happen before this information can be used?",
    addGap: "Add gap",
    gapAdded: "Gap added and saved in this browser.",
    addClaimTitle: "Add verifiable claim",
    claimTextLabel: "Claim",
    claimTextPlaceholder: "Write a claim that could appear in the story, still subject to review.",
    claimTypeLabel: "Claim type",
    claimEvidenceLabel: "Linked evidence",
    claimEvidencePlaceholder: "Which data, document, response or interview supports/limits the claim?",
    claimRelationLabel: "Evidence relation",
    claimStrengthLabel: "Strength",
    claimRiskLabel: "Risk",
    claimStatusLabel: "Editorial status",
    addClaimButton: "Add claim",
    claimAdded: "Claim added and saved in this browser.",
  },
};

dictionary.es = {
  ...dictionary.pt,
  all: "Todos",
  languageToggle: "Idioma de la interfaz",
  topbarNote: "Flujo de investigacion para periodismo de interes público",
  goDashboard: "Volver al panel",
  heroTitle: "Convierte preguntas investigativas en evidências, vacios y afirmaciones públicables.",
  heroCopy:
    "Este protótipo estático prueba el flujo central antes de backend, login o IA: mapear evidências, seguir solicitudes, comparar respuestas y vincular afirmaciones a pruebas.",
  prototypeGoal: "Objetivo del protótipo",
  prototypeGoalText: "Validar si el metodo ayuda a periodistas a trabajar con menos caos.",
  investigations: "Investigaciones",
  testCases: "Casos de prueba",
  shown: "investigaciones mostradas",
  newInvestigation: "Nueva investigacion",
  country: "País",
  language: "Idioma",
  topic: "Tema",
  reset: "Limpiar",
  openInvestigation: "Abrir investigacion",
  requests: "Solicitudes",
  responses: "Respuestas",
  followUps: "Seguimientos",
  qaBlockers: "bloqueos de QA",
  emptyTitle: "Ninguna investigacion coincide con los filtros.",
  emptyCopy: "Prueba otro país, idioma, tema o estado. Esto prueba el estado vacio previsto en el MVP.",
  clearFilters: "Limpiar filtros",
  buildRoadmap: "Roadmap del producto",
  roadmapTitle: "Que prueba este protótipo antes de que la ingenieria sea cara",
  fellowshipScope: "alcance fellowship",
  validationQuestion: "Pregunta de validacion",
  mvpCoverage: "Cobertura del MVP",
  mvpCoverageTitle: "Checklist contra el documento original",
  mvpCoverageBadge: "revision PRD",
  expectedInDoc: "Previsto en el documento",
  implementedInPrototype: "En el protótipo",
  testingGuide: "Guia de prueba",
  testingTitle: "Que deben probar primero QA y periodistas",
  testScript: "guion v0.1",
  coreTasks: "Tareas centrales",
  feedbackQuestions: "Preguntas de feedback",
  acceptanceCriteria: "Critérios de aceptacion",
  back: "Volver a investigaciones",
  overview: "Vista general",
  jurisdiction: "Jurisdiccion",
  hypotheses: "Hipotesis",
  evidenceBlocks: "Bloques de evidência",
  sources: "Fuentes",
  deadlines: "Plazos",
  actionPlan: "Plan de accion",
  editorialQueue: "Fila editorial",
  transparencyLog: "Diário de transparência",
  requestComparison: "Comparacion de solicitudes",
  gaps: "Vacios",
  claims: "Afirmaciones",
  storyTab: "Historia",
  methodology: "Metodologia",
  evidenceBlocksMetric: "bloques de evidência",
  lateRequests: "solicitudes atrasadas",
  openGaps: "vacios abiertos",
  claimsReview: "afirmaciones a revisar",
  reviewItems: "items de revision",
  actionItems: "acciones",
  queueItems: "items en la fila",
  centralQuestion: "Pregunta central",
  quickActions: "Acciones rapidas",
  quickActionsCopy: "Atajos para probar el flujo central previsto en el wireframe.",
  currentArea: "Área actual",
  mobileNavHint: "Use las pestañas arriba para cambiar de etapa.",
  desktopTestRail: "Prueba en desktop",
  desktopTestRailHeading: "Use esta barra para navegar el flujo sin perder contexto.",
  tabProgress: "Etapa",
  nextArea: "Próxima área",
  openQaCheck: "Abrir QA",
  openMethodologyNote: "Abrir metodología",
  desktopHint:
    "Recorra desde la vista general hasta la metodología y observe si cada decisión apunta a evidencia, solicitud o vacío.",
  storyBuilderTitle: "Historia en construcción",
  storyBuilderHeading: "De la pauta al texto publicable",
  storyBuilderCopy:
    "Esta área muestra qué puede decir la investigación ahora, qué sigue como hipótesis y qué bloquea la publicación.",
  workingThesis: "Tesis provisional",
  publishableAngle: "Camino de publicación",
  editorQuestion: "Pregunta editorial",
  storySectionRole: "Papel en la historia",
  storySectionEvidence: "Base usada",
  storySectionBlocker: "Qué todavía bloquea",
  storyNoDraft:
    "La herramienta todavía está montando una lectura editorial de esta pauta a partir de hipótesis, solicitudes, vacíos y afirmaciones.",
  storyWorkspaceTitle: "Mesa de la historia",
  storyWorkspaceHeading: "Monte la publicación desde lo que ya está probado.",
  storyWorkspaceCopy:
    "Use esta etapa para separar texto publicable, salvedades necesarias y vacíos que todavía bloquean conclusiones.",
  storyPackageTitle: "Paquete de publicación",
  storyPackageHeading: "Qué entra, qué entra con salvedad y qué queda afuera por ahora.",
  storyOutlineTitle: "Estructura narrativa",
  storyOutlineHeading: "Convierta la reportería en bloques de texto revisables.",
  publishableClaimsTitle: "Afirmaciones para el texto",
  publishableClaimsHeading: "Decida cómo debe aparecer cada afirmación en la nota.",
  storyClaimReady: "Puede entrar en el texto",
  storyClaimCaveat: "Usar con salvedad",
  storyClaimHold: "Retener por ahora",
  publicationBlockersTitle: "Trabas de publicación",
  publicationBlockersHeading: "Puntos que todavía impiden una versión final segura.",
  noPublicationBlockers: "No hay traba crítica registrada para la publicación.",
  methodologyBridgeTitle: "Cerrar método",
  methodologyBridgeCopy: "Después de decidir qué entra en el texto, exporte la nota metodológica con límites, solicitudes y evidencias.",
  openStoryWorkspace: "Abrir historia",
  openClaimsBoard: "Abrir afirmaciones",
  mobileFocusTitle: "Modo foco",
  mobileFocusHeading: "Qué hacer ahora",
  mobileNextDecision: "Próxima decisión",
  mobilePublicationBlocker: "Traba principal",
  mobileOpenStory: "Ver historia",
  mobileContinueReporting: "Continuar reporteo",
  mobileReviewClaims: "Revisar afirmaciones",
  executiveSummary: "Resumen ejecutivo",
  investigationCompass: "Brújula de la investigación",
  investigationCompassHeading: "Cuatro lecturas rápidas del mismo caso: prueba, transparencia, riesgo y publicación.",
  compassEvidenceTitle: "Línea de prueba",
  compassEvidenceCopy: "Hipótesis, fuentes y bloques de evidencia ya mapeados.",
  compassAccessTitle: "Transparencia",
  compassAccessCopy: "Solicitudes, respuestas, comparaciones y follow-ups bajo control.",
  compassRiskTitle: "Riesgo editorial",
  compassRiskCopy: "Vacíos, afirmaciones frágiles y bloqueos de QA antes de avanzar.",
  compassPublishTitle: "Publicación",
  compassPublishCopy: "Afirmaciones fuertes, metodología y decisiones listas para revisión.",
  compassOpen: "Ver área",
  investigationThread: "Hilo de la investigación",
  threadQuestion: "Pregunta",
  threadQuestionCopy: "¿Qué debe responderse con evidencia?",
  threadProof: "Prueba",
  threadProofReady: "ítems mapeados para sostener la reportería.",
  threadGap: "Vacío",
  threadGapReady: "Sin bloqueo crítico registrado.",
  threadGapAlert: "puntos aún piden cuidado editorial.",
  threadClaim: "Afirmación",
  threadClaimReady: "afirmaciones para revisar antes de publicar.",
  threadClaimPending: "Aún no hay afirmación publicable mapeada.",
  dataAuditTitle: "Auditoría del caso",
  dataAuditHeading: "Antes de la prueba editorial, revise vínculos, plazos y riesgos estructurales.",
  dataAuditOk: "Sin bloqueo estructural detectado.",
  dataAuditReview: "Atención",
  dataAuditBlocked: "Bloqueo",
  dataAuditReady: "OK",
  auditDuplicateIds: "Hay IDs duplicados en los datos cargados.",
  auditNoRequests: "La investigación todavía no tiene solicitudes registradas.",
  auditRequestWithoutComparison: "solicitud(es) todavía no tienen comparación solicitud-respuesta.",
  auditComparisonWithoutRequest: "comparación(es) no coinciden con ninguna solicitud registrada.",
  auditClaimWithoutEvidence: "afirmación(es) todavía no apuntan a evidencia.",
  auditClaimWeak: "afirmación(es) tienen soporte insuficiente o relación indefinida.",
  auditHighRiskClaim: "afirmación(es) de alto riesgo exigen revisión antes de publicación.",
  auditOverdueRequests: "solicitud(es) pasaron del plazo/checkpoint.",
  auditOpenQaBlockers: "bloqueo(s) de QA siguen abiertos.",
  readinessTitle: "Preparación de la investigación",
  readinessHeading: "Vea qué ya está estructurado y qué todavía necesita decisión antes de las pruebas.",
  readinessReady: "Listo",
  readinessReview: "Revisar",
  readinessAction: "Actuar",
  readinessBlocked: "Bloqueado",
  openStep: "Abrir etapa",
  summaryEvidence: "Evidencias mapeadas",
  summaryRequests: "Solicitudes monitoreadas",
  summaryRisk: "Riesgos abiertos",
  summaryNext: "Próxima decisión",
  noImmediateAction: "Ninguna acción crítica por ahora",
  addHypothesis: "Agregar hipotesis",
  mapEvidence: "Mapear evidência",
  registerRequest: "Registrar solicitud",
  reviewResponse: "Revisar respuesta",
  openQueue: "Abrir fila",
  addClaim: "Agregar afirmacion",
  exportMethodology: "Exportar metodologia",
  exportJson: "Exportar JSON",
  exportedJson: "JSON exportado",
  importJson: "Importar JSON",
  resetLocalData: "Restaurar ejemplos",
  localSaveNote: "Guardado en este navegador",
  importedJson: "JSON importado",
  importJsonError: "No fue posible importar este JSON.",
  createInvestigation: "Crear investigación",
  investigationCreated: "Investigación creada y guardada en este navegador.",
  deadlinesNext: "Plazos y próximos pasos",
  deadlinesTitle: "Sepa cuando esperar, revisar, contestar o escalar.",
  sent: "Enviado",
  originalDue: "Plazo original",
  currentCheckpoint: "Checkpoint actual",
  checkpointSource: "Fuente del checkpoint",
  suggestedAction: "Accion sugerida",
  owner: "Responsable",
  dueCheckpoint: "Plazo/checkpoint",
  whyItMatters: "Por que importa",
  output: "Salida esperada",
  actionPlanTitle: "Convierte el registro de investigacion en una fila controlada de próximos pasos.",
  actionPlanCopy: "Cada accion debe estar ligada a una fuente, protocolo o evento procedimental documentado.",
  editorialQueueTitle: "Fila editorial",
  editorialQueueHeading: "Vea que necesita decision humana antes de públicar o automatizar.",
  editorialQueueCopy: "La fila combina checkpoints, revisiones y acciones prioritarias sin transformar pendientes en conclusion.",
  queueDeadlines: "Checkpoints activos",
  queueReviews: "Revisiones editoriales",
  queueActions: "Acciones prioritarias",
  queueEmpty: "Ningun item prioritário registrado.",
  queueRule: "Regla de la fila",
  queueRuleCopy: "Cada item debe apuntar a protocolo, fuente, plazo o vacio antes de convertirse en tarea de investigacion.",
  priority: "prioridad",
  requestLabel: "Solicitud",
  due: "Plazo",
  requested: "Solicitado",
  response: "Respuesta",
  responsesTitle: "Respuestas recibidas",
  responsesHeading: "Revise lo que llego antes de convertir una respuesta en evidência.",
  responseStatus: "Estado de la respuesta",
  receivedMaterials: "Material recibido",
  identifiedGaps: "Vacios identificados",
  reviewDecision: "Decision de revision",
  noReceivedMaterial: "Ningun material recibido o verificable todavia.",
  noComparisonYet: "Comparacion detallada aun no registrada.",
  responseReviewRule: "Regla de revision",
  responseReviewRuleCopy: "Una respuesta solo se convierte en evidência despues de abrir archivos, revisar anexos, checar campos y registrar limites.",
  ifNothingArrives: "Si no llega nada",
  requestsEyebrow: "Solicitudes",
  requestsTitle: "Siga solicitudes hechas fuera de la plataforma.",
  requestsCommandCenter: "Panel de solicitudes",
  requestsCommandCopy: "Resumen de lo que fue solicitado, recibido, comparado y necesita seguimiento.",
  totalRequests: "Solicitudes registradas",
  reviewedResponses: "Respuestas revisadas",
  nextFollowUp: "Próximo seguimiento",
  noFollowUpNeeded: "Ningún seguimiento prioritario",
  attentionNeeded: "Atención ahora",
  methodSafeguards: "Salvaguardas metodológicas",
  methodSafeguardsTitle: "Reglas que evitan que la herramienta exagere evidências.",
  processGuideTitle: "Flujo atento a la jurisdiccion, todavia controlado por la repórtera.",
  laiAssistantTitle: "Asistente LAI",
  laiAssistantHeading: "La herramienta lee solicitud y respuesta como flujo operacional.",
  laiAssistantCopy:
    "Registre lo solicitado, lo recibido y lo faltante. La herramienta organiza completitud, diario, próximos pasos, plazos, canales y salvedades para que la reportera actúe fuera de la plataforma cuando sea necesario.",
  laiComplete: "Respuesta utilizable",
  laiPartial: "Respuesta parcial",
  laiBlocked: "No usar todavía",
  laiNextAction: "Próxima acción sugerida",
  laiCompleteness: "Completitud",
  transparencyLogTitle: "Historial de transparencia del reportaje",
  transparencyLogHeading: "El diario nace del análisis solicitud-respuesta, no como pestaña editorial separada.",
  transparencyLogCopy: "Use este historial para separar solicitud, encaminamiento, respuesta parcial, recurso y entrega real de documentos.",
  nextStep: "Próximo paso",
  requestComparisonTitle: "Comparacion de solicitudes",
  requestComparisonHeading: "Compare lo que se pidio, lo que llego y lo que aun exige accion.",
  expected: "Esperado",
  received: "Recibido",
  missingUnclear: "Ausente o poco claro",
  editorialDecision: "Decision editorial",
  followUpDraftsTitle: "Borradores de seguimiento",
  followUpDraftsHeading: "Prepare mensajes y recursos sin enviar nada automaticamente.",
  followUpDraftsCopy: "Cada borrador es un punto de partida para revision humana, no orientacion legal ni peticion lista.",
  relatedRequest: "Solicitud relacionada",
  reporterCheck: "Chequeo de la repórtera",
  gapsTitle: "Vacios y próximos pasos",
  gapsHeading: "Convierte evidências ausentes en acciones de seguimiento.",
  claimMatrixTitle: "Matriz afirmacion-evidência",
  claimMatrixHeading: "Verifique si las afirmaciones públicables estan sustentadas.",
  claimDashboardTitle: "Panel de afirmaciones",
  claimDashboardCopy: "Vea rápidamente qué puede avanzar, qué exige cautela y qué aún depende de evidencia.",
  totalClaims: "Afirmaciones mapeadas",
  claimsWithSupport: "Con sustento fuerte",
  claimsNeedingCare: "Exigen cautela",
  highRiskClaims: "Alto riesgo",
  noHighRiskClaims: "Ninguna afirmación de alto riesgo",
  reportingMapTitle: "Mapa de reportería",
  reportingMapHeading: "Conecte hipótesis, evidencia necesaria y camino probable de fuente.",
  reportingMapCopy: "Use este mapa para ver si una hipótesis ya tiene prueba, fuente y límite antes de virar afirmación.",
  evidencePath: "Camino de evidencia",
  sourcePath: "Camino de fuente",
  evidenceInventoryTitle: "Inventario de evidencias",
  evidenceInventoryHeading: "Vea todos los bloques mapeados, incluso los que todavía no entraron en el mapa.",
  evidenceCoverage: "Cobertura",
  caseTestTitle: "Pre-test editorial",
  caseTestHeading: "Guion rápido para probar esta investigación antes de editar datos reales.",
  caseTestReady: "Listo para probar",
  caseTestReview: "Revisar antes de probar",
  fullFlowTestTitle: "Guion de prueba completa",
  fullFlowTestHeading: "Ejecute una ronda guiada desde el estado del caso hasta la nota metodológica.",
  testStepOpen: "Abrir estado del caso",
  testStepPlan: "Trazar una hipótesis",
  testStepRequests: "Clasificar una solicitud",
  testStepClaims: "Decidir una afirmación",
  testStepMethod: "Revisar exportación",
  testExpected: "Qué observar",
  testStepOpenExpected: "La persona entiende estado, riesgo y próxima etapa sin explicación externa.",
  testStepPlanExpected: "La persona puede seguir hipótesis, evidencia y fuente probable.",
  testStepRequestsExpected: "La persona identifica estado de solicitud y próxima acción segura.",
  testStepClaimsExpected: "La persona diferencia avanzar, usar salvedad o retener una afirmación.",
  testStepMethodExpected: "La persona encuentra límites, QA y nota exportable.",
  testContextCheck: "Contexto y jurisdicción están legibles.",
  testPlanCheck: "Hipótesis, evidencias y fuentes aparecen como camino de reportería.",
  testRequestCheck: "Solicitudes tienen estado, plazo/checkpoint y próxima acción.",
  testClaimCheck: "Afirmaciones tienen decisión editorial y vínculo con evidencia.",
  testMethodCheck: "Metodología exportable y QA están disponibles.",
  requestBoardTitle: "Tablero de solicitudes",
  requestBoardHeading: "Vea el proceso por situación, no solo como lista.",
  requestStageWaiting: "Esperando",
  requestStageProblem: "Atención",
  requestStageReceived: "Material recibido",
  requestStageSeparate: "Flujo separado",
  requestStageNext: "Próxima acción",
  noRequestsInStage: "Ninguna solicitud en esta columna.",
  claimDecisionTitle: "Decisión editorial",
  claimDecisionHeading: "Lea cada afirmación como una decisión: avanzar, limitar o retener.",
  decisionAdvance: "Puede avanzar",
  decisionLimit: "Usar con salvedad",
  decisionHold: "Retener",
  decisionEvidence: "Base",
  decisionWhy: "Por qué",
  claim: "Afirmacion",
  evidence: "Evidência",
  evidenceRelation: "Relacion",
  strength: "Fuerza",
  risk: "Riesgo",
  qaModelTitle: "Modelo QA v0.2",
  qaModelHeading: "Glosario, lista cerrada de estados y evidências contradictorias.",
  qaModelCopy: "Actualizacion basada en QA: el protótipo registra si una evidência sustenta, contradice o limita una afirmacion.",
  glossaryTerms: "Glosario operativo",
  statusRegistry: "Lista cerrada de estados",
  evidenceRelations: "Relaciones de evidência",
  strengthScale: "Escala de fuerza",
  riskScale: "Escala de riesgo",
  publishRule: "Regla de publicación",
  requiredAction: "Acción obligatoria",
  dataModel: "Modelo de datos",
  relationship: "Relación",
  accessibilityChecks: "Accesibilidad",
  functionalCoverage: "Cobertura funcional",
  qaExpectation: "Critério QA",
  prototypeCoverage: "Cobertura en el protótipo",
  methodologyNote: "Nota metodológica",
  methodologyHeading: "Exporte un resumen transparente de evidências, solicitudes y limites.",
  qaChecklistHeading: "Revise riesgos antes de tratar evidências como públicables.",
  qaNoBlockers: "Ningun bloqueo de QA registrado.",
  action: "Accion",
  editorialSafeguards: "Salvaguardas editoriales",
  editorialSafeguardsHeading: "No transforme problemas de acceso en afirmaciones sin evidência.",
  jurisdictionAccess: "Jurisdiccion y reglas de acceso",
  jurisdictionHeading: "Defina plazos y caminos de fuente antes de usar asistencia por IA.",
  jurisdictionCopy: "La herramienta debe guiar a la repórtera por reglas conocidas, no inventarlas.",
  deadline: "Plazo",
  requestChannels: "Canales de solicitud",
  escalation: "Escalamiento",
  reporterWarning: "Alerta para repórtera",
  productRule: "Regla del producto",
  productRuleCopy:
    "Evidence Desk solo puede sugerir próximos pasos despues de que la repórtera selecciona jurisdiccion, confirma el canal de solicitud y revisa la regla de acceso relevante.",
  sourceDiscovery: "Descubrimiento de fuentes",
  sourceDiscoveryHeading: "Empiece por caminos controlados, despues deje que la repórtera verifique.",
  verify: "Verificar",
  languageLocalization: "Idioma y localizacion",
  languageHeading: "Separe traduccion de localizacion juridica y editorial.",
  languageCopy: "Una herramienta global necesita acceso multilingue, pero la orientacion sobre ley de acceso depende de la jurisdiccion.",
  languagePlan: "Plan de idioma",
  workingLanguage: "Idioma de trabajo",
  interfaceOptions: "Opciones de interfaz",
  publicationLanguages: "Idiomas de públicacion",
  localizationRule: "Regla de localizacion",
  localizationRuleCopy:
    "Traduzca libremente los rótulos de interfaz, pero localice leyes, plazos, organismos y tipos de fuente solo cuando la jurisdiccion sea conocida y revisada por la repórtera.",
  translationNotes: "Notas de traduccion",
  translationNotesHeading: "Terminos que requieren revision humana.",
  secondaryQuestions: "Preguntas secundárias",
  prototypeLimits: "Limites del protótipo",
  prototypeLimitsTitle: "Que esta probado ahora y que aun no debe prometerse",
  currentBehavior: "Comportamiento actual",
  nextProductStep: "Próximo paso de producto",
  createTitle: "Empiece con una pregunta que la evidência pueda responder.",
  createCopy:
    "Este formulário simulado prueba el flujo inicial del MVP. Valida campos obligatorios, muestra la estructura del proyecto y mantiene el guardado desactivado hasta que exista backend.",
  cancel: "Cancelar",
  reviewBeforeContinue: "Revise antes de continuar",
  investigationTitle: "Título de la investigacion",
  investigationTitlePlaceholder: "ej.: Violência obstétrica y transparência de datos públicos",
  countryPlaceholder: "ej.: Brasil, Estados Unidos, México",
  jurisdictionLocality: "Jurisdiccion/localidad",
  jurisdictionPlaceholder: "ej.: Bahia, Cook County, Ciudad de México",
  primaryLanguage: "Idioma principal",
  primaryLanguagePlaceholder: "ej.: Português, Inglês, Espanol",
  generalTopic: "Tema general",
  topicPlaceholder: "ej.: Salud pública, educacion, médio ambiente",
  investigatedTerritory: "Território investigado",
  territoryPlaceholder: "ej.: Salvador e interior de Bahia",
  investigatedPeriod: "Período investigado",
  periodPlaceholder: "ej.: 2020-2026",
  centralInvestigativeQuestion: "Pregunta investigativa central",
  centralQuestionPlaceholder: "Que pregunta debe responder esta investigacion con evidência?",
  centralQuestionHelp: "Obligatorio. Prefiera una pregunta que pueda responderse con documentos, datos, entrevistas o respuestas oficiales.",
  shortDescription: "Descripcion corta",
  descriptionPlaceholder: "Que intenta entender la pauta?",
  validateStructure: "Validar estructura",
  saveDraftAfterBackend: "Guardar borrador local",
  workspacePreview: "Vista prévia del espacio de trabajo",
  untitledInvestigation: "Investigacion sin título",
  countryJurisdiction: "País/jurisdiccion",
  starterStructure: "Estructura inicial",
  sourcesDatabases: "Fuentes/bases",
  notSet: "No definido",
  draftReady: "Estructura lista para la próxima etapa del MVP: mapear hipotesis y bloques de evidência.",
  errorTitleRequired: "Agregue un título para la investigacion.",
  errorCountryRequired: "Agregue un país.",
  errorLanguageRequired: "Agregue el idioma principal.",
  errorQuestionRequired: "Agregue una pregunta investigativa central.",
  errorTitleSpecific: "Haga el título mas específico para que QA entienda el caso.",
  errorQuestionMark: "Formule la pregunta central como pregunta.",
  context: "Contexto",
  planTab: "Plan de reporteo",
  requestsWorkspace: "LAI/FOIA y respuestas",
  editorialWorkspace: "Fila y vacíos",
  startHere: "Empiece aquí",
  startHereTitle: "Flujo de trabajo recomendado",
  startHereBadge: "4 pasos",
  workflowContextTitle: "Confirme contexto y jurisdicción",
  workflowContextCopy: "Revise idioma, território, reglas de acceso y límites antes de confiar en plazos o fuentes.",
  workflowPlanTitle: "Mapee preguntas, hipótesis y evidência",
  workflowPlanCopy: "Convierta la pauta en bloques verificables y rutas de fuentes, sin dejar que la IA elija sola.",
  workflowRequestsTitle: "Siga solicitudes y respuestas",
  workflowRequestsCopy: "Registre plazos, material recibido, anexos ausentes y próximos pasos.",
  workflowClaimsTitle: "Revise afirmaciones públicables",
  workflowClaimsCopy: "Avance solo cuando cada afirmación tenga evidência, relación, fuerza, riesgo y salvedad.",
  navGroupStart: "Empiece",
  navGroupInvestigate: "Investigue",
  navGroupDecide: "Decida",
  navGroupExport: "Publique",
  tabGuideTitle: "Como usar esta área",
  tabGuideOverview: "Use la vista general para entender el estado de la pauta y decidir por donde empezar.",
  tabGuideContext: "Confirme território, idioma y reglas de acceso antes de confiar en plazos, bases o fuentes.",
  tabGuidePlan: "Convierta la pregunta en hipótesis, bloques de evidência y fuentes verificables.",
  tabGuideRequests: "Registre solicitudes hechas fuera de la plataforma, compare respuestas y acompanhe próximos pasos.",
  tabGuideEditorial: "Convierta vacios, plazos y riesgos en acciones humanas controladas.",
  tabGuideClaims: "Avance afirmaciones solo cuando relación, fuerza, riesgo y evidência estén explícitos.",
  tabGuideStory: "Monte la historia con tesis provisional, bloques narrativos, afirmaciones utilizables y trabas finales.",
  tabGuideQa: "Use el checklist para encontrar bloqueos antes de demo, publicación o automatización.",
  tabGuideMethodology: "Exporte una nota transparente sobre evidências, limites, solicitudes y decisiones.",
  addToPlan: "Agregar al plan",
  addHypothesisTitle: "Agregar hipótesis de trabajo",
  hypothesisTextLabel: "Hipótesis",
  hypothesisTextPlaceholder: "ej.: fallas de transparencia impiden comparar servicios",
  hypothesisEvidenceLabel: "Evidencia necesaria",
  hypothesisEvidencePlaceholder: "ej.: datos por unidad, protocolo y respuesta oficial",
  hypothesisStatusLabel: "Estado de la hipótesis",
  addEvidenceBlockTitle: "Agregar bloque de evidencia",
  evidenceTypeLabel: "Tipo de evidencia",
  evidenceTypePlaceholder: "ej.: serie historica por servicio",
  evidencePriorityLabel: "Prioridad",
  evidenceStatusLabel: "Estado del bloque",
  addSourceTitle: "Agregar fuente o base",
  sourceNameLabel: "Nombre de la fuente/base",
  sourceNamePlaceholder: "ej.: portal de datos, ministerio, tribunal, municipio",
  sourceTypeLabel: "Tipo",
  sourceStatusLabel: "Estado de la fuente",
  sourceUseLabel: "Uso en la investigación",
  sourceUsePlaceholder: "Que pregunta puede ayudar a responder esta fuente?",
  sourceLimitsLabel: "Limites conocidos",
  sourceLimitsPlaceholder: "Que no resuelve esta fuente o que requiere chequeo?",
  itemAdded: "Item agregado y guardado en este navegador.",
  fillRequiredPlanFields: "Complete los campos principales antes de agregar.",
  addRequestTitle: "Registrar solicitud externa",
  requestTitleLabel: "Título de la solicitud",
  requestTitlePlaceholder: "ej.: muertes maternas por servicio",
  agencyLabel: "Organismo o institución",
  agencyPlaceholder: "ej.: secretaria de salud, municipio, ministerio",
  channelLabel: "Canal",
  channelPlaceholder: "ej.: portal de acceso, email, formulario público",
  protocolPlaceholder: "ej.: protocolo, ID público o control interno",
  sentDateLabel: "Fecha de envio",
  dueDateLabel: "Plazo esperado",
  requestStatusLabel: "Estado de la solicitud",
  requestedItemsLabel: "Items solicitados",
  requestedItemsPlaceholder: "Liste campos, documentos o bases solicitadas.",
  responseSummaryLabel: "Resumen de la respuesta",
  responseSummaryPlaceholder: "Registre si no hubo respuesta, si vino parcial o que fue entregado.",
  addRequest: "Agregar solicitud",
  requestAdded: "Solicitud agregada y guardada en este navegador.",
  addComparisonTitle: "Comparar solicitud y respuesta",
  comparisonRequestLabel: "Solicitud comparada",
  comparisonRequestPlaceholder: "Digite el título de la solicitud o use el mismo nombre ya registrado.",
  deadlineStatusLabel: "Estado del plazo/respuesta",
  expectedLabel: "Lo que fue solicitado",
  expectedPlaceholder: "Liste campos, documentos, recortes o anexos que deberian llegar.",
  receivedLabel: "Lo que fue recibido",
  receivedPlaceholder: "Registre exactamente lo que llego, incluyendo enlaces, anexos, archivos o ausencia de entrega.",
  missingLabel: "Ausente o poco claro",
  missingPlaceholder: "Que falta, vino incompleto o no permite comparacion?",
  editorialDecisionLabel: "Decision editorial",
  editorialDecisionPlaceholder: "ej.: usar con salvedad, no usar, apelar, hacer nueva solicitud",
  comparisonNextStepPlaceholder: "Que accion viene ahora?",
  addComparison: "Guardar comparacion",
  comparisonAdded: "Comparacion agregada y guardada en este navegador.",
  addFollowUpTitle: "Crear borrador de seguimiento",
  followUpTitleLabel: "Título del borrador",
  followUpTitlePlaceholder: "ej.: solicitar reenvio de anexos",
  followUpTypeLabel: "Tipo de seguimiento",
  followUpTypePlaceholder: "ej.: apelacion, solicitud complementaria, contestacion, chequeo",
  followUpRequestLabel: "Solicitud relacionada",
  followUpRequestPlaceholder: "Use el título o protocolo de la solicitud relacionada.",
  followUpStatusLabel: "Estado del borrador",
  riskNoteLabel: "Chequeo obligatorio",
  riskNotePlaceholder: "Que debe revisar la repórtera antes de enviar?",
  draftTextLabel: "Texto del borrador",
  draftTextPlaceholder: "Escriba el texto-base del seguimiento para revision humana.",
  addFollowUp: "Guardar borrador",
  followUpAdded: "Borrador agregado y guardado en este navegador.",
  addTransparencyEventTitle: "Agregar evento al diário",
  transparencyDateLabel: "Fecha del evento",
  transparencyActorLabel: "Actor/organismo",
  transparencyActorPlaceholder: "ej.: organismo, oficina de recurso, ouvidoria, responsable de registros",
  transparencyEventLabel: "Evento procesal",
  transparencyEventPlaceholder: "Describa lo que ocurrio sin convertir movimiento en evidência.",
  transparencyStatusLabel: "Estado del evento",
  transparencyNextStepLabel: "Próximo paso",
  transparencyNextStepPlaceholder: "Que debe chequearse, cobrarse, esperarse o escalarse?",
  addTransparencyEvent: "Agregar evento",
  transparencyEventAdded: "Evento agregado al diário y guardado en este navegador.",
  addActionTitle: "Agregar acción editorial",
  actionLabel: "Acción",
  actionPlaceholder: "ej.: reenviar solicitud, chequear anexos, preparar recurso, buscar base alternativa",
  actionSourceLabel: "Fuente/protocolo relacionado",
  actionSourcePlaceholder: "ej.: ID de solicitud, diário de transparência, respuesta parcial",
  actionPriorityLabel: "Prioridad",
  actionStatusLabel: "Estado de la acción",
  actionOwnerPlaceholder: "ej.: repórtera, QA, editoria, juridico",
  actionTypePlaceholder: "ej.: acceso, chequeo, analisis de datos, entrevista, revision",
  actionRationalePlaceholder: "Por que necesita existir esta acción?",
  actionOutputPlaceholder: "Que salida concreta debe producir esta acción?",
  addAction: "Agregar acción",
  actionAdded: "Acción agregada y guardada en este navegador.",
  addGapTitle: "Agregar vacio",
  gapDescriptionLabel: "Descripcion del vacio",
  gapDescriptionPlaceholder: "ej.: el organismo dice que envio archivos, pero anexos no estan disponibles",
  gapOriginLabel: "Origen del vacio",
  gapOriginPlaceholder: "ej.: respuesta parcial, base incompleta, sin retorno",
  gapSeverityLabel: "Gravedad",
  gapStatusLabel: "Estado del vacio",
  gapNextStepLabel: "Próximo paso",
  gapNextStepPlaceholder: "Que debe ocurrir antes de usar esta informacion?",
  addGap: "Agregar vacio",
  gapAdded: "Vacio agregado y guardado en este navegador.",
  addClaimTitle: "Agregar afirmación verificable",
  claimTextLabel: "Afirmación",
  claimTextPlaceholder: "Escriba una afirmación que podria entrar en el texto, aun sujeta a revision.",
  claimTypeLabel: "Tipo de afirmación",
  claimEvidenceLabel: "Evidencia vinculada",
  claimEvidencePlaceholder: "Que dato, documento, respuesta o entrevista sostiene/limita la afirmación?",
  claimRelationLabel: "Relación con la evidencia",
  claimStrengthLabel: "Fuerza",
  claimRiskLabel: "Riesgo",
  claimStatusLabel: "Estado editorial",
  addClaimButton: "Agregar afirmación",
  claimAdded: "Afirmación agregada y guardada en este navegador.",
  priorityLabel: "Prioridad",
  sourcesTitle: "Fuentes y bases de datos",
  sourcesHeading: "Separe fuentes verificadas de caminos probables.",
  copyMarkdown: "Copiar Markdown",
  copied: "Copiado",
  projectScope: "Alcance del proyecto",
  topicLabel: "Tema",
  updated: "Actualizado",
  editorialSafetyRule: "Regla de seguridad editorial",
  editorialSafetyCopy:
    "Los vacios no son conclusiones. Son problemas de evidência abiertos que requieren seguimiento, limite metodológico o reescritura de la afirmacion.",
  freshnessCheck: "Chequeo de actualidad",
  reviewRecommended: "Revision recomendada",
  partialResponse: "Respuesta parcial recibida",
  responseReceived: "Respuesta recibida",
  daysToCheckpoint: "dias hasta el checkpoint",
  dayToCheckpoint: "dia hasta el checkpoint",
  daysLeft: "dias restantes",
  dayLeft: "dia restante",
  daysPastCheckpoint: "dias despues del checkpoint",
  dayPastCheckpoint: "dia despues del checkpoint",
  daysOverdue: "dias de atraso",
  dayOverdue: "dia de atraso",
};

function t(key) {
  return dictionary[state.locale]?.[key] || dictionary.pt[key] || dictionary.en[key] || key;
}

function getFieldSuggestions() {
  const suggestions = {
    pt: {
      status: [
        "Em revisão",
        "Em apuração",
        "Respondido parcialmente",
        "Resposta recebida",
        "Atrasado",
        "Recurso necessário",
        "Verificado",
        "Não usar",
        "Usar com ressalva",
      ],
      priority: ["Alta", "Média", "Baixa"],
      risk: ["Alto", "Médio", "Baixo"],
      relation: ["Sustenta", "Contradiz", "Limita", "Contextualiza", "Ainda insuficiente"],
      strength: ["Forte", "Média", "Fraca", "Indeterminada"],
    },
    en: {
      status: [
        "Under review",
        "In reporting",
        "Partial response",
        "Response received",
        "Overdue",
        "Appeal needed",
        "Verified",
        "Do not use",
        "Use with caveat",
      ],
      priority: ["High", "Medium", "Low"],
      risk: ["High", "Medium", "Low"],
      relation: ["Supports", "Contradicts", "Limits", "Contextualizes", "Still insufficient"],
      strength: ["Strong", "Medium", "Weak", "Undetermined"],
    },
    es: {
      status: [
        "En revisión",
        "En reporteo",
        "Respuesta parcial",
        "Respuesta recibida",
        "Atrasado",
        "Recurso necesario",
        "Verificado",
        "No usar",
        "Usar con salvedad",
      ],
      priority: ["Alta", "Media", "Baja"],
      risk: ["Alto", "Medio", "Bajo"],
      relation: ["Sostiene", "Contradice", "Limita", "Contextualiza", "Aún insuficiente"],
      strength: ["Fuerte", "Media", "Débil", "Indeterminada"],
    },
  };

  return suggestions[state.locale] || suggestions.pt;
}

function renderDatalists() {
  const suggestions = getFieldSuggestions();
  const datalist = (id, values) => `
    <datalist id="${id}">
      ${values.map((value) => `<option value="${escapeHtml(value)}"></option>`).join("")}
    </datalist>
  `;

  return `
    ${datalist("status-options", suggestions.status)}
    ${datalist("priority-options", suggestions.priority)}
    ${datalist("risk-options", suggestions.risk)}
    ${datalist("relation-options", suggestions.relation)}
    ${datalist("strength-options", suggestions.strength)}
  `;
}

function getCurrentInvestigation() {
  return investigations.find((item) => item.id === state.currentId) || investigations[0];
}

function saveInvestigations() {
  writeLocalStorage(STORAGE_KEY, JSON.stringify(investigations));
}

function saveUiState() {
  writeLocalStorage(
    UI_STORAGE_KEY,
    JSON.stringify({
      view: state.view,
      currentId: state.currentId,
      currentTab: state.currentTab,
      locale: state.locale,
      filters: state.filters,
    })
  );
}

function resetDraft() {
  state.draft = {
    title: "",
    country: "",
    jurisdiction: "",
    language: "",
    topic: "",
    territory: "",
    period: "",
    centralQuestion: "",
    description: "",
  };
  state.draftErrors = [];
  state.draftNotice = "";
}

function resetLocalInvestigations() {
  investigations = clone(seedInvestigations);
  removeLocalStorage(STORAGE_KEY);
  state.currentId = investigations[0].id;
  state.currentTab = "overview";
  state.view = "dashboard";
  saveUiState();
}

function todayIsoDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function createEmptyInvestigation(draft) {
  const title = draft.title.trim();
  const country = draft.country.trim();
  const jurisdiction = draft.jurisdiction.trim() || country;
  const language = draft.language.trim();
  const topic = draft.topic.trim() || t("topic");
  const territory = draft.territory.trim() || jurisdiction;
  const period = draft.period.trim() || t("notSet");
  const id = `${slugify(title) || "investigation"}-${Date.now().toString(36)}`;

  return {
    id,
    title,
    country,
    jurisdiction,
    language,
    topic,
    status: t("reviewRecommended"),
    period,
    territory,
    updatedAt: todayIsoDate(),
    freshness: {
      status: t("reviewRecommended"),
      checkedAt: todayIsoDate(),
      summary: t("draftReady"),
    },
    nextReviewItems: [t("workflowPlanCopy"), t("workflowRequestsCopy")],
    actionItems: [],
    accessLaw: {
      framework: t("notSet"),
      deadline: t("noDate"),
      escalation: t("notSet"),
      requestChannels: t("notSet"),
      reporterWarning: t("productRuleCopy"),
    },
    languagePlan: {
      workingLanguage: language,
      interfaceLanguages: ["Português", "English", "Español"],
      publicationLanguages: [language],
      localizationNotes: [t("localizationRuleCopy")],
      glossary: [],
    },
    sourceDiscovery: [],
    methodRules: [],
    transparencyLog: [],
    followUpDrafts: [],
    qaChecklist: [],
    centralQuestion: draft.centralQuestion.trim(),
    description: draft.description.trim() || draft.centralQuestion.trim(),
    processGuide: [
      { stage: t("workflowContextTitle"), action: t("workflowContextCopy"), output: t("context") },
      { stage: t("workflowPlanTitle"), action: t("workflowPlanCopy"), output: t("planTab") },
      { stage: t("workflowRequestsTitle"), action: t("workflowRequestsCopy"), output: t("requestsWorkspace") },
    ],
    secondaryQuestions: [],
    hypotheses: [],
    evidenceBlocks: [],
    sources: [],
    requests: [],
    requestComparisons: [],
    gaps: [],
    claims: [],
  };
}

function persistCreatedInvestigation() {
  validateDraft();
  if (state.draftErrors.length) return false;
  const investigation = createEmptyInvestigation(state.draft);
  investigations = [investigation, ...investigations];
  saveInvestigations();
  state.currentId = investigation.id;
  state.currentTab = "overview";
  state.view = "investigation";
  resetDraft();
  saveUiState();
  return true;
}

function resetPlanDraft(fields) {
  fields.forEach((field) => {
    state.planDraft[field] = "";
  });
}

function touchInvestigation(item) {
  item.updatedAt = todayIsoDate();
  saveInvestigations();
}

function addHypothesisToCurrent() {
  const item = getCurrentInvestigation();
  const text = state.planDraft.hypothesisText.trim();
  const evidence = state.planDraft.hypothesisEvidence.trim();
  if (!text || !evidence) {
    state.planNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.hypotheses = [
    ...(item.hypotheses || []),
    {
      text,
      evidence,
      status: state.planDraft.hypothesisStatus.trim() || t("reviewRecommended"),
    },
  ];
  touchInvestigation(item);
  resetPlanDraft(["hypothesisText", "hypothesisEvidence", "hypothesisStatus"]);
  state.planNotice = t("itemAdded");
  return true;
}

function addEvidenceBlockToCurrent() {
  const item = getCurrentInvestigation();
  const type = state.planDraft.evidenceType.trim();
  if (!type) {
    state.planNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.evidenceBlocks = [
    ...(item.evidenceBlocks || []),
    {
      type,
      priority: state.planDraft.evidencePriority.trim() || t("priorityPrefix"),
      status: state.planDraft.evidenceStatus.trim() || t("reviewRecommended"),
    },
  ];
  touchInvestigation(item);
  resetPlanDraft(["evidenceType", "evidencePriority", "evidenceStatus"]);
  state.planNotice = t("itemAdded");
  return true;
}

function addSourceToCurrent() {
  const item = getCurrentInvestigation();
  const name = state.planDraft.sourceName.trim();
  const use = state.planDraft.sourceUse.trim();
  if (!name || !use) {
    state.planNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.sources = [
    ...(item.sources || []),
    {
      name,
      type: state.planDraft.sourceType.trim() || t("sourcesDatabases"),
      status: state.planDraft.sourceStatus.trim() || t("reviewRecommended"),
      use,
      limits: state.planDraft.sourceLimits.trim() || t("reviewLog"),
    },
  ];
  touchInvestigation(item);
  resetPlanDraft(["sourceName", "sourceType", "sourceStatus", "sourceUse", "sourceLimits"]);
  state.planNotice = t("itemAdded");
  return true;
}

function resetRequestDraft() {
  Object.keys(state.requestDraft).forEach((field) => {
    state.requestDraft[field] = "";
  });
}

function addRequestToCurrent() {
  const item = getCurrentInvestigation();
  const title = state.requestDraft.title.trim();
  const agency = state.requestDraft.agency.trim();
  const requestedItems = state.requestDraft.requestedItems.trim();
  if (!title || !agency || !requestedItems) {
    state.requestNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.requests = [
    ...(item.requests || []),
    {
      title,
      agency,
      channel: state.requestDraft.channel.trim() || t("requestChannels"),
      protocol: state.requestDraft.protocol.trim() || t("notSet"),
      sentDate: state.requestDraft.sentDate || todayIsoDate(),
      dueDate: state.requestDraft.dueDate || t("noDate"),
      status: state.requestDraft.status.trim() || t("reviewRecommended"),
      requestedItems,
      responseSummary: state.requestDraft.responseSummary.trim() || t("noReceivedMaterial"),
    },
  ];
  item.transparencyLog = [...(item.transparencyLog || []), {
    date: todayIsoDate(), actor: 'Repórter', requestIndex: item.requests.length - 1,
    origin: 'request-registration', event: `Pedido cadastrado na ferramenta: ${title}. Órgão: ${agency}. Data de envio informada: ${item.requests.at(-1).sentDate}.`,
    status: 'Registro da repórter', nextStep: 'Conferir o protocolo e configurar o acompanhamento. O cadastro não protocola o pedido no órgão.',
  }];
  touchInvestigation(item);
  resetRequestDraft();
  state.requestNotice = t("requestAdded");
  return true;
}

function resetComparisonDraft() {
  Object.keys(state.comparisonDraft).forEach((field) => {
    state.comparisonDraft[field] = "";
  });
}

function addComparisonToCurrent() {
  const item = getCurrentInvestigation();
  const requestTitle = state.comparisonDraft.requestTitle.trim();
  const expected = state.comparisonDraft.expected.trim();
  const received = state.comparisonDraft.received.trim();
  const missing = state.comparisonDraft.missing.trim();
  if (!requestTitle || !expected || !received || !missing) {
    state.comparisonNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.requestComparisons = [
    ...(item.requestComparisons || []),
    {
      requestTitle,
      deadlineStatus: state.comparisonDraft.deadlineStatus.trim() || t("reviewRecommended"),
      expected,
      received,
      missing,
      editorialDecision: state.comparisonDraft.editorialDecision.trim() || t("reviewRecommended"),
      nextStep: state.comparisonDraft.nextStep.trim() || t("reviewLog"),
    },
  ];
  touchInvestigation(item);
  resetComparisonDraft();
  state.comparisonNotice = t("comparisonAdded");
  return true;
}

function resetFollowUpDraft() {
  Object.keys(state.followUpDraft).forEach((field) => {
    state.followUpDraft[field] = "";
  });
}

function addFollowUpToCurrent() {
  const item = getCurrentInvestigation();
  const title = state.followUpDraft.title.trim();
  const draft = state.followUpDraft.draft.trim();
  if (!title || !draft) {
    state.followUpNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.followUpDrafts = [
    ...(item.followUpDrafts || []),
    {
      title,
      type: state.followUpDraft.type.trim() || t("followUps"),
      request: state.followUpDraft.request.trim() || t("notSet"),
      status: state.followUpDraft.status.trim() || t("reviewRecommended"),
      riskNote: state.followUpDraft.riskNote.trim() || t("reporterCheck"),
      draft,
    },
  ];
  touchInvestigation(item);
  resetFollowUpDraft();
  state.followUpNotice = t("followUpAdded");
  return true;
}

function resetTransparencyDraft() {
  Object.keys(state.transparencyDraft).forEach((field) => {
    state.transparencyDraft[field] = "";
  });
}

function addTransparencyEventToCurrent() {
  const item = getCurrentInvestigation();
  const event = state.transparencyDraft.event.trim();
  const actor = state.transparencyDraft.actor.trim();
  const nextStep = state.transparencyDraft.nextStep.trim();
  if (!event || !actor || !nextStep) {
    state.transparencyNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.transparencyLog = [
    ...(item.transparencyLog || []),
    {
      date: state.transparencyDraft.date || todayIsoDate(),
      actor,
      event,
      status: state.transparencyDraft.status.trim() || t("reviewRecommended"),
      nextStep,
    },
  ];
  touchInvestigation(item);
  resetTransparencyDraft();
  state.transparencyNotice = t("transparencyEventAdded");
  return true;
}

function resetActionDraft() {
  Object.keys(state.actionDraft).forEach((field) => {
    state.actionDraft[field] = "";
  });
}

function addActionToCurrent() {
  const item = getCurrentInvestigation();
  const action = state.actionDraft.action.trim();
  const output = state.actionDraft.output.trim();
  if (!action || !output) {
    state.actionNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.actionItems = [
    ...(item.actionItems || []),
    {
      action,
      source: state.actionDraft.source.trim() || t("notSet"),
      priority: state.actionDraft.priority.trim() || t("priorityPrefix"),
      status: state.actionDraft.status.trim() || t("reviewRecommended"),
      owner: state.actionDraft.owner.trim() || t("owner"),
      dueDate: state.actionDraft.dueDate || "",
      type: state.actionDraft.type.trim() || t("action"),
      rationale: state.actionDraft.rationale.trim() || t("reviewLog"),
      output,
    },
  ];
  touchInvestigation(item);
  resetActionDraft();
  state.actionNotice = t("actionAdded");
  return true;
}

function resetGapDraft() {
  Object.keys(state.gapDraft).forEach((field) => {
    state.gapDraft[field] = "";
  });
}

function addGapToCurrent() {
  const item = getCurrentInvestigation();
  const description = state.gapDraft.description.trim();
  const nextStep = state.gapDraft.nextStep.trim();
  if (!description || !nextStep) {
    state.gapNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.gaps = [
    ...(item.gaps || []),
    {
      description,
      origin: state.gapDraft.origin.trim() || t("notSet"),
      severity: state.gapDraft.severity.trim() || t("reviewRecommended"),
      status: state.gapDraft.status.trim() || t("reviewRecommended"),
      nextStep,
    },
  ];
  touchInvestigation(item);
  resetGapDraft();
  state.gapNotice = t("gapAdded");
  return true;
}

function resetClaimDraft() {
  Object.keys(state.claimDraft).forEach((field) => {
    state.claimDraft[field] = "";
  });
}

function addClaimToCurrent() {
  const item = getCurrentInvestigation();
  const text = state.claimDraft.text.trim();
  const evidence = state.claimDraft.evidence.trim();
  if (!text || !evidence) {
    state.claimNotice = t("fillRequiredPlanFields");
    return false;
  }
  item.claims = [
    ...(item.claims || []),
    {
      text,
      type: state.claimDraft.type.trim() || t("claim"),
      evidence,
      relation: state.claimDraft.relation.trim() || t("reviewRecommended"),
      strength: state.claimDraft.strength.trim() || t("reviewRecommended"),
      risk: state.claimDraft.risk.trim() || t("reviewRecommended"),
      status: state.claimDraft.status.trim() || t("reviewRecommended"),
    },
  ];
  touchInvestigation(item);
  resetClaimDraft();
  state.claimNotice = t("claimAdded");
  return true;
}

function normalizeImportedInvestigation(payload) {
  const item = payload?.investigation || payload;
  if (!item || typeof item !== "object") throw new Error("Invalid investigation payload");
  if (!item.title || !item.country || !item.language || !item.centralQuestion) {
    throw new Error("Missing required investigation fields");
  }
  return {
    ...createEmptyInvestigation({
      title: item.title,
      country: item.country,
      jurisdiction: item.jurisdiction || item.country,
      language: item.language,
      topic: item.topic || "",
      territory: item.territory || "",
      period: item.period || "",
      centralQuestion: item.centralQuestion,
      description: item.description || "",
    }),
    ...item,
    id: item.id ? `${item.id}-${Date.now().toString(36)}` : `${slugify(item.title)}-${Date.now().toString(36)}`,
    updatedAt: todayIsoDate(),
  };
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function statusClass(value = "") {
  const normalized = normalizeText(value);
  if (normalized.includes("critica") || normalized.includes("high") || normalized.includes("alto")) return "danger";
  if (normalized.includes("blocked") || normalized.includes("bloqueado")) return "danger";
  if (normalized.includes("sem resposta") || normalized.includes("without attachment")) return "danger";
  if (normalized.includes("parcial") || normalized.includes("partial") || normalized.includes("media")) return "warning";
  if (normalized.includes("recurso") || normalized.includes("appeal")) return "warning";
  if (normalized.includes("cagi") || normalized.includes("cgai") || normalized.includes("progress")) return "warning";
  if (normalized.includes("review") || normalized.includes("revisão") || normalized.includes("verificar")) return "warning";
  if (normalized.includes("precisa")) return "warning";
  if (normalized.includes("update") || normalized.includes("progress")) return "warning";
  if (normalized.includes("next")) return "warning";
  if (normalized.includes("implementado") || normalized.includes("implemented") || normalized.includes("coberto") || normalized.includes("covered")) return "success";
  if (normalized.includes("ready") || normalized.includes("low")) return "success";
  if (normalized.includes("current")) return "success";
  if (normalized.includes("sustenta") || normalized.includes("supported") || normalized.includes("support") || normalized.includes("forte")) return "success";
  if (normalized.includes("contradiz") || normalized.includes("contradict")) return "danger";
  if (normalized.includes("limita") || normalized.includes("limit")) return "warning";
  if (normalized.includes("atrasado") || normalized.includes("broken") || normalized.includes("fraca")) return "danger";
  return "neutral";
}

function countOpenClaims(investigation) {
  return investigation.claims.filter((claim) => {
    const status = (claim.status || "").toLowerCase();
    return status.includes("precisa") || status.includes("needs") || status.includes("partial");
  }).length;
}

function countStrongSupportedClaims(investigation) {
  return investigation.claims.filter((claim) => {
    const relation = (claim.relation || "").toLowerCase();
    const strength = (claim.strength || "").toLowerCase();
    const risk = (claim.risk || "").toLowerCase();

    return (
      (relation.includes("sustenta") || relation.includes("support") || relation.includes("sostiene")) &&
      (strength.includes("forte") || strength.includes("strong") || strength.includes("fuerte")) &&
      (risk.includes("baixo") || risk.includes("low") || risk.includes("bajo"))
    );
  }).length;
}

function countHighRiskClaims(investigation) {
  return investigation.claims.filter((claim) => statusClass(claim.risk) === "danger").length;
}

function countClaimsNeedingCare(investigation) {
  return investigation.claims.filter((claim) => {
    const relationTone = statusClass(claim.relation);
    const strengthTone = statusClass(claim.strength);
    const riskTone = statusClass(claim.risk);
    const status = (claim.status || "").toLowerCase();

    return (
      relationTone !== "success" ||
      strengthTone !== "success" ||
      riskTone === "danger" ||
      status.includes("precisa") ||
      status.includes("needs") ||
      status.includes("cautel")
    );
  }).length;
}

function readinessStatus(tone) {
  if (tone === "success") return t("readinessReady");
  if (tone === "danger") return t("readinessBlocked");
  if (tone === "warning") return t("readinessReview");
  return t("readinessAction");
}

function getReadinessItems(item) {
  const contextReady = Boolean(item.accessLaw?.framework) && (item.sourceDiscovery?.length || item.sources.length);
  const evidenceReady = item.hypotheses.length > 0 && item.evidenceBlocks.length > 0 && item.sources.length > 0;
  const requestAttention = countLateRequests(item) + countRequestFollowUps(item);
  const requestsReady = item.requests.length > 0 && item.requestComparisons.length > 0 && (item.transparencyLog || []).length > 0;
  const claimsNeedingCare = countClaimsNeedingCare(item);
  const highRiskClaims = countHighRiskClaims(item);
  const qaBlockers = countQaBlockers(item);

  return [
    {
      tab: "context",
      title: t("context"),
      detail: `${item.country} / ${item.jurisdiction || item.territory} / ${item.sourceDiscovery?.length || item.sources.length} ${t("sources").toLowerCase()}`,
      tone: contextReady ? "success" : "warning",
    },
    {
      tab: "plan",
      title: t("planTab"),
      detail: `${item.hypotheses.length} ${t("hypotheses").toLowerCase()} / ${item.evidenceBlocks.length} ${t("evidenceBlocksMetric")}`,
      tone: evidenceReady ? "success" : "warning",
    },
    {
      tab: "requests",
      title: t("requestsWorkspace"),
      detail: `${item.requests.length} ${t("requests").toLowerCase()} / ${requestAttention} ${t("attentionNeeded").toLowerCase()}`,
      tone: requestAttention ? "danger" : requestsReady ? "success" : "warning",
    },
    {
      tab: "claims",
      title: t("claims"),
      detail: `${item.claims.length} ${t("claims").toLowerCase()} / ${claimsNeedingCare} ${t("claimsNeedingCare").toLowerCase()}`,
      tone: highRiskClaims ? "danger" : claimsNeedingCare ? "warning" : item.claims.length ? "success" : "neutral",
    },
    {
      tab: "qa",
      title: "QA",
      detail: `${qaBlockers} ${t("qaBlockers")} / ${countReviewItems(item)} ${t("reviewItems")}`,
      tone: qaBlockers ? "danger" : item.qaChecklist?.length ? "success" : "warning",
    },
  ];
}

function countOpenGaps(investigation) {
  return investigation.gaps.filter((gap) => !["resolvida", "resolved"].includes(gap.status.toLowerCase())).length;
}

function countReviewItems(investigation) {
  return investigation.nextReviewItems?.length || 0;
}

function countQaBlockers(investigation) {
  return (investigation.qaChecklist || []).filter((item) => statusClass(item.status) === "danger").length;
}

function countActionItems(investigation) {
  return investigation.actionItems?.filter((item) => !item.status.toLowerCase().includes("done")).length || 0;
}

function getEditorialQueue(item) {
  const deadlineItems = item.requests
    .map((request) => ({ request, timing: getRequestTiming(request) }))
    .filter(({ request, timing }) => request.currentCheckpoint || timing.tone === "danger" || timing.tone === "warning")
    .map(({ request, timing }) => ({
      title: request.title,
      meta: `${request.agency} / ${request.protocol}`,
      status: timing.label,
      detail: suggestDeadlineAction(request, timing),
    }));

  const reviewItems = (item.nextReviewItems || []).map((reviewItem) => ({
    title: reviewItem,
    meta: item.freshness?.checkedAt || item.updatedAt,
    status: item.freshness?.status || t("reviewRecommended"),
    detail: item.freshness?.summary || t("reviewLog"),
  }));

  const actionItems = (item.actionItems || [])
    .filter((action) => !action.status.toLowerCase().includes("done"))
    .map((action) => ({
      title: action.action,
      meta: `${action.source} / ${action.owner}`,
      status: `${action.priority} / ${action.status}`,
      detail: action.output,
    }));

  return { deadlineItems, reviewItems, actionItems };
}

function countQueueItems(investigation) {
  const queue = getEditorialQueue(investigation);
  return queue.deadlineItems.length + queue.reviewItems.length + queue.actionItems.length;
}

function getRequestTiming(request) {
  const deadline = getDeadlineInfo(request, todayIsoDate());
  const days = deadline.days;
  const review = request.operationalReview;
  const status = review ? '' : (request.status || '').toLowerCase();
  const isCheckpoint = deadline.kind === 'checkpoint';
  if (review?.scenario === 'response') {
    if (review.result === 'complete') return { label: 'Itens conferidos pela repórter', days, tone: 'success' };
    if (review.result === 'partial') return { label: t('partialResponse'), days, tone: 'warning' };
    return { label: 'Resposta recebida — conferência pendente', days, tone: 'warning' };
  }
  if (review?.scenario === 'denied' || review?.scenario === 'inaccessible') {
    return { label: review.scenario === 'denied' ? 'Acesso negado — avaliar recurso' : 'Material inacessível', days, tone: 'warning' };
  }

  if (status.includes("fluxo separado") || status.includes("separate track")) {
    return { label: t("separateTrack"), days, tone: "neutral" };
  }

  if (status.includes("parcial") || status.includes("partial")) {
    return { label: t("partialResponse"), days, tone: "warning" };
  }

  if (status.includes("entregue") || status.includes("recebida") || status.includes("received")) {
    return { label: t("responseReceived"), days, tone: "success" };
  }

  if (days === null) return { label: 'Prazo não informado', days: null, tone: 'neutral' };
  if (deadline.kind === 'reference') return {
    label: `Referência ${deadline.date} — confirmar no protocolo`, days, tone: 'warning',
  };

  if (days >= 0) {
    const key = isCheckpoint
      ? days === 1
        ? "dayToCheckpoint"
        : "daysToCheckpoint"
      : days === 1
        ? "dayLeft"
        : "daysLeft";
    return { label: `${days} ${t(key)}`, days, tone: days <= 3 ? "warning" : "neutral" };
  }

  const overdueKey = isCheckpoint
    ? Math.abs(days) === 1
      ? "dayPastCheckpoint"
      : "daysPastCheckpoint"
    : Math.abs(days) === 1
      ? "dayOverdue"
      : "daysOverdue";
  return {
    label: `${Math.abs(days)} ${t(overdueKey)}`,
    days,
    tone: "danger",
  };
}

function countLateRequests(investigation) {
  return investigation.requests.filter((request) => getRequestTiming(request).tone === "danger").length;
}

function countRequestFollowUps(investigation) {
  return investigation.requestComparisons.filter((comparison) => {
    const decision = comparison.editorialDecision.toLowerCase();
    return decision.includes("ressalva") || decision.includes("não usar") || decision.includes("partial");
  }).length;
}

function countReviewedResponses(investigation) {
  const titles = new Set((investigation.requestComparisons || []).filter(comparison => comparison.received || comparison.editorialDecision).map(comparison => comparison.requestTitle));
  (investigation.requests || []).forEach(request => {
    if (request.operationalReview?.scenario === 'response' && request.operationalReview.result !== 'unknown') titles.add(request.title);
    else if (request.operationalReview) titles.delete(request.title);
  });
  return titles.size;
}

function uniqueOptions(field) {
  return [...new Set(investigations.map((item) => item[field]).filter(Boolean))].sort();
}

function renderFilterSelect(field, label) {
  const options = uniqueOptions(field)
    .map(
      (option) => `
        <option value="${escapeHtml(option)}" ${state.filters[field] === option ? "selected" : ""}>
          ${escapeHtml(option)}
        </option>
      `,
    )
    .join("");

  return `
    <label class="filter-control">
      <span>${label}</span>
      <select data-filter="${field}">
        <option value="all">${t("all")}</option>
        ${options}
      </select>
    </label>
  `;
}

function investigationMatchesFilters(item) {
  return Object.entries(state.filters).every(([field, value]) => value === "all" || item[field] === value);
}

function renderShell(content) {
  const languageToggle = ["pt", "en", "es"]
    .map(
      (locale) => `
        <button class="locale-button ${state.locale === locale ? "active" : ""}" data-action="set-locale" data-locale="${locale}">
          ${locale.toUpperCase()}
        </button>
      `,
    )
    .join("");

  app.innerHTML = `
    <header class="topbar">
      <button class="brand" data-action="dashboard" aria-label="${t("goDashboard")}">
        <span class="brand-mark">E</span>
        <span>
          <strong>Evidence Desk</strong>
          <small>prototype</small>
        </span>
      </button>
      <div class="topbar-actions">
        <div class="topbar-note">${t("topbarNote")}</div>
        <div class="locale-toggle" aria-label="${t("languageToggle")}">${languageToggle}</div>
      </div>
    </header>
    ${renderDatalists()}
    ${content}
  `;
  bindActions();
}

function renderDashboard() {
  const filteredInvestigations = investigations.filter(investigationMatchesFilters);
  const localizedTestPlan =
    state.locale === "pt"
      ? {
          tasks: [
            {
              title: "Abrir a investigação do Brasil",
              goal: "Verificar se uma jornalista entende respostas parciais de LAI, anexos ausentes e passos de escalonamento.",
              success: "A pessoa consegue identificar pelo menos uma lacuna de evidência e uma próxima ação segura.",
            },
            {
              title: "Abrir a investigação dos EUA",
              goal: "Verificar se o mesmo fluxo funciona fora do Brasil com registros públicos, contratos e atas escolares.",
              success: "A pessoa entende que o estado/jurisdição deve ser definido antes de confiar em prazos ou recursos.",
            },
            {
              title: "Revisar uma afirmação",
              goal: "Verificar se força da afirmação, risco e evidências de apoio são fáceis de entender.",
              success: "A pessoa consegue dizer quais afirmações estão prontas, parciais ou inseguras.",
            },
            {
              title: "Copiar a metodologia",
              goal: "Verificar se a nota exportada diferencia evidências, lacunas, limites, QA e acompanhamentos.",
              success: "A pessoa reaproveitaria pelo menos parte da nota em uma seção real de transparência/metodologia.",
            },
          ],
          questions: [
            "Onde você se sentiu mais orientada ou mais perdida?",
            "O termo 'bloco de evidência' faz sentido ou deveria mudar?",
            "Fontes, pedidos, lacunas e afirmações estão claramente separados?",
            "A ferramenta parece útil ou parece burocracia extra?",
            "O que deveria ser automatizado depois, e o que deve continuar sob controle da repórter?",
          ],
          acceptanceCriteria: [
            "A pessoa entende o estado de uma investigação em menos de dois minutos.",
            "A pessoa identifica pelo menos uma ação pendente sem explicação externa.",
            "A pessoa entende lacunas como problemas de evidência pendentes, não acusações automáticas.",
            "A pessoa entende que rascunhos de follow-up não são enviados automaticamente.",
            "A pessoa percebe os exemplos Brasil e EUA como o mesmo método adaptado localmente.",
          ],
        }
      : state.locale === "es"
        ? {
            tasks: [
              {
                title: "Abrir la investigacion de Brasil",
                goal: "Verificar si una periodista entiende respuestas parciales de LAI, anexos ausentes y pasos de escalamiento.",
                success: "La persona puede identificar al menos un vacio de evidência y una próxima accion segura.",
              },
              {
                title: "Abrir la investigacion de Estados Unidos",
                goal: "Verificar si el mismo flujo funciona fuera de Brasil con registros públicos, contratos y actas escolares.",
                success: "La persona entiende que el estado/jurisdiccion debe definirse antes de confiar en plazos o recursos.",
              },
              {
                title: "Revisar una afirmacion",
                goal: "Verificar si la fuerza de la afirmacion, el riesgo y las evidências de apoyo son faciles de entender.",
                success: "La persona puede decir que afirmaciones estan listas, parciales o inseguras.",
              },
              {
                title: "Copiar la metodologia",
                goal: "Verificar si la nota exportada diferencia evidências, vacios, limites, QA y seguimientos.",
                success: "La persona reutilizaria al menos parte de la nota en una seccion real de transparência/metodologia.",
              },
            ],
            questions: [
              "Donde te sentiste mas orientada o mas perdida?",
              "El termino 'bloque de evidência' funciona o deberia cambiar?",
              "Fuentes, solicitudes, vacios y afirmaciones estan claramente separados?",
              "La herramienta parece útil o parece burocracia extra?",
              "Que deberia automatizarse despues, y que debe seguir bajo control de la repórtera?",
            ],
            acceptanceCriteria: [
              "La persona entiende el estado de una investigacion en menos de dos minutos.",
              "La persona identifica al menos una accion pendiente sin explicacion externa.",
              "La persona entiende los vacios como problemas de evidência pendientes, no acusaciones automáticas.",
              "La persona entiende que los borradores de seguimiento no se envian automaticamente.",
              "La persona percibe los ejemplos Brasil y EE. UU. como el mismo metodo adaptado localmente.",
            ],
          }
      : testPlan;
  const localizedRoadmap =
    state.locale === "pt"
      ? [
          {
            phase: "v0.1 protótipo estático",
            status: "Atual",
            goal:
              "Validar o fluxo de apuração, idioma, filtros, acompanhamento de pedidos, lacunas, afirmações e exportação metodológica sem backend ou IA.",
            ownerQuestion: "Jornalistas entendem a estrutura rápido o suficiente para usar em uma investigação real?",
          },
          {
            phase: "v0.2 persistência",
            status: "Próximo",
            goal: "Adicionar investigações salvas, fontes editáveis, logs manuais de pedidos, respostas, lacunas e afirmações.",
            ownerQuestion: "Uma repórter consegue manter um caso real atualizado sem voltar para planilhas e notas espalhadas?",
          },
          {
            phase: "v0.3 revisão assistida",
            status: "Depois",
            goal:
              "Adicionar IA limitada para comparação pedido-resposta, identificação de lacunas, resumo de respostas e rascunhos revisados pela repórter.",
            ownerQuestion: "Quais etapas são seguras para automatizar, e quais devem permanecer sob controle editorial?",
          },
        ]
      : state.locale === "es"
        ? [
            {
              phase: "v0.1 protótipo estático",
              status: "Actual",
              goal:
                "Validar el flujo de investigacion, idioma, filtros, seguimiento de solicitudes, vacios, afirmaciones y exportacion metodológica sin backend o IA.",
              ownerQuestion: "Periodistas entienden la estructura suficientemente rapido para usarla en una investigacion real?",
            },
            {
              phase: "v0.2 persistência",
              status: "Próximo",
              goal: "Agregar investigaciones guardadas, fuentes editables, registros manuales de solicitudes, respuestas, vacios y afirmaciones.",
              ownerQuestion: "Una repórtera puede mantener un caso real actualizado sin volver a planillas y notas dispersas?",
            },
            {
              phase: "v0.3 revision asistida",
              status: "Despues",
              goal:
                "Agregar IA limitada para comparacion solicitud-respuesta, identificacion de vacios, resumenes de respuestas y borradores revisados por la repórtera.",
              ownerQuestion: "Que etapas son seguras para automatizar, y cuales deben permanecer bajo control editorial?",
            },
          ]
      : roadmap;
  const cards = filteredInvestigations
    .map(
      (item) => `
        <article class="investigation-card">
          <div class="card-kicker">${item.country} / ${item.jurisdiction}</div>
          <h2>${item.title}</h2>
          <p>${item.centralQuestion}</p>
          <div class="metrics-grid compact">
            <div><strong>${item.requests.length}</strong><span>${t("requests")}</span></div>
            <div><strong>${countRequestFollowUps(item)}</strong><span>${t("followUps")}</span></div>
            <div><strong>${countQaBlockers(item)}</strong><span>${t("qaBlockers")}</span></div>
          </div>
          <div class="card-footer">
            <span class="pill ${statusClass(item.status)}">${item.status}</span>
            <button class="button" data-action="open" data-id="${item.id}">${t("openInvestigation")}</button>
          </div>
        </article>
      `,
    )
    .join("");
  const emptyState = `
    <section class="empty-state">
      <h3>${t("emptyTitle")}</h3>
      <p>${t("emptyCopy")}</p>
      <button class="button secondary active-secondary" data-action="clear-filters">${t("clearFilters")}</button>
    </section>
  `;
  const tasks = localizedTestPlan.tasks
    .map(
      (task, index) => `
        <article class="test-task">
          <span>${index + 1}</span>
          <div>
            <h3>${task.title}</h3>
            <p>${task.goal}</p>
            <strong>${task.success}</strong>
          </div>
        </article>
      `,
    )
    .join("");
  const questions = localizedTestPlan.questions.map((question) => `<li>${question}</li>`).join("");
  const criteria = localizedTestPlan.acceptanceCriteria.map((criterion) => `<li>${criterion}</li>`).join("");
  const roadmapCards = localizedRoadmap
    .map(
      (item) => `
        <article class="panel roadmap-card">
          <div class="card-footer top">
            <div>
              <p class="eyebrow">${item.phase}</p>
              <h3>${item.goal}</h3>
            </div>
            <span class="pill ${statusClass(item.status)}">${item.status}</span>
          </div>
          <p><strong>${t("validationQuestion")}:</strong> ${item.ownerQuestion}</p>
        </article>
      `,
    )
    .join("");
  const coverageCards = mvpCoverage
    .map((item) => {
      const area = item.area[state.locale] || item.area.pt || item.area.en;
      const expected = item.expected[state.locale] || item.expected.pt || item.expected.en;
      const implementation = item.implementation[state.locale] || item.implementation.pt || item.implementation.en;
      const status = item.status[state.locale] || item.status.pt || item.status.en;

      return `
        <article class="panel coverage-card">
          <div class="card-footer top">
            <h3>${area}</h3>
            <span class="pill ${statusClass(status)}">${status}</span>
          </div>
          <dl class="detail-list">
            <div>
              <dt>${t("expectedInDoc")}</dt>
              <dd>${expected}</dd>
            </div>
            <div>
              <dt>${t("implementedInPrototype")}</dt>
              <dd>${implementation}</dd>
            </div>
          </dl>
        </article>
      `;
    })
    .join("");
  const limitCards = prototypeLimits
    .map((item) => {
      const area = item.area[state.locale] || item.area.pt || item.area.en;
      const current = item.current[state.locale] || item.current.pt || item.current.en;
      const next = item.next[state.locale] || item.next.pt || item.next.en;

      return `
        <article class="panel limit-card">
          <h3>${area}</h3>
          <dl class="detail-list">
            <div>
              <dt>${t("currentBehavior")}</dt>
              <dd>${current}</dd>
            </div>
            <div>
              <dt>${t("nextProductStep")}</dt>
              <dd>${next}</dd>
            </div>
          </dl>
        </article>
      `;
    })
    .join("");

  renderShell(`
    <main class="page dashboard">
      <section class="hero">
        <div>
          <p class="eyebrow">${t("heroEyebrow")}</p>
          <h1>${t("heroTitle")}</h1>
          <p>${t("heroCopy")}</p>
        </div>
        <div class="hero-panel">
          <strong>${t("prototypeGoal")}</strong>
          <span>${t("prototypeGoalText")}</span>
        </div>
      </section>
      <section class="section-header">
        <div>
          <p class="eyebrow">${t("investigations")}</p>
          <h2>${t("testCases")}</h2>
          <p class="muted">${filteredInvestigations.length} / ${investigations.length} ${t("shown")}</p>
          <p class="muted">${t("localSaveNote")}</p>
        </div>
        <div class="button-row">
          <button class="button secondary active-secondary" data-action="import-json">${t("importJson")}</button>
          <button class="button secondary" data-action="reset-local-data">${t("resetLocalData")}</button>
          <button class="button secondary active-secondary" data-action="new-investigation">${t("newInvestigation")}</button>
          <input class="visually-hidden" type="file" accept="application/json,.json" data-role="json-import">
        </div>
      </section>
      <section class="filter-bar" aria-label="Investigation filters">
        ${renderFilterSelect("status", t("status"))}
        ${renderFilterSelect("country", t("country"))}
        ${renderFilterSelect("language", t("language"))}
        ${renderFilterSelect("topic", t("topic"))}
        <button class="button secondary active-secondary" data-action="clear-filters">${t("reset")}</button>
      </section>
      ${cards ? `<section class="cards-grid">${cards}</section>` : emptyState}
      <section class="coverage-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">${t("mvpCoverage")}</p>
            <h2>${t("mvpCoverageTitle")}</h2>
          </div>
          <span class="pill neutral">${t("mvpCoverageBadge")}</span>
        </div>
        <div class="coverage-grid">${coverageCards}</div>
      </section>
      <section class="limits-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">${t("prototypeLimits")}</p>
            <h2>${t("prototypeLimitsTitle")}</h2>
          </div>
        </div>
        <div class="limits-grid">${limitCards}</div>
      </section>
      <section class="roadmap-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">${t("buildRoadmap")}</p>
            <h2>${t("roadmapTitle")}</h2>
          </div>
          <span class="pill neutral">${t("fellowshipScope")}</span>
        </div>
        <div class="roadmap-grid">${roadmapCards}</div>
      </section>
      <section class="tester-guide">
        <div class="section-header">
          <div>
            <p class="eyebrow">${t("testingGuide")}</p>
            <h2>${t("testingTitle")}</h2>
          </div>
          <span class="pill neutral">${t("testScript")}</span>
        </div>
        <div class="tester-grid">
          <div class="panel">
            <h3>${t("coreTasks")}</h3>
            <div class="test-task-list">${tasks}</div>
          </div>
          <div class="panel">
            <h3>${t("feedbackQuestions")}</h3>
            <ul class="review-list">${questions}</ul>
          </div>
          <div class="panel">
            <h3>${t("acceptanceCriteria")}</h3>
            <ul class="review-list">${criteria}</ul>
          </div>
        </div>
      </section>
    </main>
  `);
}

function renderNewInvestigation() {
  const fields = [
    ["title", t("investigationTitle"), t("investigationTitlePlaceholder")],
    ["country", t("country"), t("countryPlaceholder")],
    ["jurisdiction", t("jurisdictionLocality"), t("jurisdictionPlaceholder")],
    ["language", t("primaryLanguage"), t("primaryLanguagePlaceholder")],
    ["topic", t("generalTopic"), t("topicPlaceholder")],
    ["territory", t("investigatedTerritory"), t("territoryPlaceholder")],
    ["period", t("investigatedPeriod"), t("periodPlaceholder")],
  ];
  const errors = state.draftErrors.map((error) => `<li>${error}</li>`).join("");

  renderShell(`
    <main class="page">
      <section class="content-header create-header">
        <div>
          <p class="eyebrow">${t("newInvestigation")}</p>
          <h1>${t("createTitle")}</h1>
          <p>${t("createCopy")}</p>
        </div>
        <button class="button secondary active-secondary" data-action="dashboard">${t("cancel")}</button>
      </section>
      ${errors ? `<section class="error-box"><strong>${t("reviewBeforeContinue")}</strong><ul>${errors}</ul></section>` : ""}
      ${state.draftNotice ? `<section class="success-box"><strong>${state.draftNotice}</strong></section>` : ""}
      <section class="create-grid">
        <form class="panel create-form" data-action="draft-form">
          <div class="form-grid">
            ${fields
              .map(
                ([id, label, placeholder]) => `
                  <label>
                    <span>${label}</span>
                    <input data-field="${id}" value="${escapeHtml(state.draft[id])}" placeholder="${placeholder}">
                  </label>
                `,
              )
              .join("")}
          </div>
          <label>
            <span>${t("centralInvestigativeQuestion")}</span>
            <textarea data-field="centralQuestion" rows="4" placeholder="${t("centralQuestionPlaceholder")}">${escapeHtml(state.draft.centralQuestion)}</textarea>
            <small>${t("centralQuestionHelp")}</small>
          </label>
          <label>
            <span>${t("shortDescription")}</span>
            <textarea data-field="description" rows="3" placeholder="${t("descriptionPlaceholder")}">${escapeHtml(state.draft.description)}</textarea>
          </label>
          <div class="form-actions">
            <button class="button" data-action="validate-draft" type="button">${t("validateStructure")}</button>
            <button class="button secondary active-secondary" data-action="create-investigation" type="button">${t("createInvestigation")}</button>
          </div>
        </form>
        <aside class="panel preview-panel">
          <p class="eyebrow">${t("workspacePreview")}</p>
          <h2>${escapeHtml(state.draft.title) || t("untitledInvestigation")}</h2>
          <dl class="detail-list">
            <div><dt>${t("countryJurisdiction")}</dt><dd>${previewValue(state.draft.country)} / ${previewValue(state.draft.jurisdiction)}</dd></div>
            <div><dt>${t("language")}</dt><dd>${previewValue(state.draft.language)}</dd></div>
            <div><dt>${t("topic")}</dt><dd>${previewValue(state.draft.topic)}</dd></div>
            <div><dt>${t("territory")}</dt><dd>${previewValue(state.draft.territory)}</dd></div>
            <div><dt>${t("period")}</dt><dd>${previewValue(state.draft.period)}</dd></div>
          </dl>
          <div class="preview-question">
            <strong>${t("centralQuestion")}</strong>
            <p>${escapeHtml(state.draft.centralQuestion) || t("centralQuestionPlaceholder")}</p>
          </div>
          <div class="starter-stack">
            <h3>${t("starterStructure")}</h3>
            <span class="pill neutral">${t("hypotheses")}</span>
            <span class="pill neutral">${t("evidenceBlocks")}</span>
            <span class="pill neutral">${t("sourcesDatabases")}</span>
            <span class="pill neutral">${t("requests")}</span>
            <span class="pill neutral">${t("gaps")}</span>
            <span class="pill neutral">${t("claims")}</span>
          </div>
        </aside>
      </section>
    </main>
  `);
}

function previewValue(value) {
  return escapeHtml(value) || t("notSet");
}

function helpTip(text) {
  return `
    <span class="help-tip">
      <button class="help-button" type="button" aria-label="${escapeHtml(text)}">?</button>
      <span class="help-popover" role="tooltip">${escapeHtml(text)}</span>
    </span>
  `;
}

function renderAddDisclosure({ eyebrow, title, copy, notice, success, content }) {
  return `
    <details class="add-disclosure" ${notice ? "open" : ""}>
      <summary>
        <span>
          <span class="eyebrow">${eyebrow}</span>
          <strong>${title}</strong>
        </span>
        ${helpTip(copy)}
      </summary>
      <p class="disclosure-copy">${copy}</p>
      ${notice ? `<section class="${notice === success ? "success-box" : "error-box"}"><strong>${notice}</strong></section>` : ""}
      ${content}
    </details>
  `;
}

function validateDraft() {
  const required = [
    ["title", t("errorTitleRequired")],
    ["country", t("errorCountryRequired")],
    ["language", t("errorLanguageRequired")],
    ["centralQuestion", t("errorQuestionRequired")],
  ];
  const errors = required
    .filter(([field]) => !state.draft[field].trim())
    .map(([, message]) => message);

  if (state.draft.title.trim() && state.draft.title.trim().split(/\s+/).length < 3) {
    errors.push(t("errorTitleSpecific"));
  }

  if (state.draft.centralQuestion.trim() && !state.draft.centralQuestion.includes("?")) {
    errors.push(t("errorQuestionMark"));
  }

  state.draftErrors = errors;
  state.draftNotice = errors.length ? "" : t("draftReady");
}

function renderInvestigation() {
  const item = getCurrentInvestigation();
  const tabGroups = [
    {
      label: t("navGroupStart"),
      tabs: [
        ["overview", t("overview")],
        ["context", t("context")],
      ],
    },
    {
      label: t("navGroupInvestigate"),
      tabs: [
        ["plan", t("planTab")],
        ["requests", t("requestsWorkspace")],
      ],
    },
    {
      label: t("navGroupDecide"),
      tabs: [
        ["editorial", t("editorialWorkspace")],
        ["claims", t("claims")],
      ],
    },
    {
      label: t("navGroupExport"),
      tabs: [
        ["story", t("storyTab")],
        ["methodology", t("methodology")],
        ["qa", "QA"],
      ],
    },
  ];
  const tabs = tabGroups.flatMap((group) => group.tabs);

  if (!tabs.some(([id]) => id === state.currentTab)) {
    state.currentTab = "overview";
  }

  const nav = tabGroups
    .map(
      (group) => `
        <section class="tab-group">
          <p>${group.label}</p>
          ${group.tabs
            .map(
              ([id, label]) => `
                <button class="tab ${state.currentTab === id ? "active" : ""}" data-action="tab" data-tab="${id}">
                  ${label}
                </button>
              `,
            )
            .join("")}
        </section>
      `,
    )
    .join("");

  renderShell(`
    <main class="workspace">
      <aside class="sidebar">
        <button class="back-link" data-action="dashboard">${t("back")}</button>
        <div class="project-card">
          <p class="eyebrow">${item.country} / ${item.language}</p>
          <h1>${item.title}</h1>
          <span class="pill ${statusClass(item.status)}">${item.status}</span>
        </div>
        ${renderTabGuide()}
        <nav class="tabs">${nav}</nav>
      </aside>
      <section class="content">
        ${renderDesktopTestRail(item, tabs)}
        ${renderMobileTabContext()}
        ${renderMobileFocusCard(item)}
        ${renderTab(item)}
      </section>
    </main>
  `);
}

function renderTab(item) {
  const renderers = {
    overview: renderOverview,
    context: renderContextWorkspace,
    plan: renderPlanningWorkspace,
    requests: renderRequestsWorkspace,
    editorial: renderEditorialWorkspace,
    claims: renderClaims,
    story: renderStoryWorkspace,
    qa: renderQaChecklist,
    methodology: renderMethodology,
  };
  return renderers[state.currentTab](item);
}

function renderTabGuide() {
  const guideByTab = {
    overview: t("tabGuideOverview"),
    context: t("tabGuideContext"),
    plan: t("tabGuidePlan"),
    requests: t("tabGuideRequests"),
    editorial: t("tabGuideEditorial"),
    claims: t("tabGuideClaims"),
    story: t("tabGuideStory"),
    qa: t("tabGuideQa"),
    methodology: t("tabGuideMethodology"),
  };

  return `
    <aside class="tab-guide">
      <p class="eyebrow">${t("tabGuideTitle")}</p>
      <p>${guideByTab[state.currentTab] || guideByTab.overview}</p>
    </aside>
  `;
}

function renderDesktopTestRail(item, tabs) {
  const labels = Object.fromEntries(tabs);
  const currentIndex = Math.max(
    0,
    tabs.findIndex(([id]) => id === state.currentTab),
  );
  const nextTab = tabs[currentIndex + 1] || tabs[0];
  const openRisks = countOpenGaps(item) + countClaimsNeedingCare(item) + countQaBlockers(item);

  return `
    <section class="desktop-test-rail">
      <div>
        <p class="eyebrow">${t("desktopTestRail")}</p>
        <h2>${labels[state.currentTab] || labels.overview}</h2>
        <p>${t("desktopTestRailHeading")}</p>
      </div>
      <div class="test-rail-meta">
        <span class="pill neutral">${t("tabProgress")}: ${currentIndex + 1}/${tabs.length}</span>
        <span class="pill ${openRisks ? "danger" : "success"}">${openRisks} ${t("summaryRisk").toLowerCase()}</span>
        <span class="pill ${countLateRequests(item) ? "danger" : "success"}">${countLateRequests(item)} ${t("lateRequests")}</span>
      </div>
      <div class="test-rail-actions">
        <button class="button secondary active-secondary" data-action="tab" data-tab="${nextTab[0]}">${t("nextArea")}: ${nextTab[1]}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="qa">${t("openQaCheck")}</button>
        <button class="button" data-action="tab" data-tab="methodology">${t("openMethodologyNote")}</button>
      </div>
      <small>${t("desktopHint")}</small>
    </section>
  `;
}

function renderMobileTabContext() {
  const labels = {
    overview: t("overview"),
    context: t("context"),
    plan: t("planTab"),
    requests: t("requestsWorkspace"),
    editorial: t("editorialWorkspace"),
    claims: t("claims"),
    story: t("storyTab"),
    qa: "QA",
    methodology: t("methodology"),
  };
  const guideByTab = {
    overview: t("tabGuideOverview"),
    context: t("tabGuideContext"),
    plan: t("tabGuidePlan"),
    requests: t("tabGuideRequests"),
    editorial: t("tabGuideEditorial"),
    claims: t("tabGuideClaims"),
    story: t("tabGuideStory"),
    qa: t("tabGuideQa"),
    methodology: t("tabGuideMethodology"),
  };

  return `
    <section class="mobile-tab-context">
      <p class="eyebrow">${t("currentArea")}</p>
      <h2>${labels[state.currentTab] || labels.overview}</h2>
      <p>${guideByTab[state.currentTab] || guideByTab.overview}</p>
      <small>${t("mobileNavHint")}</small>
    </section>
  `;
}

function renderMobileFocusCard(item) {
  const draft = getStoryDraft(item);
  const queue = getEditorialQueue(item);
  const nextItem = queue.deadlineItems[0] || queue.reviewItems[0] || queue.actionItems[0];
  const firstBlocker = draft.sections?.find((section) => statusClass(section.status) !== "success") || draft.sections?.[0];
  const blocker = firstBlocker?.blocker || item.gaps?.[0]?.description || t("noImmediateAction");

  return `
    <section class="mobile-focus-card">
      <p class="eyebrow">${t("mobileFocusTitle")}</p>
      <h2>${t("mobileFocusHeading")}</h2>
      <dl class="mobile-focus-list">
        <div>
          <dt>${t("workingThesis")}</dt>
          <dd>${draft.workingThesis}</dd>
        </div>
        <div>
          <dt>${t("mobileNextDecision")}</dt>
          <dd>${nextItem?.title || draft.editorQuestion}</dd>
        </div>
        <div>
          <dt>${t("mobilePublicationBlocker")}</dt>
          <dd>${blocker}</dd>
        </div>
      </dl>
      <div class="mobile-focus-actions">
        <button class="button secondary active-secondary" data-action="tab" data-tab="story">${t("mobileOpenStory")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="requests">${t("mobileContinueReporting")}</button>
        <button class="button" data-action="tab" data-tab="claims">${t("mobileReviewClaims")}</button>
      </div>
    </section>
  `;
}

function renderContextWorkspace(item) {
  return `
    ${renderJurisdiction(item)}
    ${renderLanguagePlan(item)}
  `;
}

function renderPlanningWorkspace(item) {
  return `
    ${renderPlanAddForms()}
    ${renderReportingMap(item)}
    ${renderEvidenceInventory(item)}
    ${renderSources(item)}
  `;
}

function renderPlanAddForms() {
  return renderAddDisclosure({
    eyebrow: t("addToPlan"),
    title: t("workflowPlanTitle"),
    copy: t("workflowPlanCopy"),
    notice: state.planNotice,
    success: t("itemAdded"),
    content: `
      <section class="plan-form-grid">
      <article class="panel create-form plan-add-form">
        <h3>${t("addHypothesisTitle")}</h3>
        <label>
          <span>${t("hypothesisTextLabel")}</span>
          <textarea data-plan-field="hypothesisText" rows="3" placeholder="${t("hypothesisTextPlaceholder")}">${escapeHtml(state.planDraft.hypothesisText)}</textarea>
        </label>
        <label>
          <span>${t("hypothesisEvidenceLabel")}</span>
          <input data-plan-field="hypothesisEvidence" value="${escapeHtml(state.planDraft.hypothesisEvidence)}" placeholder="${t("hypothesisEvidencePlaceholder")}">
        </label>
        <label>
          <span>${t("hypothesisStatusLabel")}</span>
          <input data-plan-field="hypothesisStatus" value="${escapeHtml(state.planDraft.hypothesisStatus)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
        <button class="button secondary active-secondary" data-action="add-hypothesis" type="button">${t("addHypothesis")}</button>
      </article>
      <article class="panel create-form plan-add-form">
        <h3>${t("addEvidenceBlockTitle")}</h3>
        <label>
          <span>${t("evidenceTypeLabel")}</span>
          <textarea data-plan-field="evidenceType" rows="3" placeholder="${t("evidenceTypePlaceholder")}">${escapeHtml(state.planDraft.evidenceType)}</textarea>
        </label>
        <label>
          <span>${t("evidencePriorityLabel")}</span>
          <input data-plan-field="evidencePriority" value="${escapeHtml(state.planDraft.evidencePriority)}" list="priority-options" placeholder="${t("priorityPrefix")}">
        </label>
        <label>
          <span>${t("evidenceStatusLabel")}</span>
          <input data-plan-field="evidenceStatus" value="${escapeHtml(state.planDraft.evidenceStatus)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
        <button class="button secondary active-secondary" data-action="add-evidence-block" type="button">${t("mapEvidence")}</button>
      </article>
      <article class="panel create-form plan-add-form">
        <h3>${t("addSourceTitle")}</h3>
        <label>
          <span>${t("sourceNameLabel")}</span>
          <input data-plan-field="sourceName" value="${escapeHtml(state.planDraft.sourceName)}" placeholder="${t("sourceNamePlaceholder")}">
        </label>
        <div class="form-grid compact-form-grid">
          <label>
            <span>${t("sourceTypeLabel")}</span>
            <input data-plan-field="sourceType" value="${escapeHtml(state.planDraft.sourceType)}" placeholder="${t("sourcesDatabases")}">
          </label>
          <label>
            <span>${t("sourceStatusLabel")}</span>
            <input data-plan-field="sourceStatus" value="${escapeHtml(state.planDraft.sourceStatus)}" list="status-options" placeholder="${t("reviewRecommended")}">
          </label>
        </div>
        <label>
          <span>${t("sourceUseLabel")}</span>
          <textarea data-plan-field="sourceUse" rows="3" placeholder="${t("sourceUsePlaceholder")}">${escapeHtml(state.planDraft.sourceUse)}</textarea>
        </label>
        <label>
          <span>${t("sourceLimitsLabel")}</span>
          <textarea data-plan-field="sourceLimits" rows="2" placeholder="${t("sourceLimitsPlaceholder")}">${escapeHtml(state.planDraft.sourceLimits)}</textarea>
        </label>
        <button class="button secondary active-secondary" data-action="add-source" type="button">${t("addSourceTitle")}</button>
      </article>
      </section>
    `,
  });
}

function renderRequestsWorkspace(item) {
  return `
    ${renderRequestAddForm()}
    ${renderRequestsCommandCenter(item)}
    ${renderLaiAssistant(item)}
    <details class="panel"><summary>Visão geral dos pedidos e prazos</summary>
    ${renderRequestBoard(item)}
    ${renderResponses(item)}
    ${renderDeadlines(item)}
    </details>
    <details class="panel"><summary>Comparações anteriores e registros complementares</summary>
    ${renderRequestComparison(item)}
    ${renderFollowUps(item)}
    </details>
    <details class="panel"><summary>Diário de transparência desta reportagem</summary>
    ${renderTransparencyLog(item)}
    </details>
  `;
}

function renderLaiDeadline(request) {
  const config = request.deadlineConfig || {};
  const info = getDeadlineInfo(request, todayIsoDate());
  const label = info.kind === 'checkpoint' ? 'Etapa atual registrada' : info.kind === 'registered' ? 'Prazo registrado' : info.kind === 'reference' ? 'Data de referência, a confirmar' : 'Prazo não informado';
  return `<section class="lai-deadline">
    <p><strong>${label}:</strong> ${escapeHtml(info.date || '—')}</p>
    ${info.discrepancy ? '<p class="notice">A data registrada difere da referência calculada. Confira o protocolo; o registro foi preservado.</p>' : ''}
    <details><summary>Configurar prazo e consultar a regra</summary>
      <label>Regra de acompanhamento<select data-lai-rule>
        <option value="manual" ${config.rule !== 'br-lai-reference' ? 'selected' : ''}>Usar a data do protocolo</option>
        <option value="br-lai-reference" ${config.rule === 'br-lai-reference' ? 'selected' : ''}>LAI brasileira — calcular referência</option>
      </select></label>
      <label>Data de recebimento pelo órgão<input type="date" data-lai-received-date value="${escapeHtml(config.receivedDate || '')}"></label>
      <label>Prazo confirmado no protocolo<input type="date" data-lai-confirmed-date value="${escapeHtml(config.confirmedDueDate || (parseDate(request.dueDate) ? request.dueDate : ''))}"></label>
      <label><input type="checkbox" data-lai-extension ${config.extension ? 'checked' : ''}> O órgão comunicou prorrogação com justificativa</label>
      <label>Justificativa da prorrogação<textarea data-lai-extension-reason rows="2">${escapeHtml(config.extensionReason || '')}</textarea></label>
      <label>Data da comunicação de prorrogação<input type="date" data-lai-extension-date value="${escapeHtml(config.extensionNotifiedDate || '')}"></label>
      ${info.reference ? `<p>Referência original: ${escapeHtml(info.originalReference)}${info.extensionDocumented ? ` · com prorrogação documentada: ${escapeHtml(info.reference)}` : ''}.</p>` : ''}
      <p>${escapeHtml(LAI_REFERENCE.explanation)}</p>
      <p>A referência soma dias corridos a partir do dia seguinte ao recebimento. Feriados, expediente, suspensões e regras específicas não são ajustados. Confirme a data no canal competente; o cálculo não decide se cabe recurso.</p>
      <a href="${LAI_REFERENCE.source}" target="_blank" rel="noopener noreferrer">Consultar art. 11 da Lei 12.527/2011</a>
      <p>Recursos e reclamações dependem da esfera, do poder e da instância. A regra brasileira não é aplicada automaticamente a pedidos FOIA.</p>
      <p data-lai-deadline-notice role="status"></p>
      <button type="button" class="button secondary" data-action="save-lai-deadline">Salvar acompanhamento</button>
    </details></section>`;
}

function saveLaiDeadline(card) {
  const item = getCurrentInvestigation();
  const index = Number(card.dataset.laiRequest);
  const request = item.requests[index];
  const config = {
    rule: card.querySelector('[data-lai-rule]').value,
    receivedDate: card.querySelector('[data-lai-received-date]').value,
    confirmedDueDate: card.querySelector('[data-lai-confirmed-date]').value,
    extension: card.querySelector('[data-lai-extension]').checked,
    extensionReason: card.querySelector('[data-lai-extension-reason]').value.trim(),
    extensionNotifiedDate: card.querySelector('[data-lai-extension-date]').value,
  };
  const invalid = (config.rule === 'br-lai-reference' && !parseDate(config.receivedDate)) ||
    (config.confirmedDueDate && !parseDate(config.confirmedDueDate)) ||
    (config.extension && (!config.extensionReason || !parseDate(config.extensionNotifiedDate)));
  if (invalid) {
    card.querySelector('[data-lai-deadline-notice]').textContent = 'Informe o recebimento para calcular a referência e a justificativa/data para registrar a prorrogação.';
    return;
  }
  if (JSON.stringify(request.deadlineConfig) === JSON.stringify(config)) return;
  request.deadlineConfig = config;
  if (config.confirmedDueDate) request.dueDate = config.confirmedDueDate;
  const info = getDeadlineInfo(request, todayIsoDate());
  item.transparencyLog = [...(item.transparencyLog || []), {
    date: todayIsoDate(), actor: 'Repórter', requestIndex: index, origin: 'deadline-config',
    event: `Acompanhamento atualizado: ${request.title}. Prazo registrado: ${config.confirmedDueDate || (parseDate(request.dueDate) ? request.dueDate : 'não informado')}. Referência calculada: ${info.reference || 'não calculada'}.`,
    status: 'Conferir no protocolo', nextStep: 'Verificar regras e calendário do órgão antes de agir sobre o prazo.',
    deadlineConfig: { ...config },
  }];
  touchInvestigation(item);
  renderInvestigation();
}

function renderLaiAssistant(item) {
  return `<section class="lai-assistant">
    <p class="eyebrow">${t("laiAssistantTitle")}</p>
    <h3>Pedido → resposta → próxima ação</h3>
    <p role="note" data-lai-service-status>Verificando disponibilidade da análise por IA…</p>
    <div class="lai-assistant-grid">${(item.requests || []).map((request, index) => {
      const reviews = (item.laiReviews || []).filter(entry => entry.requestIndex === index).toSorted((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
      const review = reviews.at(-1);
      return `<article class="lai-review-card" data-lai-request="${index}">
        <h3>${escapeHtml(request.title)}</h3>
        <p>${escapeHtml(request.agency)} · ${escapeHtml(request.protocol)}</p>
        <details><summary>Ver pedido original</summary><p>${escapeHtml(request.requestedItems)}</p></details>
        ${renderLaiDeadline(request)}
        ${review ? `<p class="pill">${escapeHtml(review.label)}</p><p>${escapeHtml(review.nextStep)}</p><details><summary>Ver última conferência</summary><p>${escapeHtml(review.date)}</p><p>${escapeHtml(review.response)}</p>${review.attachments ? `<details><summary>Anexos usados nesta conferência</summary><textarea rows="6" readonly>${escapeHtml(review.attachments)}</textarea>${(review.importedFiles || []).map(file => `<p>${escapeHtml(file.fileName)} · SHA-256: ${escapeHtml(file.sha256)}</p>`).join('')}${review.importedTextEdited ? '<p>O texto foi editado após a importação. O checksum identifica o arquivo original.</p>' : ''}</details>` : ''}<p>${escapeHtml(review.notes)}</p>${review.analysis ? `<p>Conferência assistida por IA, salva pela repórter.</p><p>${escapeHtml(review.analysis.summary)}</p>${review.analysis.draft ? `<label>Texto-base salvo<textarea rows="6" readonly>${escapeHtml(review.analysis.draft)}</textarea></label>` : ''}` : ''}</details>` : '<p>Resposta ainda não conferida neste fluxo.</p>'}
        <details><summary>Registrar resposta ou ocorrência</summary>
          <label>Data da ocorrência<input type="date" data-lai-date value="${todayIsoDate()}"></label>
          <label>O que aconteceu?<select data-lai-scenario>
            <option value="response">Recebi uma resposta</option>
            <option value="silence">Ainda não houve resposta</option>
            <option value="denied">Acesso negado</option>
            <option value="inaccessible">Link ou anexo inacessível</option>
          </select></label>
          <label>Resposta integral ou descrição da ocorrência<textarea data-lai-response rows="5"></textarea></label>
          <label>Importar anexos<input type="file" data-lai-files multiple accept=".pdf,.txt,.csv,.tsv,.json,.md"></label>
          <p>Textos são lidos neste navegador. PDFs precisam do extrator local; até 5 MB por arquivo. Não há OCR. Confira o texto extraído antes de analisar.</p>
          <p data-lai-file-notice role="status"></p>
          <label>Conteúdo dos anexos (texto transcrito)<textarea data-lai-attachments rows="4" placeholder="Cole o conteúdo consultado. Links e arquivos não transcritos não serão analisados."></textarea></label>
          <p>Ao analisar, o pedido, a resposta e os textos dos anexos serão enviados ao serviço de IA. Confira os dados antes de enviar.</p>
          <button type="button" class="button secondary" data-action="analyze-lai" disabled>Analisar pedido × resposta com IA</button>
          <div data-lai-analysis aria-live="polite"></div>
          <label>Conferência item a item<textarea data-lai-notes rows="4" placeholder="Compare cada item do pedido: entregue, ausente ou inconclusivo. Registre os arquivos consultados."></textarea></label>
          <label>Resultado da sua conferência<select data-lai-result>
            <option value="unknown">Ainda não consigo avaliar</option>
            <option value="partial">Faltam itens solicitados</option>
            <option value="complete">Todos os itens e anexos foram conferidos</option>
          </select></label>
          <p data-lai-notice role="status"></p>
          <button type="button" class="button secondary" data-action="save-lai-review">Salvar no histórico do pedido</button>
        </details>
      </article>`;
    }).join("") || '<p>Registre seu primeiro pedido para começar.</p>'}</div>
  </section>`;
}

function saveLaiReview(card) {
  const item = getCurrentInvestigation();
  const requestIndex = Number(card.dataset.laiRequest);
  const request = item.requests[requestIndex];
  const response = card.querySelector('[data-lai-response]').value.trim();
  const notes = card.querySelector('[data-lai-notes]').value.trim();
  const date = card.querySelector('[data-lai-date]').value;
  const scenario = card.querySelector('[data-lai-scenario]').value;
  const result = card.querySelector('[data-lai-result]').value;
  if (!response || !parseDate(date) || (scenario === 'response' && result !== 'unknown' && !notes)) {
    card.querySelector('[data-lai-notice]').textContent = 'Informe a data, a ocorrência e a conferência que sustenta o resultado.';
    return;
  }
  const outcomes = {
    silence: ['Sem resposta', 'Confira o prazo aplicável e eventuais prorrogações no protocolo. Se estiver vencido, prepare a cobrança ou reclamação no canal competente.'],
    denied: ['Acesso negado', 'Registre a justificativa e a base legal informadas pelo órgão. Confira a instância e o prazo de recurso no canal oficial antes de preparar a contestação.'],
    inaccessible: ['Material inacessível', 'Peça reenvio dos arquivos ou acesso sem restrição; guarde o endereço, a mensagem de erro e a data da tentativa.'],
    unknown: ['Conferência pendente', 'Compare cada item solicitado e abra os anexos antes de concluir sobre a completude.'],
    partial: ['Resposta parcial — conferência da repórter', 'Prepare uma complementação enumerando os itens ausentes. Confira se o caso exige recurso e qual é o prazo no protocolo.'],
    complete: ['Itens conferidos pela repórter', 'Encaminhe os documentos relevantes ao acervo de evidências e avalie o que sustentam na apuração.']
  };
  const [label, fallbackNextStep] = outcomes[scenario === 'response' ? result : scenario];
  const candidate = card.laiCandidate;
  const validCandidate = scenario === 'response' && candidate?.response === response && candidate?.attachments === card.querySelector('[data-lai-attachments]').value.trim();
  const analysis = validCandidate ? candidate.analysis : null;
  const nextStep = analysis?.nextStep || fallbackNextStep;
  const review = { requestIndex, requestTitle: request.title, date, scenario, result: scenario === 'response' ? result : 'unknown', response, notes, label, nextStep, origin: analysis ? 'ai-assisted-reporter-review' : 'reporter', analysis, attachments: card.querySelector('[data-lai-attachments]').value.trim(), importedFiles: card.importedFiles || [], importedTextEdited: Boolean(card.importedFiles?.length && card.importedAttachmentsText !== card.querySelector('[data-lai-attachments]').value), createdAt: new Date().toISOString() };
  item.laiReviews = [...(item.laiReviews || []), review];
  if (!request.operationalReview?.date || date >= request.operationalReview.date) {
    request.operationalReview = { date, scenario, result: review.result };
  }
  item.transparencyLog = [...(item.transparencyLog || []), { date, actor: request.agency, event: `${request.title} (${request.protocol}): ${response}`, status: label, nextStep, origin: 'lai-review', requestIndex }];
  touchInvestigation(item);
  renderInvestigation();
}

async function importLaiFiles(card, field) {
  const notice = card.querySelector('[data-lai-file-notice]');
  const target = card.querySelector('[data-lai-attachments]');
  const initialText = target.value;
  const files = [...field.files];
  if (!files.length) return;
  if (files.length > 10) { notice.textContent = 'Importe até 10 arquivos por vez.'; field.value = ''; return; }
  notice.textContent = 'Lendo anexos…';
  field.disabled = true;
  const imported = [], failures = [];
  try {
    for (const file of files) {
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error('acima de 5 MB');
        let text, metadata;
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (/\.pdf$/i.test(file.name)) {
          let binary = '';
          for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
          const res = await fetch('/api/lai/extract', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64: btoa(binary), fileName: file.name }), signal: AbortSignal.timeout(15000),
          });
          if (!res.headers.get('content-type')?.includes('application/json')) throw new Error('PDF exige o serviço local de extração');
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'PDF não pôde ser lido');
          text = result.text;
          metadata = { fileName: file.name, sha256: result.sha256, pages: result.pages, warning: result.warning, size: file.size };
        } else {
          if (!/\.(txt|csv|tsv|json|md)$/i.test(file.name)) throw new Error('formato não suportado');
          text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
          if (!text.trim() || text.includes('\u0000')) throw new Error('arquivo sem texto UTF-8 válido');
          const digest = await crypto.subtle.digest('SHA-256', bytes);
          metadata = { fileName: file.name, sha256: [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join(''), size: file.size };
        }
        const block = `[Arquivo: ${file.name}]\n${text}`;
        if ([initialText, ...imported.map(entry => entry.block), block].join('\n\n').length > 40000) throw new Error('ultrapassa o limite total de 40 mil caracteres; divida o material');
        imported.push({ block, metadata });
      } catch (error) {
        failures.push(`${file.name}: ${error.name === 'TypeError' || error.name === 'TimeoutError' ? 'extração indisponível; tente novamente' : error.message}`);
      }
    }
    if (!card.isConnected) return;
    if (target.value !== initialText) { notice.textContent = 'O texto dos anexos mudou durante a leitura. Nada foi substituído; importe novamente.'; return; }
    if (imported.length) {
      target.value = [initialText, ...imported.map(entry => entry.block)].filter(Boolean).join('\n\n');
      target.dispatchEvent(new Event('input', { bubbles: true }));
      card.importedFiles = [...(card.importedFiles || []), ...imported.map(entry => entry.metadata)];
      card.importedAttachmentsText = target.value;
    }
    notice.textContent = `${imported.length} arquivo(s) importado(s). ${imported.some(entry => entry.metadata.pages) ? 'Confira páginas, tabelas e imagens no original; não há OCR. ' : ''}${failures.length ? `Não importados: ${failures.join('; ')}` : 'Confira o texto antes de analisar. Os arquivos originais não são armazenados.'}`;
  } finally { field.disabled = false; field.value = ''; }
}

async function checkLaiService() {
  const notice = document.querySelector('[data-lai-service-status]');
  if (!notice) return;
  let available = false;
  let pdfExtraction = false;
  try {
    const response = await fetch('/api/lai/status', { signal: AbortSignal.timeout(4000) });
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
      const status = await response.json();
      available = status.available === true;
      pdfExtraction = status.pdfExtraction === true;
    }
  } catch { /* Static hosting remains usable without the analysis service. */ }
  if (!notice.isConnected) return;
  notice.textContent = available
    ? 'IA disponível para comparar os textos. Revise os trechos e confirme a conclusão antes de salvar.'
    : 'IA indisponível nesta hospedagem. Você pode registrar e conferir a resposta manualmente.';
  notice.textContent += pdfExtraction ? ' Extração de PDF disponível.' : ' Importação de texto disponível; extração de PDF indisponível.';
  document.querySelectorAll('[data-action="analyze-lai"]').forEach(button => { button.disabled = !available; });
}

async function analyzeLaiCard(card, button) {
  const notice = card.querySelector('[data-lai-notice]');
  const response = card.querySelector('[data-lai-response]').value.trim();
  const attachments = card.querySelector('[data-lai-attachments]').value.trim();
  if (!response || card.querySelector('[data-lai-scenario]').value !== 'response') {
    notice.textContent = 'Selecione “Recebi uma resposta” e cole o texto recebido para comparar.';
    return;
  }
  const item = getCurrentInvestigation();
  const request = item.requests[Number(card.dataset.laiRequest)].requestedItems;
  button.disabled = true;
  notice.textContent = 'Comparando os itens solicitados com os textos recebidos…';
  try {
    const res = await fetch('/api/lai/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request, response, attachments }), signal: AbortSignal.timeout(65000),
    });
    const data = await res.json();
    if (!res.ok || !data.analysis) throw new Error(data.error || 'Análise indisponível.');
    if (!card.isConnected) return;
    if (response !== card.querySelector('[data-lai-response]').value.trim() || attachments !== card.querySelector('[data-lai-attachments]').value.trim()) {
      notice.textContent = 'Os textos mudaram durante a análise. Analise novamente a versão atual.';
      return;
    }
    const analysis = data.analysis;
    card.laiCandidate = { response, attachments, analysis };
    const labels = { answered: 'Atendido no texto', missing: 'Não localizado', unclear: 'Inconclusivo' };
    card.querySelector('[data-lai-analysis]').innerHTML = `
      <h4>Comparação sugerida pela IA — confira os trechos</h4><p>${escapeHtml(analysis.summary)}</p>
      ${analysis.items.map(entry => `<article class="lai-analysis-item"><strong>${escapeHtml(entry.requested)}</strong><p>${labels[entry.status] || 'Inconclusivo'}</p>${entry.responseExcerpt ? `<blockquote>${escapeHtml(entry.responseExcerpt)}</blockquote>` : ''}<p>${escapeHtml(entry.reason)}</p></article>`).join('')}
      <p><strong>Próximo passo:</strong> ${escapeHtml(analysis.nextStep)}</p>
      <ul>${analysis.limitations.map(limit => `<li>${escapeHtml(limit)}</li>`).join('')}</ul>
      ${analysis.draft ? `<label>Texto-base para revisar e usar<textarea rows="6" readonly>${escapeHtml(analysis.draft)}</textarea></label>` : ''}`;
    const generatedNotes = analysis.items.map(entry => `${entry.requested}: ${labels[entry.status]}. ${entry.reason}`).join('\n');
    card.laiCandidate.generatedNotes = generatedNotes;
    card.querySelector('[data-lai-notes]').value = generatedNotes;
    // The model never confirms completeness on the reporter's behalf.
    card.querySelector('[data-lai-result]').value = 'unknown';
    notice.textContent = 'Análise pronta. Confira os itens e selecione sua conclusão para salvar no histórico.';
  } catch (error) {
    if (card.isConnected) notice.textContent = error.name === 'TimeoutError' ? 'A análise demorou demais. Seus textos continuam aqui; tente novamente.' : 'Não foi possível analisar. Seus textos continuam aqui; confira a conexão com o serviço e tente novamente.';
  } finally { if (button.isConnected) button.disabled = false; }
}

function renderRequestsCommandCenter(item) {
  const lateRequests = countLateRequests(item);
  const reviewedResponses = countReviewedResponses(item);
  const followUps = item.followUpDrafts || [];
  const nextFollowUp = followUps.find((draft) => !draft.status?.toLowerCase().includes("enviado")) || followUps[0];
  const attentionCount = lateRequests + countRequestFollowUps(item);

  const cards = [
    {
      label: t("totalRequests"),
      value: item.requests.length,
      detail: `${item.requestComparisons.length} ${t("requestComparison").toLowerCase()}`,
      tone: item.requests.length ? "warning" : "neutral",
    },
    {
      label: t("reviewedResponses"),
      value: reviewedResponses,
      detail: t("responseReviewRule"),
      tone: reviewedResponses ? "success" : "warning",
    },
    {
      label: t("attentionNeeded"),
      value: attentionCount,
      detail: `${lateRequests} ${t("lateRequests")} / ${countRequestFollowUps(item)} ${t("followUps").toLowerCase()}`,
      tone: attentionCount ? "danger" : "success",
    },
    {
      label: t("nextFollowUp"),
      value: followUps.length,
      detail: nextFollowUp?.title || t("noFollowUpNeeded"),
      tone: nextFollowUp ? statusClass(nextFollowUp.status) : "success",
    },
  ];

  return `
    <section class="request-command">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("requestsCommandCenter")}</p>
          <h3>${t("requestsCommandCopy")}</h3>
        </div>
        ${helpTip(t("responseReviewRuleCopy"))}
      </div>
      <div class="request-command-grid">
        ${cards
          .map(
            (card) => `
              <article class="summary-tile compact-summary ${card.tone}">
                <span>${card.label}</span>
                <strong>${card.value}</strong>
                <p>${card.detail}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderRequestAddForm() {
  return renderAddDisclosure({
    eyebrow: t("requestsEyebrow"),
    title: t("addRequestTitle"),
    copy: t("requestsTitle"),
    notice: state.requestNotice,
    success: t("requestAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <div class="form-grid">
        <label>
          <span>${t("requestTitleLabel")}</span>
          <input data-request-field="title" value="${escapeHtml(state.requestDraft.title)}" placeholder="${t("requestTitlePlaceholder")}">
        </label>
        <label>
          <span>${t("agencyLabel")}</span>
          <input data-request-field="agency" value="${escapeHtml(state.requestDraft.agency)}" placeholder="${t("agencyPlaceholder")}">
        </label>
        <label>
          <span>${t("channelLabel")}</span>
          <input data-request-field="channel" value="${escapeHtml(state.requestDraft.channel)}" placeholder="${t("channelPlaceholder")}">
        </label>
        <label>
          <span>${t("protocol")}</span>
          <input data-request-field="protocol" value="${escapeHtml(state.requestDraft.protocol)}" placeholder="${t("protocolPlaceholder")}">
        </label>
        <label>
          <span>${t("sentDateLabel")}</span>
          <input data-request-field="sentDate" value="${escapeHtml(state.requestDraft.sentDate)}" type="date">
        </label>
        <label>
          <span>${t("dueDateLabel")}</span>
          <input data-request-field="dueDate" value="${escapeHtml(state.requestDraft.dueDate)}" type="date">
        </label>
      </div>
      <label>
        <span>${t("requestStatusLabel")}</span>
        <input data-request-field="status" value="${escapeHtml(state.requestDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
      </label>
      <label>
        <span>${t("requestedItemsLabel")}</span>
        <textarea data-request-field="requestedItems" rows="3" placeholder="${t("requestedItemsPlaceholder")}">${escapeHtml(state.requestDraft.requestedItems)}</textarea>
      </label>
      <label>
        <span>${t("responseSummaryLabel")}</span>
        <textarea data-request-field="responseSummary" rows="3" placeholder="${t("responseSummaryPlaceholder")}">${escapeHtml(state.requestDraft.responseSummary)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-request" type="button">${t("addRequest")}</button>
      </div>
      </section>
    `,
  });
}

function requestBoardStage(request) {
  const review = request.operationalReview;
  if (review?.scenario === 'response') return review.result === 'complete' ? 'received' : 'problem';
  if (review?.scenario === 'denied' || review?.scenario === 'inaccessible') return 'problem';
  if (review?.scenario === 'silence') return getRequestTiming(request).tone === 'danger' ? 'problem' : 'waiting';
  const status = normalizeText(request.status || "");
  const timing = getRequestTiming(request);

  if (status.includes("fluxo separado") || status.includes("separate track")) return "separate";
  if (status.includes("recebida") || status.includes("received") || status.includes("entregue")) return "received";
  if (timing.tone === "danger" || status.includes("parcial") || status.includes("partial") || status.includes("recurso")) {
    return "problem";
  }
  return "waiting";
}

function renderRequestBoard(item) {
  const stages = [
    { id: "waiting", title: t("requestStageWaiting"), tone: "neutral" },
    { id: "problem", title: t("requestStageProblem"), tone: "warning" },
    { id: "received", title: t("requestStageReceived"), tone: "success" },
    { id: "separate", title: t("requestStageSeparate"), tone: "neutral" },
  ];

  return `
    <section class="content-header">
      <p class="eyebrow">${t("requestBoardTitle")}</p>
      <h2>${t("requestBoardHeading")}</h2>
    </section>
    <div class="request-board">
      ${stages
        .map((stage) => {
          const requests = item.requests.filter((request) => requestBoardStage(request) === stage.id);
          return `
            <section class="request-lane ${stage.tone}">
              <div class="lane-header">
                <h3>${stage.title}</h3>
                <span class="pill ${stage.tone}">${requests.length}</span>
              </div>
              <div class="lane-stack">
                ${
                  requests
                    .map((request) => {
                      const timing = getRequestTiming(request);
                      return `
                        <article class="request-ticket">
                          <p class="eyebrow">${request.agency}</p>
                          <h4>${request.title}</h4>
                          <span class="pill ${timing.tone}">${timing.label}</span>
                          <dl class="mini-detail-list">
                            <div><dt>${t("protocol")}</dt><dd>${request.protocol}</dd></div>
                            <div><dt>${t("due")}</dt><dd>${request.currentCheckpoint?.date || request.dueDate}</dd></div>
                          </dl>
                          <p><strong>${t("requestStageNext")}:</strong> ${suggestDeadlineAction(request, timing)}</p>
                        </article>
                      `;
                    })
                    .join("") || `<p class="muted lane-empty">${t("noRequestsInStage")}</p>`
                }
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderEditorialWorkspace(item) {
  return `
    ${renderEditorialQueue(item)}
    ${renderActionPlan(item)}
    ${renderGaps(item)}
  `;
}

function renderOverview(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("overview")}</p>
      <h2>${item.centralQuestion}</h2>
      <p>${item.description}</p>
    </section>
    ${renderStoryBuilder(item)}
    ${renderExecutiveSummary(item)}
    ${renderInvestigationCompass(item)}
    ${renderDataAuditPanel(item)}
    ${renderReadinessPanel(item)}
    ${renderCaseTestPanel(item)}
    <section class="metrics-grid">
      <div><strong>${item.hypotheses.length}</strong><span>${t("hypotheses")}</span></div>
      <div><strong>${item.evidenceBlocks.length}</strong><span>${t("evidenceBlocksMetric")}</span></div>
      <div><strong>${item.requests.length}</strong><span>${t("requests")}</span></div>
      <div><strong>${countReviewedResponses(item)}</strong><span>${t("responses")}</span></div>
      <div><strong>${countLateRequests(item)}</strong><span>${t("lateRequests")}</span></div>
      <div><strong>${countRequestFollowUps(item)}</strong><span>${t("followUps")}</span></div>
      <div><strong>${countOpenGaps(item)}</strong><span>${t("openGaps")}</span></div>
      <div><strong>${countOpenClaims(item)}</strong><span>${t("claimsReview")}</span></div>
      <div><strong>${countReviewItems(item)}</strong><span>${t("reviewItems")}</span></div>
      <div><strong>${countActionItems(item)}</strong><span>${t("actionItems")}</span></div>
      <div><strong>${countQueueItems(item)}</strong><span>${t("queueItems")}</span></div>
      <div><strong>${countQaBlockers(item)}</strong><span>${t("qaBlockers")}</span></div>
    </section>
    ${renderWorkflowMap(item)}
    <section class="panel quick-actions">
      <div>
        <p class="eyebrow">${t("quickActions")}</p>
        <h3>${t("quickActionsCopy")}</h3>
      </div>
      <div class="quick-action-row">
        <button class="button secondary active-secondary" data-action="tab" data-tab="plan">${t("addHypothesis")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="plan">${t("mapEvidence")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="requests">${t("registerRequest")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="requests">${t("reviewResponse")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="editorial">${t("openQueue")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="claims">${t("addClaim")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="story">${t("openStoryWorkspace")}</button>
        <button class="button" data-action="tab" data-tab="methodology">${t("exportMethodology")}</button>
        <button class="button" data-action="export-json">${t("exportJson")}</button>
      </div>
    </section>
    ${renderFreshnessPanel(item)}
    <section class="two-column">
      <article class="panel">
        <h3>${t("projectScope")}</h3>
        <dl class="detail-list">
          <div><dt>${t("topicLabel")}</dt><dd>${item.topic}</dd></div>
          <div><dt>${t("territory")}</dt><dd>${item.territory}</dd></div>
          <div><dt>${t("period")}</dt><dd>${item.period}</dd></div>
          <div><dt>${t("updated")}</dt><dd>${item.updatedAt}</dd></div>
        </dl>
      </article>
      <article class="panel accent">
        <h3>${t("editorialSafetyRule")}</h3>
        <p>${t("editorialSafetyCopy")}</p>
      </article>
    </section>
  `;
}

function getStoryDraft(item) {
  if (item.storyDraft) return item.storyDraft;

  const firstClaim = item.claims?.[0];
  const firstGap = item.gaps?.[0];
  const firstHypothesis = item.hypotheses?.[0];

  return {
    status: t("reviewRecommended"),
    workingThesis: firstHypothesis?.text || item.centralQuestion,
    publishableAngle: firstClaim?.text || t("storyNoDraft"),
    editorQuestion: t("storyNoDraft"),
    sections: [
      {
        title: t("centralQuestion"),
        role: t("storySectionRole"),
        evidence: item.centralQuestion,
        status: item.status,
        blocker: firstGap?.description || t("noImmediateAction"),
      },
      {
        title: t("claims"),
        role: t("publishableAngle"),
        evidence: firstClaim?.evidence || t("reviewRecommended"),
        status: firstClaim?.status || t("reviewRecommended"),
        blocker: firstClaim?.relation || t("reviewRecommended"),
      },
    ],
  };
}

function renderStoryBuilder(item) {
  const draft = getStoryDraft(item);

  return `
    <section class="story-builder">
      <div class="story-builder-main">
        <p class="eyebrow">${t("storyBuilderTitle")}</p>
        <h2>${t("storyBuilderHeading")}</h2>
        <p>${t("storyBuilderCopy")}</p>
        <dl class="story-brief">
          <div>
            <dt>${t("workingThesis")}</dt>
            <dd>${draft.workingThesis}</dd>
          </div>
          <div>
            <dt>${t("publishableAngle")}</dt>
            <dd>${draft.publishableAngle}</dd>
          </div>
          <div>
            <dt>${t("editorQuestion")}</dt>
            <dd>${draft.editorQuestion}</dd>
          </div>
        </dl>
      </div>
      <div class="story-stage-list">
        ${(draft.sections || [])
          .map(
            (section, index) => `
              <article class="story-stage-card ${statusClass(section.status)}">
                <div class="story-stage-index">${index + 1}</div>
                <div>
                  <p class="eyebrow">${section.role || t("storySectionRole")}</p>
                  <h3>${section.title}</h3>
                  <span class="pill ${statusClass(section.status)}">${section.status}</span>
                  <dl class="mini-detail-list">
                    <div><dt>${t("storySectionEvidence")}</dt><dd>${section.evidence}</dd></div>
                    <div><dt>${t("storySectionBlocker")}</dt><dd>${section.blocker}</dd></div>
                  </dl>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function getStoryClaimDecision(claim) {
  if (isProceduralClaim(claim)) {
    return { key: "hold", label: t("storyClaimHold"), tone: "danger" };
  }
  const relationTone = statusClass(claim.relation);
  const strengthTone = statusClass(claim.strength);
  const riskTone = statusClass(claim.risk);
  const status = normalizeText(claim.status);
  const relation = normalizeText(claim.relation);

  if (riskTone === "danger" || strengthTone === "danger" || status.includes("needs") || status.includes("precisa")) {
    return { key: "hold", label: t("storyClaimHold"), tone: "danger" };
  }

  if (relationTone === "success" && strengthTone === "success" && riskTone === "success" && !status.includes("ressalva")) {
    return { key: "ready", label: t("storyClaimReady"), tone: "success" };
  }

  if (relation.includes("limita") || relation.includes("limit") || status.includes("ressalva") || status.includes("caveat")) {
    return { key: "caveat", label: t("storyClaimCaveat"), tone: "warning" };
  }

  return { key: "caveat", label: t("storyClaimCaveat"), tone: "warning" };
}

function isProceduralClaim(claim) {
  return claim.role === "procedural" || claim.kind === "process";
}

function getPublicationBlockers(item) {
  const gapBlockers = (item.gaps || [])
    .filter((gap) => statusClass(gap.status) !== "success")
    .map((gap) => ({
      title: gap.description,
      detail: gap.action || gap.impact || t("reviewRecommended"),
      status: gap.status,
      tone: statusClass(gap.status),
      target: "editorial",
    }));

  const claimBlockers = (item.claims || [])
    .filter((claim) => getStoryClaimDecision(claim).key === "hold")
    .map((claim) => ({
      title: claim.text,
      detail: claim.evidence || t("claimEvidenceLabel"),
      status: claim.status || claim.risk,
      tone: "danger",
      target: "claims",
    }));

  const qaBlockers = (item.qaChecklist || [])
    .filter((qaItem) => statusClass(qaItem.status) === "danger")
    .map((qaItem) => ({
      title: qaItem.question,
      detail: qaItem.action || qaItem.risk,
      status: qaItem.status,
      tone: "danger",
      target: "qa",
    }));

  return [...gapBlockers, ...claimBlockers, ...qaBlockers];
}

function renderStoryPublicationPackage(item) {
  const decisions = (item.claims || []).map(getStoryClaimDecision);
  const ready = decisions.filter((decision) => decision.key === "ready").length;
  const caveat = decisions.filter((decision) => decision.key === "caveat").length;
  const hold = decisions.filter((decision) => decision.key === "hold").length;
  const blockers = getPublicationBlockers(item).length;
  const cards = [
    { label: t("storyClaimReady"), value: ready, detail: t("publishableClaimsHeading"), tone: ready ? "success" : "neutral" },
    { label: t("storyClaimCaveat"), value: caveat, detail: t("storyPackageHeading"), tone: caveat ? "warning" : "success" },
    { label: t("storyClaimHold"), value: hold, detail: t("publicationBlockersHeading"), tone: hold ? "danger" : "success" },
    { label: t("publicationBlockersTitle"), value: blockers, detail: t("methodologyBridgeCopy"), tone: blockers ? "danger" : "success" },
  ];

  return `
    <section class="story-publication-package">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("storyPackageTitle")}</p>
          <h3>${t("storyPackageHeading")}</h3>
        </div>
      </div>
      <div class="story-package-grid">
        ${cards
          .map(
            (card) => `
              <article class="summary-tile compact-summary ${card.tone}">
                <span>${card.label}</span>
                <strong>${card.value}</strong>
                <p>${card.detail}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderStoryOutline(item) {
  const draft = getStoryDraft(item);

  return `
    <section class="panel story-outline">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("storyOutlineTitle")}</p>
          <h3>${t("storyOutlineHeading")}</h3>
        </div>
      </div>
      <div class="story-outline-grid">
        ${(draft.sections || [])
          .map(
            (section, index) => `
              <article class="story-outline-card ${statusClass(section.status)}">
                <span class="story-stage-index">${index + 1}</span>
                <div>
                  <p class="eyebrow">${section.role || t("storySectionRole")}</p>
                  <h4>${section.title}</h4>
                  <p>${section.evidence}</p>
                  <small>${t("storySectionBlocker")}: ${section.blocker}</small>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderStoryClaimsDeck(item) {
  return `
    <section class="panel story-claims-deck">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("publishableClaimsTitle")}</p>
          <h3>${t("publishableClaimsHeading")}</h3>
        </div>
        <button class="button secondary active-secondary" data-action="tab" data-tab="claims">${t("openClaimsBoard")}</button>
      </div>
      <div class="story-claim-grid">
        ${(item.claims || [])
          .map((claim) => {
            const decision = getStoryClaimDecision(claim);
            return `
              <article class="story-claim-card ${decision.tone}">
                <span class="pill ${decision.tone}">${decision.label}</span>
                <h4>${claim.text}</h4>
                <dl class="mini-detail-list">
                  <div><dt>${t("storySectionEvidence")}</dt><dd>${claim.evidence}</dd></div>
                  <div><dt>${t("evidenceRelation")}</dt><dd>${claim.relation}</dd></div>
                  <div><dt>${t("risk")}</dt><dd>${claim.risk}</dd></div>
                </dl>
              </article>
            `;
          })
          .join("") || `<section class="empty-state"><h3>${t("publishableClaimsTitle")}</h3><p>${t("storyNoDraft")}</p></section>`}
      </div>
    </section>
  `;
}

function renderPublicationBlockers(item) {
  const blockers = getPublicationBlockers(item);

  return `
    <section class="panel publication-blockers">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("publicationBlockersTitle")}</p>
          <h3>${t("publicationBlockersHeading")}</h3>
        </div>
      </div>
      ${
        blockers.length
          ? `<div class="publication-blocker-list">
              ${blockers
                .map(
                  (blocker) => `
                    <button class="publication-blocker ${blocker.tone}" data-action="tab" data-tab="${blocker.target}">
                      <span class="pill ${blocker.tone}">${blocker.status}</span>
                      <strong>${blocker.title}</strong>
                      <small>${blocker.detail}</small>
                    </button>
                  `,
                )
                .join("")}
            </div>`
          : `<p class="success-note">${t("noPublicationBlockers")}</p>`
      }
    </section>
  `;
}

function renderStoryMethodologyBridge() {
  return `
    <section class="panel story-methodology-bridge">
      <div>
        <p class="eyebrow">${t("methodologyBridgeTitle")}</p>
        <h3>${t("methodologyBridgeCopy")}</h3>
      </div>
      <div class="quick-action-row">
        <button class="button secondary active-secondary" data-action="tab" data-tab="requests">${t("requestsWorkspace")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="qa">${t("openQaCheck")}</button>
        <button class="button" data-action="tab" data-tab="methodology">${t("openMethodologyNote")}</button>
      </div>
    </section>
  `;
}

function renderStoryWorkspace(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("storyWorkspaceTitle")}</p>
      <h2>${t("storyWorkspaceHeading")}</h2>
      <p>${t("storyWorkspaceCopy")}</p>
    </section>
    ${renderStoryBuilder(item)}
    ${renderStoryPublicationPackage(item)}
    ${renderStoryOutline(item)}
    ${renderStoryClaimsDeck(item)}
    ${renderPublicationBlockers(item)}
    ${renderStoryMethodologyBridge(item)}
  `;
}

function renderInvestigationCompass(item) {
  const openRisks = countOpenGaps(item) + countClaimsNeedingCare(item) + countQaBlockers(item);
  const requestWork = item.requests.length + item.requestComparisons.length + countRequestFollowUps(item);
  const publishWork = countStrongSupportedClaims(item) + (item.methodologyNote ? 1 : 0);
  const proofWork = item.hypotheses.length + item.sources.length + item.evidenceBlocks.length;
  const compassItems = [
    {
      tab: "plan",
      title: t("compassEvidenceTitle"),
      value: proofWork,
      copy: t("compassEvidenceCopy"),
      tone: item.evidenceBlocks.length ? "success" : "warning",
    },
    {
      tab: "requests",
      title: t("compassAccessTitle"),
      value: requestWork,
      copy: t("compassAccessCopy"),
      tone: countLateRequests(item) ? "danger" : item.requests.length ? "warning" : "neutral",
    },
    {
      tab: "editorial",
      title: t("compassRiskTitle"),
      value: openRisks,
      copy: t("compassRiskCopy"),
      tone: openRisks ? "danger" : "success",
    },
    {
      tab: "claims",
      title: t("compassPublishTitle"),
      value: publishWork,
      copy: t("compassPublishCopy"),
      tone: publishWork ? "success" : "warning",
    },
  ];

  return `
    <section class="investigation-compass">
      <div class="compass-core">
        <p class="eyebrow">${t("investigationCompass")}</p>
        <h3>${t("investigationCompassHeading")}</h3>
        <span>${item.topic}</span>
      </div>
      <div class="compass-orbit">
        ${compassItems
          .map(
            (compassItem) => `
              <button class="compass-card ${compassItem.tone}" data-action="tab" data-tab="${compassItem.tab}">
                <span class="compass-value">${compassItem.value}</span>
                <strong>${compassItem.title}</strong>
                <small>${compassItem.copy}</small>
                <em>${t("compassOpen")}</em>
              </button>
            `,
          )
          .join("")}
      </div>
      <div class="investigation-spine" aria-label="${t("investigationThread")}">
        ${renderSpineNode(t("threadQuestion"), t("threadQuestionCopy"), "current")}
        ${renderSpineNode(t("threadProof"), `${proofWork} ${t("threadProofReady")}`, proofWork ? "ready" : "pending")}
        ${renderSpineNode(t("threadGap"), openRisks ? `${openRisks} ${t("threadGapAlert")}` : t("threadGapReady"), openRisks ? "alert" : "ready")}
        ${renderSpineNode(t("threadClaim"), item.claims.length ? `${item.claims.length} ${t("threadClaimReady")}` : t("threadClaimPending"), item.claims.length ? "ready" : "pending")}
      </div>
    </section>
  `;
}

function renderSpineNode(label, copy, tone) {
  return `
    <article class="spine-node ${tone}">
      <strong>${label}</strong>
      <span>${copy}</span>
    </article>
  `;
}

function getDataAuditItems(item) {
  const ids = investigations.map((investigation) => investigation.id);
  const duplicateIds = ids.length - new Set(ids).size;
  const requestTitles = new Set((item.requests || []).map((request) => request.title));
  const comparisons = item.requestComparisons || [];
  const comparisonsWithoutRequest = comparisons.filter((comparison) => !requestTitles.has(comparison.requestTitle)).length;
  const requestsWithoutComparison = (item.requests || []).filter(
    (request) => !comparisons.some((comparison) => comparison.requestTitle === request.title),
  ).length;
  const claimsWithoutEvidence = (item.claims || []).filter((claim) => !(claim.evidence || "").trim()).length;
  const weakClaims = (item.claims || []).filter((claim) => {
    const relationTone = statusClass(claim.relation);
    const strengthTone = statusClass(claim.strength);
    return relationTone !== "success" || strengthTone === "danger" || strengthTone === "warning";
  }).length;
  const highRiskClaims = countHighRiskClaims(item);
  const overdueRequests = countLateRequests(item);
  const qaBlockers = countQaBlockers(item);

  return [
    { count: duplicateIds, label: t("auditDuplicateIds"), tone: "danger" },
    { count: item.requests.length ? 0 : 1, label: t("auditNoRequests"), tone: "warning" },
    { count: requestsWithoutComparison, label: t("auditRequestWithoutComparison"), tone: "warning" },
    { count: comparisonsWithoutRequest, label: t("auditComparisonWithoutRequest"), tone: "danger" },
    { count: claimsWithoutEvidence, label: t("auditClaimWithoutEvidence"), tone: "danger" },
    { count: weakClaims, label: t("auditClaimWeak"), tone: "warning" },
    { count: highRiskClaims, label: t("auditHighRiskClaim"), tone: "danger" },
    { count: overdueRequests, label: t("auditOverdueRequests"), tone: "danger" },
    { count: qaBlockers, label: t("auditOpenQaBlockers"), tone: "danger" },
  ].filter((auditItem) => auditItem.count > 0);
}

function renderDataAuditPanel(item) {
  const auditItems = getDataAuditItems(item);
  const dangerCount = auditItems.filter((auditItem) => auditItem.tone === "danger").length;
  const panelTone = dangerCount ? "danger" : auditItems.length ? "warning" : "success";
  const statusLabel = dangerCount ? t("dataAuditBlocked") : auditItems.length ? t("dataAuditReview") : t("dataAuditReady");

  return `
    <section class="data-audit-panel ${panelTone}">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("dataAuditTitle")}</p>
          <h3>${t("dataAuditHeading")}</h3>
        </div>
        <span class="pill ${panelTone}">${statusLabel}</span>
      </div>
      ${
        auditItems.length
          ? `<div class="audit-grid">
              ${auditItems
                .map(
                  (auditItem) => `
                    <article class="audit-item ${auditItem.tone}">
                      <strong>${auditItem.count}</strong>
                      <span>${auditItem.label}</span>
                    </article>
                  `,
                )
                .join("")}
            </div>`
          : `<p class="muted">${t("dataAuditOk")}</p>`
      }
    </section>
  `;
}

function getCaseTestChecks(item) {
  return [
    {
      label: t("testContextCheck"),
      ready: Boolean(item.accessLaw?.framework && item.country && item.jurisdiction),
      target: "context",
    },
    {
      label: t("testPlanCheck"),
      ready: item.hypotheses.length > 0 && item.evidenceBlocks.length > 0 && item.sources.length > 0,
      target: "plan",
    },
    {
      label: t("testRequestCheck"),
      ready: item.requests.length > 0 && item.requests.every((request) => request.status && (request.dueDate || request.currentCheckpoint)),
      target: "requests",
    },
    {
      label: t("testClaimCheck"),
      ready: item.claims.length > 0 && item.claims.every((claim) => claim.evidence && claim.relation && claim.risk),
      target: "claims",
    },
    {
      label: t("testMethodCheck"),
      ready: Boolean(item.qaChecklist?.length || qaModel.acceptanceCriteria?.length),
      target: "methodology",
    },
  ];
}

function renderCaseTestPanel(item) {
  const checks = getCaseTestChecks(item);
  const readyCount = checks.filter((check) => check.ready).length;
  const allReady = readyCount === checks.length;

  return `
    <section class="case-test-panel ${allReady ? "success" : "warning"}">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("caseTestTitle")}</p>
          <h3>${t("caseTestHeading")}</h3>
        </div>
        <span class="pill ${allReady ? "success" : "warning"}">${readyCount}/${checks.length} ${allReady ? t("caseTestReady") : t("caseTestReview")}</span>
      </div>
      <div class="case-test-grid">
        ${checks
          .map(
            (check) => `
              <button class="case-test-check ${check.ready ? "success" : "warning"}" data-action="tab" data-tab="${check.target}">
                <span class="check-dot">${check.ready ? "✓" : "!"}</span>
                <strong>${check.label}</strong>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderReadinessPanel(item) {
  const items = getReadinessItems(item);

  return `
    <section class="readiness-panel">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("readinessTitle")}</p>
          <h3>${t("readinessHeading")}</h3>
        </div>
        ${helpTip(t("qaChecklistHeading"))}
      </div>
      <div class="readiness-grid">
        ${items
          .map(
            (readinessItem) => `
              <article class="readiness-card ${readinessItem.tone}">
                <div>
                  <div class="card-footer top">
                    <h3>${readinessItem.title}</h3>
                    <span class="pill ${readinessItem.tone}">${readinessStatus(readinessItem.tone)}</span>
                  </div>
                  <p>${readinessItem.detail}</p>
                </div>
                <button class="button secondary active-secondary" data-action="tab" data-tab="${readinessItem.tab}">
                  ${t("openStep")}
                </button>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderExecutiveSummary(item) {
  const queue = getEditorialQueue(item);
  const nextItem = queue.deadlineItems[0] || queue.reviewItems[0] || queue.actionItems[0];
  const openRisks = countOpenGaps(item) + countOpenClaims(item) + countQaBlockers(item);
  const evidenceTotal = item.hypotheses.length + item.evidenceBlocks.length + item.sources.length;
  const requestTotal = item.requests.length + countReviewedResponses(item) + countRequestFollowUps(item);

  const tiles = [
    {
      label: t("summaryEvidence"),
      value: evidenceTotal,
      detail: `${item.evidenceBlocks.length} ${t("evidenceBlocksMetric")} / ${item.sources.length} ${t("sources").toLowerCase()}`,
      tone: evidenceTotal ? "success" : "warning",
    },
    {
      label: t("summaryRequests"),
      value: requestTotal,
      detail: `${countLateRequests(item)} ${t("lateRequests")} / ${countRequestFollowUps(item)} ${t("followUps").toLowerCase()}`,
      tone: countLateRequests(item) ? "danger" : "warning",
    },
    {
      label: t("summaryRisk"),
      value: openRisks,
      detail: `${countOpenGaps(item)} ${t("openGaps")} / ${countQaBlockers(item)} ${t("qaBlockers")}`,
      tone: openRisks ? "danger" : "success",
    },
    {
      label: t("summaryNext"),
      value: queue.deadlineItems.length + queue.reviewItems.length + queue.actionItems.length,
      detail: nextItem?.title || t("noImmediateAction"),
      tone: nextItem ? statusClass(nextItem.status) : "success",
    },
  ];

  return `
    <section class="executive-summary" aria-label="${t("executiveSummary")}">
      ${tiles
        .map(
          (tile) => `
            <article class="summary-tile ${tile.tone}">
              <span>${tile.label}</span>
              <strong>${tile.value}</strong>
              <p>${tile.detail}</p>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderWorkflowMap(item) {
  const steps = [
    {
      tab: "context",
      title: t("workflowContextTitle"),
      copy: t("workflowContextCopy"),
      count: item.sourceDiscovery?.length || item.sources.length,
      label: t("sources"),
      tone: item.accessLaw?.framework && item.accessLaw.framework !== t("notSet") ? "success" : "warning",
    },
    {
      tab: "plan",
      title: t("workflowPlanTitle"),
      copy: t("workflowPlanCopy"),
      count: item.hypotheses.length + item.evidenceBlocks.length,
      label: t("evidenceBlocks"),
      tone: item.hypotheses.length && item.evidenceBlocks.length ? "success" : "warning",
    },
    {
      tab: "requests",
      title: t("workflowRequestsTitle"),
      copy: t("workflowRequestsCopy"),
      count: item.requests.length + item.requestComparisons.length + (item.transparencyLog || []).length,
      label: t("requestsWorkspace"),
      tone: countLateRequests(item) ? "danger" : item.requests.length ? "warning" : "neutral",
    },
    {
      tab: "claims",
      title: t("workflowClaimsTitle"),
      copy: t("workflowClaimsCopy"),
      count: item.claims.length,
      label: t("claims"),
      tone: countOpenClaims(item) ? "warning" : item.claims.length ? "success" : "neutral",
    },
  ];

  return `
    <section class="workflow-map">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("startHere")}</p>
          <h3>${t("startHereTitle")}</h3>
        </div>
        <span class="pill neutral">${t("startHereBadge")}</span>
      </div>
      <div class="workflow-track">
        ${steps
          .map(
            (step, index) => `
              <button class="workflow-node ${step.tone}" data-action="tab" data-tab="${step.tab}">
                <span class="workflow-index">${index + 1}</span>
                <span class="workflow-content">
                  <strong>${step.title}</strong>
                  <small>${step.copy}</small>
                </span>
                <span class="workflow-count">
                  <strong>${step.count}</strong>
                  <small>${step.label}</small>
                </span>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderFreshnessPanel(item) {
  if (!item.freshness && !item.nextReviewItems?.length) return "";

  const reviewItems = (item.nextReviewItems || [])
    .map((reviewItem) => `<li>${reviewItem}</li>`)
    .join("");

  return `
    <section class="panel freshness-panel">
      <div class="card-footer top">
        <div>
          <p class="eyebrow">${t("freshnessCheck")}</p>
          <h3>${item.freshness?.status || t("reviewRecommended")}</h3>
        </div>
        <span class="pill ${statusClass(item.freshness?.status)}">${item.freshness?.checkedAt || item.updatedAt}</span>
      </div>
      <p>${item.freshness?.summary || t("reviewLog")}</p>
      ${reviewItems ? `<ul class="review-list">${reviewItems}</ul>` : ""}
    </section>
  `;
}

function renderJurisdiction(item) {
  const law = item.accessLaw;
  const sources = item.sourceDiscovery || [];

  return `
    <section class="content-header">
      <p class="eyebrow">${t("jurisdictionAccess")}</p>
      <h2>${t("jurisdictionHeading")}</h2>
      <p>${t("jurisdictionCopy")}</p>
    </section>
    <section class="two-column">
      <article class="panel law-card">
        <h3>${law.framework}</h3>
        <dl class="detail-list">
          <div><dt>${t("deadline")}</dt><dd>${law.deadline}</dd></div>
          <div><dt>${t("requestChannels")}</dt><dd>${law.requestChannels}</dd></div>
          <div><dt>${t("escalation")}</dt><dd>${law.escalation}</dd></div>
          <div><dt>${t("reporterWarning")}</dt><dd>${law.reporterWarning}</dd></div>
        </dl>
      </article>
      <article class="panel accent">
        <h3>${t("productRule")}</h3>
        <p>${t("productRuleCopy")}</p>
      </article>
    </section>
    <section class="content-header process-header">
      <p class="eyebrow">${t("sourceDiscovery")}</p>
      <h2>${t("sourceDiscoveryHeading")}</h2>
    </section>
    <div class="source-map">
      ${sources
        .map(
          (source) => `
            <article class="panel source-path-card">
              <h3>${source.source}</h3>
              <p>${source.purpose}</p>
              <p class="muted"><strong>${t("verify")}:</strong> ${source.verification}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderLanguagePlan(item) {
  const plan = item.languagePlan;
  const interfaceLanguages = plan.interfaceLanguages.map((language) => `<span class="pill neutral">${language}</span>`).join("");
  const publicationLanguages = plan.publicationLanguages.map((language) => `<span class="pill success">${language}</span>`).join("");
  const notes = plan.localizationNotes.map((note) => `<li>${note}</li>`).join("");

  return `
    <section class="content-header">
      <p class="eyebrow">${t("languageLocalization")}</p>
      <h2>${t("languageHeading")}</h2>
      <p>${t("languageCopy")}</p>
    </section>
    <section class="two-column">
      <article class="panel language-card">
        <h3>${t("languagePlan")}</h3>
        <dl class="detail-list">
          <div><dt>${t("workingLanguage")}</dt><dd>${plan.workingLanguage}</dd></div>
          <div><dt>${t("interfaceOptions")}</dt><dd class="pill-row">${interfaceLanguages}</dd></div>
          <div><dt>${t("publicationLanguages")}</dt><dd class="pill-row">${publicationLanguages}</dd></div>
        </dl>
      </article>
      <article class="panel accent">
        <h3>${t("localizationRule")}</h3>
        <p>${t("localizationRuleCopy")}</p>
      </article>
    </section>
    <section class="content-header process-header">
      <p class="eyebrow">${t("translationNotes")}</p>
      <h2>${t("translationNotesHeading")}</h2>
    </section>
    <div class="language-grid">
      <article class="panel">
        <h3>${t("notes")}</h3>
        <ul class="review-list">${notes}</ul>
      </article>
      <article class="panel">
        <h3>${t("glossary")}</h3>
        <div class="glossary-list">
          ${plan.glossary
            .map(
              (entry) => `
                <div>
                  <strong>${entry.term}</strong>
                  <p>${entry.meaning}</p>
                  <p class="muted">${entry.handling}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </div>
  `;
}

function renderReportingMap(item) {
  const evidenceBlocks = item.evidenceBlocks || [];
  const sources = item.sources || [];
  const rows = (item.hypotheses || []).map((hypothesis, index) => {
    const evidence = evidenceBlocks[index] || evidenceBlocks.find((block) => hypothesis.evidence?.includes(block.type)) || evidenceBlocks[0];
    const source =
      sources.find((entry) => hypothesis.evidence?.toLowerCase().includes(entry.name.toLowerCase())) ||
      sources.find((entry) => evidence?.type && entry.use?.toLowerCase().includes(evidence.type.toLowerCase())) ||
      sources[index % Math.max(sources.length, 1)];

    return { hypothesis, evidence, source };
  });

  return `
    <section class="content-header">
      <p class="eyebrow">${t("reportingMapTitle")}</p>
      <h2>${t("reportingMapHeading")}</h2>
      <p>${t("reportingMapCopy")}</p>
    </section>
    <div class="reporting-map">
      ${rows
        .map(
          ({ hypothesis, evidence, source }, index) => `
            <article class="reporting-path">
              <div class="path-index">${index + 1}</div>
              <section class="path-card hypothesis-card">
                <p class="eyebrow">${t("hypotheses")}</p>
                <h3>${hypothesis.text}</h3>
                <span class="pill ${statusClass(hypothesis.status)}">${hypothesis.status}</span>
              </section>
              <section class="path-card">
                <p class="eyebrow">${t("evidencePath")}</p>
                <h3>${evidence?.type || hypothesis.evidence || t("notSet")}</h3>
                <p>${hypothesis.evidence}</p>
                <div class="pill-row">
                  <span class="pill ${statusClass(evidence?.priority || "")}">${evidence?.priority || t("priorityPrefix")}</span>
                  <span class="pill ${statusClass(evidence?.status || "")}">${evidence?.status || t("reviewRecommended")}</span>
                </div>
              </section>
              <section class="path-card source-path">
                <p class="eyebrow">${t("sourcePath")}</p>
                <h3>${source?.name || t("notSet")}</h3>
                <p>${source?.use || t("reviewLog")}</p>
                <p class="muted">${t("limits")}: ${source?.limits || t("notSet")}</p>
              </section>
            </article>
          `,
        )
        .join("") || `<section class="empty-state"><h3>${t("reportingMapTitle")}</h3><p>${t("workflowPlanCopy")}</p></section>`}
    </div>
  `;
}

function renderEvidenceInventory(item) {
  const linkedEvidence = new Set((item.hypotheses || []).map((hypothesis) => hypothesis.evidence).filter(Boolean));

  return `
    <section class="content-header process-header">
      <p class="eyebrow">${t("evidenceInventoryTitle")}</p>
      <h2>${t("evidenceInventoryHeading")}</h2>
    </section>
    <div class="evidence-inventory">
      ${(item.evidenceBlocks || [])
        .map((block) => {
          const isLinked = [...linkedEvidence].some((evidence) => evidence.toLowerCase().includes(block.type.toLowerCase()));
          return `
            <article class="evidence-chip-card">
              <div>
                <p class="eyebrow">${t("block")}</p>
                <h3>${block.type}</h3>
              </div>
              <div class="pill-row">
                <span class="pill ${statusClass(block.priority)}">${block.priority}</span>
                <span class="pill ${statusClass(block.status)}">${block.status}</span>
                <span class="pill ${isLinked ? "success" : "warning"}">${t("evidenceCoverage")}: ${isLinked ? t("readinessReady") : t("readinessReview")}</span>
              </div>
            </article>
          `;
        })
        .join("") || `<section class="empty-state compact-empty"><p>${t("workflowPlanCopy")}</p></section>`}
    </div>
  `;
}

function renderSources(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("sourcesTitle")}</p>
      <h2>${t("sourcesHeading")}</h2>
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
              <p class="muted">${t("limits")}: ${source.limits}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderResponses(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("responsesTitle")}</p>
      <h2>${t("responsesHeading")}</h2>
    </section>
    <section class="panel accent">
      <h3>${t("responseReviewRule")}</h3>
      <p>${t("responseReviewRuleCopy")}</p>
    </section>
    <div class="stack">
      ${item.requests
        .map((request) => {
          const comparison = item.requestComparisons.find((entry) => entry.requestTitle === request.title);
          const hasReceivedMaterial =
            request.responseSummary &&
            !request.responseSummary.toLowerCase().includes("sem resposta") &&
            !request.responseSummary.toLowerCase().includes("no response") &&
            !request.responseSummary.toLowerCase().includes("sem entrega");

          return `
            <article class="panel">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${request.agency}</p>
                  <h3>${request.title}</h3>
                </div>
                <span class="pill ${statusClass(request.status)}">${request.status}</span>
              </div>
              <dl class="detail-list grid">
                <div><dt>${t("protocol")}</dt><dd>${request.protocol}</dd></div>
                <div><dt>${t("responseStatus")}</dt><dd>${request.status}</dd></div>
                <div><dt>${t("sent")}</dt><dd>${request.sentDate}</dd></div>
                <div><dt>${t("due")}</dt><dd>${request.dueDate}</dd></div>
              </dl>
              <dl class="detail-list">
                <div>
                  <dt>${t("receivedMaterials")}</dt>
                  <dd>${comparison?.received || (hasReceivedMaterial ? request.responseSummary : t("noReceivedMaterial"))}</dd>
                </div>
                <div>
                  <dt>${t("identifiedGaps")}</dt>
                  <dd>${comparison?.missing || t("noComparisonYet")}</dd>
                </div>
                <div>
                  <dt>${t("reviewDecision")}</dt>
                  <dd>${comparison?.editorialDecision || t("noComparisonYet")}</dd>
                </div>
              </dl>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderDeadlines(item) {
  const rules = item.methodRules || [];

  return `
    <section class="content-header">
      <p class="eyebrow">${t("deadlinesNext")}</p>
      <h2>${t("deadlinesTitle")}</h2>
    </section>
    <section class="deadline-grid">
      ${item.requests
        .map((request) => {
          const timing = getRequestTiming(request);
          return `
            <article class="panel deadline-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${request.agency}</p>
                  <h3>${request.title}</h3>
                </div>
                <span class="pill ${timing.tone}">${timing.label}</span>
              </div>
              <dl class="detail-list grid">
                <div><dt>${t("sent")}</dt><dd>${request.sentDate}</dd></div>
                <div><dt>${t("originalDue")}</dt><dd>${request.dueDate}</dd></div>
                ${
                  request.currentCheckpoint
                    ? `<div><dt>${t("currentCheckpoint")}</dt><dd>${request.currentCheckpoint.date} / ${request.currentCheckpoint.label}</dd></div>`
                    : ""
                }
                <div><dt>${t("status")}</dt><dd>${request.status}</dd></div>
              </dl>
              ${
                request.currentCheckpoint
                  ? `<p class="muted"><strong>${t("checkpointSource")}:</strong> ${request.currentCheckpoint.source}</p>`
                  : ""
              }
              <p><strong>${t("suggestedAction")}:</strong> ${suggestDeadlineAction(request, timing)}</p>
            </article>
          `;
        })
        .join("")}
    </section>
    ${
      rules.length
        ? `<section class="content-header process-header">
            <p class="eyebrow">${t("methodSafeguards")}</p>
            <h2>${t("methodSafeguardsTitle")}</h2>
          </section>
          <div class="safeguard-grid">
            ${rules
              .map(
                (rule) => `
                  <article class="panel safeguard-card">
                    <h3>${rule.rule}</h3>
                    <p>${rule.productUse}</p>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : ""
    }
    <section class="content-header process-header">
      <p class="eyebrow">${t("processGuide")}</p>
      <h2>${t("processGuideTitle")}</h2>
    </section>
    <div class="process-steps">
      ${item.processGuide
        .map(
          (step, index) => `
            <article class="process-step">
              <span>${index + 1}</span>
              <div>
                <h3>${step.stage}</h3>
                <p>${step.action}</p>
                <strong>${step.output}</strong>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTransparencyLog(item) {
  const events = item.transparencyLog || [];

  return `
    ${renderTransparencyAddForm()}
    <section class="content-header">
      <p class="eyebrow">${t("transparencyLogTitle")}</p>
      <h2>${t("transparencyLogHeading")}</h2>
      <p>${t("transparencyLogCopy")}</p>
    </section>
    <div class="timeline-list">
      ${events
        .map(
          (event) => `
            <article class="panel timeline-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${event.date} / ${event.actor}</p>
                  <h3>${event.event}</h3>
                </div>
                <span class="pill ${statusClass(event.status)}">${event.status}</span>
              </div>
              <p><strong>${t("nextStep")}:</strong> ${event.nextStep}</p>
            </article>
          `,
        )
        .join("") || `<section class="empty-state"><h3>${t("noTransparencyTitle")}</h3><p>${t("noTransparencyCopy")}</p></section>`}
    </div>
  `;
}

function renderTransparencyAddForm() {
  return renderAddDisclosure({
    eyebrow: t("transparencyLogTitle"),
    title: t("addTransparencyEventTitle"),
    copy: t("transparencyLogCopy"),
    notice: state.transparencyNotice,
    success: t("transparencyEventAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <div class="form-grid">
        <label>
          <span>${t("transparencyDateLabel")}</span>
          <input data-transparency-field="date" value="${escapeHtml(state.transparencyDraft.date)}" type="date">
        </label>
        <label>
          <span>${t("transparencyActorLabel")}</span>
          <input data-transparency-field="actor" value="${escapeHtml(state.transparencyDraft.actor)}" placeholder="${t("transparencyActorPlaceholder")}">
        </label>
        <label>
          <span>${t("transparencyStatusLabel")}</span>
          <input data-transparency-field="status" value="${escapeHtml(state.transparencyDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
        <label>
          <span>${t("transparencyNextStepLabel")}</span>
          <input data-transparency-field="nextStep" value="${escapeHtml(state.transparencyDraft.nextStep)}" placeholder="${t("transparencyNextStepPlaceholder")}">
        </label>
      </div>
      <label>
        <span>${t("transparencyEventLabel")}</span>
        <textarea data-transparency-field="event" rows="3" placeholder="${t("transparencyEventPlaceholder")}">${escapeHtml(state.transparencyDraft.event)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-transparency-event" type="button">${t("addTransparencyEvent")}</button>
      </div>
      </section>
    `,
  });
}

function renderActionPlan(item) {
  const actions = item.actionItems || [];

  return `
    ${renderActionAddForm()}
    <section class="content-header">
      <p class="eyebrow">${t("actionPlan")}</p>
      <h2>${t("actionPlanTitle")}</h2>
      <p>${t("actionPlanCopy")}</p>
    </section>
    <div class="action-grid">
      ${actions
        .map(
          (action) => `
            <article class="panel action-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${t("priorityPrefix")}: ${action.priority} / ${action.source}</p>
                  <h3>${action.action}</h3>
                </div>
                <span class="pill ${statusClass(action.status)}">${action.status}</span>
              </div>
              <dl class="detail-list grid">
                <div><dt>${t("owner")}</dt><dd>${action.owner}</dd></div>
                <div><dt>${t("dueCheckpoint")}</dt><dd>${action.dueDate || t("noDate")}</dd></div>
                <div><dt>${t("type")}</dt><dd>${action.type}</dd></div>
              </dl>
              <p class="muted"><strong>${t("whyItMatters")}:</strong> ${action.rationale}</p>
              <p><strong>${t("output")}:</strong> ${action.output}</p>
            </article>
          `,
        )
        .join("") || `<section class="empty-state"><h3>${t("noActionTitle")}</h3><p>${t("noActionCopy")}</p></section>`}
    </div>
  `;
}

function renderActionAddForm() {
  return renderAddDisclosure({
    eyebrow: t("actionPlan"),
    title: t("addActionTitle"),
    copy: t("actionPlanCopy"),
    notice: state.actionNotice,
    success: t("actionAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <label>
        <span>${t("actionLabel")}</span>
        <textarea data-action-field="action" rows="3" placeholder="${t("actionPlaceholder")}">${escapeHtml(state.actionDraft.action)}</textarea>
      </label>
      <div class="form-grid">
        <label>
          <span>${t("actionSourceLabel")}</span>
          <input data-action-field="source" value="${escapeHtml(state.actionDraft.source)}" placeholder="${t("actionSourcePlaceholder")}">
        </label>
        <label>
          <span>${t("actionPriorityLabel")}</span>
          <input data-action-field="priority" value="${escapeHtml(state.actionDraft.priority)}" list="priority-options" placeholder="${t("priorityPrefix")}">
        </label>
        <label>
          <span>${t("actionStatusLabel")}</span>
          <input data-action-field="status" value="${escapeHtml(state.actionDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
        <label>
          <span>${t("owner")}</span>
          <input data-action-field="owner" value="${escapeHtml(state.actionDraft.owner)}" placeholder="${t("actionOwnerPlaceholder")}">
        </label>
        <label>
          <span>${t("dueCheckpoint")}</span>
          <input data-action-field="dueDate" value="${escapeHtml(state.actionDraft.dueDate)}" type="date">
        </label>
        <label>
          <span>${t("type")}</span>
          <input data-action-field="type" value="${escapeHtml(state.actionDraft.type)}" placeholder="${t("actionTypePlaceholder")}">
        </label>
      </div>
      <label>
        <span>${t("whyItMatters")}</span>
        <textarea data-action-field="rationale" rows="2" placeholder="${t("actionRationalePlaceholder")}">${escapeHtml(state.actionDraft.rationale)}</textarea>
      </label>
      <label>
        <span>${t("output")}</span>
        <textarea data-action-field="output" rows="2" placeholder="${t("actionOutputPlaceholder")}">${escapeHtml(state.actionDraft.output)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-action-item" type="button">${t("addAction")}</button>
      </div>
      </section>
    `,
  });
}

function renderQueueSection(title, items) {
  return `
    <section class="queue-section">
      <div class="section-header compact-header">
        <h3>${title}</h3>
        <span class="pill neutral">${items.length}</span>
      </div>
      <div class="stack">
        ${
          items
            .map(
              (queueItem) => `
                <article class="row-card">
                  <div>
                    <p class="eyebrow">${queueItem.meta}</p>
                    <h3>${queueItem.title}</h3>
                    <p class="muted">${queueItem.detail}</p>
                  </div>
                  <span class="pill ${statusClass(queueItem.status)}">${queueItem.status}</span>
                </article>
              `,
            )
            .join("") || `<section class="empty-state compact-empty"><p>${t("queueEmpty")}</p></section>`
        }
      </div>
    </section>
  `;
}

function renderEditorialQueue(item) {
  const queue = getEditorialQueue(item);

  return `
    <section class="content-header">
      <p class="eyebrow">${t("editorialQueueTitle")}</p>
      <h2>${t("editorialQueueHeading")}</h2>
      <p>${t("editorialQueueCopy")}</p>
    </section>
    <section class="panel accent">
      <h3>${t("queueRule")}</h3>
      <p>${t("queueRuleCopy")}</p>
    </section>
    ${renderQueueSection(t("queueDeadlines"), queue.deadlineItems)}
    ${renderQueueSection(t("queueReviews"), queue.reviewItems)}
    ${renderQueueSection(t("queueActions"), queue.actionItems)}
  `;
}

function suggestDeadlineAction(request, timing) {
  const status = request.status.toLowerCase();

  if (status.includes("fluxo separado") || status.includes("separate track")) {
    return t("separateTrackAction");
  }

  if (request.currentCheckpoint && timing.days >= 0) {
    return request.currentCheckpoint.action;
  }

  if (request.currentCheckpoint && timing.days < 0) {
    return `${t("checkpointPassed")} ${request.currentCheckpoint.action}`;
  }

  if (status.includes("parcial") || status.includes("partial")) {
    return t("partialAction");
  }

  if (status.includes("problema") || status.includes("broken")) {
    return t("brokenAction");
  }

  if (timing.days < 0) {
    return t("overdueAction");
  }

  if (timing.days <= 3) {
    return t("nearDeadlineAction");
  }

  return t("waitAction");
}

function renderRequestComparison(item) {
  const requestOptions = (item.requests || [])
    .map((request) => `<option value="${escapeHtml(request.title)}"></option>`)
    .join("");

  return `
    ${renderComparisonAddForm(requestOptions)}
    <section class="content-header">
      <p class="eyebrow">${t("requestComparisonTitle")}</p>
      <h2>${t("requestComparisonHeading")}</h2>
    </section>
    <div class="comparison-grid">
      ${item.requestComparisons
        .map(
          (comparison) => `
            <article class="panel comparison-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${t("requestLabel")}</p>
                  <h3>${comparison.requestTitle}</h3>
                </div>
                <span class="pill ${statusClass(comparison.deadlineStatus)}">${comparison.deadlineStatus}</span>
              </div>
              <div class="comparison-lane">
                <div>
                  <strong>${t("expected")}</strong>
                  <p>${comparison.expected}</p>
                </div>
                <div>
                  <strong>${t("received")}</strong>
                  <p>${comparison.received}</p>
                </div>
                <div>
                  <strong>${t("missingUnclear")}</strong>
                  <p>${comparison.missing}</p>
                </div>
              </div>
              <dl class="detail-list">
                <div>
                  <dt>${t("editorialDecision")}</dt>
                  <dd>${comparison.editorialDecision}</dd>
                </div>
                <div>
                  <dt>${t("nextStep")}</dt>
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

function renderComparisonAddForm(requestOptions) {
  return renderAddDisclosure({
    eyebrow: t("responseReviewRule"),
    title: t("addComparisonTitle"),
    copy: t("responseReviewRuleCopy"),
    notice: state.comparisonNotice,
    success: t("comparisonAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <datalist id="request-title-options">${requestOptions}</datalist>
      <div class="form-grid">
        <label>
          <span>${t("comparisonRequestLabel")}</span>
          <input data-comparison-field="requestTitle" value="${escapeHtml(state.comparisonDraft.requestTitle)}" list="request-title-options" placeholder="${t("comparisonRequestPlaceholder")}">
        </label>
        <label>
          <span>${t("deadlineStatusLabel")}</span>
          <input data-comparison-field="deadlineStatus" value="${escapeHtml(state.comparisonDraft.deadlineStatus)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
      </div>
      <label>
        <span>${t("expectedLabel")}</span>
        <textarea data-comparison-field="expected" rows="3" placeholder="${t("expectedPlaceholder")}">${escapeHtml(state.comparisonDraft.expected)}</textarea>
      </label>
      <label>
        <span>${t("receivedLabel")}</span>
        <textarea data-comparison-field="received" rows="3" placeholder="${t("receivedPlaceholder")}">${escapeHtml(state.comparisonDraft.received)}</textarea>
      </label>
      <label>
        <span>${t("missingLabel")}</span>
        <textarea data-comparison-field="missing" rows="3" placeholder="${t("missingPlaceholder")}">${escapeHtml(state.comparisonDraft.missing)}</textarea>
      </label>
      <div class="form-grid">
        <label>
          <span>${t("editorialDecisionLabel")}</span>
          <input data-comparison-field="editorialDecision" value="${escapeHtml(state.comparisonDraft.editorialDecision)}" placeholder="${t("editorialDecisionPlaceholder")}">
        </label>
        <label>
          <span>${t("nextStep")}</span>
          <input data-comparison-field="nextStep" value="${escapeHtml(state.comparisonDraft.nextStep)}" placeholder="${t("comparisonNextStepPlaceholder")}">
        </label>
      </div>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-comparison" type="button">${t("addComparison")}</button>
      </div>
      </section>
    `,
  });
}

function renderFollowUps(item) {
  const drafts = item.followUpDrafts || [];
  const requestOptions = (item.requests || [])
    .map((request) => `<option value="${escapeHtml(request.title)}"></option>`)
    .join("");

  return `
    ${renderFollowUpAddForm(requestOptions)}
    <section class="content-header">
      <p class="eyebrow">${t("followUpDraftsTitle")}</p>
      <h2>${t("followUpDraftsHeading")}</h2>
      <p>${t("followUpDraftsCopy")}</p>
    </section>
    <div class="draft-grid">
      ${drafts
        .map(
          (draft) => `
            <article class="panel draft-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${draft.type}</p>
                  <h3>${draft.title}</h3>
                </div>
                <span class="pill ${statusClass(draft.status)}">${draft.status}</span>
              </div>
              <dl class="detail-list">
                <div><dt>${t("relatedRequest")}</dt><dd>${draft.request}</dd></div>
                <div><dt>${t("reporterCheck")}</dt><dd>${draft.riskNote}</dd></div>
              </dl>
              <pre class="draft-text">${draft.draft}</pre>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderFollowUpAddForm(requestOptions) {
  return renderAddDisclosure({
    eyebrow: t("followUpDraftsTitle"),
    title: t("addFollowUpTitle"),
    copy: t("followUpDraftsCopy"),
    notice: state.followUpNotice,
    success: t("followUpAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <datalist id="follow-up-request-options">${requestOptions}</datalist>
      <div class="form-grid">
        <label>
          <span>${t("followUpTitleLabel")}</span>
          <input data-follow-up-field="title" value="${escapeHtml(state.followUpDraft.title)}" placeholder="${t("followUpTitlePlaceholder")}">
        </label>
        <label>
          <span>${t("followUpTypeLabel")}</span>
          <input data-follow-up-field="type" value="${escapeHtml(state.followUpDraft.type)}" placeholder="${t("followUpTypePlaceholder")}">
        </label>
        <label>
          <span>${t("followUpRequestLabel")}</span>
          <input data-follow-up-field="request" value="${escapeHtml(state.followUpDraft.request)}" list="follow-up-request-options" placeholder="${t("followUpRequestPlaceholder")}">
        </label>
        <label>
          <span>${t("followUpStatusLabel")}</span>
          <input data-follow-up-field="status" value="${escapeHtml(state.followUpDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
      </div>
      <label>
        <span>${t("riskNoteLabel")}</span>
        <textarea data-follow-up-field="riskNote" rows="2" placeholder="${t("riskNotePlaceholder")}">${escapeHtml(state.followUpDraft.riskNote)}</textarea>
      </label>
      <label>
        <span>${t("draftTextLabel")}</span>
        <textarea data-follow-up-field="draft" rows="6" placeholder="${t("draftTextPlaceholder")}">${escapeHtml(state.followUpDraft.draft)}</textarea>
      </label>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-follow-up" type="button">${t("addFollowUp")}</button>
      </div>
      </section>
    `,
  });
}

function renderGaps(item) {
  return `
    ${renderGapAddForm()}
    <section class="content-header">
      <p class="eyebrow">${t("gapsTitle")}</p>
      <h2>${t("gapsHeading")}</h2>
    </section>
    <div class="stack">
      ${item.gaps
        .map(
          (gap) => `
            <article class="row-card">
              <div>
                <h3>${gap.description}</h3>
                <p>${t("origin")}: ${gap.origin}</p>
                <p class="muted">${t("nextStep")}: ${gap.nextStep}</p>
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

function renderGapAddForm() {
  return renderAddDisclosure({
    eyebrow: t("editorialWorkspace"),
    title: t("addGapTitle"),
    copy: t("editorialSafetyCopy"),
    notice: state.gapNotice,
    success: t("gapAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <label>
        <span>${t("gapDescriptionLabel")}</span>
        <textarea data-gap-field="description" rows="3" placeholder="${t("gapDescriptionPlaceholder")}">${escapeHtml(state.gapDraft.description)}</textarea>
      </label>
      <div class="form-grid">
        <label>
          <span>${t("gapOriginLabel")}</span>
          <input data-gap-field="origin" value="${escapeHtml(state.gapDraft.origin)}" placeholder="${t("gapOriginPlaceholder")}">
        </label>
        <label>
          <span>${t("gapSeverityLabel")}</span>
          <input data-gap-field="severity" value="${escapeHtml(state.gapDraft.severity)}" list="risk-options" placeholder="${t("reviewRecommended")}">
        </label>
        <label>
          <span>${t("gapStatusLabel")}</span>
          <input data-gap-field="status" value="${escapeHtml(state.gapDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
        <label>
          <span>${t("gapNextStepLabel")}</span>
          <input data-gap-field="nextStep" value="${escapeHtml(state.gapDraft.nextStep)}" placeholder="${t("gapNextStepPlaceholder")}">
        </label>
      </div>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-gap" type="button">${t("addGap")}</button>
      </div>
      </section>
    `,
  });
}

function renderClaims(item) {
  return `
    ${renderClaimAddForm()}
    ${renderClaimsDashboard(item)}
    ${renderClaimDecisionBoard(item)}
    <section class="content-header">
      <p class="eyebrow">${t("claimMatrixTitle")}</p>
      <h2>${t("claimMatrixHeading")}</h2>
    </section>
    <div class="claim-matrix-cards">
      ${item.claims
        .map(
          (claim) => `
            <article class="claim-mini-card">
              <h3>${claim.text}</h3>
              <div class="pill-row">
                <span class="pill neutral">${claim.type}</span>
                <span class="pill ${statusClass(claim.relation)}">${claim.relation || "-"}</span>
                <span class="pill ${statusClass(claim.strength)}">${claim.strength}</span>
                <span class="pill ${statusClass(claim.risk)}">${claim.risk}</span>
              </div>
              <p class="muted">${claim.evidence}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function claimDecisionMeta(claim) {
  const relationTone = statusClass(claim.relation);
  const strengthTone = statusClass(claim.strength);
  const riskTone = statusClass(claim.risk);

  if (riskTone === "danger" || relationTone === "danger" || strengthTone === "danger") {
    return {
      label: t("decisionHold"),
      tone: "danger",
      why: t("workflowClaimsCopy"),
    };
  }

  if (relationTone === "success" && strengthTone === "success" && riskTone !== "warning") {
    return {
      label: t("decisionAdvance"),
      tone: "success",
      why: t("publishRule"),
    };
  }

  return {
    label: t("decisionLimit"),
    tone: "warning",
    why: t("editorialSafetyCopy"),
  };
}

function renderClaimDecisionBoard(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("claimDecisionTitle")}</p>
      <h2>${t("claimDecisionHeading")}</h2>
    </section>
    <div class="claim-decision-grid">
      ${item.claims
        .map((claim) => {
          const decision = claimDecisionMeta(claim);
          return `
            <article class="claim-decision-card ${decision.tone}">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${claim.type}</p>
                  <h3>${claim.text}</h3>
                </div>
                <span class="pill ${decision.tone}">${decision.label}</span>
              </div>
              <dl class="detail-list">
                <div><dt>${t("decisionEvidence")}</dt><dd>${claim.evidence}</dd></div>
                <div><dt>${t("evidenceRelation")}</dt><dd><span class="pill ${statusClass(claim.relation)}">${claim.relation || "-"}</span></dd></div>
                <div><dt>${t("decisionWhy")}</dt><dd>${decision.why}</dd></div>
              </dl>
              <div class="pill-row">
                <span class="pill ${statusClass(claim.strength)}">${claim.strength}</span>
                <span class="pill ${statusClass(claim.risk)}">${claim.risk}</span>
                <span class="pill ${statusClass(claim.status)}">${claim.status}</span>
              </div>
            </article>
          `;
        })
        .join("") || `<section class="empty-state"><h3>${t("claimDecisionTitle")}</h3><p>${t("workflowClaimsCopy")}</p></section>`}
    </div>
  `;
}

function renderClaimsDashboard(item) {
  const strongSupported = countStrongSupportedClaims(item);
  const claimsNeedingCare = countClaimsNeedingCare(item);
  const highRiskClaims = countHighRiskClaims(item);
  const firstHighRiskClaim = item.claims.find((claim) => statusClass(claim.risk) === "danger");
  const highRiskDetail = firstHighRiskClaim?.text || t("noHighRiskClaims");
  const cards = [
    {
      label: t("totalClaims"),
      value: item.claims.length,
      detail: t("claimMatrixHeading"),
      tone: item.claims.length ? "warning" : "neutral",
    },
    {
      label: t("claimsWithSupport"),
      value: strongSupported,
      detail: t("publishRule"),
      tone: strongSupported ? "success" : "warning",
    },
    {
      label: t("claimsNeedingCare"),
      value: claimsNeedingCare,
      detail: t("workflowClaimsCopy"),
      tone: claimsNeedingCare ? "warning" : "success",
    },
    {
      label: t("highRiskClaims"),
      value: highRiskClaims,
      detail: highRiskDetail,
      tone: highRiskClaims ? "danger" : "success",
    },
  ];

  return `
    <section class="claim-dashboard">
      <div class="section-header compact-header">
        <div>
          <p class="eyebrow">${t("claimDashboardTitle")}</p>
          <h3>${t("claimDashboardCopy")}</h3>
        </div>
        ${helpTip(t("workflowClaimsCopy"))}
      </div>
      <div class="claim-dashboard-grid">
        ${cards
          .map(
            (card) => `
              <article class="summary-tile compact-summary ${card.tone}">
                <span>${card.label}</span>
                <strong>${card.value}</strong>
                <p>${escapeHtml(card.detail)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderClaimAddForm() {
  return renderAddDisclosure({
    eyebrow: t("claims"),
    title: t("addClaimTitle"),
    copy: t("workflowClaimsCopy"),
    notice: state.claimNotice,
    success: t("claimAdded"),
    content: `
      <section class="panel create-form request-add-form">
      <label>
        <span>${t("claimTextLabel")}</span>
        <textarea data-claim-field="text" rows="3" placeholder="${t("claimTextPlaceholder")}">${escapeHtml(state.claimDraft.text)}</textarea>
      </label>
      <label>
        <span>${t("claimEvidenceLabel")}</span>
        <textarea data-claim-field="evidence" rows="3" placeholder="${t("claimEvidencePlaceholder")}">${escapeHtml(state.claimDraft.evidence)}</textarea>
      </label>
      <div class="form-grid">
        <label>
          <span>${t("claimTypeLabel")}</span>
          <input data-claim-field="type" value="${escapeHtml(state.claimDraft.type)}" placeholder="${t("claim")}">
        </label>
        <label>
          <span>${t("claimRelationLabel")}</span>
          <input data-claim-field="relation" value="${escapeHtml(state.claimDraft.relation)}" list="relation-options" placeholder="${t("evidenceRelation")}">
        </label>
        <label>
          <span>${t("claimStrengthLabel")}</span>
          <input data-claim-field="strength" value="${escapeHtml(state.claimDraft.strength)}" list="strength-options" placeholder="${t("reviewRecommended")}">
        </label>
        <label>
          <span>${t("claimRiskLabel")}</span>
          <input data-claim-field="risk" value="${escapeHtml(state.claimDraft.risk)}" list="risk-options" placeholder="${t("risk")}">
        </label>
        <label>
          <span>${t("claimStatusLabel")}</span>
          <input data-claim-field="status" value="${escapeHtml(state.claimDraft.status)}" list="status-options" placeholder="${t("reviewRecommended")}">
        </label>
      </div>
      <div class="form-actions">
        <button class="button secondary active-secondary" data-action="add-claim" type="button">${t("addClaimButton")}</button>
      </div>
      </section>
    `,
  });
}

function renderQaModel() {
  const localized = (value) => (typeof value === "string" ? value : value[state.locale] || value.pt || value.en);

  return `
    <section class="content-header process-header">
      <p class="eyebrow">${t("qaModelTitle")}</p>
      <h2>${t("qaModelHeading")}</h2>
      <p>${t("qaModelCopy")}</p>
    </section>
    <div class="qa-model-grid">
      <article class="panel">
        <h3>${t("glossaryTerms")}</h3>
        <div class="definition-list">
          ${qaModel.glossary
            .map(
              (entry) => `
                <div>
                  <strong>${entry.term}</strong>
                  <p>${entry.meaning}</p>
                  <small>${entry.qaRule}</small>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="panel">
        <h3>${t("statusRegistry")}</h3>
        <div class="definition-list">
          ${qaModel.statuses
            .map(
              (entry) => `
                <div>
                  <strong>${entry.entity}</strong>
                  <p>${entry.values}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="panel">
        <h3>${t("evidenceRelations")}</h3>
        <div class="definition-list">
          ${qaModel.evidenceRelations
            .map(
              (entry) => `
                <div>
                  <span class="pill ${statusClass(entry.relation)}">${entry.relation}</span>
                  <p>${entry.meaning}</p>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="panel">
        <h3>${t("strengthScale")}</h3>
        <div class="definition-list">
          ${qaModel.strengthScale
            .map(
              (entry) => `
                <div>
                  <span class="pill ${statusClass(entry.level)}">${entry.level}</span>
                  <p>${entry.meaning}</p>
                  <small>${t("publishRule")}: ${entry.publishRule}</small>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="panel">
        <h3>${t("riskScale")}</h3>
        <div class="definition-list">
          ${qaModel.riskScale
            .map(
              (entry) => `
                <div>
                  <span class="pill ${statusClass(entry.level)}">${entry.level}</span>
                  <p>${entry.meaning}</p>
                  <small>${t("requiredAction")}: ${entry.requiredAction}</small>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
      <article class="panel">
        <h3>${t("acceptanceCriteria")}</h3>
        <ul class="review-list">
          ${qaModel.acceptanceCriteria.map((criterion) => `<li>${criterion}</li>`).join("")}
        </ul>
      </article>
    </div>
    <section class="content-header process-header">
      <p class="eyebrow">${t("dataModel")}</p>
      <h2>${t("relationship")}</h2>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>${t("type")}</th><th>${t("relationship")}</th><th>${t("qaExpectation")}</th></tr>
        </thead>
        <tbody>
          ${qaModel.dataModel
            .map(
              (entry) => `
                <tr>
                  <td>${entry.entity}</td>
                  <td>${entry.relation}</td>
                  <td>${entry.qaRule}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <section class="content-header process-header">
      <p class="eyebrow">${t("accessibilityChecks")}</p>
      <h2>${t("acceptanceCriteria")}</h2>
    </section>
    <article class="panel">
      <ul class="review-list">
        ${qaModel.accessibilityChecks.map((criterion) => `<li>${criterion}</li>`).join("")}
      </ul>
    </article>
    <section class="content-header process-header">
      <p class="eyebrow">${t("functionalCoverage")}</p>
      <h2>${t("testingTitle")}</h2>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>${t("functionalCoverage")}</th><th>${t("qaExpectation")}</th><th>${t("prototypeCoverage")}</th><th>${t("status")}</th></tr>
        </thead>
        <tbody>
          ${qaModel.functionalChecks
            .map(
              (check) => `
                <tr>
                  <td>${localized(check.item)}</td>
                  <td>${localized(check.expectation)}</td>
                  <td>${localized(check.coverage)}</td>
                  <td><span class="pill ${statusClass(localized(check.status))}">${localized(check.status)}</span></td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderQaChecklist(item) {
  const checklist = item.qaChecklist || [];
  const blockers = countQaBlockers(item);
  const rules = item.methodRules || [];
  const blockerCopy = blockers
    ? `${blockers} ${t(blockers === 1 ? "qaBlockerSingular" : "qaBlockerPlural")}`
    : t("qaNoBlockers");

  return `
    <section class="content-header">
      <p class="eyebrow">${t("qaChecklist")}</p>
      <h2>${t("qaChecklistHeading")}</h2>
      <p>${blockerCopy}</p>
    </section>
    <div class="qa-grid">
      ${checklist
        .map(
          (item) => `
            <article class="panel qa-card">
              <div class="card-footer top">
                <div>
                  <p class="eyebrow">${item.area}</p>
                  <h3>${item.question}</h3>
                </div>
                <div class="pill-column">
                  <span class="pill ${statusClass(item.status)}">${item.status}</span>
                  <span class="pill ${statusClass(item.risk)}">${item.risk} ${t("riskSuffix")}</span>
                </div>
              </div>
              <p><strong>${t("action")}:</strong> ${item.action}</p>
            </article>
          `,
        )
        .join("")}
    </div>
    ${renderFullFlowTestScript()}
    ${renderQaModel()}
    ${
      rules.length
        ? `<section class="content-header process-header">
            <p class="eyebrow">${t("editorialSafeguards")}</p>
            <h2>${t("editorialSafeguardsHeading")}</h2>
          </section>
          <div class="safeguard-grid">
            ${rules
              .map(
                (rule) => `
                  <article class="panel safeguard-card">
                    <h3>${rule.rule}</h3>
                    <p>${rule.productUse}</p>
                  </article>
                `,
              )
              .join("")}
          </div>`
        : ""
    }
  `;
}

function renderFullFlowTestScript() {
  const steps = [
    {
      target: "overview",
      title: t("testStepOpen"),
      expected: t("testStepOpenExpected"),
    },
    {
      target: "plan",
      title: t("testStepPlan"),
      expected: t("testStepPlanExpected"),
    },
    {
      target: "requests",
      title: t("testStepRequests"),
      expected: t("testStepRequestsExpected"),
    },
    {
      target: "claims",
      title: t("testStepClaims"),
      expected: t("testStepClaimsExpected"),
    },
    {
      target: "methodology",
      title: t("testStepMethod"),
      expected: t("testStepMethodExpected"),
    },
  ];

  return `
    <section class="content-header process-header">
      <p class="eyebrow">${t("fullFlowTestTitle")}</p>
      <h2>${t("fullFlowTestHeading")}</h2>
    </section>
    <div class="full-flow-test">
      ${steps
        .map(
          (step, index) => `
            <button class="test-step-card" data-action="tab" data-tab="${step.target}">
              <span class="workflow-index">${index + 1}</span>
              <strong>${step.title}</strong>
              <small>${t("testExpected")}: ${step.expected}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function methodologyMarkdown(item) {
  const labels =
    state.locale === "pt"
      ? {
          title: "Nota metodológica",
          centralQuestion: "Pergunta central",
          secondaryQuestions: "Perguntas secundárias",
          noSecondaryQuestions: "Nenhuma pergunta secundaria registrada.",
          workingHypotheses: "Hipóteses de trabalho",
          scope: "Escopo",
          countryJurisdiction: "País/jurisdição",
          territory: "Território",
          period: "Período",
          jurisdictionRules: "Jurisdição e regras de acesso",
          framework: "Base legal",
          deadline: "Prazo",
          escalation: "Escalonamento",
          warning: "Alerta",
          noJurisdictionRule: "Nenhuma regra de jurisdição registrada.",
          sourceDiscovery: "Descoberta de fontes",
          verify: "Verificar",
          noSourceDiscovery: "Nenhum mapa de descoberta de fontes registrado.",
          sources: "Fontes, bases e documentos",
          limits: "Limites",
          noSources: "Nenhuma fonte registrada.",
          languageLocalization: "Idioma e localização",
          workingLanguage: "Idioma de trabalho",
          interfaceLanguages: "Idiomas da interface",
          publicationLanguages: "Idiomas de publicação",
          localizationNotes: "Notas de localização",
          noLanguagePlan: "Nenhum plano de idioma registrado.",
          requestsTracked: "Pedidos acompanhados",
          responsesReviewed: "Respostas revisadas",
          noResponsesReviewed: "Nenhuma resposta revisada registrada.",
          material: "Material",
          gap: "Lacuna",
          decision: "Decisão",
          currentCheckpoint: "Checkpoint atual",
          transparencyLog: "Diário de transparência",
          next: "Próximo passo",
          noTransparencyLog: "Nenhum diário de transparência registrado.",
          requestComparison: "Comparação pedido-resposta",
          followUpDrafts: "Rascunhos de follow-up",
          reporterCheck: "Checagem da repórter",
          noFollowUps: "Nenhum rascunho de follow-up registrado.",
          actionPlan: "Plano de ação",
          dueCheckpoint: "prazo/checkpoint",
          noDate: "sem data",
          output: "Saída",
          noActionPlan: "Nenhum plano de ação registrado.",
          freshnessReview: "Atualidade e revisão",
          noFreshness: "Nenhum alerta de atualidade registrado.",
          qaChecklist: "Checklist QA",
          risk: "risco",
          noQa: "Nenhum checklist QA registrado.",
          methodSafeguards: "Salvaguardas metodológicas",
          productUse: "Uso no produto",
          noSafeguards: "Nenhuma salvaguarda metodológica registrada.",
          gaps: "Lacunas e limites abertos",
          mainClaims: "Afirmações principaís",
          evidenceRelation: "relação da evidência",
        }
      : state.locale === "es"
        ? {
            title: "Nota metodológica",
            centralQuestion: "Pregunta central",
            secondaryQuestions: "Preguntas secundárias",
            noSecondaryQuestions: "Ninguna pregunta secundaria registrada.",
            workingHypotheses: "Hipotesis de trabajo",
            scope: "Alcance",
            countryJurisdiction: "País/jurisdiccion",
            territory: "Território",
            period: "Período",
            jurisdictionRules: "Jurisdiccion y reglas de acceso",
            framework: "Base legal",
            deadline: "Plazo",
            escalation: "Escalamiento",
            warning: "Alerta",
            noJurisdictionRule: "Ninguna regla de jurisdiccion registrada.",
            sourceDiscovery: "Descubrimiento de fuentes",
            verify: "Verificar",
            noSourceDiscovery: "Ningun mapa de descubrimiento de fuentes registrado.",
            sources: "Fuentes, bases y documentos",
            limits: "Limites",
            noSources: "Ninguna fuente registrada.",
            languageLocalization: "Idioma y localizacion",
            workingLanguage: "Idioma de trabajo",
            interfaceLanguages: "Idiomas de la interfaz",
            publicationLanguages: "Idiomas de públicacion",
            localizationNotes: "Notas de localizacion",
            noLanguagePlan: "Ningun plan de idioma registrado.",
            requestsTracked: "Solicitudes acompanadas",
            responsesReviewed: "Respuestas revisadas",
            noResponsesReviewed: "Ninguna respuesta revisada registrada.",
            material: "Material",
            gap: "Vacio",
            decision: "Decision",
            currentCheckpoint: "Checkpoint actual",
            transparencyLog: "Diário de transparência",
            next: "Próximo paso",
            noTransparencyLog: "Ningun diário de transparência registrado.",
            requestComparison: "Comparacion solicitud-respuesta",
            followUpDrafts: "Borradores de seguimiento",
            reporterCheck: "Chequeo de la repórtera",
            noFollowUps: "Ningun borrador de seguimiento registrado.",
            actionPlan: "Plan de accion",
            dueCheckpoint: "plazo/checkpoint",
            noDate: "sin fecha",
            output: "Salida",
            noActionPlan: "Ningun plan de accion registrado.",
            freshnessReview: "Actualidad y revision",
            noFreshness: "Ninguna alerta de actualidad registrada.",
            qaChecklist: "Checklist QA",
            risk: "riesgo",
            noQa: "Ningun checklist QA registrado.",
            methodSafeguards: "Salvaguardas metodológicas",
            productUse: "Uso en el producto",
            noSafeguards: "Ninguna salvaguarda metodológica registrada.",
            gaps: "Vacios y limites abiertos",
            mainClaims: "Afirmaciones principales",
            evidenceRelation: "relacion de evidência",
          }
      : {
          title: "Methodological note",
          centralQuestion: "Central question",
          secondaryQuestions: "Secondary questions",
          noSecondaryQuestions: "No secondary questions recorded.",
          workingHypotheses: "Working hypotheses",
          scope: "Scope",
          countryJurisdiction: "Country/jurisdiction",
          territory: "Territory",
          period: "Period",
          jurisdictionRules: "Jurisdiction and access rules",
          framework: "Framework",
          deadline: "Deadline",
          escalation: "Escalation",
          warning: "Warning",
          noJurisdictionRule: "No jurisdiction rule recorded.",
          sourceDiscovery: "Source discovery",
          verify: "Verify",
          noSourceDiscovery: "No source discovery map recorded.",
          sources: "Sources, databases and documents",
          limits: "Limits",
          noSources: "No sources recorded.",
          languageLocalization: "Language and localization",
          workingLanguage: "Working language",
          interfaceLanguages: "Interface languages",
          publicationLanguages: "Publication languages",
          localizationNotes: "Localization notes",
          noLanguagePlan: "No language plan recorded.",
          requestsTracked: "Requests tracked",
          responsesReviewed: "Responses reviewed",
          noResponsesReviewed: "No reviewed responses recorded.",
          material: "Material",
          gap: "Gap",
          decision: "Decision",
          currentCheckpoint: "Current checkpoint",
          transparencyLog: "Transparency log",
          next: "Next",
          noTransparencyLog: "No transparency log recorded.",
          requestComparison: "Request comparison",
          followUpDrafts: "Follow-up drafts",
          reporterCheck: "Reporter check",
          noFollowUps: "No follow-up drafts recorded.",
          actionPlan: "Action plan",
          dueCheckpoint: "due/checkpoint",
          noDate: "no date",
          output: "Output",
          noActionPlan: "No action plan recorded.",
          freshnessReview: "Freshness and review",
          noFreshness: "No freshness warning recorded.",
          qaChecklist: "QA checklist",
          risk: "risk",
          noQa: "No QA checklist recorded.",
          methodSafeguards: "Method safeguards",
          productUse: "Product use",
          noSafeguards: "No method safeguards recorded.",
          gaps: "Open gaps and limitations",
          mainClaims: "Main claims",
          evidenceRelation: "evidence relation",
        };
  const requests = item.requests
    .map((request) => {
      const checkpoint = request.currentCheckpoint
        ? ` ${labels.currentCheckpoint}: ${request.currentCheckpoint.date} / ${request.currentCheckpoint.label}.`
        : "";
      return `- ${request.title}: ${request.status}.${checkpoint}`;
    })
    .join("\n");
  const comparisons = item.requestComparisons
    .map((comparison) => `- ${comparison.requestTitle}: ${comparison.editorialDecision}; ${labels.next}: ${comparison.nextStep}`)
    .join("\n");
  const responseReviews = item.requests
    .map((request) => {
      const comparison = item.requestComparisons.find((entry) => entry.requestTitle === request.title);
      const material = comparison?.received || request.responseSummary || t("noReceivedMaterial");
      const gap = comparison?.missing || t("noComparisonYet");
      const decision = comparison?.editorialDecision || t("noComparisonYet");
      return `- ${request.title}: ${request.status}. ${labels.material}: ${material} ${labels.gap}: ${gap} ${labels.decision}: ${decision}`;
    })
    .join("\n");
  const reviews = (item.nextReviewItems || []).map((reviewItem) => `- ${reviewItem}`).join("\n");
  const law = item.accessLaw
    ? `- ${labels.framework}: ${item.accessLaw.framework}\n- ${labels.deadline}: ${item.accessLaw.deadline}\n- ${labels.escalation}: ${item.accessLaw.escalation}\n- ${labels.warning}: ${item.accessLaw.reporterWarning}`
    : labels.noJurisdictionRule;
  const sourceDiscovery = (item.sourceDiscovery || [])
    .map((source) => `- ${source.source}: ${source.purpose}. ${labels.verify}: ${source.verification}`)
    .join("\n");
  const sources = (item.sources || [])
    .map((source) => `- ${source.name} (${source.type}; ${source.status}): ${source.use} ${labels.limits}: ${source.limits}`)
    .join("\n");
  const transparencyLog = (item.transparencyLog || [])
    .map((event) => `- ${event.date} / ${event.actor}: ${event.status}. ${event.event} ${labels.next}: ${event.nextStep}`)
    .join("\n");
  const languagePlan = item.languagePlan
    ? `- ${labels.workingLanguage}: ${item.languagePlan.workingLanguage}\n- ${labels.interfaceLanguages}: ${item.languagePlan.interfaceLanguages.join(", ")}\n- ${labels.publicationLanguages}: ${item.languagePlan.publicationLanguages.join(", ")}\n- ${labels.localizationNotes}: ${item.languagePlan.localizationNotes.join(" ")}`
    : labels.noLanguagePlan;
  const followUps = (item.followUpDrafts || [])
    .map((draft) => `- ${draft.title} (${draft.type}): ${draft.status}. ${labels.reporterCheck}: ${draft.riskNote}`)
    .join("\n");
  const actionItems = (item.actionItems || [])
    .map(
      (action) =>
        `- ${action.action} (${action.priority}; ${action.status}; ${labels.dueCheckpoint}: ${action.dueDate || labels.noDate}). ${labels.output}: ${action.output}`,
    )
    .join("\n");
  const qaItems = (item.qaChecklist || [])
    .map((qaItem) => `- ${qaItem.area}: ${qaItem.status} (${qaItem.risk} ${labels.risk}). ${t("action")}: ${qaItem.action}`)
    .join("\n");
  const secondaryQuestions = (item.secondaryQuestions || []).map((question) => `- ${question}`).join("\n");
  const hypotheses = item.hypotheses.map((hypothesis) => `- ${hypothesis.text} (${hypothesis.status})`).join("\n");
  const methodRules = (item.methodRules || [])
    .map((rule) => `- ${rule.rule} ${labels.productUse}: ${rule.productUse}`)
    .join("\n");
  const gaps = item.gaps.map((gap) => `- ${gap.description} (${gap.status})`).join("\n");
  const claims = item.claims
    .map((claim) => `- ${claim.text} - ${claim.status}; ${labels.evidenceRelation}: ${claim.relation || "not set"}`)
    .join("\n");

  return `# ${labels.title}: ${item.title}

## ${labels.centralQuestion}
${item.centralQuestion}

## ${labels.secondaryQuestions}
${secondaryQuestions || labels.noSecondaryQuestions}

## ${labels.workingHypotheses}
${hypotheses}

## ${labels.scope}
- ${labels.countryJurisdiction}: ${item.country} / ${item.jurisdiction}
- ${labels.territory}: ${item.territory}
- ${labels.period}: ${item.period}

## ${labels.jurisdictionRules}
${law}

## ${labels.sourceDiscovery}
${sourceDiscovery || labels.noSourceDiscovery}

## ${labels.sources}
${sources || labels.noSources}

## ${labels.languageLocalization}
${languagePlan}

## ${labels.requestsTracked}
${requests}

## ${labels.responsesReviewed}
${responseReviews || labels.noResponsesReviewed}

## ${labels.transparencyLog}
${transparencyLog || labels.noTransparencyLog}

## ${labels.requestComparison}
${comparisons}

## ${labels.followUpDrafts}
${followUps || labels.noFollowUps}

## ${labels.actionPlan}
${actionItems || labels.noActionPlan}

## ${labels.freshnessReview}
${item.freshness?.summary || labels.noFreshness}
${reviews}

## ${labels.qaChecklist}
${qaItems || labels.noQa}

## ${labels.methodSafeguards}
${methodRules || labels.noSafeguards}

## ${labels.gaps}
${gaps}

## ${labels.mainClaims}
${claims}
`;
}

function renderMethodology(item) {
  const markdown = methodologyMarkdown(item);
  return `
    <section class="content-header">
      <div>
        <p class="eyebrow">${t("methodologyNote")}</p>
        <h2>${t("methodologyHeading")}</h2>
      </div>
      <div class="button-row">
        <button class="button secondary active-secondary" data-action="export-json">${t("exportJson")}</button>
        <button class="button" data-action="copy-methodology">${t("copyMarkdown")}</button>
      </div>
    </section>
    <pre class="methodology" id="methodology-text">${markdown}</pre>
  `;
}

function investigationExportPayload(item) {
  return {
    schema: "evidence-desk-investigation-v0.1",
    exportedAt: new Date().toISOString(),
    exportedFrom: "Evidence Desk static prototype",
    locale: state.locale,
    investigation: item,
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function exportCurrentInvestigationJson(button) {
  const item = getCurrentInvestigation();
  const payload = investigationExportPayload(item);
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(item.title) || "evidence-desk-investigation"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  if (button) {
    const originalLabel = button.textContent;
    button.textContent = t("exportedJson");
    setTimeout(() => {
      button.textContent = originalLabel;
    }, 1500);
  }
}

function bindActions() {
  document.querySelectorAll("[data-action='dashboard']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "dashboard";
      resetDraft();
      saveUiState();
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-action='new-investigation']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "new-investigation";
      state.draftErrors = [];
      state.draftNotice = "";
      saveUiState();
      renderNewInvestigation();
    });
  });

  document.querySelectorAll("[data-action='reset-local-data']").forEach((button) => {
    button.addEventListener("click", () => {
      resetLocalInvestigations();
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-action='import-json']").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector("[data-role='json-import']")?.click();
    });
  });

  document.querySelectorAll("[data-role='json-import']").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = normalizeImportedInvestigation(JSON.parse(text));
        investigations = [imported, ...investigations];
        saveInvestigations();
        state.currentId = imported.id;
        state.currentTab = "overview";
        state.view = "investigation";
        saveUiState();
        renderInvestigation();
      } catch (error) {
        state.draftErrors = [t("importJsonError")];
        state.view = "new-investigation";
        saveUiState();
        renderNewInvestigation();
      } finally {
        input.value = "";
      }
    });
  });

  document.querySelectorAll("[data-action='set-locale']").forEach((button) => {
    button.addEventListener("click", () => {
      state.locale = button.dataset.locale;
      saveUiState();
      if (state.view === "investigation") {
        renderInvestigation();
        return;
      }
      if (state.view === "new-investigation") {
        renderNewInvestigation();
        return;
      }
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      state.filters[select.dataset.filter] = select.value;
      saveUiState();
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-action='clear-filters']").forEach((button) => {
    button.addEventListener("click", () => {
      state.filters = {
        status: "all",
        country: "all",
        language: "all",
        topic: "all",
      };
      saveUiState();
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.draft[field.dataset.field] = field.value;
      state.draftErrors = [];
      state.draftNotice = "";
      renderNewInvestigation();
      const nextField = document.querySelector(`[data-field='${field.dataset.field}']`);
      nextField?.focus();
      if (nextField && "selectionStart" in nextField) {
        nextField.selectionStart = field.selectionStart;
        nextField.selectionEnd = field.selectionEnd;
      }
    });
  });

  document.querySelectorAll("[data-plan-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.planDraft[field.dataset.planField] = field.value;
      state.planNotice = "";
    });
  });

  document.querySelectorAll("[data-request-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.requestDraft[field.dataset.requestField] = field.value;
      state.requestNotice = "";
    });
  });

  document.querySelectorAll("[data-comparison-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.comparisonDraft[field.dataset.comparisonField] = field.value;
      state.comparisonNotice = "";
    });
  });

  document.querySelectorAll("[data-follow-up-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.followUpDraft[field.dataset.followUpField] = field.value;
      state.followUpNotice = "";
    });
  });

  document.querySelectorAll("[data-transparency-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.transparencyDraft[field.dataset.transparencyField] = field.value;
      state.transparencyNotice = "";
    });
  });

  document.querySelectorAll("[data-action-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.actionDraft[field.dataset.actionField] = field.value;
      state.actionNotice = "";
    });
  });

  document.querySelectorAll("[data-gap-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.gapDraft[field.dataset.gapField] = field.value;
      state.gapNotice = "";
    });
  });

  document.querySelectorAll("[data-claim-field]").forEach((field) => {
    field.addEventListener("input", () => {
      state.claimDraft[field.dataset.claimField] = field.value;
      state.claimNotice = "";
    });
  });

  document.querySelectorAll("[data-action='validate-draft']").forEach((button) => {
    button.addEventListener("click", () => {
      validateDraft();
      renderNewInvestigation();
    });
  });

  document.querySelectorAll("[data-action='create-investigation']").forEach((button) => {
    button.addEventListener("click", () => {
      if (persistCreatedInvestigation()) {
        renderInvestigation();
        return;
      }
      renderNewInvestigation();
    });
  });

  document.querySelectorAll("[data-action='open']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "investigation";
      state.currentId = button.dataset.id;
      state.currentTab = "overview";
      saveUiState();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='tab']").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentTab = button.dataset.tab;
      saveUiState();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-hypothesis']").forEach((button) => {
    button.addEventListener("click", () => {
      addHypothesisToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-evidence-block']").forEach((button) => {
    button.addEventListener("click", () => {
      addEvidenceBlockToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-source']").forEach((button) => {
    button.addEventListener("click", () => {
      addSourceToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='save-lai-review']").forEach((button) => {
    button.addEventListener("click", () => saveLaiReview(button.closest('[data-lai-request]')));
  });
  document.querySelectorAll('[data-lai-files]').forEach(field => {
    field.addEventListener('change', () => importLaiFiles(field.closest('[data-lai-request]'), field));
  });
  document.querySelectorAll('[data-action="save-lai-deadline"]').forEach(button => {
    button.addEventListener('click', () => saveLaiDeadline(button.closest('[data-lai-request]')));
  });

  document.querySelectorAll("[data-action='analyze-lai']").forEach(button => {
    button.addEventListener('click', () => analyzeLaiCard(button.closest('[data-lai-request]'), button));
  });
  document.querySelectorAll('[data-lai-response], [data-lai-attachments]').forEach(field => {
    field.addEventListener('input', () => {
      const card = field.closest('[data-lai-request]');
      if (!card.laiCandidate) return;
      const notes = card.querySelector('[data-lai-notes]');
      if (notes.value === card.laiCandidate.generatedNotes) notes.value = '';
      delete card.laiCandidate;
      card.querySelector('[data-lai-result]').value = 'unknown';
      card.querySelector('[data-lai-analysis]').textContent = 'Os textos mudaram. Analise novamente para atualizar a comparação.';
    });
  });
  checkLaiService();

  document.querySelectorAll("[data-action='add-request']").forEach((button) => {
    button.addEventListener("click", () => {
      addRequestToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-comparison']").forEach((button) => {
    button.addEventListener("click", () => {
      addComparisonToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-follow-up']").forEach((button) => {
    button.addEventListener("click", () => {
      addFollowUpToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-transparency-event']").forEach((button) => {
    button.addEventListener("click", () => {
      addTransparencyEventToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-action-item']").forEach((button) => {
    button.addEventListener("click", () => {
      addActionToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-gap']").forEach((button) => {
    button.addEventListener("click", () => {
      addGapToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='add-claim']").forEach((button) => {
    button.addEventListener("click", () => {
      addClaimToCurrent();
      renderInvestigation();
    });
  });

  document.querySelectorAll("[data-action='copy-methodology']").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = document.querySelector("#methodology-text")?.innerText || "";
      await navigator.clipboard.writeText(text);
      button.textContent = t("copied");
      setTimeout(() => {
        button.textContent = t("copyMarkdown");
      }, 1500);
    });
  });

  document.querySelectorAll("[data-action='export-json']").forEach((button) => {
    button.addEventListener("click", () => {
      exportCurrentInvestigationJson(button);
    });
  });
}

if (state.view === "investigation") {
  renderInvestigation();
} else if (state.view === "new-investigation") {
  renderNewInvestigation();
} else {
  renderDashboard();
}
