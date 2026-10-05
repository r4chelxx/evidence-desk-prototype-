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

export const mvpCoverage = [
  {
    area: {
      pt: "Criar investigacao",
      en: "Create investigation",
    },
    expected: {
      pt: "Titulo, pais, jurisdicao, idioma, tema, territorio, periodo, pergunta central e descricao curta.",
      en: "Title, country, jurisdiction, language, topic, territory, period, central question and short description.",
    },
    implementation: {
      pt: "Formulario de nova investigacao com validacoes essenciais e preview do projeto.",
      en: "New investigation form with essential validations and project preview.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Mapear evidencias",
      en: "Map evidence",
    },
    expected: {
      pt: "Perguntas, hipoteses e blocos de evidencia necessaria, complementar, contextual ou desconhecida.",
      en: "Questions, hypotheses and evidence blocks marked as necessary, complementary, contextual or unknown.",
    },
    implementation: {
      pt: "Abas de hipoteses e blocos de evidencia com status, prioridade e evidencia relacionada.",
      en: "Hypotheses and evidence-block tabs with status, priority and related evidence.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Cadastrar fontes e bases",
      en: "Register sources and databases",
    },
    expected: {
      pt: "Separar fonte verificada, caminho provavel e fonte a confirmar, com limites e melhor uso.",
      en: "Separate verified source, likely path and source to confirm, with limits and best use.",
    },
    implementation: {
      pt: "Aba de fontes com status, jurisdicao, links, limites e trilhas de descoberta.",
      en: "Sources tab with status, jurisdiction, links, limits and discovery paths.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Registrar pedidos feitos fora da plataforma",
      en: "Track external requests",
    },
    expected: {
      pt: "Orgao, canal, protocolo, data, prazo, status, resumo e itens solicitados.",
      en: "Agency, channel, protocol, date, due date, status, summary and requested items.",
    },
    implementation: {
      pt: "Aba de pedidos com prazos, checkpoints, status e acoes sugeridas sem envio automatico.",
      en: "Requests tab with due dates, checkpoints, status and suggested actions without automatic filing.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Comparar pedido e resposta",
      en: "Compare request and response",
    },
    expected: {
      pt: "Mostrar itens solicitados, entregues, ausentes, divergencias de granularidade e proximos passos.",
      en: "Show requested, delivered and missing items, granularity issues and next steps.",
    },
    implementation: {
      pt: "Aba de comparacao com esperado, recebido, ausente/pouco claro e decisao editorial.",
      en: "Comparison tab with expected, received, missing/unclear and editorial decision.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Transformar lacunas em acoes",
      en: "Turn gaps into actions",
    },
    expected: {
      pt: "Marcar lacunas, riscos, origem e proximo passo sem tratar ausencia como conclusao.",
      en: "Mark gaps, risks, origin and next step without treating absence as a conclusion.",
    },
    implementation: {
      pt: "Abas de lacunas, plano de acao, diario de transparencia e rascunhos de follow-up.",
      en: "Gaps, action plan, transparency log and follow-up draft tabs.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Matriz claim-to-evidence",
      en: "Claim-to-evidence matrix",
    },
    expected: {
      pt: "Vincular afirmacoes a evidencias, forca, risco e status editorial.",
      en: "Link claims to evidence, strength, risk and editorial status.",
    },
    implementation: {
      pt: "Aba de afirmacoes com evidencia, risco, forca e ressalvas.",
      en: "Claims tab with evidence, risk, strength and caveats.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "Nota metodologica",
      en: "Methodology note",
    },
    expected: {
      pt: "Exportar pergunta, periodo, territorio, pedidos, respostas, fontes, lacunas, limites e claims.",
      en: "Export question, period, territory, requests, responses, sources, gaps, limits and claims.",
    },
    implementation: {
      pt: "Aba de metodologia com nota em Markdown copiavel e salvaguardas metodologicas.",
      en: "Methodology tab with copyable Markdown note and methodological safeguards.",
    },
    status: {
      pt: "Implementado",
      en: "Implemented",
    },
  },
  {
    area: {
      pt: "IA, backend e envio automatico",
      en: "AI, backend and automatic filing",
    },
    expected: {
      pt: "Fora do MVP original: sem protocolo automatico de LAI/FOIA, login complexo ou IA decidindo fontes.",
      en: "Outside the original MVP: no automatic FOIA/LAI filing, complex login or AI deciding sources.",
    },
    implementation: {
      pt: "Mantido como limite do prototipo; roadmap separa persistencia v0.2 e revisao assistida v0.3.",
      en: "Kept as prototype boundary; roadmap separates v0.2 persistence and v0.3 assisted review.",
    },
    status: {
      pt: "Fora do MVP",
      en: "Out of MVP",
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
          "Manifestation 3346148 filed to address omissions in YL5LHVVX, C5NTY0ER, UID2OB7T and VEZ8KTNX, with request for CGAI review.",
        status: "In progress",
        nextStep:
          "Track whether the case is actually submitted to CGAI; do not treat forwarding to SESAB as a CGAI decision.",
      },
      {
        date: "2026-09-24",
        actor: "DPE-BA",
        event:
          "Administrative representation filed through Ouvidoria Cidada under ficha 2026.01.020197 after e-SIC and attachment failures.",
        status: "Separate track",
        nextStep:
          "Send the six supporting documents by e-mail linked to the ficha and request forwarding to Defensoria Publica-Geral.",
      },
      {
        date: "2026-10-01",
        actor: "MPBA / CESAU",
        event:
          "Oficio 41/CESAU delivered a certificate with 23 health-maternal-child representations from Promotorias de Justica de Saude da Capital, 01/01/2020 to 20/09/2026.",
        status: "Partial response received",
        nextStep:
          "Structure and audit the 23 IDEA records; keep the capital scope explicit and do not treat it as statewide coverage.",
      },
      {
        date: "2026-10-02",
        actor: "SESAB / OuvidorSUS",
        event:
          "Manifestation 3346148 was forwarded to SESAB; e-mail reported deadline 24/10/2026, while portal showed 01/11/2026.",
        status: "Deadline conflict",
        nextStep:
          "Record both dates and wait for documentary confirmation of CGAI routing or decision.",
      },
      {
        date: "2026-10-02",
        actor: "Ouvidoria SUS / DGC",
        event:
          "Complaint 202620001381338 received 'resposta definitiva' saying an attachment followed, but no attachment or opinion was effectively available.",
        status: "Response without attachment",
        nextStep:
          "Do not mark original LAI requests as fulfilled until the file is delivered and reviewed.",
      },
      {
        date: "2026-10-02",
        actor: "OuvidorSUS",
        event:
          "Appeal 202620001408821 filed through the system regarding the missing attachment and preservation of the CGAI request.",
        status: "Appeal filed",
        nextStep:
          "Track response deadline shown by the system as 01/11/2026 without inferring legal basis or reviewing authority.",
      },
    ],
    followUpDrafts: [
      {
        title: "Missing attachments follow-up",
        request: "Mortes fetais, neonatais e maternas por maternidade",
        type: "Attachment resend",
        status: "Ready for reporter review",
        riskNote: "Do not accuse omission; document the access problem and ask for resend or alternate channel.",
        draft:
          "Prezados(as), em relacao ao protocolo YL5LHVVX, a resposta informa envio de anexos, mas os arquivos nao constam no acesso disponivel. Solicito, por favor, o reenvio dos anexos ou a indicacao de canal alternativo para acesso aos documentos, mantendo o numero de protocolo e a data da resposta anterior.",
      },
      {
        title: "Broken link/access problem",
        request: "Manifestacoes sobre violencia obstetrica",
        type: "Access correction",
        status: "Needs screenshots attached",
        riskNote: "Attach screenshots and preserve the distinction between partial access and missing data.",
        draft:
          "Prezados(as), os links enviados para acesso as manifestacoes sobre violencia obstetrica apresentam erro de login ou acesso invalido. Solicito orientacao de acesso, reenvio por e-mail ou disponibilizacao de link valido, com dicionario de campos quando houver base estruturada.",
      },
      {
        title: "Authority-monitoring escalation note",
        request: "SESAB/CGAI/CIPOF track",
        type: "Escalation summary",
        status: "Needs diary reconciliation",
        riskNote: "Use only after confirming every date and protocol in the transparency diary.",
        draft:
          "Resumo para escalonamento: listar protocolos, datas de envio, prazos, respostas recebidas, inconsistencias de anexo/link e tentativas de contestacao. Solicitar avaliacao da autoridade competente sobre cumprimento do acesso a informacao e medidas para entrega integral dos documentos.",
      },
    ],
    qaChecklist: [
      {
        area: "Request log",
        question: "Every request has protocol, channel, sent date, due date and current status?",
        status: "Needs update",
        risk: "Medium",
        action: "Reconcile the prototype with the transparency diary before external demo.",
      },
      {
        area: "Evidence files",
        question: "Can every received spreadsheet, link or attachment be opened and traced to its source?",
        status: "Blocked",
        risk: "High",
        action: "Verify missing attachments and broken links before treating responses as data.",
      },
      {
        area: "Jurisdiction flow",
        question: "Are agencies with different appeal paths separated?",
        status: "In progress",
        risk: "Medium",
        action: "Keep SESAB/CGAI and DPE-BA in separate escalation tracks.",
      },
      {
        area: "Claim safety",
        question: "Are all publishable claims linked to evidence instead of inference from silence?",
        status: "Needs review",
        risk: "High",
        action: "Rewrite any claim based only on delay as a transparency/access finding.",
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
        strength: "Media",
        risk: "Medio",
        status: "Sustentada parcialmente",
      },
      {
        text: "Quatro pedidos de informacao estavam atrasados em setembro de 2026.",
        type: "Numerica",
        evidence: "Diario de transparencia e protocolos",
        strength: "Forte",
        risk: "Baixo",
        status: "Precisa de rechecagem temporal",
      },
      {
        text: "Nao ha uma base oficial unica que meca violencia obstetrica diretamente na Bahia.",
        type: "Metodologica",
        evidence: "Arquitetura da pauta e pedidos a SESAB, Ouvidoria SUS, MP-BA, DPE-BA e CEPOIF",
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
        strength: "Strong",
        risk: "Low",
        status: "Supported",
      },
      {
        text: "The district provided contracts only for part of the requested period.",
        type: "Factual",
        evidence: "Partial public records response",
        strength: "Strong",
        risk: "Low",
        status: "Supported",
      },
      {
        text: "The vendor selection process lacked competition.",
        type: "Interpretive",
        evidence: "Procurement records still missing",
        strength: "Insufficient",
        risk: "High",
        status: "Needs more evidence",
      },
    ],
  },
];
