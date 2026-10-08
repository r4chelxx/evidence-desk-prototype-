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
      qaRule: "Toda afirmação deve mostrar se a evidência sustenta, contradiz ou limita o que esta sendo dito.",
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
  acceptanceCriteria: [
    "Cada tela mostra a seção atual e a próxima pendência editorial.",
    "Cada status usado nos dados de exemplo aparece na lista fecháda de status.",
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
        pt: "Coberto na aba Checklist QA pelo glossário e lista fecháda de status.",
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
        pt: "Persistencia de investigação",
        en: "Investigation persistence",
        es: "Persistencia de investigacion",
      },
      expectation: {
        pt: "Uma jornalista deve conseguir salvar, exportar ou reabrir uma investigação real.",
        en: "A journalist should be able to save, export or reopen a real investigation.",
        es: "Una periodista debe poder guardar, exportar o reabrir una investigacion real.",
      },
      coverage: {
        pt: "Parcial: a investigação atual pode ser exportada em JSON, mas ainda não há importação ou reabertura.",
        en: "Partial: the current investigation can be exported as JSON, but there is no import or reopening yet.",
        es: "Parcial: la investigacion actual puede exportarse como JSON, pero aun no háy importacion ni reapertura.",
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
      pt: "O protótipo é estático: permite exportar a investigação atual em JSON, mas ainda não reabre nem persiste novas investigações.",
      en: "The prototype is static: it can export the current investigation as JSON, but does not reopen or persist new investigations yet.",
      es: "El prototipo es estático: permite exportar la investigacion actual en JSON, pero aun no reabre ni guarda nuevas investigaciones.",
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
      pt: "A IA deve entrar apenas como revisão assistida: comparar pedido-resposta, apontar lacunas e rascunhár notas revisáveis.",
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
      pt: "Formulario de nova investigação com validações essenciais e preview do projeto.",
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
      pt: "Abas de hipóteses e blocos de evidência com status, prioridade e evidência relacionada.",
      en: "Hypotheses and evidence-block tabs with status, priority and related evidence.",
      es: "Pestanas de hipotesis y bloques de evidência con estado, prioridad y evidência relacionada.",
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
      pt: "Aba de fontes com status, jurisdição, links, limites e trilhas de descoberta.",
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
      pt: "Órgão, canal, protocolo, data, prazo, status, resumo e itens solicitados.",
      en: "Agency, channel, protocol, date, due date, status, summary and requested items.",
      es: "Organismo, canal, protocolo, fechá, plazo, estado, resumen e items solicitados.",
    },
    implementation: {
      pt: "Aba de pedidos com prazos, checkpoints, status e ações sugeridas sem envio automatico.",
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
      pt: "Mostrar itens solicitados, entregues, ausentes, divergências de granularidade e próximos passos.",
      en: "Show requested, delivered and missing items, granularity issues and next steps.",
      es: "Mostrar items solicitados, entregados, ausentes, divergências de granularidad y próximos pasos.",
    },
    implementation: {
      pt: "Abas de respostas e comparação com material recebido, lacunas, esperado, ausente/pouco claro e decisão editorial.",
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
      pt: "Abas de lacunas, plano de ação, diário de transparência e rascunhos de follow-up.",
      en: "Gaps, action plan, transparency log and follow-up draft tabs.",
      es: "Pestanas de vacios, plan de accion, diário de transparência y borradores de seguimiento.",
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
      pt: "Aba de afirmações com evidência, relação sustenta/contradiz/limita, risco, força e ressalvas.",
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
    id: "vo-bahia",
    title: "Violência obstétrica e transparência de dados na Bahia",
    country: "Brasil",
    jurisdiction: "Bahia",
    language: "Português",
    topic: "Saúde pública",
    status: "Em revisão",
    period: "2020-2026",
    territory: "Salvador, RMS e interior da Bahia",
    updatedAt: "2026-10-05",
    freshness: {
      status: "Precisa de revisão da repórter",
      checkedAt: "2026-10-05",
      summary:
        "Diário de transparência mais recente revisado: 02/10/2026. MPBA/CESAU entregou certidão parcial com escopo de capital; SESAB/OuvidoriaSUS ainda tem entrega pendente, anexo ausente e dúvidas sobre encaminhámento ou decisão da CGAI.",
    },
    nextReviewItems: [
      "Monitorar manifestação 3346148: prazo por e-mail em 24/10/2026, prazo no portal em 01/11/2026, ainda sem decisão CGAI documentada.",
      "Monitorar recurso 202620001408821 sobre o anexo DGC/SESAB ausente; prazo exibido pelo sistema em 01/11/2026.",
      "Estruturar os 23 registros MPBA/CESAU da certidão de escopo capital antes de usa-los analiticamente.",
      "Manter a representação DPE-BA 2026.01.020197 separada da cadeia SESAB/OGE/CGAI.",
    ],
    actionItems: [
      {
        action: "Verificar se a manifestação 3346148 recebeu resposta substantiva da SESAB/CGAI.",
        type: "Revisão de prazo",
        priority: "Alta",
        status: "Aguardando checkpoint",
        owner: "Repórter",
        dueDate: "2026-10-24",
        source: "Diário de transparência",
        rationale:
          "O diário registra prazo por e-mail em 24/10 e prazo no portal em 01/11, mas nenhuma decisão CGAI documentada.",
        output: "Entrada de log atualizada indicando se a resposta entregou dados, apenas encaminhou o caso ou manteve silêncio.",
      },
      {
        action: "Rechecar o prazo do portal para a manifestação 3346148.",
        type: "Conflito de prazo",
        priority: "Alta",
        status: "Agendado",
        owner: "Repórter",
        dueDate: "2026-11-01",
        source: "Diário de transparência",
        rationale:
          "A mesma trilha processual tem duas datas; o produto deve preservar ambas em vez de escolher uma automaticamente.",
        output: "Nota de conflito de prazo resolvida, preservada ou escalada com prints.",
      },
      {
        action: "Monitorar o recurso 202620001408821 sobre o anexo DGC/SESAB ausente.",
        type: "Acompanhámento de recurso",
        priority: "Alta",
        status: "Aguardando checkpoint",
        owner: "Repórter",
        dueDate: "2026-11-01",
        source: "Recurso OuvidorSUS",
        rationale:
          "O diário registra que uma resposta definitiva mencionou anexo, mas o anexo não estava efetivamente disponível.",
        output: "Decisão sobre se o pedido original da Ouvidoria SUS segue não cumprido ou pode ir para revisão de evidência.",
      },
      {
        action: "Estruturar os 23 registros MPBA/CESAU de escopo capital antes da análise.",
        type: "Estruturação de dados",
        priority: "Média",
        status: "Pronto",
        owner: "Repórter",
        dueDate: "",
        source: "Oficio 41/CESAU",
        rationale:
          "A certidão e útil, mas parcial; não pode ser tratada como cobertura estadual do MPBA sem nota de escopo.",
        output: "Tabela com número IDEA, ano, unidade, objeto, situação e alerta de escopo.",
      },
      {
        action: "Manter a ficha DPE-BA 2026.01.020197 fora do dossiê SESAB/CGAI até haver resposta própria.",
        type: "Controle de escopo",
        priority: "Média",
        status: "Aberto",
        owner: "Repórter",
        dueDate: "",
        source: "Manifestação DPE-BA",
        rationale:
          "O diário documenta uma representação administrativa separada; mistura-la com SESAB/CGAI distorceria o histórico processual.",
        output: "Entrada separada para DPE-BA e nenhuma afirmação sobre DPE dentro da trilha SESAB/CGAI.",
      },
    ],
    accessLaw: {
      framework: "LAI brasileira",
      deadline: "20 dias, com possibilidade de prorrogação por mais 10 dias quando justificada.",
      escalation:
        "Recurso interno, ouvidoria, pedido a autoridade de monitoramento e dossiê jurídico/público quando falhas de acesso persistirem.",
      requestChannels:
        "Portal oficial de transparência, Queremos Saber quando disponível, e-mail do órgão e sistemas de ouvidoria.",
      reporterWarning:
        "A lei nacional é comum, mas cada órgão pode operar com sistemas, anexos, logins e rotinas recursais diferentes.",
    },
    languagePlan: {
      workingLanguage: "Português",
      interfaceLanguages: ["Inglês", "Português", "Espanhol"],
      publicationLanguages: ["Português"],
      localizationNotes: [
        "Manter termos legais como LAI, OGE e autoridade de monitoramento em português, com explicações curtas.",
        "Traduzir rótulos de fluxo, mas preservar nomes de órgãos, códigos de protocolo e títulos de fontes.",
        "Se exportar para parceiros internacionais, adicionar glossário curto de termos brasileiros de transparência.",
      ],
      glossary: [
        {
          term: "LAI",
          meaning: "Lei de Acesso à Informação brasileira.",
          handling: "Não traduzir simplesmente como FOIA sem explicar o mecanismo brasileiro.",
        },
        {
          term: "OGE",
          meaning: "Canal estadual de ouvidoria/controle usado para escalonamento na Bahia.",
          handling: "Manter a sigla e explicar o papel institucional.",
        },
        {
          term: "Autoridade de monitoramento",
          meaning: "Autoridade responsável por monitorar o cumprimento da Lei de Acesso à Informação.",
          handling: "Traduzir de forma descritiva ao escrever em inglês ou espanhol.",
        },
      ],
    },
    sourceDiscovery: [
      {
        source: "Diário de transparência",
        purpose: "Fonte de controle para protocolos, datas, recursos, prints e acompanhamentos.",
        verification: "Todo status da plataforma deve bater com o diário antes de demo ou publicação.",
      },
      {
        source: "Arquivos de resposta dos órgãos",
        purpose: "Bases, planilhas, certidões, e-mails e links de acesso recebidos via LAI.",
        verification: "Abrir cada arquivo e registrar campos ausentes, links quebrados e anexos faltantes.",
      },
      {
        source: "Órgãos de controle e responsabilização",
        purpose: "OGE, canais de autoridade de monitoramento, MP, DPE e ouvidorias.",
        verification: "Manter fluxos separados quando um órgão tiver caminho recursal ou manifestação diferente.",
      },
    ],
    methodRules: [
      {
        rule: "Dado não fornecido não significa dado inexistente.",
        productUse: "Mostrar entrega ausente como lacuna de acesso, não como achado substantivo.",
      },
      {
        rule: "'Não informado' ou 'ignorado' não e a mesma coisa que variavel ausente.",
        productUse: "Manter campos ausentes e valores desconhecidos como problemas diferentes de qualidade de dados.",
      },
      {
        rule: "Falhá de protocolo não equivale a negativa de acesso.",
        productUse: "Acompanhár problemas de sistema separadamente de negativas formais e recursos.",
      },
      {
        rule: "Encaminhámento não equivale a resposta.",
        productUse: "Não fechár um pedido quando o órgão apenas o encaminhá internamente.",
      },
      {
        rule: "Levantamento parcial não equivale a atendimento integral.",
        productUse: "Exigir notas de escopo antes de usar respostas parciais em afirmações.",
      },
      {
        rule: "Silencio institucional não prova inexistencia de informação.",
        productUse: "Tratar silêncio como achado de transparência, não como evidência sobre o fato investigado.",
      },
    ],
    transparencyLog: [
      {
        date: "2026-09-24",
        actor: "SESAB / OGE / CGAI",
        event:
          "Manifestação 3346148 aberta para tratar omissoes em YL5LHVVX, C5NTY0ER, UID2OB7T e VEZ8KTNX, com pedido de avaliação pela CGAI.",
        status: "Em andamento",
        nextStep:
          "Acompanhár se o caso foi efetivamente submetido a CGAI; não tratar encaminhámento para a SESAB como decisão da CGAI.",
      },
      {
        date: "2026-09-24",
        actor: "DPE-BA",
        event:
          "Representação administrativa aberta pela Ouvidoria Cidadã sob ficha 2026.01.020197 após falhas no e-SIC e em anexos.",
        status: "Fluxo separado",
        nextStep:
          "Enviar os seis documentos de apoio por e-mail vinculado a ficha e solicitar encaminhámento a Defensoria Pública-Geral.",
      },
      {
        date: "2026-10-01",
        actor: "MPBA / CESAU",
        event:
          "Oficio 41/CESAU entregou certidão com 23 representações de saúde matérno-infantil das Promotorias de Justiça de Saúde da Capital, de 01/01/2020 a 20/09/2026.",
        status: "Resposta parcial recebida",
        nextStep:
          "Estruturar e auditar os 23 registros IDEA; manter explicito o escopo da capital e não tratar como cobertura estadual.",
      },
      {
        date: "2026-10-02",
        actor: "SESAB / OuvidorSUS",
        event:
          "Manifestação 3346148 foi encaminháda a SESAB; e-mail informou prazo em 24/10/2026, enquanto o portal exibia 01/11/2026.",
        status: "Conflito de prazo",
        nextStep:
          "Registrar as duas datas e aguardar confirmação documental de encaminhámento ou decisão da CGAI.",
      },
      {
        date: "2026-10-02",
        actor: "Ouvidoria SUS / DGC",
        event:
          "Manifestação 202620001381338 recebeu 'resposta definitiva' informando anexo, mas nenhum anexo ou parecer estava efetivamente disponível.",
        status: "Resposta sem anexo",
        nextStep:
          "Não marcar os pedidos LAI originais como atendidos até o arquivo ser entregue e revisado.",
      },
      {
        date: "2026-10-02",
        actor: "OuvidorSUS",
        event:
          "Recurso 202620001408821 protocolado no sistema sobre anexo ausente e preservação do pedido de avaliação pela CGAI.",
        status: "Recurso protocolado",
        nextStep:
          "Acompanhár prazo exibido pelo sistema em 01/11/2026 sem inferir base legal ou autoridade revisora.",
      },
    ],
    followUpDrafts: [
      {
        title: "Follow-up sobre anexos ausentes",
        request: "Mortes fetais, neonatais e maternas por matérnidade",
        type: "Reenvio de anexo",
        status: "Pronto para revisão da repórter",
        riskNote: "Não acusar omissão; documentar o problema de acesso e pedir reenvio ou canal alternativo.",
        draft:
          "Prezados(as), em relação ao protocolo YL5LHVVX, a resposta informa envio de anexos, mas os arquivos não constam no acesso disponível. Solicito, por favor, o reenvio dos anexos ou a indicação de canal alternativo para acesso aos documentos, mantendo o número de protocolo e a data da resposta anterior.",
      },
      {
        title: "Problema de link ou acesso",
        request: "Manifestações sobre violência obstétrica",
        type: "Correcao de acesso",
        status: "Precisa anexar prints",
        riskNote: "Anexar prints e preservar a diferenca entre acesso parcial e dado ausente.",
        draft:
          "Prezados(as), os links enviados para acesso as manifestações sobre violência obstétrica apresentam erro de login ou acesso inválido. Solicito orientação de acesso, reenvio por e-mail ou disponibilização de link válido, com dicionario de campos quando houver base estruturada.",
      },
      {
        title: "Nota de escalonamento para autoridade de monitoramento",
        request: "SESAB/CGAI/CIPOF track",
        type: "Resumo de escalonamento",
        status: "Precisa reconciliar com diário",
        riskNote: "Usar apenas depois de confirmar todas as datas e protocolos no diário de transparência.",
        draft:
          "Resumo para escalonamento: listar protocolos, datas de envio, prazos, respostas recebidas, inconsistencias de anexo/link e tentativas de contestação. Solicitar avaliação da autoridade competente sobre cumprimento do acesso a informação e medidas para entrega integral dos documentos.",
      },
    ],
    qaChecklist: [
      {
        area: "Log de pedidos",
        question: "Todo pedido tem protocolo, canal, data de envio, prazo e status atual?",
        status: "Precisa atualizar",
        risk: "Medio",
        action: "Reconciliar o protótipo com o diário de transparência antes de demo externa.",
      },
      {
        area: "Arquivos de evidência",
        question: "Toda planilha, link ou anexo recebido abre e pode ser rastreado até a fonte?",
        status: "Bloqueado",
        risk: "Alto",
        action: "Verificar anexos ausentes e links quebrados antes de tratar respostas como dados.",
      },
      {
        area: "Fluxo jurisdicional",
        question: "Órgãos com caminhos recursais diferentes estão separados?",
        status: "Em andamento",
        risk: "Medio",
        action: "Manter SESAB/CGAI e DPE-BA em trilhas de escalonamento separadas.",
      },
      {
        area: "Seguranca das afirmações",
        question: "Todas as afirmações publicáveis estão ligadas a evidência, sem inferência a partir do silêncio?",
        status: "Precisa revisar",
        risk: "Alto",
        action: "Reescrever qualquer afirmação baseada apenas em demora como achado de transparência/acesso.",
      },
    ],
    centralQuestion:
      "O que os dados revelam sobre violência obstétrica e mortalidade matérna na Bahia?",
    description:
      "Investigação documental e baseada em dados sobre padroes territoriais, hospitais, mortalidade matérna, denúncias, desigualdades e responsabilização institucional, sem entrevistas com vitimas nesta fase.",
    processGuide: [
      {
        stage: "Pedido enviado",
        action: "Registrar protocolo, órgão, canal, data de envio e prazo esperado.",
        output: "Diário de transparência atualizado",
      },
      {
        stage: "Perto do prazo",
        action: "Preparar checagem de anexos, links, login, formato dos dados e campos pedidos.",
        output: "Checklist de recebimento",
      },
      {
        stage: "Resposta parcial ou acesso quebrado",
        action: "Contestar por escrito, pedir reenvio e guardar prints, e-mails e protocolos.",
        output: "Registro de falhá verificável",
      },
      {
        stage: "Atraso ou silêncio",
        action: "Acionar OGE, autoridade de monitoramento ou dossiê jurídico, separando órgãos por fluxo.",
        output: "Plano de escalonamento com evidências",
      },
    ],
    secondaryQuestions: [
      "Como os registros se distribuem por território e por hospital ou matérnidade no recorte inicial de 29 hospitais baianos?",
      "Ha concentração de denúncias ou manifestações em determinados hospitais, municípios ou regiões?",
      "O cruzamento entre manifestações, mortalidade matérna/fetal/neonatal e estrutura hospitalar permite investigar mortes evitáveis?",
      "Mulheres negras, indígenas, PCDs e outros grupos vulneraveis aparecem de forma desproporcional nos dados disponíveis?",
      "Quais lacunas de acesso, campo ou formato impedem transformar os registros em conclusões publicáveis?",
    ],
    hypotheses: [
      {
        text: "Podem existir padroes territoriais na assistência obstétrica baiana quando mortalidade, nascimentos, estrutura hospitalar e manifestações forem analisados em conjunto.",
        status: "Em apuração",
        evidence: "SESAB, SINASC, SIM/Ministerio da Saúde, CNES e Ouvidoria SUS",
      },
      {
        text: "Manifestações sobre violência obstétrica podem estar concentradas em determinados hospitais ou matérnidades, mas isso depende de base acessível por unidade e período.",
        status: "Aguardando dados",
        evidence: "Ouvidoria SUS Bahia e pedidos C5NTY0ER/links de acesso",
      },
      {
        text: "A relação entre denúncias, mortes maternas evitáveis e estrutura de atendimento pode revelar falhas sistêmicas, mas ainda não deve ser tratada como achado até a análise das bases e respostas pendentes.",
        status: "Hipótese de trabalho",
        evidence: "Dados de mortalidade, CEPOIF, estrutura hospitalar e manifestações",
      },
      {
        text: "Mulheres negras, indígenas, PCDs e outros grupos vulneraveis podem estar sobrerrepresentados nos registros de mortalidade e violência obstétrica, a depender da completude dos campos de raca/cor e perfil.",
        status: "Em apuração",
        evidence: "Campos de raca/cor, idade, território e perfil nas bases recebidas ou solicitadas",
      },
    ],
    evidenceBlocks: [
      { type: "Base administrativa", priority: "Essencial", status: "Evidência recebida" },
      { type: "Órgão público", priority: "Essencial", status: "Fonte mapeada" },
      { type: "Omissão", priority: "Essencial", status: "Lacuna aberta" },
      { type: "Território", priority: "Importante", status: "Pedido enviado" },
      { type: "Comparação", priority: "Contextual", status: "Não iniciado" },
      { type: "Responsabilidade", priority: "Importante", status: "Fonte mapeada" },
    ],
    sources: [
      {
        name: "Fiocruz / Nascer no Brasil 2",
        type: "Fonte curada / pesquisa",
        status: "Fonte contextual",
        use: "Contexto nacional e parametros de comparação sobre assistência obstétrica.",
        limits: "Não substitui bases administrativas estaduais nem prova achados específicos da Bahia sem cruzamento.",
      },
      {
        name: "SINASC / Ministerio da Saúde",
        type: "Sistema administrativo",
        status: "Fonte a integrar",
        use: "Nascimentos, denominadores e perfil dos registros por território.",
        limits: "Exige chaves e denominadores corretos; não mede violência obstétrica diretamente.",
      },
      {
        name: "SIM / Ministerio da Saúde",
        type: "Sistema administrativo",
        status: "Fonte a integrar",
        use: "Mortalidade matérna, fetal e neonatal como eixo de análise documental.",
        limits: "Campos incompletos ou classificações diferentes podem limitar comparações.",
      },
      {
        name: "CNES",
        type: "Cadastro administrativo",
        status: "Fonte a integrar",
        use: "Estrutura cadastrada de matérnidades, leitos e vinculos.",
        limits: "Não mede plantao, qualidade assistêncial, presenca real de profissionais ou disponibilidade operacional.",
      },
      {
        name: "SESAB",
        type: "Órgão público",
        status: "Fonte verificada",
        use: "Dados estaduais de mortalidade e unidades de saúde.",
        limits: "Respostas podem vir por setores diferentes e com anexos ausentes.",
      },
      {
        name: "Ouvidoria SUS Bahia",
        type: "Órgão público",
        status: "Fonte verificada",
        use: "Manifestações sobre violência obstétrica.",
        limits: "Links de acesso e login podem falhár.",
      },
      {
        name: "Ministerio Publico da Bahia",
        type: "Órgão público",
        status: "Fonte verificada",
        use: "Procedimentos e orientações sobre responsabilização.",
        limits: "MP informou não centralizar alguns dados.",
      },
      {
        name: "DPE-BA",
        type: "Fluxo separado",
        status: "Em manifestação própria",
        use: "Atendimentos, ações e acordos relacionados a gestantes e matérnidades.",
        limits: "Não deve ser misturado ao dossiê SESAB/CGAI enquanto seguir por manifestação diferente.",
      },
      {
        name: "CEPOIF / Comite de mortalidade matérna",
        type: "Órgão público / comitê",
        status: "Pedido pendente",
        use: "Fluxos, reuniões, encaminhámentos, evitabilidade e monitoramento de mortalidade matérna.",
        limits: "Ainda depende de resposta ao pedido VEZ8KTNX e não deve ser presumido.",
      },
    ],
    requests: [
      {
        title: "Obitos matérnos 2020-presente",
        agency: "SESAB",
        channel: "Queremos Saber + e-mail",
        protocol: "PVCJ006S",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Resposta parcial",
        requestedItems:
          "Obitos matérnos com município, estabelecimento, idade, raca/cor, escolaridade, causa basica, evitabilidade, investigação, encerramento e recomendações do Comite.",
        responseSummary:
          "SESAB respondeu em 31/07; anexos não apareciam na pagina, mas os dados chegaram depois via Fiquem Sabendo/Google Drive. Permanecem lacunas: evitabilidade, recomendações do Comite, data de encerramento e valores 'não informado/ignorado'.",
      },
      {
        title: "Mortes fetais, neonatais e maternas por matérnidade",
        agency: "SESAB",
        channel: "Queremos Saber",
        protocol: "YL5LHVVX",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestação 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se não houver resposta até o checkpoint, revisar o portal em 01/11 e preparar cobranca com histórico, prints e protocolo.",
        },
        requestedItems:
          "Mortes fetais, neonatais e maternas por matérnidade publica estadual entre 2020 e 2026, em formato aberto.",
        responseSummary:
          "Sem resposta substantiva. Incluído na manifestação 3346148 em 24/09; encaminhádo a SESAB em 02/10, sem confirmação documental de apreciação pela CGAI.",
      },
      {
        title: "Manifestações sobre violência obstétrica",
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
            "Se o anexo não for entregue, manter a resposta como não cumprida e registrar nova medida de escalonamento.",
        },
        requestedItems:
          "Manifestações anonimizadas de 2020 em diante com termos relacionados a violência obstétrica, parto, gestante, matérnidade e correlatos.",
        responseSummary:
          "Sem entrega dos dados. Respostas administrativas citaram demanda semelhánte e DGC, mas sem comprovar entrega. Recurso 202620001408821 apresentado em 02/10 por ausência do anexo mencionado.",
      },
      {
        title: "Procedimentos instaurados sobre saúde matérno-infantil",
        agency: "MP-BA / CESAU",
        channel: "SEI + e-mail",
        protocol: "YKXAX4NR / INF0000526 / SEI 19.09.02032.0023004/2026-55",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Resposta parcial entregue",
        requestedItems:
          "Procedimentos relacionados a violência obstétrica, assistência obstétrica, mortalidade matérna/fetal e termos correlatos, com município, unidade, objeto, situação e encaminhámentos.",
        responseSummary:
          "Em 01/10, Oficio 41/CESAU entregou certidão com 23 representações das Promotorias de Justiça de Saúde da Capital entre 01/01/2020 e 20/09/2026. Resposta parcial no recorte informado, não atendimento estadual integral.",
      },
      {
        title: "Serie historica de mortalidade matérna",
        agency: "DIVEP / SESAB",
        channel: "Queremos Saber",
        protocol: "UID2OB7T",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestação 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se não houver resposta substantiva, registrar conflito de prazo e pedir confirmação documental da análise pela autoridade competente.",
        },
        requestedItems:
          "Serie historica de mortalidade matérna de 2020 em diante com município, estabelecimento, faixa etaria, raca/cor, escolaridade, pre-natal, idade gestacional, tipo de parto e CID-10.",
        responseSummary:
          "Sem resposta substantiva no diário. Incluído na manifestação 3346148, com prazos divergentes informados em 24/10 e 01/11.",
      },
      {
        title: "Comite de mortalidade matérna",
        agency: "CEPOIF / SESAB",
        channel: "Queremos Saber",
        protocol: "VEZ8KTNX",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Em acompanhamento CGAI",
        currentCheckpoint: {
          label: "Manifestação 3346148",
          date: "2026-10-24",
          source: "E-mail informou 24/10; portal mostrou 01/11.",
          action:
            "Se não houver entrega das atas, pareceres ou recomendações, manter como ausência de documento e preparar pedido complementar ou escalonamento.",
        },
        requestedItems:
          "Atas, relatorios anuais, pareceres tecnicos, recomendações e planos de ação do Comite entre 2020 e a data do pedido.",
        responseSummary:
          "Sem resposta substantiva. Incluído na manifestação 3346148; encaminhámento a SESAB não equivale a entrega dos documentos.",
      },
      {
        title: "Atendimentos, ações e acordos sobre violência obstétrica",
        agency: "DPE-BA",
        channel: "e-SIC, e-mail e Ouvidoria Cidadã",
        protocol: "1XCDXR72 / ficha 2026.01.020197",
        sentDate: "2026-07-02",
        dueDate: "2026-07-22",
        status: "Fluxo separado",
        requestedItems:
          "Atendimentos, ações judiciais, acordos e dados relacionados a violência obstétrica e Rede Cegonhá.",
        responseSummary:
          "Protocolização enfrentou falhá persistente no e-SIC. Em 24/09, representação por omissão foi registrada na Ouvidoria da DPE-BA sob ficha 2026.01.020197; anexos devem ser enviados por e-mail vinculados a ficha.",
      },
    ],
    requestComparisons: [
      {
        requestTitle: "Obitos matérnos 2020-presente",
        expected:
          "Obitos matérnos por ano, município, idade, raca/cor, tipo de parto e causa basica.",
        received:
          "Base parcial com campos demograficos, mas sem tipo de parto consistente.",
        missing: "Tipo de parto, completude de causa basica e explicação sobre campos ignorados.",
        deadlineStatus: "Respondido no prazo",
        editorialDecision: "Usar com ressalva metodológica",
        nextStep: "Fazer pedido complementar focado apenas nos campos ausentes.",
      },
      {
        requestTitle: "Mortes fetais, neonatais e maternas por matérnidade",
        expected:
          "Dados por matérnidade, ano, município, tipo de morte, causa basica e unidade.",
        received:
          "Resposta afirma envio de anexos, mas os anexos não aparecem no sistema.",
        missing: "Arquivo original, comprovante de envio e canal alternativo de acesso.",
        deadlineStatus: "Em escalonamento",
        editorialDecision: "Não usar como evidência substantiva",
        nextStep: "Manter no dossiê SESAB/CGAI com prints, protocolos e histórico de contestação.",
      },
      {
        requestTitle: "Manifestações sobre violência obstétrica",
        expected:
          "Manifestações por ano, município, unidade, classificação e desfecho.",
        received:
          "Links divergentes e acesso parcial por e-mail, com falhas de login.",
        missing: "Base completa, link válido, orientação de acesso e dicionario de campos.",
        deadlineStatus: "Resposta com problema",
        editorialDecision: "Tratar como falhá de acesso, não como dado final",
        nextStep: "Pedir reenvio por e-mail e documentar prints das telas de erro.",
      },
      {
        requestTitle: "Procedimentos instaurados sobre saúde matérno-infantil",
        expected:
          "Procedimentos, orientações, eventuais registros centralizados, TACs, ACPs e indicação de unidades responsaveis no período de 2020 a 2026.",
        received:
          "Oficio 41/CESAU e certidão com 23 representações das Promotorias de Justiça de Saúde da Capital entre 01/01/2020 e 20/09/2026.",
        missing: "Levantamento estadual integral; escopo fora da capital; critérios e limites devem acompanhar qualquer uso quantitativo.",
        deadlineStatus: "Resposta parcial entregue",
        editorialDecision: "Usar como base parcial da capital, não como retrato estadual do MPBA",
        nextStep: "Estruturar os 23 registros por número IDEA, tipo, ano, unidade e objeto resumido.",
      },
    ],
    gaps: [
      {
        description: "Tipo de parto ausente ou informado como ignorado.",
        origin: "VO-LAI-01",
        severity: "Alta",
        status: "Aberta",
        nextStep: "Registrar limite metodológico e avaliar novo pedido mais específico.",
      },
      {
        description: "Resposta menciona envio de anexos, mas anexos não constam no sistema.",
        origin: "VO-LAI-02",
        severity: "Critica",
        status: "Em escalonamento",
        nextStep: "Manter no dossiê SESAB/CGAI e aguardar retorno da OGE/autoridade de monitoramento.",
      },
      {
        description: "Links da Ouvidoria SUS retornam erro de login ou acesso inválido.",
        origin: "VO-LAI-03",
        severity: "Alta",
        status: "Aberta",
        nextStep: "Registrar prints e solicitar reenvio por e-mail.",
      },
      {
        description: "DPE-BA segue em fluxo separado e não deve entrar no dossiê SESAB/CGAI.",
        origin: "Manifestação própria DPE-BA",
        severity: "Média",
        status: "Separada",
        nextStep: "Atualizar somente quando houver retorno específico da manifestação da DPE-BA.",
      },
    ],
    claims: [
      {
        text: "Parte dos dados recebidos não permite identificar tipo de parto de forma consistente.",
        type: "Factual",
        evidence: "Planilhá parcial VO-LAI-01",
        relation: "Limita",
        strength: "Média",
        risk: "Medio",
        status: "Sustentada parcialmente",
      },
      {
        text: "Quatro pedidos de informação estavam atrasados em setembro de 2026.",
        type: "Numerica",
        evidence: "Diário de transparência e protocolos",
        relation: "Sustenta",
        strength: "Forte",
        risk: "Baixo",
        status: "Precisa de rechecagem temporal",
      },
      {
        text: "Não há uma base oficial única que meça violência obstétrica diretamente na Bahia.",
        type: "Metodológica",
        evidence: "Arquitetura da pauta e pedidos a SESAB, Ouvidoria SUS, MP-BA, DPE-BA e CEPOIF",
        relation: "Limita",
        strength: "Média",
        risk: "Medio",
        status: "Precisa de formulação cautelosa",
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
