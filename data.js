export const testPlan = {
  tasks: [
    {
      title: "Open the Brazil investigation",
      goal: "Check whether a reporter understands partial LAI responses, missing attachments and escalation steps.",
      success: "Tester can identify at least one evidence gap and one safe next action.",
    },
    {
      title: "Open the U.S. investigation",
      goal: "Check whether the same workflow works outside Brazil with public records, contracts and school board materials.",
      success: "Tester understands that state law must be selected before deadlines or appeals are trusted.",
    },
    {
      title: "Review one claim",
      goal: "Check whether claim strength, risk and supporting evidence are easy to understand.",
      success: "Tester can say which claims are ready, partial or unsafe.",
    },
    {
      title: "Copy the methodology",
      goal: "Check whether the exported note differentiates evidence, gaps, limits, QA and follow-ups.",
      success: "Tester would reuse at least part of the note in a real transparency/methodology section.",
    },
  ],
  questions: [
    "Where did you feel most oriented or most lost?",
    "Does 'evidence block' make sense, or should the term change?",
    "Are sources, requests, gaps and claims clearly different?",
    "Does the tool feel useful, or does it feel like extra bureaucracy?",
    "What should be automated later, and what should remain under reporter control?",
  ],
  acceptanceCriteria: [
    "Tester understands the state of an investigation in under two minutes.",
    "Tester can identify at least one pending action without explanation.",
    "Tester sees gaps as pending evidence problems, not automatic accusations.",
    "Tester understands that follow-up drafts are not sent automatically.",
    "Tester sees the Brazil and U.S. examples as the same method adapted locally.",
  ],
};

export const roadmap = [
  {
    phase: "v0.1 static prototype",
    status: "Current",
    goal: "Validate the reporting workflow, language, filters, request tracking, gaps, claims and methodology export without backend or AI.",
    ownerQuestion: "Do journalists understand the structure quickly enough to use it in a real investigation?",
  },
  {
    phase: "v0.2 persistence",
    status: "Next",
    goal: "Add saved investigations, editable sources, manual request logs, responses, gaps and claim records.",
    ownerQuestion: "Can a reporter keep a real case updated without returning to spreadsheets or scattered notes?",
  },
  {
    phase: "v0.3 assisted review",
    status: "Later",
    goal: "Add limited AI for request-response comparison, gap spotting, response summaries and reporter-reviewed follow-up drafts.",
    ownerQuestion: "Which steps are safe to automate, and which must stay under editorial control?",
  },
];

export const qaModel = {
  glossary: [
    {
      term: "Hipotese",
      meaning: "Possibilidade investigativa ainda em teste.",
      qaRule: "Nao deve aparecer como conclusao enquanto evidencias suficientes nao forem revisadas.",
    },
    {
      term: "Afirmacao",
      meaning: "Frase publicavel que precisa estar ligada a evidencia, limite e risco editorial.",
      qaRule: "Toda afirmacao deve mostrar se a evidencia sustenta, contradiz ou limita o que esta sendo dito.",
    },
    {
      term: "Bloco de evidencia",
      meaning: "Tipo de prova, dado, documento ou fonte necessario para testar uma hipotese.",
      qaRule: "Pode existir antes da fonte concreta ser encontrada, mas precisa ter prioridade e status.",
    },
    {
      term: "Lacuna",
      meaning: "Informacao ausente, incompleta, contraditoria ou ainda nao verificavel.",
      qaRule: "Nunca deve virar acusacao; deve virar follow-up, limite metodologico ou reescrita.",
    },
    {
      term: "Resposta parcial",
      meaning: "Resposta que entrega parte do solicitado ou exige checagem de anexos, campos e escopo.",
      qaRule: "So vira evidencia depois de conferencia humana do material recebido.",
    },
  ],
  statuses: [
    {
      entity: "Hipotese",
      values: "Aberta; em apuracao; aguardando dados; sustentada; contradita; reformular",
    },
    {
      entity: "Pedido",
      values: "Enviado; respondido; resposta parcial; em recurso; em escalonamento; fluxo separado",
    },
    {
      entity: "Resposta",
      values: "Sem material; recebida; parcial; com problema; revisada; nao usar como evidencia",
    },
    {
      entity: "Afirmacao",
      values: "Sustentada; sustentada parcialmente; limitada; contradita; precisa de evidencia; reformular",
    },
    {
      entity: "Lacuna",
      values: "Aberta; em verificacao; em escalonamento; resolvida; separada",
    },
  ],
  evidenceRelations: [
    {
      relation: "Sustenta",
      meaning: "A evidencia reforca a afirmacao, dentro dos limites registrados.",
    },
    {
      relation: "Contradiz",
      meaning: "A evidencia enfraquece, derruba ou exige reescrever a afirmacao.",
    },
    {
      relation: "Limita",
      meaning: "A evidencia nao contradiz, mas reduz o alcance, escopo ou nivel de certeza.",
    },
  ],
  acceptanceCriteria: [
    "Cada tela mostra a secao atual e a proxima pendencia editorial.",
    "Cada status usado nos dados de exemplo aparece na lista fechada de status.",
    "Toda afirmacao mostra relacao da evidencia: sustenta, contradiz ou limita.",
    "A nota metodologica exportada inclui relacoes de evidencia, lacunas e salvaguardas.",
    "No teste com 5 jornalistas, pelo menos 4 identificam uma afirmacao insegura sem explicacao externa.",
  ],
  functionalChecks: [
    {
      item: {
        pt: "Status por entidade",
        en: "Status by entity",
        es: "Estado por entidad",
      },
      expectation: {
        pt: "Hipoteses, pedidos, respostas, lacunas e afirmacoes devem ter estados separados.",
        en: "Hypotheses, requests, responses, gaps and claims need separate status lists.",
        es: "Hipotesis, solicitudes, respuestas, vacios y afirmaciones necesitan listas de estado separadas.",
      },
      coverage: {
        pt: "Coberto na aba Checklist QA pelo glossario e lista fechada de status.",
        en: "Covered in the QA Checklist tab through the glossary and closed status list.",
        es: "Cubierto en la pestana Checklist QA por el glosario y la lista cerrada de estados.",
      },
      status: {
        pt: "Coberto",
        en: "Covered",
        es: "Cubierto",
      },
    },
    {
      item: {
        pt: "Evidencia contraditoria",
        en: "Contradictory evidence",
        es: "Evidencia contradictoria",
      },
      expectation: {
        pt: "A matriz precisa registrar se cada evidencia sustenta, contradiz ou limita uma afirmacao.",
        en: "The matrix must record whether each evidence item supports, contradicts or limits a claim.",
        es: "La matriz debe registrar si cada evidencia sustenta, contradice o limita una afirmacion.",
      },
      coverage: {
        pt: "Coberto na matriz de afirmacoes e na nota metodologica exportada.",
        en: "Covered in the claims matrix and exported methodology note.",
        es: "Cubierto en la matriz de afirmaciones y en la nota metodologica exportada.",
      },
      status: {
        pt: "Coberto",
        en: "Covered",
        es: "Cubierto",
      },
    },
    {
      item: {
        pt: "Prazos por jurisdicao",
        en: "Jurisdiction deadlines",
        es: "Plazos por jurisdiccion",
      },
      expectation: {
        pt: "O produto nao deve calcular prazo legal sem jurisdicao, orgao e regra revisada.",
        en: "The product should not calculate legal deadlines without jurisdiction, agency and reviewed rule.",
        es: "El producto no debe calcular plazos legales sin jurisdiccion, organismo y regla revisada.",
      },
      coverage: {
        pt: "Parcial: o prototipo mostra prazos registrados e limites, mas nao calcula regras automaticamente.",
        en: "Partial: the prototype shows logged deadlines and limits, but does not calculate rules automatically.",
        es: "Parcial: el prototipo muestra plazos registrados y limites, pero no calcula reglas automaticamente.",
      },
      status: {
        pt: "Parcial",
        en: "Partial",
        es: "Parcial",
      },
    },
    {
      item: {
        pt: "Persistencia de investigacao",
        en: "Investigation persistence",
        es: "Persistencia de investigacion",
      },
      expectation: {
        pt: "Uma jornalista deve conseguir salvar, exportar ou reabrir uma investigacao real.",
        en: "A journalist should be able to save, export or reopen a real investigation.",
        es: "Una periodista debe poder guardar, exportar o reabrir una investigacion real.",
      },
      coverage: {
        pt: "Parcial: a investigacao atual pode ser exportada em JSON, mas ainda nao ha importacao ou reabertura.",
        en: "Partial: the current investigation can be exported as JSON, but there is no import or reopening yet.",
        es: "Parcial: la investigacion actual puede exportarse como JSON, pero aun no hay importacion ni reapertura.",
      },
      status: {
        pt: "Parcial",
        en: "Partial",
        es: "Parcial",
      },
    },
  ],
};

