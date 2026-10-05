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
      status: "Needs reporter review",
      checkedAt: "2026-10-05",
      summary:
        "This case has active LAI follow-ups and legal/escalation steps in progress. Do not treat the request log as final before reviewing the transparency diary.",
    },
    nextReviewItems: [
      "Update the SESAB/CGAI/CIPOF escalation status from the transparency diary.",
      "Keep the DPE-BA issue separate because it follows a different manifestation path.",
      "Confirm which attachments or links were received, broken or missing before using them as evidence.",
      "Review whether the count of delayed requests is still four after the latest authority-monitoring action.",
    ],
    accessLaw: {
      framework: "Brazilian LAI",
      deadline: "20 days, with possible 10-day extension when justified.",
      escalation:
        "Internal appeal, ombudsman channel, authority-monitoring request and legal/public accountability dossier when access failures persist.",
      requestChannels:
        "Official transparency portal, Queremos Saber when available, agency e-mail and ombudsman systems.",
      reporterWarning:
        "The national law is shared, but each agency can operate with different systems, attachments, logins and appeal routines.",
    },
    languagePlan: {
      workingLanguage: "Portuguese",
      interfaceLanguages: ["English", "Portuguese", "Spanish"],
      publicationLanguages: ["Portuguese"],
      localizationNotes: [
        "Keep legal terms such as LAI, OGE and autoridade de monitoramento in Portuguese with short explanations.",
        "Translate the workflow labels, but preserve agency names, protocol codes and source titles.",
        "If exported for international partners, add a short glossary for Brazilian transparency terms.",
      ],
      glossary: [
        {
          term: "LAI",
          meaning: "Brazilian Access to Information Law.",
          handling: "Do not translate as FOIA without explaining the Brazilian mechanism.",
        },
        {
          term: "OGE",
          meaning: "State ombudsman/control channel used for escalation in Bahia.",
          handling: "Keep acronym and explain the institutional role.",
        },
        {
          term: "Autoridade de monitoramento",
          meaning: "Authority responsible for monitoring access-to-information compliance.",
          handling: "Translate descriptively when writing in English or Spanish.",
        },
      ],
    },
    sourceDiscovery: [
      {
        source: "Transparency diary",
        purpose: "Single source of truth for protocols, dates, appeals, screenshots and follow-ups.",
        verification: "Every platform status must match the diary before demo or publication.",
      },
      {
        source: "Agency response files",
        purpose: "Datasets, spreadsheets, certificates, e-mails and access links received through LAI.",
        verification: "Open each file and record missing fields, broken links and absent attachments.",
      },
      {
        source: "Public accountability bodies",
        purpose: "OGE, authority-monitoring channels, MP, DPE and ombudsman offices.",
        verification: "Keep separate flows when an agency has a different appeal or manifestation path.",
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
        sentDate: "2026-08-01",
        dueDate: "2026-08-21",
        status: "Resposta parcial",
        requestedItems:
          "Obitos maternos por ano, municipio, idade, raca/cor, tipo de parto e causa basica.",
        responseSummary:
          "Dados recebidos parcialmente. Campos incompletos e tipo de parto ausente ou ignorado.",
      },
      {
        title: "Mortes fetais, neonatais e maternas por maternidade",
        agency: "SESAB",
        channel: "Queremos Saber",
        protocol: "YL5LHVVX",
        sentDate: "2026-08-10",
        dueDate: "2026-08-30",
        status: "Em escalonamento",
        requestedItems:
          "Dados por maternidade, ano, municipio, tipo de morte, causa basica e unidade.",
        responseSummary:
          "SESAB informou genericamente que enviou, mas anexos nao foram localizados. Caso segue em dossie SESAB/CGAI.",
      },
      {
        title: "Manifestacoes sobre violencia obstetrica",
        agency: "Ouvidoria SUS Bahia",
        channel: "Queremos Saber",
        protocol: "C5NTY0ER",
        sentDate: "2026-08-10",
        dueDate: "2026-08-30",
        status: "Resposta com problema",
        requestedItems:
          "Manifestacoes sobre violencia obstetrica por ano, municipio, unidade e classificacao.",
        responseSummary:
          "Links divergentes, login invalido e acesso parcial em apenas um e-mail. Precisa rechecagem antes de classificacao final.",
      },
      {
        title: "Procedimentos instaurados sobre saude materno-infantil",
        agency: "MP-BA / CESAU",
        channel: "SEI + e-mail",
        protocol: "Certidao CESAU",
        sentDate: "2026-09-01",
        dueDate: "2026-09-21",
        status: "Resposta recebida",
        requestedItems:
          "Procedimentos, orientacoes e registros centralizados sobre saude materno-infantil e violencia obstetrica.",
        responseSummary:
          "MP informou que nao centraliza alguns dados e orientou acionar promotorias, DPE e SESAB.",
      },
      {
        title: "Comite de mortalidade materna",
        agency: "CEPOIF / SESAB",
        channel: "Queremos Saber",
        protocol: "VEZ8KTNX",
        sentDate: "2026-09-01",
        dueDate: "2026-09-21",
        status: "A verificar",
        requestedItems:
          "Informacoes sobre comite, fluxos, reunioes, encaminhamentos e monitoramento de mortalidade materna.",
        responseSummary:
          "Status precisa ser atualizado a partir do diario da transparencia e do dossie juridico.",
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
          "Procedimentos, orientacoes, eventuais registros centralizados e indicacao de unidades responsaveis.",
        received:
          "Certidao informa ausencia de centralizacao e orienta acionar promotorias, DPE e SESAB.",
        missing: "Mapa de promotorias responsaveis, criterios de busca e eventuais procedimentos locais.",
        deadlineStatus: "Resposta recebida",
        editorialDecision: "Usar como evidencia sobre limite institucional, nao como ausencia definitiva de casos",
        nextStep: "Transformar a resposta em nova frente de pedidos direcionados.",
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
