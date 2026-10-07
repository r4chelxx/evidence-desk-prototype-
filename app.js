import { investigations, mvpCoverage, prototypeLimits, qaModel, roadmap, testPlan } from "./data.js?v=20261007-qa4";

const state = {
  view: "dashboard",
  currentId: investigations[0].id,
  currentTab: "overview",
  locale: "pt",
  filters: {
    status: "all",
    country: "all",
    language: "all",
    topic: "all",
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
};

const app = document.querySelector("#app");

const dictionary = {
  pt: {
    all: "Todos",
    languageToggle: "Idioma da interface",
    topbarNote: "Fluxo de investigacao para jornalismo de interesse publico",
    goDashboard: "Voltar ao painel",
    heroEyebrow: "MVP v0.1",
    heroTitle: "Transforme perguntas investigativas em evidencias, lacunas e afirmacoes publicaveis.",
    heroCopy:
      "Este prototipo estatico testa o fluxo central antes de backend, login ou IA: mapear evidencias, acompanhar pedidos, comparar respostas e ligar afirmacoes a provas.",
    prototypeGoal: "Objetivo do prototipo",
    prototypeGoalText: "Validar se o metodo ajuda jornalistas a trabalhar com menos caos.",
    investigations: "Investigacoes",
    testCases: "Casos de teste",
    shown: "investigacoes exibidas",
    newInvestigation: "Nova investigacao",
    status: "Status",
    country: "Pais",
    language: "Idioma",
    topic: "Tema",
    reset: "Limpar",
    openInvestigation: "Abrir investigacao",
    requests: "Pedidos",
    responses: "Respostas",
    followUps: "Acompanhamentos",
    qaBlockers: "bloqueios de QA",
    emptyTitle: "Nenhuma investigacao corresponde aos filtros.",
    emptyCopy: "Tente outro pais, idioma, tema ou status. Isso testa o estado vazio previsto no MVP.",
    clearFilters: "Limpar filtros",
    buildRoadmap: "Roadmap do produto",
    roadmapTitle: "O que este prototipo testa antes de a engenharia ficar cara",
    fellowshipScope: "escopo fellowship",
    validationQuestion: "Pergunta de validacao",
    mvpCoverage: "Cobertura do MVP",
    mvpCoverageTitle: "Checklist contra o documento original",
    mvpCoverageBadge: "revisao PRD",
    expectedInDoc: "Previsto no documento",
    implementedInPrototype: "No prototipo",
    testingGuide: "Guia de teste",
    testingTitle: "O que QA e jornalistas devem testar primeiro",
    testScript: "roteiro v0.1",
    coreTasks: "Tarefas centrais",
    feedbackQuestions: "Perguntas de feedback",
    acceptanceCriteria: "Criterios de aceitacao",
    back: "Voltar para investigacoes",
    overview: "Visao geral",
    jurisdiction: "Jurisdicao",
    languageTab: "Idioma",
    hypotheses: "Hipoteses",
    evidenceBlocks: "Blocos de evidencia",
    sources: "Fontes",
    deadlines: "Prazos",
    actionPlan: "Plano de acao",
    editorialQueue: "Fila editorial",
    transparencyLog: "Diario de transparencia",
    requestComparison: "Comparacao de pedidos",
    gaps: "Lacunas",
    claims: "Afirmacoes",
    qaChecklist: "Checklist QA",
    methodology: "Metodologia",
    evidenceBlocksMetric: "blocos de evidencia",
    lateRequests: "pedidos atrasados",
    openGaps: "lacunas abertas",
    claimsReview: "afirmacoes a revisar",
    reviewItems: "itens de revisao",
    actionItems: "acoes",
    queueItems: "itens na fila",
    centralQuestion: "Pergunta central",
    quickActions: "Acoes rapidas",
    quickActionsCopy: "Atalhos para testar o fluxo central previsto no wireframe.",
    addHypothesis: "Adicionar hipotese",
    mapEvidence: "Mapear evidencia",
    registerRequest: "Registrar pedido",
    reviewResponse: "Revisar resposta",
    openQueue: "Abrir fila",
    addClaim: "Adicionar afirmacao",
    exportMethodology: "Exportar metodologia",
    exportJson: "Exportar JSON",
    exportedJson: "JSON exportado",
    deadlinesNext: "Prazos e proximos passos",
    deadlinesTitle: "Saiba quando esperar, checar, contestar ou escalar.",
    sent: "Enviado",
    originalDue: "Prazo original",
    currentCheckpoint: "Checkpoint atual",
    checkpointSource: "Fonte do checkpoint",
    suggestedAction: "Acao sugerida",
    noDate: "Sem data definida",
    priorityPrefix: "Prioridade",
    owner: "Responsavel",
    dueCheckpoint: "Prazo/checkpoint",
    type: "Tipo",
    whyItMatters: "Por que importa",
    output: "Saida esperada",
    actionPlanTitle: "Transforme o log da apuracao em uma fila controlada de proximos passos.",
    actionPlanCopy: "Cada acao deve estar ligada a uma fonte, protocolo ou evento procedimental documentado.",
    editorialQueueTitle: "Fila editorial",
    editorialQueueHeading: "Veja o que precisa de decisao humana antes de publicar ou automatizar.",
    editorialQueueCopy: "A fila combina checkpoints, revisoes e acoes prioritarias sem transformar pendencia em conclusao.",
    queueDeadlines: "Checkpoints ativos",
    queueReviews: "Revisoes editoriais",
    queueActions: "Acoes prioritarias",
    queueEmpty: "Nenhum item prioritario registrado.",
    queueRule: "Regra da fila",
    queueRuleCopy: "Cada item precisa apontar para protocolo, fonte, prazo ou lacuna antes de virar tarefa de reportagem.",
    priority: "prioridade",
    requestLabel: "Pedido",
    protocol: "Protocolo",
    due: "Prazo",
    requested: "Solicitado",
    response: "Resposta",
    responsesTitle: "Respostas recebidas",
    responsesHeading: "Revise o que chegou antes de transformar resposta em evidencia.",
    responseStatus: "Status da resposta",
    receivedMaterials: "Material recebido",
    identifiedGaps: "Lacunas identificadas",
    reviewDecision: "Decisao de revisao",
    noReceivedMaterial: "Nenhum material recebido ou verificavel ainda.",
    noComparisonYet: "Comparacao detalhada ainda nao registrada.",
    responseReviewRule: "Regra de revisao",
    responseReviewRuleCopy: "Uma resposta so vira evidencia depois de abrir arquivos, conferir anexos, checar campos e registrar limites.",
    ifNothingArrives: "Se nada chegar",
    requestsEyebrow: "Pedidos",
    requestsTitle: "Acompanhe pedidos feitos fora da plataforma.",
    methodSafeguards: "Salvaguardas metodologicas",
    methodSafeguardsTitle: "Regras que impedem a ferramenta de exagerar evidencias.",
    processGuide: "Guia de processo",
    processGuideTitle: "Fluxo atento a jurisdicao, ainda controlado pela reporter.",
    transparencyLogTitle: "Diario de transparencia",
    transparencyLogHeading: "Acompanhe o historico processual sem tratar movimentacao como entrega de evidencia.",
    transparencyLogCopy: "Use este log para separar pedido, encaminhamento, resposta parcial, recurso e entrega real de documentos.",
    noTransparencyTitle: "Ainda nao ha diario de transparencia.",
    noTransparencyCopy: "Adicione eventos processuais conforme pedidos avancem por recursos ou revisao.",
    nextStep: "Proximo passo",
    requestComparisonTitle: "Comparacao de pedidos",
    requestComparisonHeading: "Compare o que foi pedido, o que chegou e o que ainda exige acao.",
    expected: "Esperado",
    received: "Recebido",
    missingUnclear: "Ausente ou pouco claro",
    editorialDecision: "Decisao editorial",
    followUpDraftsTitle: "Rascunhos de follow-up",
    followUpDraftsHeading: "Prepare mensagens e recursos sem enviar nada automaticamente.",
    followUpDraftsCopy: "Cada rascunho e ponto de partida para revisao humana, nao orientacao juridica nem peticao pronta.",
    relatedRequest: "Pedido relacionado",
    reporterCheck: "Checagem da reporter",
    gapsTitle: "Lacunas e proximos passos",
    gapsHeading: "Transforme evidencias ausentes em acoes de follow-up.",
    origin: "Origem",
    claimMatrixTitle: "Matriz afirmacao-evidencia",
    claimMatrixHeading: "Verifique se afirmacoes publicaveis estao sustentadas.",
    claim: "Afirmacao",
    evidence: "Evidencia",
    evidenceRelation: "Relacao",
    strength: "Forca",
    risk: "Risco",
    qaModelTitle: "Modelo QA v0.2",
    qaModelHeading: "Glossario, status fechados e evidencias contraditorias.",
    qaModelCopy: "Rodada baseada na revisao de QA: o prototipo agora registra se uma evidencia sustenta, contradiz ou limita uma afirmacao.",
    glossaryTerms: "Glossario operacional",
    statusRegistry: "Lista fechada de status",
    evidenceRelations: "Relacoes de evidencia",
    functionalCoverage: "Cobertura funcional",
    qaExpectation: "Criterio QA",
    prototypeCoverage: "Cobertura no prototipo",
    methodologyNote: "Nota metodologica",
    methodologyHeading: "Exporte um resumo transparente de evidencias, pedidos e limites.",
    qaChecklistHeading: "Revise riscos antes de tratar evidencias como publicaveis.",
    qaNoBlockers: "Nenhum bloqueio de QA registrado.",
    qaBlockerSingular: "bloqueio precisa de atencao antes de demo ou publicacao.",
    qaBlockerPlural: "bloqueios precisam de atencao antes de demo ou publicacao.",
    riskSuffix: "risco",
    action: "Acao",
    editorialSafeguards: "Salvaguardas editoriais",
    editorialSafeguardsHeading: "Nao transforme problemas de acesso em afirmacoes sem evidencia.",
    noActionTitle: "Ainda nao ha plano de acao.",
    noActionCopy: "Adicione tarefas revisadas pela reporter depois de cada pedido, recurso ou revisao de resposta.",
    separateTrackAction: "Mantenha este fluxo em um log separado e atualize somente quando o proprio canal retornar resposta.",
    checkpointPassed: "Checkpoint ultrapassado.",
    partialAction: "Compare os campos solicitados com os registros entregues e envie follow-up focado nos itens ausentes.",
    brokenAction: "Documente o problema de acesso com prints e solicite link valido ou reenvio do arquivo.",
    overdueAction: "Prepare uma nota de escalonamento com protocolo, datas, texto do pedido e prova da ausencia de resposta.",
    nearDeadlineAction: "Prepare agora a checklist de recebimento para revisar rapidamente o material quando chegar.",
    waitAction: "Aguarde, mantenha o protocolo organizado e confirme a proxima data de revisao no log da apuracao.",
    jurisdictionAccess: "Jurisdicao e regras de acesso",
    jurisdictionHeading: "Defina prazos e caminhos de fonte antes de usar assistencia por IA.",
    jurisdictionCopy: "A ferramenta deve guiar a reporter por regras conhecidas, nao inventa-las.",
    deadline: "Prazo",
    requestChannels: "Canais de pedido",
    escalation: "Escalonamento",
    reporterWarning: "Alerta para reporter",
    productRule: "Regra do produto",
    productRuleCopy:
      "Evidence Desk so pode sugerir proximos passos depois que a reporter seleciona jurisdicao, confirma o canal do pedido e revisa a regra de acesso relevante.",
    sourceDiscovery: "Descoberta de fontes",
    sourceDiscoveryHeading: "Comece por caminhos controlados, depois deixe a reporter verificar.",
    verify: "Verificar",
    languageLocalization: "Idioma e localizacao",
    languageHeading: "Separe traducao de localizacao juridica e editorial.",
    languageCopy: "Uma ferramenta global precisa de acesso multilingue, mas orientacao sobre lei de acesso ainda depende da jurisdicao.",
    languagePlan: "Plano de idioma",
    workingLanguage: "Idioma de trabalho",
    interfaceOptions: "Opcoes de interface",
    publicationLanguages: "Idiomas de publicacao",
    localizationRule: "Regra de localizacao",
    localizationRuleCopy:
      "Traduza livremente os rotulos da interface, mas localize leis, prazos, orgaos e tipos de fonte somente quando a jurisdicao for conhecida e revisada pela reporter.",
    translationNotes: "Notas de traducao",
    translationNotesHeading: "Termos que exigem revisao humana.",
    notes: "Notas",
    glossary: "Glossario",
    questionsHypotheses: "Perguntas e hipoteses",
    hypothesesHeading: "Divida a pergunta central em partes testaveis.",
    secondaryQuestions: "Perguntas secundarias",
    noSecondary: "Ainda nao ha perguntas secundarias registradas.",
    relatedEvidence: "Evidencia relacionada",
    evidenceBlocksTitle: "Blocos de evidencia",
    evidenceBlocksHeading: "Que tipos de prova sao necessarios?",
    evidenceBlocksCopy: "Blocos ajudam a separar o que precisa ser provado de onde a informacao pode ser encontrada.",
    block: "Bloco",
    priorityLabel: "Prioridade",
    sourcesTitle: "Fontes e bases de dados",
    sourcesHeading: "Separe fontes verificadas de caminhos provaveis.",
    limits: "Limites",
    copyMarkdown: "Copiar Markdown",
    copied: "Copiado",
    projectScope: "Escopo do projeto",
    topicLabel: "Tema",
    territory: "Territorio",
    period: "Periodo",
    updated: "Atualizado",
    editorialSafetyRule: "Regra de seguranca editorial",
    editorialSafetyCopy:
      "Lacunas nao sao conclusoes. Elas sao problemas de evidencia em aberto que exigem follow-up, limite metodologico ou reescrita da afirmacao.",
    freshnessCheck: "Checagem de atualidade",
    reviewRecommended: "Revisao recomendada",
    reviewLog: "Revise o log da investigacao antes de confiar neste caso.",
    separateTrack: "Fluxo separado",
    partialResponse: "Resposta parcial recebida",
    responseReceived: "Resposta recebida",
    daysToCheckpoint: "dias ate o checkpoint",
    dayToCheckpoint: "dia ate o checkpoint",
    daysLeft: "dias restantes",
    dayLeft: "dia restante",
    daysPastCheckpoint: "dias depois do checkpoint",
    dayPastCheckpoint: "dia depois do checkpoint",
    daysOverdue: "dias de atraso",
    dayOverdue: "dia de atraso",
    prototypeLimits: "Limites do prototipo",
    prototypeLimitsTitle: "O que esta testavel agora e o que ainda nao deve ser prometido",
    currentBehavior: "Comportamento atual",
    nextProductStep: "Proximo passo de produto",
    createTitle: "Comece com uma pergunta que a evidencia consegue responder.",
    createCopy:
      "Este formulario simulado testa o fluxo inicial do MVP. Ele valida campos obrigatorios, mostra a estrutura do projeto e mantem o salvamento desativado ate existir backend.",
    cancel: "Cancelar",
    reviewBeforeContinue: "Revise antes de continuar",
    investigationTitle: "Titulo da investigacao",
    investigationTitlePlaceholder: "ex.: Violencia obstetrica e transparencia de dados publicos",
    countryPlaceholder: "ex.: Brasil, Estados Unidos, Mexico",
    jurisdictionLocality: "Jurisdicao/localidade",
    jurisdictionPlaceholder: "ex.: Bahia, Cook County, Cidade do Mexico",
    primaryLanguage: "Idioma principal",
    primaryLanguagePlaceholder: "ex.: Portugues, Ingles, Espanhol",
    generalTopic: "Tema geral",
    topicPlaceholder: "ex.: Saude publica, educacao, meio ambiente",
    investigatedTerritory: "Territorio investigado",
    territoryPlaceholder: "ex.: Salvador e interior da Bahia",
    investigatedPeriod: "Periodo investigado",
    periodPlaceholder: "ex.: 2020-2026",
    centralInvestigativeQuestion: "Pergunta investigativa central",
    centralQuestionPlaceholder: "Que pergunta esta investigacao deve responder com evidencias?",
    centralQuestionHelp: "Obrigatorio. Prefira uma pergunta que possa ser respondida com documentos, dados, entrevistas ou respostas oficiais.",
    shortDescription: "Descricao curta",
    descriptionPlaceholder: "O que a pauta tenta entender?",
    validateStructure: "Validar estrutura",
    saveDraftAfterBackend: "Salvar rascunho apos backend",
    workspacePreview: "Previa do espaco de trabalho",
    untitledInvestigation: "Investigacao sem titulo",
    countryJurisdiction: "Pais/jurisdicao",
    starterStructure: "Estrutura inicial",
    sourcesDatabases: "Fontes/bases",
    notSet: "Nao definido",
    draftReady: "Estrutura pronta para a proxima etapa do MVP: mapear hipoteses e blocos de evidencia.",
    errorTitleRequired: "Adicione um titulo para a investigacao.",
    errorCountryRequired: "Adicione um pais.",
    errorLanguageRequired: "Adicione o idioma principal.",
    errorQuestionRequired: "Adicione uma pergunta investigativa central.",
    errorTitleSpecific: "Deixe o titulo mais especifico para QA entender o caso.",
    errorQuestionMark: "Formule a pergunta central como pergunta.",
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
    addHypothesis: "Add hypothesis",
    mapEvidence: "Map evidence",
    registerRequest: "Register request",
    reviewResponse: "Review response",
    openQueue: "Open queue",
    addClaim: "Add claim",
    exportMethodology: "Export methodology",
    exportJson: "Export JSON",
    exportedJson: "JSON exported",
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
    methodSafeguards: "Method safeguards",
    methodSafeguardsTitle: "Rules that keep the tool from overstating evidence.",
    processGuide: "Process guide",
    processGuideTitle: "Jurisdiction-aware workflow, still controlled by the reporter.",
    transparencyLogTitle: "Transparency log",
    transparencyLogHeading: "Track procedural history without treating movement as evidence delivery.",
    transparencyLogCopy: "Use this log to separate request, forwarding, partial response, appeal and actual document delivery.",
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
    questionsHypotheses: "Questions and hypotheses",
    hypothesesHeading: "Break the central question into testable parts.",
    secondaryQuestions: "Secondary questions",
    noSecondary: "No secondary questions recorded yet.",
    relatedEvidence: "Related evidence",
    evidenceBlocksTitle: "Evidence blocks",
    evidenceBlocksHeading: "What types of proof are needed?",
    evidenceBlocksCopy: "Blocks help separate what must be proven from where the information might be found.",
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
    countryPlaceholder: "e.g. Brazil, United States, Mexico",
    jurisdictionLocality: "Jurisdiction/locality",
    jurisdictionPlaceholder: "e.g. Bahia, Cook County, Mexico City",
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
  },
};

dictionary.es = {
  ...dictionary.pt,
  all: "Todos",
  languageToggle: "Idioma de la interfaz",
  topbarNote: "Flujo de investigacion para periodismo de interes publico",
  goDashboard: "Volver al panel",
  heroTitle: "Convierte preguntas investigativas en evidencias, vacios y afirmaciones publicables.",
  heroCopy:
    "Este prototipo estatico prueba el flujo central antes de backend, login o IA: mapear evidencias, seguir solicitudes, comparar respuestas y vincular afirmaciones a pruebas.",
  prototypeGoal: "Objetivo del prototipo",
  prototypeGoalText: "Validar si el metodo ayuda a periodistas a trabajar con menos caos.",
  investigations: "Investigaciones",
  testCases: "Casos de prueba",
  shown: "investigaciones mostradas",
  newInvestigation: "Nueva investigacion",
  country: "Pais",
  language: "Idioma",
  topic: "Tema",
  reset: "Limpiar",
  openInvestigation: "Abrir investigacion",
  requests: "Solicitudes",
  responses: "Respuestas",
  followUps: "Seguimientos",
  qaBlockers: "bloqueos de QA",
  emptyTitle: "Ninguna investigacion coincide con los filtros.",
  emptyCopy: "Prueba otro pais, idioma, tema o estado. Esto prueba el estado vacio previsto en el MVP.",
  clearFilters: "Limpiar filtros",
  buildRoadmap: "Roadmap del producto",
  roadmapTitle: "Que prueba este prototipo antes de que la ingenieria sea cara",
  fellowshipScope: "alcance fellowship",
  validationQuestion: "Pregunta de validacion",
  mvpCoverage: "Cobertura del MVP",
  mvpCoverageTitle: "Checklist contra el documento original",
  mvpCoverageBadge: "revision PRD",
  expectedInDoc: "Previsto en el documento",
  implementedInPrototype: "En el prototipo",
  testingGuide: "Guia de prueba",
  testingTitle: "Que deben probar primero QA y periodistas",
  testScript: "guion v0.1",
  coreTasks: "Tareas centrales",
  feedbackQuestions: "Preguntas de feedback",
  acceptanceCriteria: "Criterios de aceptacion",
  back: "Volver a investigaciones",
  overview: "Vista general",
  jurisdiction: "Jurisdiccion",
  hypotheses: "Hipotesis",
  evidenceBlocks: "Bloques de evidencia",
  sources: "Fuentes",
  deadlines: "Plazos",
  actionPlan: "Plan de accion",
  editorialQueue: "Fila editorial",
  transparencyLog: "Diario de transparencia",
  requestComparison: "Comparacion de solicitudes",
  gaps: "Vacios",
  claims: "Afirmaciones",
  methodology: "Metodologia",
  evidenceBlocksMetric: "bloques de evidencia",
  lateRequests: "solicitudes atrasadas",
  openGaps: "vacios abiertos",
  claimsReview: "afirmaciones a revisar",
  reviewItems: "items de revision",
  actionItems: "acciones",
  queueItems: "items en la fila",
  centralQuestion: "Pregunta central",
  quickActions: "Acciones rapidas",
  quickActionsCopy: "Atajos para probar el flujo central previsto en el wireframe.",
  addHypothesis: "Agregar hipotesis",
  mapEvidence: "Mapear evidencia",
  registerRequest: "Registrar solicitud",
  reviewResponse: "Revisar respuesta",
  openQueue: "Abrir fila",
  addClaim: "Agregar afirmacion",
  exportMethodology: "Exportar metodologia",
  exportJson: "Exportar JSON",
  exportedJson: "JSON exportado",
  deadlinesNext: "Plazos y proximos pasos",
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
  actionPlanTitle: "Convierte el registro de investigacion en una fila controlada de proximos pasos.",
  actionPlanCopy: "Cada accion debe estar ligada a una fuente, protocolo o evento procedimental documentado.",
  editorialQueueTitle: "Fila editorial",
  editorialQueueHeading: "Vea que necesita decision humana antes de publicar o automatizar.",
  editorialQueueCopy: "La fila combina checkpoints, revisiones y acciones prioritarias sin transformar pendientes en conclusion.",
  queueDeadlines: "Checkpoints activos",
  queueReviews: "Revisiones editoriales",
  queueActions: "Acciones prioritarias",
  queueEmpty: "Ningun item prioritario registrado.",
  queueRule: "Regla de la fila",
  queueRuleCopy: "Cada item debe apuntar a protocolo, fuente, plazo o vacio antes de convertirse en tarea de investigacion.",
  priority: "prioridad",
  requestLabel: "Solicitud",
  due: "Plazo",
  requested: "Solicitado",
  response: "Respuesta",
  responsesTitle: "Respuestas recibidas",
  responsesHeading: "Revise lo que llego antes de convertir una respuesta en evidencia.",
  responseStatus: "Estado de la respuesta",
  receivedMaterials: "Material recibido",
  identifiedGaps: "Vacios identificados",
  reviewDecision: "Decision de revision",
  noReceivedMaterial: "Ningun material recibido o verificable todavia.",
  noComparisonYet: "Comparacion detallada aun no registrada.",
  responseReviewRule: "Regla de revision",
  responseReviewRuleCopy: "Una respuesta solo se convierte en evidencia despues de abrir archivos, revisar anexos, checar campos y registrar limites.",
  ifNothingArrives: "Si no llega nada",
  requestsTitle: "Siga solicitudes hechas fuera de la plataforma.",
  methodSafeguards: "Salvaguardas metodologicas",
  methodSafeguardsTitle: "Reglas que evitan que la herramienta exagere evidencias.",
  processGuideTitle: "Flujo atento a la jurisdiccion, todavia controlado por la reportera.",
  transparencyLogTitle: "Diario de transparencia",
  transparencyLogHeading: "Siga el historial procesal sin tratar movimientos como entrega de evidencia.",
  transparencyLogCopy: "Use este registro para separar solicitud, encaminamiento, respuesta parcial, recurso y entrega real de documentos.",
  nextStep: "Proximo paso",
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
  reporterCheck: "Chequeo de la reportera",
  gapsTitle: "Vacios y proximos pasos",
  gapsHeading: "Convierte evidencias ausentes en acciones de seguimiento.",
  claimMatrixTitle: "Matriz afirmacion-evidencia",
  claimMatrixHeading: "Verifique si las afirmaciones publicables estan sustentadas.",
  claim: "Afirmacion",
  evidence: "Evidencia",
  evidenceRelation: "Relacion",
  strength: "Fuerza",
  risk: "Riesgo",
  qaModelTitle: "Modelo QA v0.2",
  qaModelHeading: "Glosario, lista cerrada de estados y evidencias contradictorias.",
  qaModelCopy: "Actualizacion basada en QA: el prototipo registra si una evidencia sustenta, contradice o limita una afirmacion.",
  glossaryTerms: "Glosario operativo",
  statusRegistry: "Lista cerrada de estados",
  evidenceRelations: "Relaciones de evidencia",
  functionalCoverage: "Cobertura funcional",
  qaExpectation: "Criterio QA",
  prototypeCoverage: "Cobertura en el prototipo",
  methodologyNote: "Nota metodologica",
  methodologyHeading: "Exporte un resumen transparente de evidencias, solicitudes y limites.",
  qaChecklistHeading: "Revise riesgos antes de tratar evidencias como publicables.",
  qaNoBlockers: "Ningun bloqueo de QA registrado.",
  action: "Accion",
  editorialSafeguards: "Salvaguardas editoriales",
  editorialSafeguardsHeading: "No transforme problemas de acceso en afirmaciones sin evidencia.",
  jurisdictionAccess: "Jurisdiccion y reglas de acceso",
  jurisdictionHeading: "Defina plazos y caminos de fuente antes de usar asistencia por IA.",
  jurisdictionCopy: "La herramienta debe guiar a la reportera por reglas conocidas, no inventarlas.",
  deadline: "Plazo",
  requestChannels: "Canales de solicitud",
  escalation: "Escalamiento",
  reporterWarning: "Alerta para reportera",
  productRule: "Regla del producto",
  productRuleCopy:
    "Evidence Desk solo puede sugerir proximos pasos despues de que la reportera selecciona jurisdiccion, confirma el canal de solicitud y revisa la regla de acceso relevante.",
  sourceDiscovery: "Descubrimiento de fuentes",
  sourceDiscoveryHeading: "Empiece por caminos controlados, despues deje que la reportera verifique.",
  verify: "Verificar",
  languageLocalization: "Idioma y localizacion",
  languageHeading: "Separe traduccion de localizacion juridica y editorial.",
  languageCopy: "Una herramienta global necesita acceso multilingue, pero la orientacion sobre ley de acceso depende de la jurisdiccion.",
  languagePlan: "Plan de idioma",
  workingLanguage: "Idioma de trabajo",
  interfaceOptions: "Opciones de interfaz",
  publicationLanguages: "Idiomas de publicacion",
  localizationRule: "Regla de localizacion",
  localizationRuleCopy:
    "Traduzca libremente los rotulos de interfaz, pero localice leyes, plazos, organismos y tipos de fuente solo cuando la jurisdiccion sea conocida y revisada por la reportera.",
  translationNotes: "Notas de traduccion",
  translationNotesHeading: "Terminos que requieren revision humana.",
  questionsHypotheses: "Preguntas e hipotesis",
  hypothesesHeading: "Divida la pregunta central en partes comprobables.",
  secondaryQuestions: "Preguntas secundarias",
  noSecondary: "Aun no hay preguntas secundarias registradas.",
  relatedEvidence: "Evidencia relacionada",
  evidenceBlocksTitle: "Bloques de evidencia",
  evidenceBlocksHeading: "Que tipos de prueba son necesarios?",
  evidenceBlocksCopy: "Los bloques ayudan a separar lo que debe probarse de donde puede encontrarse la informacion.",
  prototypeLimits: "Limites del prototipo",
  prototypeLimitsTitle: "Que esta probado ahora y que aun no debe prometerse",
  currentBehavior: "Comportamiento actual",
  nextProductStep: "Proximo paso de producto",
  createTitle: "Empiece con una pregunta que la evidencia pueda responder.",
  createCopy:
    "Este formulario simulado prueba el flujo inicial del MVP. Valida campos obligatorios, muestra la estructura del proyecto y mantiene el guardado desactivado hasta que exista backend.",
  cancel: "Cancelar",
  reviewBeforeContinue: "Revise antes de continuar",
  investigationTitle: "Titulo de la investigacion",
  investigationTitlePlaceholder: "ej.: Violencia obstetrica y transparencia de datos publicos",
  countryPlaceholder: "ej.: Brasil, Estados Unidos, Mexico",
  jurisdictionLocality: "Jurisdiccion/localidad",
  jurisdictionPlaceholder: "ej.: Bahia, Cook County, Ciudad de Mexico",
  primaryLanguage: "Idioma principal",
  primaryLanguagePlaceholder: "ej.: Portugues, Ingles, Espanol",
  generalTopic: "Tema general",
  topicPlaceholder: "ej.: Salud publica, educacion, medio ambiente",
  investigatedTerritory: "Territorio investigado",
  territoryPlaceholder: "ej.: Salvador e interior de Bahia",
  investigatedPeriod: "Periodo investigado",
  periodPlaceholder: "ej.: 2020-2026",
  centralInvestigativeQuestion: "Pregunta investigativa central",
  centralQuestionPlaceholder: "Que pregunta debe responder esta investigacion con evidencia?",
  centralQuestionHelp: "Obligatorio. Prefiera una pregunta que pueda responderse con documentos, datos, entrevistas o respuestas oficiales.",
  shortDescription: "Descripcion corta",
  descriptionPlaceholder: "Que intenta entender la pauta?",
  validateStructure: "Validar estructura",
  saveDraftAfterBackend: "Guardar borrador despues del backend",
  workspacePreview: "Vista previa del espacio de trabajo",
  untitledInvestigation: "Investigacion sin titulo",
  countryJurisdiction: "Pais/jurisdiccion",
  starterStructure: "Estructura inicial",
  sourcesDatabases: "Fuentes/bases",
  notSet: "No definido",
  draftReady: "Estructura lista para la proxima etapa del MVP: mapear hipotesis y bloques de evidencia.",
  errorTitleRequired: "Agregue un titulo para la investigacion.",
  errorCountryRequired: "Agregue un pais.",
  errorLanguageRequired: "Agregue el idioma principal.",
  errorQuestionRequired: "Agregue una pregunta investigativa central.",
  errorTitleSpecific: "Haga el titulo mas especifico para que QA entienda el caso.",
  errorQuestionMark: "Formule la pregunta central como pregunta.",
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
    "Los vacios no son conclusiones. Son problemas de evidencia abiertos que requieren seguimiento, limite metodologico o reescritura de la afirmacion.",
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

function getCurrentInvestigation() {
  return investigations.find((item) => item.id === state.currentId) || investigations[0];
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(value = "") {
  const normalized = value.toLowerCase();
  if (normalized.includes("critica") || normalized.includes("high") || normalized.includes("alto")) return "danger";
  if (normalized.includes("blocked") || normalized.includes("bloqueado")) return "danger";
  if (normalized.includes("sem resposta") || normalized.includes("without attachment")) return "danger";
  if (normalized.includes("parcial") || normalized.includes("partial") || normalized.includes("media")) return "warning";
  if (normalized.includes("recurso") || normalized.includes("appeal")) return "warning";
  if (normalized.includes("cagi") || normalized.includes("cgai") || normalized.includes("progress")) return "warning";
  if (normalized.includes("review") || normalized.includes("revisao") || normalized.includes("verificar")) return "warning";
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
    const status = claim.status.toLowerCase();
    return status.includes("precisa") || status.includes("needs") || status.includes("partial");
  }).length;
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
  const activeDate = request.currentCheckpoint?.date || request.dueDate;
  const dueDate = new Date(`${activeDate}T00:00:00`);
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Math.ceil((dueDate - todayDate) / 86400000);
  const status = request.status.toLowerCase();
  const isCheckpoint = Boolean(request.currentCheckpoint);

  if (status.includes("fluxo separado") || status.includes("separate track")) {
    return { label: t("separateTrack"), days, tone: "neutral" };
  }

  if (status.includes("parcial") || status.includes("partial")) {
    return { label: t("partialResponse"), days, tone: "warning" };
  }

  if (status.includes("entregue") || status.includes("recebida") || status.includes("received")) {
    return { label: t("responseReceived"), days, tone: "success" };
  }

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
    return decision.includes("ressalva") || decision.includes("nao usar") || decision.includes("partial");
  }).length;
}

