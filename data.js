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
      term: "Hipótese",
      meaning: "Possibilidade investigativa ainda em teste.",
      qaRule: "Não deve aparecer como conclusão enquanto evidências suficientes não forem revisadas.",
    },
    {
      term: "Afirmação",
      meaning: "Frase publicável que precisa estar ligada a evidência, limite e risco editorial.",
      qaRule: "Toda afirmação deve mostrar se a evidência sustenta, contradiz ou limita o que está sendo dito.",
    },
    {
      term: "Bloco de evidência",
      meaning: "Tipo de prova, dado, documento ou fonte necessário para testar uma hipótese.",
      qaRule: "Pode existir antes da fonte concreta ser encontrada, mas precisa ter prioridade e status.",
    },
    {
      term: "Lacuna",
      meaning: "Informação ausente, incompleta, contraditória ou ainda não verificável.",
      qaRule: "Nunca deve virar acusação; deve virar follow-up, limite metodológico ou reescrita.",
    },
    {
      term: "Resposta parcial",
      meaning: "Resposta que entrega parte do solicitado ou exige checagem de anexos, campos e escopo.",
      qaRule: "Só vira evidência depois de conferência humana do material recebido.",
    },
  ],
  statuses: [
    {
      entity: "Hipótese",
      values: "Aberta; em apuração; aguardando dados; sustentada; contradita; reformular",
    },
    {
      entity: "Pedido",
      values: "Enviado; respondido; resposta parcial; em recurso; em escalonamento; fluxo separado",
    },
    {
      entity: "Resposta",
      values: "Sem material; recebida; parcial; com problema; revisada; não usar como evidência",
    },
    {
      entity: "Afirmação",
      values: "Sustentada; sustentada parcialmente; limitada; contradita; precisa de evidência; reformular",
    },
    {
      entity: "Lacuna",
      values: "Aberta; em verificação; em escalonamento; resolvida; separada",
    },
  ],
  evidenceRelations: [
    {
      relation: "Sustenta",
      meaning: "A evidência reforça a afirmação, dentro dos limites registrados.",
    },
    {
      relation: "Contradiz",
      meaning: "A evidência enfraquece, derruba ou exige reescrever a afirmação.",
    },
    {
      relation: "Limita",
      meaning: "A evidência não contradiz, mas reduz o alcance, escopo ou nível de certeza.",
    },
  ],
  strengthScale: [
    {
      level: "Forte",
      meaning: "Documento, dado ou resposta oficial diretamente ligado à afirmação, com escopo e campos suficientes.",
      publishRule: "Pode sustentar afirmação factual se não houver lacuna crítica, contradição aberta ou ressalva ignorada.",
    },
    {
      level: "Média",
      meaning: "Evidência útil, mas parcial, agregada, incompleta ou dependente de cruzamento adicional.",
      publishRule: "Só deve sustentar formulação cautelosa, com limite metodológico explícito.",
    },
    {
      level: "Insuficiente",
      meaning: "Material ausente, inacessível, contraditório, indireto ou ainda não conferido pela repórter.",
      publishRule: "Não deve sustentar claim; deve virar lacuna, follow-up ou reformulação.",
    },
  ],
  riskScale: [
    {
      level: "Baixo",
      meaning: "Afirmação descritiva, bem delimitada e apoiada por evidência revisada.",
      requiredAction: "Manter fonte, escopo e data visíveis na metodologia.",
    },
    {
      level: "Médio",
      meaning: "Afirmação depende de dado parcial, ausência de campo, interpretação de categoria ou recorte territorial.",
      requiredAction: "Adicionar ressalva e pedir revisão editorial antes de publicar.",
    },
    {
      level: "Alto",
      meaning: "Afirmação pode sugerir culpa, negligência, ilegalidade ou conclusão que a evidência ainda não prova.",
      requiredAction: "Bloquear publicação até haver nova evidência, direito de resposta ou reescrita.",
    },
  ],
  dataModel: [
    {
      entity: "Investigação",
      relation: "1 investigação tem várias perguntas, hipóteses, fontes, pedidos, lacunas e afirmações.",
      qaRule: "Nada deve ser avaliado fora do contexto de país, jurisdição, período e território.",
    },
    {
      entity: "Hipótese",
      relation: "1 hipótese pode depender de vários blocos de evidência.",
      qaRule: "Hipótese não é conclusão; precisa manter status próprio até virar afirmação verificável.",
    },
    {
      entity: "Bloco de evidência",
      relation: "1 bloco pode apontar para várias fontes, bases, documentos ou pedidos.",
      qaRule: "O bloco define o que precisa ser provado antes de escolher o melhor caminho de coleta.",
    },
    {
      entity: "Pedido",
      relation: "1 pedido pode gerar resposta completa, parcial, problemática ou nenhuma resposta.",
      qaRule: "Prazo, protocolo e canal são manuais nesta versão; a ferramenta não calcula regra legal sozinha.",
    },
    {
      entity: "Afirmação",
      relation: "1 afirmação deve apontar para evidência, relação, força, risco, status e ressalva.",
      qaRule: "Afirmações sem evidência suficiente devem ficar bloqueadas, limitadas ou reescritas.",
    },
  ],
  accessibilityChecks: [
    "Status aparece como texto dentro dos pills, não apenas por cor.",
    "Abas e atalhos principais são botões navegáveis por teclado.",
    "Tabelas mantêm cabeçalhos visíveis para leitura de matriz e comparação.",
    "Estados vazios e limites do protótipo são descritos em texto.",
  ],
  acceptanceCriteria: [
    "Cada tela mostra a seção atual e a próxima pendência editorial.",
    "Cada status usado nos dados de exemplo aparece na lista fechada de status.",
    "Toda afirmação mostra relação da evidência: sustenta, contradiz ou limita.",
    "A nota metodológica exportada inclui relações de evidência, lacunas e salvaguardas.",
    "No teste com 5 jornalistas, pelo menos 4 identificam uma afirmação insegura sem explicação externa.",
  ],
  functionalChecks: [
    {
      item: {
        pt: "Status por entidade",
        en: "Status by entity",
        es: "Estado por entidad",
      },
      expectation: {
        pt: "Hipóteses, pedidos, respostas, lacunas e afirmações devem ter estados separados.",
        en: "Hypotheses, requests, responses, gaps and claims need separate status lists.",
        es: "Hipotesis, solicitudes, respuestas, vacios y afirmaciones necesitan listas de estado separadas.",
      },
      coverage: {
        pt: "Coberto na aba Checklist QA pelo glossário e lista fechada de status.",
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
        pt: "Evidência contraditória",
        en: "Contradictory evidence",
        es: "Evidência contradictoria",
      },
      expectation: {
        pt: "A matriz precisa registrar se cada evidência sustenta, contradiz ou limita uma afirmação.",
        en: "The matrix must record whether each evidence item supports, contradicts or limits a claim.",
        es: "La matriz debe registrar si cada evidência sustenta, contradice o limita una afirmacion.",
      },
      coverage: {
        pt: "Coberto na matriz de afirmações e na nota metodológica exportada.",
        en: "Covered in the claims matrix and exported methodology note.",
        es: "Cubierto en la matriz de afirmaciones y en la nota metodológica exportada.",
      },
      status: {
        pt: "Coberto",
        en: "Covered",
        es: "Cubierto",
      },
    },
    {
      item: {
        pt: "Prazos por jurisdição",
        en: "Jurisdiction deadlines",
        es: "Plazos por jurisdiccion",
      },
      expectation: {
        pt: "O produto não deve calcular prazo legal sem jurisdição, órgão e regra revisada.",
        en: "The product should not calculate legal deadlines without jurisdiction, agency and reviewed rule.",
        es: "El producto no debe calcular plazos legales sin jurisdiccion, organismo y regla revisada.",
      },
      coverage: {
        pt: "Parcial: o protótipo mostra prazos registrados e limites, mas não calcula regras automaticamente.",
        en: "Partial: the prototype shows logged deadlines and limits, but does not calculate rules automatically.",
        es: "Parcial: el protótipo muestra plazos registrados y limites, pero no calcula reglas automaticamente.",
      },
      status: {
        pt: "Parcial",
        en: "Partial",
        es: "Parcial",
      },
    },
    {
      item: {
        pt: "Persistência de investigação",
        en: "Investigation persistence",
        es: "Persistencia de investigacion",
      },
      expectation: {
        pt: "Uma jornalista deve conseguir salvar, exportar ou reabrir uma investigação real.",
        en: "A journalist should be able to save, export or reopen a real investigation.",
        es: "Una periodista debe poder guardar, exportar o reabrir una investigacion real.",
      },
      coverage: {
        pt: "Parcial: agora cria, salva localmente, importa e exporta JSON, mas ainda não há conta, backend ou colaboração.",
        en: "Partial: it now creates, saves locally, imports and exports JSON, but there is no account, backend or collaboration yet.",
        es: "Parcial: ahora crea, guarda localmente, importa y exporta JSON, pero aun no hay cuenta, backend ni colaboracion.",
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
      pt: "O protótipo salva investigações no navegador, cria novos casos, importa JSON e exporta a investigação atual.",
      en: "The prototype saves investigations in the browser, creates new cases, imports JSON and exports the current investigation.",
      es: "El prototipo guarda investigaciones en el navegador, crea nuevos casos, importa JSON y exporta la investigacion actual.",
    },
    next: {
      pt: "v0.2 precisa transformar armazenamento local em backend com login, permissões e colaboração.",
      en: "v0.2 needs to move local storage into a backend with login, permissions and collaboration.",
      es: "v0.2 necesita convertir el almacenamiento local en backend con login, permisos y colaboracion.",
    },
  },
  {
    area: {
      pt: "Prazos legais",
      en: "Legal deadlines",
      es: "Plazos legales",
    },
    current: {
      pt: "Prazos aparecem quando foram registrados pela repórter ou pelo caso de teste; a ferramenta não calcula regra por jurisdição.",
      en: "Deadlines appear when logged by the reporter or test case; the tool does not calculate jurisdiction rules.",
      es: "Los plazos aparecen cuando fueron registrados por la repórtera o por el caso de prueba; la herramienta no calcula reglas por jurisdiccion.",
    },
    next: {
      pt: "Adicionar regras revisadas por país/estado/órgão, sempre com alerta de verificação humana.",
      en: "Add reviewed rules by country/state/agency, always with human verification warnings.",
      es: "Agregar reglas revisadas por país/estado/organismo, siempre con alerta de verificacion humana.",
    },
  },
  {
    area: {
      pt: "IA",
      en: "AI",
      es: "IA",
    },
    current: {
      pt: "Nenhuma IA decide fontes, prazos, claims ou conclusões nesta versão.",
      en: "No AI decides sources, deadlines, claims or conclusions in this version.",
      es: "Ninguna IA decide fuentes, plazos, afirmaciones o conclusiones en esta version.",
    },
    next: {
      pt: "A IA deve entrar apenas como revisão assistida: comparar pedido-resposta, apontar lacunas e rascunhar notas revisáveis.",
      en: "AI should enter only as assisted review: comparing request-response, flagging gaps and drafting reviewable notes.",
      es: "La IA debe entrar solo como revision asistida: comparar solicitud-respuesta, senalar vacios y redactar notas revisables.",
    },
  },
];

