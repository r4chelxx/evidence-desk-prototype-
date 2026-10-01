export const investigations = [
  {
    id: "vo-bahia",
    title: "Violencia obstetrica e transparencia de dados na Bahia",
    country: "Brasil",
    jurisdiction: "Bahia",
    language: "Portugues",
    topic: "Saude publica",
    status: "Em apuracao",
    period: "2020-2026",
    territory: "Salvador, RMS e interior da Bahia",
    updatedAt: "2026-09-30",
    centralQuestion:
      "O poder publico tem produzido e fornecido dados suficientes para monitorar mortalidade materna e violencia obstetrica na Bahia entre 2020 e 2026?",
    description:
      "Investigacao sobre disponibilidade, qualidade e completude de dados publicos relacionados a violencia obstetrica, mortalidade materna e responsabilizacao institucional.",
    hypotheses: [
      {
        text: "Os dados enviados por orgaos publicos nao possuem granularidade suficiente para identificar unidades de saude e padroes territoriais.",
        status: "Em apuracao",
        evidence: "Pedidos VO-LAI-01 e VO-LAI-02",
      },
      {
        text: "Parte das respostas oficiais registra o envio de anexos que nao chegaram ou nao estao acessiveis.",
        status: "Sustentada parcialmente",
        evidence: "Protocolos com resposta sem anexo e links quebrados",
      },
      {
        text: "Campos como tipo de parto, causa basica e raca/cor podem limitar conclusoes sobre desigualdade e responsabilizacao.",
        status: "Em apuracao",
        evidence: "Planilhas parciais recebidas",
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
        type: "Caminho provavel",
        status: "Fonte a confirmar",
        use: "Atendimentos, acoes e acordos relacionados a gestantes e maternidades.",
        limits: "Canal de e-SIC apresentou erro de cadastro.",
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
        status: "Atrasado",
        requestedItems:
          "Dados por maternidade, ano, municipio, tipo de morte, causa basica e unidade.",
        responseSummary:
          "SESAB informou genericamente que enviou, mas anexos nao foram localizados.",
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
          "Links divergentes, login invalido e acesso parcial em apenas um e-mail.",
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
        status: "Aguardando resposta",
        nextStep: "Enviar follow-up formal e manter evidencias do problema de acesso.",
      },
      {
        description: "Links da Ouvidoria SUS retornam erro de login ou acesso invalido.",
        origin: "VO-LAI-03",
        severity: "Alta",
        status: "Aberta",
        nextStep: "Registrar prints e solicitar reenvio por e-mail.",
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
        status: "Sustentada",
      },
      {
        text: "Ha subnotificacao de violencia obstetrica nos registros oficiais.",
        type: "Interpretativa",
        evidence: "Dados parciais + contexto de especialistas ainda pendente",
        strength: "Fraca",
        risk: "Alto",
        status: "Precisa de fonte adicional",
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
    centralQuestion:
      "What records can show how a public school district selected, contracted and monitored education technology vendors?",
    description:
      "A simulated U.S. public records workflow to test whether Evidence Desk works outside the Brazilian LAI context.",
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