function countReviewedResponses(investigation) {
  return investigation.requestComparisons.filter((comparison) => comparison.received || comparison.editorialDecision).length;
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
              title: "Abrir a investigacao do Brasil",
              goal: "Verificar se uma jornalista entende respostas parciais de LAI, anexos ausentes e passos de escalonamento.",
              success: "A pessoa consegue identificar pelo menos uma lacuna de evidencia e uma proxima acao segura.",
            },
            {
              title: "Abrir a investigacao dos EUA",
              goal: "Verificar se o mesmo fluxo funciona fora do Brasil com registros publicos, contratos e atas escolares.",
              success: "A pessoa entende que o estado/jurisdicao deve ser definido antes de confiar em prazos ou recursos.",
            },
            {
              title: "Revisar uma afirmacao",
              goal: "Verificar se forca da afirmacao, risco e evidencias de apoio sao faceis de entender.",
              success: "A pessoa consegue dizer quais afirmacoes estao prontas, parciais ou inseguras.",
            },
            {
              title: "Copiar a metodologia",
              goal: "Verificar se a nota exportada diferencia evidencias, lacunas, limites, QA e acompanhamentos.",
              success: "A pessoa reaproveitaria pelo menos parte da nota em uma secao real de transparencia/metodologia.",
            },
          ],
          questions: [
            "Onde voce se sentiu mais orientada ou mais perdida?",
            "O termo 'bloco de evidencia' faz sentido ou deveria mudar?",
            "Fontes, pedidos, lacunas e afirmacoes estao claramente separados?",
            "A ferramenta parece util ou parece burocracia extra?",
            "O que deveria ser automatizado depois, e o que deve continuar sob controle da reporter?",
          ],
          acceptanceCriteria: [
            "A pessoa entende o estado de uma investigacao em menos de dois minutos.",
            "A pessoa identifica pelo menos uma acao pendente sem explicacao externa.",
            "A pessoa entende lacunas como problemas de evidencia pendentes, nao acusacoes automaticas.",
            "A pessoa entende que rascunhos de follow-up nao sao enviados automaticamente.",
            "A pessoa percebe os exemplos Brasil e EUA como o mesmo metodo adaptado localmente.",
          ],
        }
      : state.locale === "es"
        ? {
            tasks: [
              {
                title: "Abrir la investigacion de Brasil",
                goal: "Verificar si una periodista entiende respuestas parciales de LAI, anexos ausentes y pasos de escalamiento.",
                success: "La persona puede identificar al menos un vacio de evidencia y una proxima accion segura.",
              },
              {
                title: "Abrir la investigacion de Estados Unidos",
                goal: "Verificar si el mismo flujo funciona fuera de Brasil con registros publicos, contratos y actas escolares.",
                success: "La persona entiende que el estado/jurisdiccion debe definirse antes de confiar en plazos o recursos.",
              },
              {
                title: "Revisar una afirmacion",
                goal: "Verificar si la fuerza de la afirmacion, el riesgo y las evidencias de apoyo son faciles de entender.",
                success: "La persona puede decir que afirmaciones estan listas, parciales o inseguras.",
              },
              {
                title: "Copiar la metodologia",
                goal: "Verificar si la nota exportada diferencia evidencias, vacios, limites, QA y seguimientos.",
                success: "La persona reutilizaria al menos parte de la nota en una seccion real de transparencia/metodologia.",
              },
            ],
            questions: [
              "Donde te sentiste mas orientada o mas perdida?",
              "El termino 'bloque de evidencia' funciona o deberia cambiar?",
              "Fuentes, solicitudes, vacios y afirmaciones estan claramente separados?",
              "La herramienta parece util o parece burocracia extra?",
              "Que deberia automatizarse despues, y que debe seguir bajo control de la reportera?",
            ],
            acceptanceCriteria: [
              "La persona entiende el estado de una investigacion en menos de dos minutos.",
              "La persona identifica al menos una accion pendiente sin explicacion externa.",
              "La persona entiende los vacios como problemas de evidencia pendientes, no acusaciones automaticas.",
              "La persona entiende que los borradores de seguimiento no se envian automaticamente.",
              "La persona percibe los ejemplos Brasil y EE. UU. como el mismo metodo adaptado localmente.",
            ],
          }
      : testPlan;
  const localizedRoadmap =
    state.locale === "pt"
      ? [
          {
            phase: "v0.1 prototipo estatico",
            status: "Atual",
            goal:
              "Validar o fluxo de apuracao, idioma, filtros, acompanhamento de pedidos, lacunas, afirmacoes e exportacao metodologica sem backend ou IA.",
            ownerQuestion: "Jornalistas entendem a estrutura rapido o suficiente para usar em uma investigacao real?",
          },
          {
            phase: "v0.2 persistencia",
            status: "Proximo",
            goal: "Adicionar investigacoes salvas, fontes editaveis, logs manuais de pedidos, respostas, lacunas e afirmacoes.",
            ownerQuestion: "Uma reporter consegue manter um caso real atualizado sem voltar para planilhas e notas espalhadas?",
          },
          {
            phase: "v0.3 revisao assistida",
            status: "Depois",
            goal:
              "Adicionar IA limitada para comparacao pedido-resposta, identificacao de lacunas, resumo de respostas e rascunhos revisados pela reporter.",
            ownerQuestion: "Quais etapas sao seguras para automatizar, e quais devem permanecer sob controle editorial?",
          },
        ]
      : state.locale === "es"
        ? [
            {
              phase: "v0.1 prototipo estatico",
              status: "Actual",
              goal:
                "Validar el flujo de investigacion, idioma, filtros, seguimiento de solicitudes, vacios, afirmaciones y exportacion metodologica sin backend o IA.",
              ownerQuestion: "Periodistas entienden la estructura suficientemente rapido para usarla en una investigacion real?",
            },
            {
              phase: "v0.2 persistencia",
              status: "Proximo",
              goal: "Agregar investigaciones guardadas, fuentes editables, registros manuales de solicitudes, respuestas, vacios y afirmaciones.",
              ownerQuestion: "Una reportera puede mantener un caso real actualizado sin volver a planillas y notas dispersas?",
            },
            {
              phase: "v0.3 revision asistida",
              status: "Despues",
              goal:
                "Agregar IA limitada para comparacion solicitud-respuesta, identificacion de vacios, resumenes de respuestas y borradores revisados por la reportera.",
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
        </div>
        <button class="button secondary active-secondary" data-action="new-investigation">${t("newInvestigation")}</button>
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
            <button class="button secondary" type="button" disabled>${t("saveDraftAfterBackend")}</button>
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
  const tabs = [
    ["overview", t("overview")],
    ["jurisdiction", t("jurisdiction")],
    ["language", t("languageTab")],
    ["hypotheses", t("hypotheses")],
    ["evidence", t("evidenceBlocks")],
    ["sources", t("sources")],
    ["requests", t("requests")],
    ["responses", t("responses")],
    ["deadlines", t("deadlines")],
    ["actions", t("actionPlan")],
    ["queue", t("editorialQueue")],
    ["transparency", t("transparencyLog")],
    ["comparison", t("requestComparison")],
    ["followups", t("followUps")],
    ["gaps", t("gaps")],
    ["claims", t("claims")],
    ["qa", t("qaChecklist")],
    ["methodology", t("methodology")],
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
        <button class="back-link" data-action="dashboard">${t("back")}</button>
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
    jurisdiction: renderJurisdiction,
    language: renderLanguagePlan,
    hypotheses: renderHypotheses,
    evidence: renderEvidenceBlocks,
    sources: renderSources,
    requests: renderRequests,
    responses: renderResponses,
    deadlines: renderDeadlines,
    actions: renderActionPlan,
    queue: renderEditorialQueue,
    transparency: renderTransparencyLog,
    comparison: renderRequestComparison,
    followups: renderFollowUps,
    gaps: renderGaps,
    claims: renderClaims,
    qa: renderQaChecklist,
    methodology: renderMethodology,
  };
  return renderers[state.currentTab](item);
}

function renderOverview(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("overview")}</p>
      <h2>${item.centralQuestion}</h2>
      <p>${item.description}</p>
    </section>
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
    <section class="panel quick-actions">
      <div>
        <p class="eyebrow">${t("quickActions")}</p>
        <h3>${t("quickActionsCopy")}</h3>
      </div>
      <div class="quick-action-row">
        <button class="button secondary active-secondary" data-action="tab" data-tab="hypotheses">${t("addHypothesis")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="evidence">${t("mapEvidence")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="requests">${t("registerRequest")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="responses">${t("reviewResponse")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="queue">${t("openQueue")}</button>
        <button class="button secondary active-secondary" data-action="tab" data-tab="claims">${t("addClaim")}</button>
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

function renderHypotheses(item) {
  const secondaryQuestions = (item.secondaryQuestions || [])
    .map((question) => `<li>${question}</li>`)
    .join("");

  return `
    <section class="content-header">
      <p class="eyebrow">${t("questionsHypotheses")}</p>
      <h2>${t("hypothesesHeading")}</h2>
    </section>
    <section class="two-column question-map">
      <article class="panel">
        <p class="eyebrow">${t("centralQuestion")}</p>
        <h3>${item.centralQuestion}</h3>
      </article>
      <article class="panel accent">
        <p class="eyebrow">${t("secondaryQuestions")}</p>
        <ul class="review-list">${secondaryQuestions || `<li>${t("noSecondary")}</li>`}</ul>
      </article>
    </section>
    <div class="stack">
      ${item.hypotheses
        .map(
          (hypothesis) => `
            <article class="row-card">
              <div>
                <h3>${hypothesis.text}</h3>
                <p>${t("relatedEvidence")}: ${hypothesis.evidence}</p>
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
      <p class="eyebrow">${t("evidenceBlocksTitle")}</p>
      <h2>${t("evidenceBlocksHeading")}</h2>
      <p>${t("evidenceBlocksCopy")}</p>
    </section>
    <div class="table-wrap">
      <table>
        <thead><tr><th>${t("block")}</th><th>${t("priorityLabel")}</th><th>${t("status")}</th></tr></thead>
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

function renderRequests(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("requestsEyebrow")}</p>
      <h2>${t("requestsTitle")}</h2>
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
                <div><dt>${t("protocol")}</dt><dd>${request.protocol}</dd></div>
                <div><dt>${t("sent")}</dt><dd>${request.sentDate}</dd></div>
                <div><dt>${t("due")}</dt><dd>${request.dueDate}</dd></div>
                ${
                  request.currentCheckpoint
                    ? `<div><dt>${t("currentCheckpoint")}</dt><dd>${request.currentCheckpoint.date} / ${request.currentCheckpoint.label}</dd></div>`
                    : ""
                }
              </dl>
              <p><strong>${t("requested")}:</strong> ${request.requestedItems}</p>
              <p class="muted"><strong>${t("response")}:</strong> ${request.responseSummary}</p>
              ${
                request.currentCheckpoint
                  ? `<p class="muted"><strong>${t("ifNothingArrives")}:</strong> ${request.currentCheckpoint.action}</p>`
                  : ""
              }
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

function renderActionPlan(item) {
  const actions = item.actionItems || [];

  return `
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
  return `
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

function renderFollowUps(item) {
  const drafts = item.followUpDrafts || [];

  return `
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

function renderGaps(item) {
  return `
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

function renderClaims(item) {
  return `
    <section class="content-header">
      <p class="eyebrow">${t("claimMatrixTitle")}</p>
      <h2>${t("claimMatrixHeading")}</h2>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>${t("claim")}</th><th>${t("type")}</th><th>${t("evidence")}</th><th>${t("evidenceRelation")}</th><th>${t("strength")}</th><th>${t("risk")}</th><th>${t("status")}</th></tr>
        </thead>
        <tbody>
          ${item.claims
            .map(
              (claim) => `
                <tr>
                  <td>${claim.text}</td>
                  <td>${claim.type}</td>
                  <td>${claim.evidence}</td>
                  <td><span class="pill ${statusClass(claim.relation)}">${claim.relation || "-"}</span></td>
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
        <h3>${t("acceptanceCriteria")}</h3>
        <ul class="review-list">
          ${qaModel.acceptanceCriteria.map((criterion) => `<li>${criterion}</li>`).join("")}
        </ul>
      </article>
    </div>
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

function methodologyMarkdown(item) {
  const labels =
    state.locale === "pt"
      ? {
          title: "Nota metodologica",
          centralQuestion: "Pergunta central",
          secondaryQuestions: "Perguntas secundarias",
          noSecondaryQuestions: "Nenhuma pergunta secundaria registrada.",
          workingHypotheses: "Hipoteses de trabalho",
          scope: "Escopo",
          countryJurisdiction: "Pais/jurisdicao",
          territory: "Territorio",
          period: "Periodo",
          jurisdictionRules: "Jurisdicao e regras de acesso",
          framework: "Base legal",
          deadline: "Prazo",
          escalation: "Escalonamento",
          warning: "Alerta",
          noJurisdictionRule: "Nenhuma regra de jurisdicao registrada.",
          sourceDiscovery: "Descoberta de fontes",
          verify: "Verificar",
          noSourceDiscovery: "Nenhum mapa de descoberta de fontes registrado.",
          sources: "Fontes, bases e documentos",
          limits: "Limites",
          noSources: "Nenhuma fonte registrada.",
          languageLocalization: "Idioma e localizacao",
          workingLanguage: "Idioma de trabalho",
          interfaceLanguages: "Idiomas da interface",
          publicationLanguages: "Idiomas de publicacao",
          localizationNotes: "Notas de localizacao",
          noLanguagePlan: "Nenhum plano de idioma registrado.",
          requestsTracked: "Pedidos acompanhados",
          responsesReviewed: "Respostas revisadas",
          noResponsesReviewed: "Nenhuma resposta revisada registrada.",
          material: "Material",
          gap: "Lacuna",
          decision: "Decisao",
          currentCheckpoint: "Checkpoint atual",
          transparencyLog: "Diario de transparencia",
          next: "Proximo passo",
          noTransparencyLog: "Nenhum diario de transparencia registrado.",
          requestComparison: "Comparacao pedido-resposta",
          followUpDrafts: "Rascunhos de follow-up",
          reporterCheck: "Checagem da reporter",
          noFollowUps: "Nenhum rascunho de follow-up registrado.",
          actionPlan: "Plano de acao",
          dueCheckpoint: "prazo/checkpoint",
          noDate: "sem data",
          output: "Saida",
          noActionPlan: "Nenhum plano de acao registrado.",
          freshnessReview: "Atualidade e revisao",
          noFreshness: "Nenhum alerta de atualidade registrado.",
          qaChecklist: "Checklist QA",
          risk: "risco",
          noQa: "Nenhum checklist QA registrado.",
          methodSafeguards: "Salvaguardas metodologicas",
          productUse: "Uso no produto",
          noSafeguards: "Nenhuma salvaguarda metodologica registrada.",
          gaps: "Lacunas e limites abertos",
          mainClaims: "Afirmacoes principais",
          evidenceRelation: "relacao da evidencia",
        }
      : state.locale === "es"
        ? {
            title: "Nota metodologica",
            centralQuestion: "Pregunta central",
            secondaryQuestions: "Preguntas secundarias",
            noSecondaryQuestions: "Ninguna pregunta secundaria registrada.",
            workingHypotheses: "Hipotesis de trabajo",
            scope: "Alcance",
            countryJurisdiction: "Pais/jurisdiccion",
            territory: "Territorio",
            period: "Periodo",
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
            publicationLanguages: "Idiomas de publicacion",
            localizationNotes: "Notas de localizacion",
            noLanguagePlan: "Ningun plan de idioma registrado.",
            requestsTracked: "Solicitudes acompanadas",
            responsesReviewed: "Respuestas revisadas",
            noResponsesReviewed: "Ninguna respuesta revisada registrada.",
            material: "Material",
            gap: "Vacio",
            decision: "Decision",
            currentCheckpoint: "Checkpoint actual",
            transparencyLog: "Diario de transparencia",
            next: "Proximo paso",
            noTransparencyLog: "Ningun diario de transparencia registrado.",
            requestComparison: "Comparacion solicitud-respuesta",
            followUpDrafts: "Borradores de seguimiento",
            reporterCheck: "Chequeo de la reportera",
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
            methodSafeguards: "Salvaguardas metodologicas",
            productUse: "Uso en el producto",
            noSafeguards: "Ninguna salvaguarda metodologica registrada.",
            gaps: "Vacios y limites abiertos",
            mainClaims: "Afirmaciones principales",
            evidenceRelation: "relacion de evidencia",
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
      state.draftErrors = [];
      state.draftNotice = "";
      renderDashboard();
    });
  });

  document.querySelectorAll("[data-action='new-investigation']").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = "new-investigation";
      state.draftErrors = [];
      state.draftNotice = "";
      renderNewInvestigation();
    });
  });

  document.querySelectorAll("[data-action='set-locale']").forEach((button) => {
    button.addEventListener("click", () => {
      state.locale = button.dataset.locale;
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

  document.querySelectorAll("[data-action='validate-draft']").forEach((button) => {
    button.addEventListener("click", () => {
      validateDraft();
      renderNewInvestigation();
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

renderDashboard();