export const mvpCoverage = [
  {
    area: {
      pt: "Criar investigação",
      en: "Create investigation",
      es: "Crear investigacion",
    },
    expected: {
      pt: "Título, país, jurisdição, idioma, tema, território, período, pergunta central e descrição curta.",
      en: "Title, country, jurisdiction, language, topic, territory, period, central question and short description.",
      es: "Título, país, jurisdiccion, idioma, tema, território, período, pregunta central y descripcion corta.",
    },
    implementation: {
      pt: "Formulário de nova investigação com validações essenciais e preview do projeto.",
      en: "New investigation form with essential validations and project preview.",
      es: "Formulário de nueva investigacion con validaciones esenciales y preview del proyecto.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Mapear evidências",
      en: "Map evidence",
      es: "Mapear evidências",
    },
    expected: {
      pt: "Perguntas, hipóteses e blocos de evidência necessária, complementar, contextual ou desconhecida.",
      en: "Questions, hypotheses and evidence blocks marked as necessary, complementary, contextual or unknown.",
      es: "Preguntas, hipotesis y bloques de evidência necesaria, complementaria, contextual o desconocida.",
    },
    implementation: {
      pt: "Aba de plano com cadastro local de hipóteses, blocos de evidência e fontes, além de status, prioridade e evidência relacionada.",
      en: "Plan tab with local entry for hypotheses, evidence blocks and sources, plus status, priority and related evidence.",
      es: "Pestana de plan con registro local de hipotesis, bloques de evidência y fuentes, ademas de estado, prioridad y evidência relacionada.",
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
      pt: "Separar fonte verificada, caminho provável e fonte a confirmar, com limites e melhor uso.",
      en: "Separate verified source, likely path and source to confirm, with limits and best use.",
      es: "Separar fuente verificada, camino probable y fuente por confirmar, con limites y mejor uso.",
    },
    implementation: {
      pt: "Aba de fontes com cadastro local, status, jurisdição, links, limites e trilhas de descoberta.",
      en: "Sources tab with local entry, status, jurisdiction, links, limits and discovery paths.",
      es: "Pestana de fuentes con registro local, estado, jurisdiccion, enlaces, limites y rutas de descubrimiento.",
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
      pt: "Órgão, canal, protocolo, data, prazo, status, resumo e itens solicitados.",
      en: "Agency, channel, protocol, date, due date, status, summary and requested items.",
      es: "Organismo, canal, protocolo, fecha, plazo, estado, resumen e items solicitados.",
    },
    implementation: {
      pt: "Aba de pedidos com cadastro local, prazos, checkpoints, status e ações sugeridas sem envio automático.",
      en: "Requests tab with local entry, due dates, checkpoints, status and suggested actions without automatic filing.",
      es: "Pestana de solicitudes con registro local, plazos, checkpoints, estado y acciones sugeridas sin envio automático.",
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
      pt: "Mostrar itens solicitados, entregues, ausentes, divergências de granularidade e próximos passos.",
      en: "Show requested, delivered and missing items, granularity issues and next steps.",
      es: "Mostrar items solicitados, entregados, ausentes, divergências de granularidad y próximos pasos.",
    },
    implementation: {
      pt: "Abas de respostas e comparação com cadastro local de esperado, recebido, ausente/pouco claro, decisão editorial e próximo passo.",
      en: "Responses and comparison tabs with local entry for expected, received, missing/unclear points, editorial decision and next step.",
      es: "Pestanas de respuestas y comparacion con registro local de esperado, recibido, ausente/poco claro, decision editorial y próximo paso.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Transformar lacunas em ações",
      en: "Turn gaps into actions",
      es: "Convertir vacios en acciones",
    },
    expected: {
      pt: "Marcar lacunas, riscos, origem e próximo passo sem tratar ausência como conclusão.",
      en: "Mark gaps, risks, origin and next step without treating absence as a conclusion.",
      es: "Marcar vacios, riesgos, origen y próximo paso sin tratar ausência como conclusion.",
    },
    implementation: {
      pt: "Aba de lacunas com cadastro local, plano de ação editável, diário de transparência editável e rascunhos de follow-up editáveis.",
      en: "Gaps tab with local entry, editable action plan, editable transparency log and editable follow-up draft tabs.",
      es: "Pestana de vacios con registro local, plan de accion editable, diário de transparência editable y borradores de seguimiento editables.",
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
      es: "Matriz afirmacion-evidência",
    },
    expected: {
      pt: "Vincular afirmações a evidências, relação da evidência, força, risco e status editorial.",
      en: "Link claims to evidence, evidence relation, strength, risk and editorial status.",
      es: "Vincular afirmaciones a evidências, relacion de evidência, fuerza, riesgo y estado editorial.",
    },
    implementation: {
      pt: "Aba de afirmações com cadastro local, evidência, relação sustenta/contradiz/limita, risco, força e ressalvas.",
      en: "Claims tab with local entry, evidence, supports/contradicts/limits relation, risk, strength and caveats.",
      es: "Pestana de afirmaciones con registro local, relacion sustenta/contradice/limita, riesgo, fuerza y salvedades.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "Nota metodológica",
      en: "Methodology note",
      es: "Nota metodológica",
    },
    expected: {
      pt: "Exportar pergunta, período, território, pedidos, respostas, fontes, lacunas, limites e claims.",
      en: "Export question, period, territory, requests, responses, sources, gaps, limits and claims.",
      es: "Exportar pregunta, período, território, solicitudes, respuestas, fuentes, vacios, limites y afirmaciones.",
    },
    implementation: {
      pt: "Aba de metodologia com nota em Markdown copiável e salvaguardas metodológicas.",
      en: "Methodology tab with copyable Markdown note and methodological safeguards.",
      es: "Pestana de metodologia con nota en Markdown copiable y salvaguardas metodológicas.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
      es: "Implementado",
    },
  },
  {
    area: {
      pt: "IA, backend e envio automático",
      en: "AI, backend and automatic filing",
      es: "IA, backend y envio automático",
    },
    expected: {
      pt: "Fora do MVP original: sem protocolo automático de LAI/FOIA, login complexo ou IA decidindo fontes.",
      en: "Outside the original MVP: no automatic FOIA/LAI filing, complex login or AI deciding sources.",
      es: "Fuera del MVP original: sin protocolo automático de LAI/FOIA, login complejo o IA decidiendo fuentes.",
    },
    implementation: {
      pt: "Mantido como limite do protótipo; roadmap separa persistência v0.2 e revisão assistida v0.3.",
      en: "Kept as prototype boundary; roadmap separates v0.2 persistence and v0.3 assisted review.",
      es: "Mantenido como limite del protótipo; el roadmap separa persistência v0.2 y revision asistida v0.3.",
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
        owner: "Repórter",
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
        owner: "Repórter",
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
        owner: "Repórter",
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
        riskNote: "Repórter must insert exact meeting dates before sending.",
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
        use: "Request contracts, invoices, commúnications and assessments.",
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