export const prototypeLimits = [
  {
    area: {
      pt: "Dados salvos",
      en: "Saved data",
      es: "Datos guardados",
    },
    current: {
      pt: "O prototipo e estatico: permite exportar a investigacao atual em JSON, mas ainda nao reabre nem persiste novas investigacoes.",
      en: "The prototype is static: it can export the current investigation as JSON, but does not reopen or persist new investigations yet.",
      es: "El prototipo es estatico: permite exportar la investigacion actual en JSON, pero aun no reabre ni guarda nuevas investigaciones.",
    },
    next: {
      pt: "v0.2 precisa de importar JSON, armazenamento local e depois login ou banco de dados.",
      en: "v0.2 needs JSON import, local storage and then login or database work.",
      es: "v0.2 necesita importar JSON, almacenamiento local y despues login o base de datos.",
    },
  },
  {
    area: {
      pt: "Prazos legais",
      en: "Legal deadlines",
      es: "Plazos legales",
    },
    current: {
      pt: "Prazos aparecem quando foram registrados pela reporter ou pelo caso de teste; a ferramenta nao calcula regra por jurisdicao.",
      en: "Deadlines appear when logged by the reporter or test case; the tool does not calculate jurisdiction rules.",
      es: "Los plazos aparecen cuando fueron registrados por la reportera o por el caso de prueba; la herramienta no calcula reglas por jurisdiccion.",
    },
    next: {
      pt: "Adicionar regras revisadas por pais/estado/orgao, sempre com alerta de verificacao humana.",
      en: "Add reviewed rules by country/state/agency, always with human verification warnings.",
      es: "Agregar reglas revisadas por pais/estado/organismo, siempre con alerta de verificacion humana.",
    },
  },
  {
    area: {
      pt: "IA",
      en: "AI",
      es: "IA",
    },
    current: {
      pt: "Nenhuma IA decide fontes, prazos, claims ou conclusoes nesta versao.",
      en: "No AI decides sources, deadlines, claims or conclusions in this version.",
      es: "Ninguna IA decide fuentes, plazos, afirmaciones o conclusiones en esta version.",
    },
    next: {
      pt: "A IA deve entrar apenas como revisao assistida: comparar pedido-resposta, apontar lacunas e rascunhar notas revisaveis.",
      en: "AI should enter only as assisted review: comparing request-response, flagging gaps and drafting reviewable notes.",
      es: "La IA debe entrar solo como revision asistida: comparar solicitud-respuesta, senalar vacios y redactar notas revisables.",
    },
  },
];

export const mvpCoverage = [
  {
    area: {
      pt: "Criar investigacao",
      en: "Create investigation",
      es: "Crear investigacion",
    },
    expected: {
      pt: "Titulo, pais, jurisdicao, idioma, tema, territorio, periodo, pergunta central e descricao curta.",
      en: "Title, country, jurisdiction, language, topic, territory, period, central question and short description.",
      es: "Titulo, pais, jurisdiccion, idioma, tema, territorio, periodo, pregunta central y descripcion corta.",
    },
    implementation: {
      pt: "Formulario de nova investigacao com validacoes essenciais e preview do projeto.",
      en: "New investigation form with essential validations and project preview.",
      es: "Formulario de nueva investigacion con validaciones esenciales y preview del proyecto.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Mapear evidencias",
      en: "Map evidence",
      es: "Mapear evidencias",
    },
    expected: {
      pt: "Perguntas, hipoteses e blocos de evidencia necessaria, complementar, contextual ou desconhecida.",
      en: "Questions, hypotheses and evidence blocks marked as necessary, complementary, contextual or unknown.",
      es: "Preguntas, hipotesis y bloques de evidencia necesaria, complementaria, contextual o desconocida.",
    },
    implementation: {
      pt: "Abas de hipoteses e blocos de evidencia com status, prioridade e evidencia relacionada.",
      en: "Hypotheses and evidence-block tabs with status, priority and related evidence.",
      es: "Pestanas de hipotesis y bloques de evidencia con estado, prioridad y evidencia relacionada.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Cadastrar fontes e bases",
      en: "Register sources and databases",
      es: "Registrar fuentes y bases",
    },
    expected: {
      pt: "Separar fonte verificada, caminho provavel e fonte a confirmar, com limites e melhor uso.",
      en: "Separate verified source, likely path and source to confirm, with limits and best use.",
      es: "Separar fuente verificada, camino probable y fuente por confirmar, con limites y mejor uso.",
    },
    implementation: {
      pt: "Aba de fontes com status, jurisdicao, links, limites e trilhas de descoberta.",
      en: "Sources tab with status, jurisdiction, links, limits and discovery paths.",
      es: "Pestana de fuentes con estado, jurisdiccion, enlaces, limites y rutas de descubrimiento.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Registrar pedidos feitos fora da plataforma",
      en: "Track external requests",
      es: "Registrar solicitudes externas",
    },
    expected: {
      pt: "Orgao, canal, protocolo, data, prazo, status, resumo e itens solicitados.",
      en: "Agency, channel, protocol, date, due date, status, summary and requested items.",
      es: "Organismo, canal, protocolo, fecha, plazo, estado, resumen e items solicitados.",
    },
    implementation: {
      pt: "Aba de pedidos com prazos, checkpoints, status e acoes sugeridas sem envio automatico.",
      en: "Requests tab with due dates, checkpoints, status and suggested actions without automatic filing.",
      es: "Pestana de solicitudes con plazos, checkpoints, estado y acciones sugeridas sin envio automatico.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Comparar pedido e resposta",
      en: "Compare request and response",
      es: "Comparar solicitud y respuesta",
    },
    expected: {
      pt: "Mostrar itens solicitados, entregues, ausentes, divergencias de granularidade e proximos passos.",
      en: "Show requested, delivered and missing items, granularity issues and next steps.",
      es: "Mostrar items solicitados, entregados, ausentes, divergencias de granularidad y proximos pasos.",
    },
    implementation: {
      pt: "Abas de respostas e comparacao com material recebido, lacunas, esperado, ausente/pouco claro e decisao editorial.",
      en: "Responses and comparison tabs with received material, gaps, expected items, missing/unclear points and editorial decision.",
      es: "Pestanas de respuestas y comparacion con material recibido, vacios, esperado, ausente/poco claro y decision editorial.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Transformar lacunas em acoes",
      en: "Turn gaps into actions",
      es: "Convertir vacios en acciones",
    },
    expected: {
      pt: "Marcar lacunas, riscos, origem e proximo passo sem tratar ausencia como conclusao.",
      en: "Mark gaps, risks, origin and next step without treating absence as a conclusion.",
      es: "Marcar vacios, riesgos, origen y proximo paso sin tratar ausencia como conclusion.",
    },
    implementation: {
      pt: "Abas de lacunas, plano de acao, diario de transparencia e rascunhos de follow-up.",
      en: "Gaps, action plan, transparency log and follow-up draft tabs.",
      es: "Pestanas de vacios, plan de accion, diario de transparencia y borradores de seguimiento.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Matriz claim-to-evidence",
      en: "Claim-to-evidence matrix",
      es: "Matriz afirmacion-evidencia",
    },
    expected: {
      pt: "Vincular afirmacoes a evidencias, relacao da evidencia, forca, risco e status editorial.",
      en: "Link claims to evidence, evidence relation, strength, risk and editorial status.",
      es: "Vincular afirmaciones a evidencias, relacion de evidencia, fuerza, riesgo y estado editorial.",
    },
    implementation: {
      pt: "Aba de afirmacoes com evidencia, relacao sustenta/contradiz/limita, risco, forca e ressalvas.",
      en: "Claims tab with evidence, supports/contradicts/limits relation, risk, strength and caveats.",
      es: "Pestana de afirmaciones con relacion sustenta/contradice/limita, riesgo, fuerza y salvedades.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Nota metodologica",
      en: "Methodology note",
      es: "Nota metodologica",
    },
    expected: {
      pt: "Exportar pergunta, periodo, territorio, pedidos, respostas, fontes, lacunas, limites e claims.",
      en: "Export question, period, territory, requests, responses, sources, gaps, limits and claims.",
      es: "Exportar pregunta, periodo, territorio, solicitudes, respuestas, fuentes, vacios, limites y afirmaciones.",
    },
    implementation: {
      pt: "Aba de metodologia com nota em Markdown copiavel e salvaguardas metodologicas.",
      en: "Methodology tab with copyable Markdown note and methodological safeguards.",
      es: "Pestana de metodologia con nota en Markdown copiable y salvaguardas metodologicas.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "IA, backend e envio automatico",
      en: "AI, backend and automatic filing",
      es: "IA, backend y envio automatico",
    },
    expected: {
      pt: "Fora do MVP original: sem protocolo automatico de LAI/FOIA, login complexo ou IA decidindo fontes.",
      en: "Outside the original MVP: no automatic FOIA/LAI filing, complex login or AI deciding sources.",
      es: "Fuera del MVP original: sin protocolo automatico de LAI/FOIA, login complejo o IA decidiendo fuentes.",
    },
    implementation: {
      pt: "Mantido como limite do prototipo; roadmap separa persistencia v0.2 e revisao assistida v0.3.",
      en: "Kept as prototype boundary; roadmap separates v0.2 persistence and v0.3 assisted review.",
      es: "Mantenido como limite del prototipo; el roadmap separa persistencia v0.2 y revision asistida v0.3.",
    },
    status: {
      pt: "Fora do MVP",
      en: "Out of MVP",
      es: "Fuera del MVP",
    },
  },
];

export const investigations = [
  {
    id: "vo-bahia",
    title: "Violencia obstetrica e transparencia de dados na Bahia",
    country: "Brasil",
    jurisdiction: "Bahia",
    language: "Portugues",
    topic: "Saude publica",
    status: "Em revisao",
    period: "2020-2026",
    territory: "Salvador, RMS e interior da Bahia",
    updatedAt: "2026-10-05",
    freshness: {
      status: "Precisa de revisao da reporter",
      checkedAt: "2026-10-05",
      summary:
        "Diario de transparencia mais recente revisado: 02/10/2026. MPBA/CESAU entregou certidao parcial com escopo de capital; SESAB/OuvidoriaSUS ainda tem entrega pendente, anexo ausente e duvidas sobre encaminhamento ou decisao da CGAI.",
    },
    nextReviewItems: [
      "Monitorar manifestacao 3346148: prazo por e-mail em 24/10/2026, prazo no portal em 01/11/2026, ainda sem decisao CGAI documentada.",
      "Monitorar recurso 202620001408821 sobre o anexo DGC/SESAB ausente; prazo exibido pelo sistema em 01/11/2026.",
      "Estruturar os 23 registros MPBA/CESAU da certidao de escopo capital antes de usa-los analiticamente.",
      "Manter a representacao DPE-BA 2026.01.020197 separada da cadeia SESAB/OGE/CGAI.",
    ],
    actionItems: [
      {
        action: "Verificar se a manifestacao 3346148 recebeu resposta substantiva da SESAB/CGAI.",
        type: "Revisao de prazo",
        priority: "Alta",
        status: "Aguardando checkpoint",
        owner: "Reporter",
        dueDate: "2026-10-24",
        source: "Diario de transparencia",
        rationale:
          "O diario registra prazo por e-mail em 24/10 e prazo no portal em 01/11, mas nenhuma decisao CGAI documentada.",
        output: "Entrada de log atualizada indicando se a resposta entregou dados, apenas encaminhou o caso ou manteve silencio.",
      },
      {
        action: "Rechecar o prazo do portal para a manifestacao 3346148.",
        type: "Conflito de prazo",
        priority: "Alta",
        status: "Agendado",
        owner: "Reporter",
        dueDate: "2026-11-01",
        source: "Diario de transparencia",
        rationale:
          "A mesma trilha processual tem duas datas; o produto deve preservar ambas em vez de escolher uma automaticamente.",
        output: "Nota de conflito de prazo resolvida, preservada ou escalada com prints.",
      },
      {
        action: "Monitorar o recurso 202620001408821 sobre o anexo DGC/SESAB ausente.",
        type: "Acompanhamento de recurso",
        priority: "Alta",
        status: "Aguardando checkpoint",
        owner: "Reporter",
        dueDate: "2026-11-01",
        source: "Recurso OuvidorSUS",
        rationale:
          "O diario registra que uma resposta definitiva mencionou anexo, mas o anexo nao estava efetivamente disponivel.",
        output: "Decisao sobre se o pedido original da Ouvidoria SUS segue nao cumprido ou pode ir para revisao de evidencia.",
      },
      {
        action: "Estruturar os 23 registros MPBA/CESAU de escopo capital antes da analise.",
        type: "Estruturacao de dados",
        priority: "Media",
        status: "Pronto",
        owner: "Reporter",
        dueDate: "",
        source: "Oficio 41/CESAU",
        rationale:
          "A certidao e util, mas parcial; nao pode ser tratada como cobertura estadual do MPBA sem nota de escopo.",
        output: "Tabela com numero IDEA, ano, unidade, objeto, situacao e alerta de escopo.",
      },
      {
        action: "Manter a ficha DPE-BA 2026.01.020197 fora do dossie SESAB/CGAI ate haver resposta propria.",
        type: "Controle de escopo",
        priority: "Media",
        status: "Aberto",
        owner: "Reporter",
        dueDate: "",
        source: "Manifestacao DPE-BA",
        rationale:
          "O diario documenta uma representacao administrativa separada; mistura-la com SESAB/CGAI distorceria o historico processual.",
        output: "Entrada separada para DPE-BA e nenhuma afirmacao sobre DPE dentro da trilha SESAB/CGAI.",
      },
    ],
    accessLaw: {
      framework: "LAI brasileira",
      deadline: "20 dias, com possibilidade de prorrogacao por mais 10 dias quando justificada.",
      escalation:
        "Recurso interno, ouvidoria, pedido a autoridade de monitoramento e dossie juridico/publico quando falhas de acesso persistirem.",
      requestChannels:
        "Portal oficial de transparencia, Queremos Saber quando disponivel, e-mail do orgao e sistemas de ouvidoria.",
      reporterWarning:
        "A lei nacional e comum, mas cada orgao pode operar com sistemas, anexos, logins e rotinas recursais diferentes.",
    },
    languagePlan: {
      workingLanguage: "Portugues",
      interfaceLanguages: ["Ingles", "Portugues", "Espanhol"],
      publicationLanguages: ["Portugues"],
      localizationNotes: [
        "Manter termos legais como LAI, OGE e autoridade de monitoramento em portugues, com explicacoes curtas.",
        "Traduzir rotulos de fluxo, mas preservar nomes de orgaos, codigos de protocolo e titulos de fontes.",
        "Se exportar para parceiros internacionais, adicionar glossario curto de termos brasileiros de transparencia.",
      ],
      glossary: [
        {
          term: "LAI",
          meaning: "Lei de Acesso a Informacao brasileira.",
          handling: "Nao traduzir simplesmente como FOIA sem explicar o mecanismo brasileiro.",
        },
        {
          term: "OGE",
          meaning: "Canal estadual de ouvidoria/controle usado para escalonamento na Bahia.",
          handling: "Manter a sigla e explicar o papel institucional.",
        },
        {
          term: "Autoridade de monitoramento",
          meaning: "Autoridade responsavel por monitorar o cumprimento da Lei de Acesso a Informacao.",
          handling: "Traduzir de forma descritiva ao escrever em ingles ou espanhol.",
        },
      ],
    },
    sourceDiscovery: [
      {
        source: "Diario de transparencia",
        purpose: "Fonte de controle para protocolos, datas, recursos, prints e acompanhamentos.",
        verification: "Todo status da plataforma deve bater com o diario antes de demo ou publicacao.",
      },
      {
        source: "Arquivos de resposta dos orgaos",
        purpose: "Bases, planilhas, certidoes, e-mails e links de acesso recebidos via LAI.",
        verification: "Abrir cada arquivo e registrar campos ausentes, links quebrados e anexos faltantes.",
      },
      {
        source: "Orgaos de controle e responsabilizacao",
        purpose: "OGE, canais de autoridade de monitoramento, MP, DPE e ouvidorias.",
        verification: "Manter fluxos separados quando um orgao tiver caminho recursal ou manifestacao diferente.",
      },
    ],
    methodRules: [
      {
        rule: "Dado nao fornecido nao significa dado inexistente.",
        productUse: "Mostrar entrega ausente como lacuna de acesso, nao como achado substantivo.",
      },
      {
        rule: "'Nao informado' ou 'ignorado' nao e a mesma coisa que variavel ausente.",
        productUse: "Manter campos ausentes e valores desconhecidos como problemas diferentes de qualidade de dados.",
      },
      {
        rule: "Falha de protocolo nao equivale a negativa de acesso.",
        productUse: "Acompanhar problemas de sistema separadamente de negativas formais e recursos.",
      },
      {
        rule: "Encaminhamento nao equivale a resposta.",
        productUse: "Nao fechar um pedido quando o orgao apenas o encaminha internamente.",
      },
      {
        rule: "Levantamento parcial nao equivale a atendimento integral.",
        productUse: "Exigir notas de escopo antes de usar respostas parciais em afirmacoes.",
      },
      {
        rule: "Silencio institucional nao prova inexistencia de informacao.",
        productUse: "Tratar silencio como achado de transparencia, nao como evidencia sobre o fato investigado.",
      },
    ],
    transparencyLog: [
      {
        date: "2026-09-24",
        actor: "SESAB / OGE / CGAI",
        event:
          "Manifestacao 3346148 aberta para tratar omissoes em YL5LHVVX, C5NTY0ER, UID2OB7T e VEZ8KTNX, com pedido de avaliacao pela CGAI.",
        status: "Em andamento",
        nextStep:
          "Acompanhar se o caso foi efetivamente submetido a CGAI; nao tratar encaminhamento para a SESAB como decisao da CGAI.",
      },
      {
        date: "2026-09-24",
        actor: "DPE-BA",
        event:
          "Representacao administrativa aberta pela Ouvidoria Cidada sob ficha 2026.01.020197 apos falhas no e-SIC e em anexos.",
        status: "Fluxo separado",
        nextStep:
          "Enviar os seis documentos de apoio por e-mail vinculado a ficha e solicitar encaminhamento a Defensoria Publica-Geral.",
      },
      {
        date: "2026-10-01",
        actor: "MPBA / CESAU",
        event:
          "Oficio 41/CESAU entregou certidao com 23 representacoes de saude materno-infantil das Promotorias de Justica de Saude da Capital, de 01/01/2020 a 20/09/2026.",
        status: "Resposta parcial recebida",
        nextStep:
          "Estruturar e auditar os 23 registros IDEA; manter explicito o escopo da capital e nao tratar como cobertura estadual.",
      },
      {
        date: "2026-10-02",
        actor: "SESAB / OuvidorSUS",
        event:
          "Manifestacao 3346148 foi encaminhada a SESAB; e-mail informou prazo em 24/10/2026, enquanto o portal exibia 01/11/2026.",
        status: "Conflito de prazo",
        nextStep:
          "Registrar as duas datas e aguardar confirmacao documental de encaminhamento ou decisao da CGAI.",
      },
      {
        date: "2026-10-02",
        actor: "Ouvidoria SUS / DGC",
        event:
          "Manifestacao 202620001381338 recebeu 'resposta definitiva' informando anexo, mas nenhum anexo ou parecer estava efetivamente disponivel.",
        status: "Resposta sem anexo",
        nextStep:
          "Nao marcar os pedidos LAI originais como atendidos ate o arquivo ser entregue e revisado.",
      },
      {
        date: "2026-10-02",
        actor: "OuvidorSUS",
        event:
          "Recurso 202620001408821 protocolado no sistema sobre anexo ausente e preservacao do pedido de avaliacao pela CGAI.",
        status: "Recurso protocolado",
        nextStep:
          "Acompanhar prazo exibido pelo sistema em 01/11/2026 sem inferir base legal ou autoridade revisora.",
      },
    ],
    followUpDrafts: [
      {
        title: "Follow-up sobre anexos ausentes",
        request: "Mortes fetais, neonatais e maternas por maternidade",
        type: "Reenvio de anexo",
        status: "Pronto para revisao da reporter",
        riskNote: "Nao acusar omissao; documentar o problema de acesso e pedir reenvio ou canal alternativo.",
        draft:
          "Prezados(as), em relacao ao protocolo YL5LHVVX, a resposta informa envio de anexos, mas os arquivos nao constam no acesso disponivel. Solicito, por favor, o reenvio dos anexos ou a indicacao de canal alternativo para acesso aos documentos, mantendo o numero de protocolo e a data da resposta anterior.",
      },
      {
        title: "Problema de link ou acesso",
        request: "Manifestacoes sobre violencia obstetrica",
        type: "Correcao de acesso",
        status: "Precisa anexar prints",
        riskNote: "Anexar prints e preservar a diferenca entre acesso parcial e dado ausente.",
        draft:
          "Prezados(as), os links enviados para acesso as manifestacoes sobre violencia obstetrica apresentam erro de login ou acesso invalido. Solicito orientacao de acesso, reenvio por e-mail ou disponibilizacao de link valido, com dicionario de campos quando houver base estruturada.",
      },
      {
        title: "Nota de escalonamento para autoridade de monitoramento",
        request: "SESAB/CGAI/CIPOF track",
        type: "Resumo de escalonamento",
        status: "Precisa reconciliar com diario",
        riskNote: "Usar apenas depois de confirmar todas as datas e protocolos no diario de transparencia.",
        draft:
          "Resumo para escalonamento: listar protocolos, datas de envio, prazos, respostas recebidas, inconsistencias de anexo/link e tentativas de contestacao. Solicitar avaliacao da autoridade competente sobre cumprimento do acesso a informacao e medidas para entrega integral dos documentos.",
      },
    ],
    qaChecklist: [
      {
        area: "Log de pedidos",
        question: "Todo pedido tem protocolo, canal, data de envio, prazo e status atual?",
        status: "Precisa atualizar",
        risk: "Medio",
        action: "Reconciliar o prototipo com o diario de transparencia antes de demo externa.",
      },
      {
        area: "Arquivos de evidencia",
        question: "Toda planilha, link ou anexo recebido abre e pode ser rastreado ate a fonte?",
        status: "Bloqueado",
        risk: "Alto",
        action: "Verificar anexos ausentes e links quebrados antes de tratar respostas como dados.",
      },
      {
        area: "Fluxo jurisdicional",
        question: "Orgaos com caminhos recursais diferentes estao separados?",
        status: "Em andamento",
        risk: "Medio",
        action: "Manter SESAB/CGAI e DPE-BA em trilhas de escalonamento separadas.",
      },
      {
        area: "Seguranca das afirmacoes",
        question: "Todas as afirmacoes publicaveis estao ligadas a evidencia, sem inferencia a partir do silencio?",
        status: "Precisa revisar",
        risk: "Alto",
        action: "Reescrever qualquer afirmacao baseada apenas em demora como achado de transparencia/acesso.",
      },
    ],
    centralQuestion:
      "O que os dados revelam sobre violencia obstetrica e mortalidade materna na Bahia?",
    description:
      "Investigacao documental e baseada em dados sobre padroes territoriais, hospitais, mortalidade materna, denuncias, desigualdades e responsabilizacao institucional, sem entrevistas com vitimas nesta fase.",
    processGuide: [
      {
        stage: "Pedido enviado",
        action: "Registrar protocolo, orgao, canal, data de envio e prazo esperado.",
        output: "Diario de transparencia atualizado",
      },
      {
        stage: "Perto do prazo",
        action: "Preparar checagem de anexos, links, login, formato dos dados e campos pedidos.",
        output: "Checklist de recebimento",
      },
      {
        stage: "Resposta parcial ou acesso quebrado",
        action: "Contestar por escrito, pedir reenvio e guardar prints, e-mails e protocolos.",
        output: "Registro de falha verificavel",
      },
      {
        stage: "Atraso ou silencio",
        action: "Acionar OGE, autoridade de monitoramento ou dossie juridico, separando orgaos por fluxo.",
        output: "Plano de escalonamento com evidencias",
      },
    ],
    secondaryQuestions: [
      "Como os registros se distribuem por territorio e por hospital ou maternidade no recorte inicial de 29 hospitais baianos?",
      "Ha concentracao de denuncias ou manifestacoes em determinados hospitais, municipios ou regioes?",
      "O cruzamento entre manifestacoes, mortalidade materna/fetal/neonatal e estrutura hospitalar permite investigar mortes evitaveis?",
      "Mulheres negras, indigenas, PCDs e outros grupos vulneraveis aparecem de forma desproporcional nos dados disponiveis?",
      "Quais lacunas de acesso, campo ou formato impedem transformar os registros em conclusoes publicaveis?",
    ],
    hypotheses: [
      {
        text: "Podem existir padroes territoriais na assistencia obstetrica baiana quando mortalidade, nascimentos, estrutura hospitalar e manifestacoes forem analisados em conjunto.",
        status: "Em apuracao",
        evidence: "SESAB, SINASC, SIM/Ministerio da Saude, CNES e Ouvidoria SUS",
      },
      {
        text: "Manifestacoes sobre violencia obstetrica podem estar concentradas em determinados hospitais ou maternidades, mas isso depende de base acessivel por unidade e periodo.",
        status: "Aguardando dados",
        evidence: "Ouvidoria SUS Bahia e pedidos C5NTY0ER/links de acesso",
      },
      {
        text: "A relacao entre denuncias, mortes maternas evitaveis e estrutura de atendimento pode revelar falhas sistemicas, mas ainda nao deve ser tratada como achado ate a analise das bases e respostas pendentes.",
        status: "Hipotese de trabalho",
        evidence: "Dados de mortalidade, CEPOIF, estrutura hospitalar e manifestacoes",
      },
      {
        text: "Mulheres negras, indigenas, PCDs e outros grupos vulneraveis podem estar sobrerrepresentados nos registros de mortalidade e violencia obstetrica, a depender da completude dos campos de raca/cor e perfil.",
        status: "Em apuracao",
        evidence: "Campos de raca/cor, idade, territorio e perfil nas bases recebidas ou solicitadas",
      },
    ],
    evidenceBlocks: [
      { type: "Base administrativa", priority: "Essencial", status: "Evidencia recebida" },
      { type: "Orgao publico", priority: "Essencial", status: "Fonte mapeada" },
      { type: "Omissao", priority: "Essencial", status: "Lacuna aberta" },
      { type: "Territorio", priority: "Importante", status: "Pedido enviado" },
      { type: "Comparacao", priority: "Contextual", status: "Nao iniciado" },
      { type: "Responsabilidade", priority: "Importante", status: "Fonte mapeada" },
    ],
    sources: [
      {
        name: "Fiocruz / Nascer no Brasil 2",
        type: "Fonte curada / pesquisa",
        status: "Fonte contextual",
        use: "Contexto nacional e parametros de comparacao sobre assistencia obstetrica.",
        limits: "Nao substitui bases administrativas estaduais nem prova achados especificos da Bahia sem cruzamento.",
      },
      {
        name: "SINASC / Ministerio da Saude",
        type: "Sistema administrativo",
        status: "Fonte a integrar",
        use: "Nascimentos, denominadores e perfil dos registros por territorio.",
        limits: "Exige chaves e denominadores corretos; nao mede violencia obstetrica diretamente.",
      },
      {
        name: "SIM / Ministerio da Saude",
        type: "Sistema administrativo",
        status: "Fonte a integrar",
        use: "Mortalidade materna, fetal e neonatal como eixo de analise documental.",
        limits: "Campos incompletos ou classificacoes diferentes podem limitar comparacoes.",
      },
      {
        name: "CNES",
        type: "Cadastro administrativo",
        status: "Fonte a integrar",
        use: "Estrutura cadastrada de maternidades, leitos e vinculos.",
        limits: "Nao mede plantao, qualidade assistencial, presenca real de profissionais ou disponibilidade operacional.",
      },
      {
        name: "SESAB",
        type: "Orgao publico",
        status: "Fonte verificada",
        use: "Dados estaduais de mortalidade e unidades de saude.",
        limits: "Respostas podem vir por setores diferentes e com anexos ausentes.",
      },
      {
        name: "Ouvidoria SUS Bahia",
        type: "Orgao publico",
        status: "Fonte verificada",
        use: "Manifestacoes sobre violencia obstetrica.",
        limits: "Links de acesso e login podem falhar.",
      },
      {
        name: "Ministerio Publico da Bahia",
        type: "Orgao publico",
        status: "Fonte verificada",
        use: "Procedimentos e orientacoes sobre responsabilizacao.",
        limits: "MP informou nao centralizar alguns dados.",
      },
      {
        name: "DPE-BA",
        type: "Fluxo separado",
        status: "Em manifestacao propria",
        use: "Atendimentos, acoes e acordos relacionados a gestantes e maternidades.",
        limits: "Nao deve ser misturado ao dossie SESAB/CGAI enquanto seguir por manifestacao diferente.",
      },
      {
        name: "CEPOIF / Comite de mortalidade materna",
        type: "Orgao publico / comite",
        status: "Pedido pendente",
        use: "Fluxos, reunioes, encaminhamentos, evitabilidade e monitoramento de mortalidade materna.",
        limits: "Ainda depende de resposta ao pedido VEZ8KTNX e nao deve ser presumido.",
      },
    ],
    requests: [
      {
        title: "Obitos maternos 2020-presente",
        agency: "SESAB",
        channel: "Queremos Saber + e-mail",
        protocol: "PVCJ006S",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Resposta parcial",
        requestedItems:
          "Obitos maternos com municipio, estabelecimento, idade, raca/cor, escolaridade, causa basica, evitabilidade, investigacao, encerramento e recomendacoes do Comite.",
        responseSummary:
          "SESAB respondeu em 31/07; anexos nao apareciam na pagina, mas os dados chegaram depois via Fiquem Sabendo/Google Drive. Permanecem lacunas: evitabilidade, recomendacoes do Comite, data de encerramento e valores 'nao informado/ignorado'.",
      },
      {
        title: "Mortes fetais, neonatais e maternas por maternidade",
        agency: "SESAB",
        channel: "Queremos Saber",
        protocol: "YL5LHVVX",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestacao 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se nao houver resposta ate o checkpoint, revisar o portal em 01/11 e preparar cobranca com historico, prints e protocolo.",
        },
        requestedItems:
          "Mortes fetais, neonatais e maternas por maternidade publica estadual entre 2020 e 2026, em formato aberto.",
        responseSummary:
          "Sem resposta substantiva. Incluido na manifestacao 3346148 em 24/09; encaminhado a SESAB em 02/10, sem confirmacao documental de apreciacao pelo CGAI.",
      },
      {
        title: "Manifestacoes sobre violencia obstetrica",
        agency: "Ouvidoria SUS Bahia",
        channel: "Queremos Saber",
        protocol: "C5NTY0ER",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em recurso",
        currentCheckpoint: {
          label: "Recurso 202620001408821",
          date: "2026-11-01",
          source: "Prazo exibido pelo sistema para o recurso apresentado em 02/10.",
          action:
            "Se o anexo nao for entregue, manter a resposta como nao cumprida e registrar nova medida de escalonamento.",
        },
        requestedItems:
          "Manifestacoes anonimizadas de 2020 em diante com termos relacionados a violencia obstetrica, parto, gestante, maternidade e correlatos.",
        responseSummary:
          "Sem entrega dos dados. Respostas administrativas citaram demanda semelhante e DGC, mas sem comprovar entrega. Recurso 202620001408821 apresentado em 02/10 por ausencia do anexo mencionado.",
      },
      {
        title: "Procedimentos instaurados sobre saude materno-infantil",
        agency: "MP-BA / CESAU",
        channel: "SEI + e-mail",
        protocol: "YKXAX4NR / INF0000526 / SEI 19.09.02032.0023004/2026-55",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Resposta parcial entregue",
        requestedItems:
          "Procedimentos relacionados a violencia obstetrica, assistencia obstetrica, mortalidade materna/fetal e termos correlatos, com municipio, unidade, objeto, situacao e encaminhamentos.",
        responseSummary:
          "Em 01/10, Oficio 41/CESAU entregou certidao com 23 representacoes das Promotorias de Justica de Saude da Capital entre 01/01/2020 e 20/09/2026. Resposta parcial no recorte informado, nao atendimento estadual integral.",
      },
      {
        title: "Serie historica de mortalidade materna",
        agency: "DIVEP / SESAB",
        channel: "Queremos Saber",
        protocol: "UID2OB7T",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestacao 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se nao houver resposta substantiva, registrar conflito de prazo e pedir confirmacao documental da analise pela autoridade competente.",
        },
        requestedItems:
          "Serie historica de mortalidade materna de 2020 em diante com municipio, estabelecimento, faixa etaria, raca/cor, escolaridade, pre-natal, idade gestacional, tipo de parto e CID-10.",
        responseSummary:
          "Sem resposta substantiva no diario. Incluido na manifestacao 3346148, com prazos divergentes informados em 24/10 e 01/11.",
      },
      {
        title: "Comite de mortalidade materna",
        agency: "CEPOIF / SESAB",
        channel: "Queremos Saber",
        protocol: "VEZ8KTNX",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestacao 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se nao houver entrega das atas, pareceres ou recomendacoes, manter como ausencia de documento e preparar pedido complementar ou escalonamento.",
        },
        requestedItems:
          "Atas, relatorios anuais, pareceres tecnicos, recomendacoes e planos de acao do Comite entre 2020 e a data do pedido.",
        responseSummary:
          "Sem resposta substantiva. Incluido na manifestacao 3346148; encaminhamento a SESAB nao equivale a entrega dos documentos.",
      },
      {
        title: "Atendimentos, acoes e acordos sobre violencia obstetrica",
        agency: "DPE-BA",
        channel: "e-SIC, e-mail e Ouvidoria Cidada",
        protocol: "1XCDXR72 / ficha 2026.01.020197",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Fluxo separado",
        requestedItems:
          "Atendimentos, acoes judiciais, acordos e dados relacionados a violencia obstetrica e Rede Cegonha.",
        responseSummary:
          "Protocolizacao enfrentou falha persistente no e-SIC. Em 24/09, representacao por omissao foi registrada na Ouvidoria da DPE-BA sob ficha 2026.01.020197; anexos devem ser enviados por e-mail vinculados a ficha.",
      },
    ],
    requestComparisons: [
      {
        requestTitle: "Obitos maternos 2020-presente",
        expected:
          "Obitos maternos por ano, municipio, idade, raca/cor, tipo de parto e causa basica.",
        received:
          "Base parcial com campos demograficos, mas sem tipo de parto consistente.",
        missing: "Tipo de parto, completude de causa basica e explicacao sobre campos ignorados.",
        deadlineStatus: "Respondido no prazo",
        editorialDecision: "Usar com ressalva metodologica",
        nextStep: "Fazer pedido complementar focado apenas nos campos ausentes.",
      },
      {
        requestTitle: "Mortes fetais, neonatais e maternas por maternidade",
        expected:
          "Dados por maternidade, ano, municipio, tipo de morte, causa basica e unidade.",
        received:
          "Resposta afirma envio de anexos, mas os anexos nao aparecem no sistema.",
        missing: "Arquivo original, comprovante de envio e canal alternativo de acesso.",
        deadlineStatus: "Em escalonamento",
        editorialDecision: "Nao usar como evidencia substantiva",
        nextStep: "Manter no dossie SESAB/CGAI com prints, protocolos e historico de contestacao.",
      },
      {
        requestTitle: "Manifestacoes sobre violencia obstetrica",
        expected:
          "Manifestacoes por ano, municipio, unidade, classificacao e desfecho.",
        received:
          "Links divergentes e acesso parcial por e-mail, com falhas de login.",
        missing: "Base completa, link valido, orientacao de acesso e dicionario de campos.",
        deadlineStatus: "Resposta com problema",
        editorialDecision: "Tratar como falha de acesso, nao como dado final",
        nextStep: "Pedir reenvio por e-mail e documentar prints das telas de erro.",
      },
      {
        requestTitle: "Procedimentos instaurados sobre saude materno-infantil",
        expected:
          "Procedimentos, orientacoes, eventuais registros centralizados, TACs, ACPs e indicacao de unidades responsaveis no periodo de 2020 a 2026.",
        received:
          "Oficio 41/CESAU e certidao com 23 representacoes das Promotorias de Justica de Saude da Capital entre 01/01/2020 e 20/09/2026.",
        missing: "Levantamento estadual integral; escopo fora da capital; criterios e limites devem acompanhar qualquer uso quantitativo.",
        deadlineStatus: "Resposta parcial entregue",
        editorialDecision: "Usar como base parcial da capital, nao como retrato estadual do MPBA",
        nextStep: "Estruturar os 23 registros por numero IDEA, tipo, ano, unidade e objeto resumido.",
      },
    ],
    gaps: [
      {
        description: "Tipo de parto ausente ou informado como ignorado.",
        origin: "VO-LAI-01",
        severity: "Alta",
        status: "Aberta",
        nextStep: "Registrar limite metodologico e avaliar novo pedido mais especifico.",
      },
      {
        description: "Resposta menciona envio de anexos, mas anexos nao constam no sistema.",
        origin: "VO-LAI-02",
        severity: "Critica",
        status: "Em escalonamento",
        nextStep: "Manter no dossie SESAB/CGAI e aguardar retorno da OGE/autoridade de monitoramento.",
      },
      {
        description: "Links da Ouvidoria SUS retornam erro de login ou acesso invalido.",
        origin: "VO-LAI-03",
        severity: "Alta",
        status: "Aberta",
        nextStep: "Registrar prints e solicitar reenvio por e-mail.",
      },
      {
        description: "DPE-BA segue em fluxo separado e nao deve entrar no dossie SESAB/CGAI.",
        origin: "Manifestacao propria DPE-BA",
        severity: "Media",
        status: "Separada",
        nextStep: "Atualizar somente quando houver retorno especifico da manifestacao da DPE-BA.",
      },
    ],
    claims: [
      {
        text: "Parte dos dados recebidos nao permite identificar tipo de parto de forma consistente.",
        type: "Factual",
        evidence: "Planilha parcial VO-LAI-01",
        relation: "Limita",
        strength: "Media",
        risk: "Medio",
        status: "Sustentada parcialmente",
      },
      {
        text: "Quatro pedidos de informacao estavam atrasados em setembro de 2026.",
        type: "Numerica",
        evidence: "Diario de transparencia e protocolos",
        relation: "Sustenta",
        strength: "Forte",
        risk: "Baixo",
        status: "Precisa de rechecagem temporal",
      },
      {
        text: "Nao ha uma base oficial unica que meca violencia obstetrica diretamente na Bahia.",
        type: "Metodologica",
        evidence: "Arquitetura da pauta e pedidos a SESAB, Ouvidoria SUS, MP-BA, DPE-BA e CEPOIF",
        relation: "Limita",
        strength: "Media",
        risk: "Medio",
        status: "Precisa de formulacao cautelosa",
      },
    ],
  },
  {
    id: "school-tech",
    title: "School technology contracts and public accountability",
    country: "United States",
    jurisdiction: "County school district",
    language: "English",
    topic: "Public spending",
    status: "Simulated test case",
    period: "2021-2026",
    territory: "Local school district",
    updatedAt: "2026-09-30",
    freshness: {
      status: "Current simulated case",
      checkedAt: "2026-09-30",
      summary:
        "This case is synthetic and exists to test U.S. public-records behavior, deadlines and partial response review.",
    },
    nextReviewItems: [
      "Replace generic county references with one real jurisdiction before user testing.",
      "Add state-specific deadline and appeal language.",
      "Confirm whether procurement records, invoices and board attachments follow separate request paths.",
    ],
    actionItems: [
      {
        action: "Select one real state before showing public-records deadlines.",
        type: "Jurisdiction setup",
        priority: "High",
        status: "Blocked",
        owner: "Reporter",
        dueDate: "",
        source: "State public records guide",
        rationale:
          "A U.S. school district usually follows state public-records law, not federal FOIA.",
        output: "State-specific deadline, exemption and appeal fields ready for QA.",
      },
      {
        action: "Send a narrowed invoice and purchase-order follow-up.",
        type: "Records follow-up",
        priority: "Medium",
        status: "Ready",
        owner: "Reporter",
        dueDate: "",
        source: "Partial production",
        rationale:
          "Contracts alone cannot show spending patterns; invoices and purchase orders are still missing.",
        output: "Focused request limited to invoices, purchase orders and older records location.",
      },
      {
        action: "Identify exact board meeting dates before requesting attachments.",
        type: "Source narrowing",
        priority: "Medium",
        status: "Needs reporter input",
        owner: "Reporter",
        dueDate: "",
        source: "School board website",
        rationale:
          "The attachment request should be narrow enough to avoid unnecessary delay or fees.",
        output: "List of meeting dates and agenda items connected to vendor decisions.",
      },
    ],
    accessLaw: {
      framework: "U.S. public records law",
      deadline:
        "Varies by state and agency. Federal FOIA has a 20-working-day response target, but school districts usually follow state law.",
      escalation:
        "State-specific appeal, mediation, attorney general/public records office, court option or narrowed follow-up request.",
      requestChannels:
        "Agency public records e-mail, online portal, clerk office, board office and public websites.",
      reporterWarning:
        "Do not suggest a deadline or appeal path until the state and agency type are identified.",
    },
    languagePlan: {
      workingLanguage: "English",
      interfaceLanguages: ["English", "Portuguese", "Spanish"],
      publicationLanguages: ["English", "Spanish"],
      localizationNotes: [
        "Keep FOIA separate from state public records law because school districts usually follow state rules.",
        "Translate product UI, but localize legal guidance only after a state is selected.",
        "Spanish publication support should explain U.S. public-records concepts instead of using literal legal translations.",
      ],
      glossary: [
        {
          term: "FOIA",
          meaning: "Federal Freedom of Information Act.",
          handling: "Use only for federal agencies; avoid using it as a generic synonym for all public records.",
        },
        {
          term: "Public records request",
          meaning: "State or local access-to-records request.",
          handling: "Translate as a concept, then name the state law once known.",
        },
        {
          term: "School board minutes",
          meaning: "Official meeting records from a school board.",
          handling: "Preserve as a source type and explain whether attachments are included.",
        },
      ],
    },
    sourceDiscovery: [
      {
        source: "School board website",
        purpose: "Minutes, agendas, votes, policy documents and public attachments.",
        verification: "Separate public minutes from attachments that require a records request.",
      },
      {
        source: "Procurement portal",
        purpose: "Contracts, bids, purchase orders, invoices and vendor identifiers.",
        verification: "Check whether older years are archived or held by another office.",
      },
      {
        source: "State public records guide",
        purpose: "Deadline, exemptions, appeal route and fee rules for the jurisdiction.",
        verification: "Select the state before generating any deadline or escalation advice.",
      },
    ],
    followUpDrafts: [
      {
        title: "Narrowed invoice request",
        request: "Vendor contracts and invoices",
        type: "Focused follow-up",
        status: "Ready for reporter review",
        riskNote: "Ask narrowly for missing records; do not frame missing invoices as wrongdoing.",
        draft:
          "Dear records officer, thank you for the contract records produced for 2024-2026. This follow-up request is limited to invoices and purchase orders for the same vendors, including records from 2021-2023 or the office/archive where those older records are maintained.",
      },
      {
        title: "Board attachments request",
        request: "School board minutes and attachments",
        type: "Specific record request",
        status: "Needs meeting dates",
        riskNote: "Reporter must insert exact meeting dates before sending.",
        draft:
          "Dear clerk, I am requesting the agenda attachments, presentations and supporting files for the school board meetings where education technology vendors were discussed. I can narrow this request to the following meeting dates: [insert dates].",
      },
    ],
    qaChecklist: [
      {
        area: "Jurisdiction",
        question: "Is the state law identified before suggesting deadlines or appeal options?",
        status: "Blocked",
        risk: "High",
        action: "Select one U.S. state and encode its public-records rules.",
      },
      {
        area: "Source map",
        question: "Are public websites separated from records that require a formal request?",
        status: "Ready",
        risk: "Low",
        action: "Use board minutes as open source and invoices/contracts as request track.",
      },
      {
        area: "Response review",
        question: "Does the tool distinguish partial production from denial?",
        status: "Ready",
        risk: "Low",
        action: "Keep missing years and invoices as follow-up items, not as proof of wrongdoing.",
      },
    ],
    centralQuestion:
      "What records can show how a public school district selected, contracted and monitored education technology vendors?",
    description:
      "A simulated U.S. public records workflow to test whether Evidence Desk works outside the Brazilian LAI context.",
    secondaryQuestions: [
      "Which public records show the vendor selection process, board approval and procurement path?",
      "Do contracts, invoices and purchase orders show spending patterns that are not visible in board summaries?",
      "What records document privacy review, implementation monitoring and accountability after purchase?",
      "Which missing records require a narrowed follow-up request under state public-records law?",
    ],
    processGuide: [
      {
        stage: "Request sent",
        action: "Log the agency, channel, sent date, expected deadline and exact wording.",
        output: "Public records request log",
      },
      {
        stage: "Before deadline",
        action: "Prepare a receipt checklist for records, exemptions, missing years and file formats.",
        output: "Response review checklist",
      },
      {
        stage: "Partial response",
        action: "Narrow the follow-up request and ask where older or missing records are held.",
        output: "Focused follow-up request",
      },
      {
        stage: "Delay or denial",
        action: "Review state-specific appeal options, exemptions and mediation paths before escalating.",
        output: "Appeal or mediation plan",
      },
    ],
    hypotheses: [
      {
        text: "Procurement records may show whether vendor selection followed a competitive process.",
        status: "Open",
        evidence: "Procurement files and school board minutes",
      },
      {
        text: "Invoices and contracts may reveal spending patterns not visible in board summaries.",
        status: "In progress",
        evidence: "Contracts and invoices",
      },
      {
        text: "Privacy impact assessments may be missing or incomplete.",
        status: "Needs records",
        evidence: "Public records request pending",
      },
    ],
    evidenceBlocks: [
      { type: "Contract", priority: "Essential", status: "Request sent" },
      { type: "Money", priority: "Essential", status: "Gap open" },
      { type: "Public decision", priority: "Important", status: "Source mapped" },
      { type: "Timeline", priority: "Important", status: "Evidence received" },
      { type: "Impact", priority: "Contextual", status: "Not started" },
      { type: "Organization", priority: "Important", status: "Source mapped" },
    ],
    sources: [
      {
        name: "School district board minutes",
        type: "Public website",
        status: "Verified source",
        use: "Decision records, votes and meeting context.",
        limits: "Minutes may summarize decisions without attachments.",
      },
      {
        name: "County procurement portal",
        type: "Open data path",
        status: "Likely path",
        use: "Contracts, bids and vendor records.",
        limits: "May require manual search or records request.",
      },
      {
        name: "State public records law",
        type: "Legal mechanism",
        status: "To confirm",
        use: "Request contracts, invoices, communications and assessments.",
        limits: "Deadlines and exemptions vary by state.",
      },
    ],
    requests: [
      {
        title: "Vendor contracts and invoices",
        agency: "School district procurement office",
        channel: "Public records email",
        protocol: "N/A",
        sentDate: "2026-09-01",
        dueDate: "2026-09-21",
        status: "Partial response",
        requestedItems:
          "All contracts, invoices and purchase orders related to education technology vendors from 2021 to 2026.",
        responseSummary:
          "Contracts for 2024-2026 received. Invoices and earlier years missing.",
      },
      {
        title: "School board minutes and attachments",
        agency: "School board clerk",
        channel: "Public website + email",
        protocol: "N/A",
        sentDate: "2026-09-03",
        dueDate: "2026-09-23",
        status: "Response received",
        requestedItems:
          "Minutes, agendas and attachments for meetings where education technology vendors were discussed.",
        responseSummary:
          "Minutes found online. Attachments require separate request.",
      },
    ],
    requestComparisons: [
      {
        requestTitle: "Vendor contracts and invoices",
        expected:
          "Contracts, invoices and purchase orders for education technology vendors from 2021 to 2026.",
        received: "Contracts for 2024-2026, with invoices and earlier years missing.",
        missing: "Invoices, purchase orders, 2021-2023 records and archive location.",
        deadlineStatus: "Partial response",
        editorialDecision: "Use only to describe the partial production",
        nextStep: "Send a narrowed follow-up request for invoices and older records.",
      },
      {
        requestTitle: "School board minutes and attachments",
        expected:
          "Minutes, agendas and attachments for meetings where education technology vendors were discussed.",
        received: "Minutes found online, but attachments require a separate request.",
        missing: "Meeting attachments and file names for the relevant agenda items.",
        deadlineStatus: "Response received",
        editorialDecision: "Use minutes for timeline, not for contract detail",
        nextStep: "Request attachments for the specific meeting dates.",
      },
    ],
    gaps: [
      {
        description: "Invoices were not included in the partial response.",
        origin: "Vendor contracts and invoices",
        severity: "High",
        status: "Open",
        nextStep: "Send a narrowed follow-up request for invoices only.",
      },
      {
        description: "Response covers 2024-2026 but request asked for 2021-2026.",
        origin: "Vendor contracts and invoices",
        severity: "Medium",
        status: "Open",
        nextStep: "Ask whether older records are held by another office or archived.",
      },
      {
        description: "Meeting attachments were not available with public minutes.",
        origin: "School board minutes and attachments",
        severity: "Medium",
        status: "In verification",
        nextStep: "Request attachments for the specific meeting dates.",
      },
    ],
    claims: [
      {
        text: "The district publicly posted minutes for meetings where education technology vendors were discussed.",
        type: "Factual",
        evidence: "School board website",
        relation: "Supports",
        strength: "Strong",
        risk: "Low",
        status: "Supported",
      },
      {
        text: "The district provided contracts only for part of the requested period.",
        type: "Factual",
        evidence: "Partial public records response",
        relation: "Supports",
        strength: "Strong",
        risk: "Low",
        status: "Supported",
      },
      {
        text: "The vendor selection process lacked competition.",
        type: "Interpretive",
        evidence: "Procurement records still missing",
        relation: "Limits",
        strength: "Insufficient",
        risk: "High",
        status: "Needs more evidence",
      },
    ],
  },
];
