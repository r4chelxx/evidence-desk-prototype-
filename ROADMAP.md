# Evidence Desk — Roadmap mestre e registro de execução

**Revisão de escopo: 17/10/2026.** Este documento recupera o plano consolidado de 15/10 e o confronta com o escopo de evolução, diagnóstico funcional, propostas de simplificação/inovação e brief original. A sequência de tarefas de uma rodada não substitui o escopo completo.

## Compromissos que orientam todas as frentes
- A investigação é o centro: um dashboard de trabalho, pouca digitação, reaproveitamento de dados e ferramentas no contexto.
- Quatro destinos principais são uma hipótese de simplificação a validar dentro dessa experiência, não quatro novos módulos obrigatórios nem UX considerada aprovada.
- Produto gratuito, acessível e sem conta obrigatória para usar IA. A proteção atual do piloto é provisória.
- IA propõe com trechos e procedência; a jornalista aprova, corrige ou rejeita. Ausência de resposta não prova irregularidade.
- Melhorar as frentes já discutidas antes de ampliar o escopo com novas ideias. Não alterar os casos reais para testar.

## Cinco diferenciais centrais — permanecem no escopo
| Diferencial | Entrega completa esperada | Situação conservadora em 17/10 |
| --- | --- | --- |
| Detector de silêncios | Pedido × resposta × anexos × períodos; itens não atendidos, justificativas, impacto e rascunho de complementação/recurso | Parcial: registros manuais, lacunas e vínculos; checklist granular e validação completa pendentes |
| Investigação reversa | Afirmação → requisitos verificáveis → documentos/fontes/perguntas/tarefas; mostrar saltos inferenciais | Consolidação funcional pendente; cadastro de afirmações e sugestões genéricas não concluem esta entrega |
| Simulador de robustez | Retirar provisoriamente evidência **ou fonte**, comparar efeitos e ressalvas sem alterar o caso | Motor de retirada de evidência e interface inicial existem; retirada por fonte e validação integrada completa pendentes |
| Detector de dependência | Rastrear origem primária; separar citações repetidas de corroboradores independentes | Regras e interface inicial para origens declaradas existem; não equivalem a detecção semântica ou independência comprovada |
| Radar de caminhos | Próximas ações com justificativa, material de origem, impacto estimado, esforço e dependências; converter em tarefa/pedido/pergunta/verificação | Propostas iniciais por regras existem; priorização completa, conversão integrada e decisões rastreáveis pendentes |

## Frentes transversais que não podem desaparecer do planejamento
1. **UX e trabalho em uma tela:** painel de investigações, visão clara do próximo movimento, menos formulários, criação rápida, visualizações elegantes, ajuda “?” acessível por toque/teclado e desktop/mobile. Organização de abas continua em aberto.
2. **Registro único e reaproveitamento:** classificação posterior; vincular entidades/datas/documentos semelhantes, evitar duplicação e reconciliar dados legados sem promover necessidades planejadas a provas.
3. **Documentos e trechos:** visualizador e seleção citável com página/linha, origem e versão; distinguir nota, alegação, documento, informação extraída e evidência verificada; PDF, EML, tabelas e OCR local condicionado a testes.
4. **Investigação reativa:** “o que mudou”, “o que este documento não comprova” e contradições com período, universo, unidade, definição e versão, duas citações lado a lado e justificativa.
5. **Decisão e memória editorial:** aceitar/corrigir/rejeitar; memória de rejeições, diário de mudanças de hipótese e motivos de decisões, autoria, eventos versionados e revisão de fontes descartadas.
6. **LAI integrada à pauta:** lacuna → pedido → resposta → comparação → recurso → lacuna atualizada; prazos por jurisdição, anexos, redirecionamentos/prorrogações e modelos revisáveis. Eventos administrativos não sustentam automaticamente alegações substantivas.
7. **Método e publicação:** hipóteses concorrentes, refutação, risco editorial, direito de resposta e pré-mortem; cronologia derivada, modelos por tema e matéria em construção vinculada às evidências; metodologia, afirmações e exportações rastreáveis.
8. **Segurança e continuidade:** migrações completas, backup recuperável, originais e hashes, marcação de sensíveis, criptografia opcional, política de dados e recuperação. Cópia no mesmo navegador não é backup externo.
9. **IA e infraestrutura:** validar chamada real, precisão, citações, latência, custos, limites de consumo e recuperação de falhas; viabilizar acesso público sem login obrigatório, mantendo fluxo manual e controle explícito de envio.
10. **Fontes, localização e interoperabilidade:** catálogo curado com data/limites/responsável, fonte verificada versus caminho provável, pacotes Brasil/EUA/global; PT/EN/ES completos; Markdown/CSV, proveniência W3C PROV e pacote versionado/mesclável.
11. **Validação e fellowship:** testes funcionais e de usabilidade separados, casos de referência, demo protegida, acessibilidade, testes móveis reais e 3–5 jornalistas; benchmarking, métricas e demonstração ponta a ponta para Emerging Technology; orçamento, manutenção, licença e sustentabilidade.
12. **Expansão condicionada:** colaboração e sincronização segura com conflitos; biblioteca pública/contribuições da comunidade e integrações de coleta constam da visão inicial, mas não são requisitos imediatos nem funcionalidades prontas.

## Como interpretar o andamento
- **Implementado e testado em escopo delimitado:** armazenamento local versionado e recuperação, validação de importação, anexos em IndexedDB, hash, backup completo e captura vinculada ao original; 70 testes automáticos aprovados no último commit de código.
- **Teste manual realizado:** caso sintético; rascunho preservado ao anexar, salvamento e recarga, vínculo e recuperação do original com bytes idênticos.
- **Parcial/experimental:** motor investigativo, silêncios, dependência de fontes, simulador e propostas de ação. Código e testes unitários não encerram o recurso completo.
- **Ainda não validado integralmente:** migração de todos os modelos, recuperação manual no navegador em todos os erros, mobile/acessibilidade, caso real revisado, usabilidade com jornalistas e IA pública sem conta.
- **Não reduzir o backlog:** rascunhos, checklist de LAI e navegação são apenas um recorte da próxima rodada.

---

# Plano consolidado de origem — 15/10/2026

**Versão:** 15/10/2026 · **Status:** plano vivo, não certificação de funcionalidades · **Repositório:** `r4chelxx/evidence-desk-prototype-` · **Branch de trabalho:** `feature/investigation-intelligence-engine`.

## Visão de produto

**Material entra → evidências e limites ficam claros → mudanças são explicadas → próxima ação é proposta → jornalista decide → decisão e procedência ficam rastreáveis.** Interface centrada na investigação, sem multiplicar telas. Gratuito e utilizável sem login obrigatório. IA opcional, nunca requisito para funções essenciais; controle editorial humano, privacidade por padrão e linguagem que não confunde lacuna com irregularidade.

## Estado de referência e ressalvas

O protótipo já contém captura de notas, cadastro de fontes/hipóteses/afirmações, fluxos de pedidos e respostas de LAI, comparações, registro de lacunas, motor de inteligência por regras e vínculos entre lacunas de LAI e afirmações. A visualização das lacunas vinculadas foi acrescentada ao painel na branch. Existem adaptadores locais de IA, mas **IA hospedada no protótipo público não está validada**. A validação integrada, CI e UX móvel permanecem pendentes. Nenhum dado salvo deve ser apagado ou substituído em atualizações. Não confundir código implementado com produto testado.

## P0 — Segurança, integridade e fluxo mínimo

- [x] Impedir que revisão de dados iniciais sobrescreva investigações salvas (implementação inicial; testes pendentes).
- [ ] Esquema versionado de casos, migrações não destrutivas, validação de importações, tratamento de dados corrompidos e testes de persistência.
- [ ] Exportação recuperável de caso com aviso explícito de armazenamento local; estratégia de backup compatível com diferentes navegadores, sem prometer backup silencioso universal.
- [ ] Migrar anexos para IndexedDB/OPFS, mantendo metadados leves; limites de tamanho, hashes, versão do original, data e origem.
- [ ] Entrada única de material: colar texto, nota ou arquivo uma vez; preservar original, nome, data, origem; permitir classificação posterior.
- [ ] Reduzir navegação para quatro destinos principais: **Apuração, Pedidos/LAI, Revisão, Publicação**; ferramentas avançadas contextuais.
- [ ] Executar e corrigir testes automatizados/CI e testes de interface desktop/mobile; estados vazios, acessibilidade e ajuda contextual.
- [ ] Caso sintético de demonstração protegido contra sobrescrita e testes de referência ponta a ponta.

## P1 — Diferenciais investigativos integrados

- [x] Detector inicial de silêncios de LAI: lacunas registradas pelo jornalista, acompanhamento individual e vínculo opcional com afirmações (implementado parcialmente; validar).
- [x] Exibir lacunas de LAI vinculadas a afirmações no painel (implementado; validar casos sem IDs e encerramento de lacunas).
- [ ] Checklist por item solicitado em LAI: atendido/parcial/ausente/negado; anexos esperados e recebidos, períodos, versões, recurso e prazo, sem inferir má-fé.
- [ ] **Tela contextual da afirmação:** requisitos, evidências, trechos citáveis, lacunas, fontes primárias, explicações alternativas, contraditório/direito de resposta e próximos passos.
- [ ] **Simulador de robustez:** retirada temporária de evidência ou fonte, recálculo de relações e comparação antes/depois sem mutar dados nem atribuir verdade.
- [ ] **Detector de dependência:** rastrear origens primárias e distinguir referências repetidas de corroboradores independentes; não presumir independência sem procedência.
- [ ] **Investigação reversa:** decompor uma afirmação em requisitos documentais e tarefas, com lacunas e aprovações explícitas.
- [ ] **O que mudou:** alterações explicáveis após nova entrada, incluindo evidência, lacuna, hipótese e revisão editorial, com procedência.
- [ ] **O que o documento não comprova:** limites explicitamente documentados, sem inferências injustificadas.
- [ ] Contradições com período, universo, unidade, definição, versão e duas citações confrontáveis.
- [ ] Próxima ação contextual e justificada, poucas sugestões, aceitar/corrigir/rejeitar e memória de rejeições.
- [ ] Seleção de trecho com página/linha, fonte e versão, mantendo diferenciação entre anotação, alegação, documento e evidência verificada.
- [ ] Diário de mudanças de entendimento: hipótese inicial → nova documentação → decisão editorial → próxima pergunta, sem formulário extra.
- [ ] Marcação de conteúdo sensível e exportação cifrada opcional, com desenho de recuperação e riscos esclarecidos.

## P2 — Método, ingestão e interoperabilidade

- [ ] PDF com texto selecionável, importação `.eml`, CSV/TSV/JSON e respostas coladas; OCR local opcional apenas depois de validação e avaliação de desempenho.
- [ ] Análise de hipóteses concorrentes (ACH), critérios de refutação e pré-mortem editorial.
- [ ] Afirmações de alto risco, evidências independentes e direito de resposta como requisitos editoriais rastreáveis, sem parecer jurídico automático.
- [ ] Cronologia derivada com datas e inconsistências; modelos de investigação (contratos, saúde, meio ambiente).
- [ ] Nota metodológica Markdown, tabela de afirmações, cronologia CSV e vocabulário compatível com W3C PROV.
- [ ] Autoria de decisões e pacote de caso versionado e mesclável; revisão de sensíveis antes de compartilhar.
- [ ] Regras configuráveis de prazo por jurisdição com base legal e revisão humana.
- [ ] Documentação de política de dados, licença, manutenção e sustentabilidade.

## P3 — Expansão condicionada a validação

- [ ] Colaboração e sincronização com criptografia ponta a ponta, após modelo de conflitos e segurança.
- [ ] IA opcional: comparar infraestrutura financiada, chave própria (BYOK) e modelo local, sem obrigar conta de usuário e sem envio silencioso de material sensível.
- [ ] OCR avançado, automações de coleta e integrações externas apenas se resolverem tarefas prioritárias medidas em testes.

## Validação e fellowship

1. Testar importação, fechamento/reabertura, exportação, recuperação e não perda de dados; nunca alterar os casos reais para testar.
2. Testar casos sintéticos: afirmação sem evidência, com múltiplas evidências, fonte derivada, lacuna de LAI resolvida, evidência removida apenas na simulação e documento contraditório.
3. Realizar sessões com 3–5 jornalistas: tempo até primeira evidência vinculada, campos poupados, compreensão dos limites documentais, aceitação/rejeição de sugestões, SUS e problemas mobile.
4. Fazer benchmarking atualizado com DocumentCloud, Pinpoint, Aleph, plataformas de LAI e ferramentas de notas antes de reivindicar originalidade.
5. Preparar demonstração ponta a ponta e orçamento de desenvolvimento, UX, QA, segurança/infraestrutura e processamento; diferenciar implementado, experimental, planejado.

## Critérios de aceite

- Nenhuma investigação salva é sobrescrita por atualização ou teste.
- Um material entra uma vez e seus trechos podem ser rastreados ao original.
- Uma afirmação mostra apoio, limites, lacunas e procedência sem conclusões automáticas.
- Uma nova evidência produz mudanças explicáveis ou informa corretamente que nada foi alterado.
- O simulador não modifica a investigação real e demonstra impactos documentais verificáveis.
- LAI percorre pedido → resposta → comparação → lacuna → recurso, sem presumir irregularidade.
- Fluxos críticos passam em CI, testes manuais desktop/mobile e avaliação com jornalistas.

## Sequência de execução recomendada

**Agora:** corrigir e testar vínculo lacuna–afirmação e integridade dos dados; implementar motor puro de simulação com testes. **Depois:** incorporar simulação e requisitos à tela contextual da afirmação, consolidar captura e reduzir navegação. **Em seguida:** armazenamento de arquivos, trechos citáveis, análise de dependência e mudanças explicáveis. **Por fim:** privacidade avançada, ingestão complementar, pesquisa com usuários e demonstração do fellowship.

---

# Histórico das entregas e notas técnicas

# Evidence Desk — Roadmap consolidado (15/10/2026)

Documento de planejamento, não atestado de funcionalidade concluída. Roadmap completo também entregue como `evidence_desk_roadmap_consolidado.md` na conversa de trabalho.

## Princípio
Material entra → evidências e limites são apresentados → mudanças são explicadas → próxima ação justificada → decisão humana → rastreabilidade. Interface centrada na investigação; gratuita, sem login obrigatório, IA opcional e dados privados por padrão.

## P0: confiança e fluxo mínimo
- [x] Proteção inicial contra sobrescrita de casos salvos por revisão de seeds (testes pendentes).
- [ ] Esquema versionado, migrações não destrutivas, validação de importação, recuperação e testes.
- [ ] Exportação recuperável, política de backup realista e armazenamento de anexos em IndexedDB/OPFS.
- [ ] Entrada única de texto/arquivo com original, origem, data, versão e hash preservados.
- [ ] Quatro destinos: Apuração, Pedidos/LAI, Revisão, Publicação; UX móvel, acessibilidade e ajuda contextual.
- [ ] CI validado e casos sintéticos de teste sem alterar investigações reais.

## P1: inteligência investigativa contextual
- [x] Silêncios de LAI registrados por jornalista, pendências individuais e vínculo opcional a afirmação (parcial, não validado).
- [x] Visualização das lacunas vinculadas no painel (parcial, não validado).
- [ ] Checklist por item solicitado na LAI; resposta, ausência, anexos, recurso, prazo e proveniência.
- [ ] Tela contextual da afirmação: requisitos, evidências, trechos, lacunas, alternativas, direito de resposta.
- [ ] Simulador de robustez não destrutivo: excluir provisoriamente evidência/fonte, comparar suporte antes/depois.
- [ ] Dependência de fontes: contar origens primárias, não citações repetidas.
- [ ] Investigação reversa e propostas de próxima ação com aprovação humana.
- [ ] O que mudou; o que documento não comprova; contradições contextualizadas.
- [ ] Fila limitada de sugestões, justificativas e memória de rejeições.
- [ ] Diário de revisão de hipóteses e decisões sem digitação duplicada.
- [ ] Sensibilidade dos dados e exportação cifrada opcional.

## P2: método e interoperabilidade
- [ ] PDF com texto, EML e respostas coladas; OCR local opcional.
- [ ] Hipóteses concorrentes, refutação, pré-mortem, risco de afirmações e direito de resposta.
- [ ] Cronologia e modelos de apuração por domínio.
- [ ] Exportar metodologia Markdown, afirmações e cronologia CSV, proveniência compatível com W3C PROV.
- [ ] Autoria de ações, pacote de caso versionado/mesclável e prazos por jurisdição.
- [ ] Política de dados, licença, governança e sustentabilidade.

## P3: expansão condicionada
- [ ] Colaboração e sincronização segura com resolução de conflitos.
- [ ] Comparar IA financiada, BYOK e modelo local, sem login obrigatório ou envio implícito de material sensível.
- [ ] OCR e automações avançadas somente após testes de valor.

## Critérios de aceite
1. Criar, fechar, reabrir e exportar sem perder dados.
2. Trecho rastreável ao documento original; distinção clara entre nota, alegação e evidência verificada.
3. Mudanças e limitações explicáveis, sem conclusão automática de irregularidade ou verdade.
4. LAI do pedido ao recurso, integrada às afirmações.
5. Simulação de retirada de evidência sem mutar dados originais.
6. Testes automatizados, desktop/mobile e sessões com 3–5 jornalistas.
7. Benchmarking atualizado (DocumentCloud, Pinpoint, Aleph e similares), demo ponta a ponta e orçamento de fellowship.

## Sequência imediata
Testar integridade e vínculos → motor puro e testes do simulador → UI contextual → captura única e navegação → anexos/proveniência → independência de fontes e mudanças → testes com jornalistas.

**Não afirmar como pronto:** IA pública hospedada, OCR/PDF estruturado, colaboração, backup automático universal ou originalidade comprovada sem benchmarking.

## Validação técnica — 17/10/2026
- Testes automatizados executados no Node: 49 aprovados. Workflow `Tests` adicionado; confirmar a execução de cada novo commit no GitHub.
- Contradições e limitações registradas continuam visíveis com origem incompleta; suporte positivo continua exigindo procedência.
- Anexos novos recebem SHA-256; backup verifica o original e restauração rejeita conteúdo divergente. Backups antigos sem hash continuam aceitos. O hash verifica integridade de bytes, não autenticidade ou veracidade do conteúdo.
- Importação aceita o formato legado e os dois esquemas existentes, rejeita versões desconhecidas e formatos incompatíveis antes de salvar. Mantém campos de extensão e completa campos opcionais conhecidos.
- Se o navegador não conseguir salvar uma importação, os casos existentes permanecem e os anexos dessa tentativa são removidos.
- Validação visual e testes manuais completos de recuperação no navegador continuam pendentes; esquema/migrações de todo o armazenamento ainda não estão concluídos.

## Continuação em paralelo — 17/10/2026

### Integrado nesta rodada
- [x] Envelope versionado do armazenamento local, aceitando listas legadas sem substituir os dados por exemplos. A primeira gravação válida migra o envelope sem alterar os casos.
- [x] Bloqueio de gravação quando o armazenamento existente está corrompido ou usa versão desconhecida. Aviso persistente com download dos dados originais.
- [x] Cópia local anterior válida, quando houver espaço; recuperação explícita preserva o conteúdo substituído. Não é backup externo, contínuo ou garantido contra limpeza do navegador.
- [x] “Adicionar exemplos” preserva os casos existentes em vez de apagar o armazenamento.
- [x] Captura de material com texto e/ou original, vínculo ao arquivo, versão, data, SHA-256 e estado não verificado. Anexar preserva o texto ainda não salvo.
- [x] Restauração de backup completo remapeia vínculos para os novos IDs locais. JSON sem bytes apresenta o original vinculado como ausente.
- [x] Testes dos fluxos de captura, falha de gravação, recuperação, legado e integridade: 70 testes locais aprovados.

### Próximas entregas preservadas
1. Rascunho persistente da entrada de materiais e proteção contra sair com texto não salvo.
2. Checklist de LAI por item, conectado à lacuna e à afirmação, com procedência.
3. Tela contextual da afirmação e explicação das mudanças após novo material.
4. Fila limitada de sugestões e memória de rejeições.
5. Revisão da navegação para quatro destinos e validação móvel, sem considerar a organização atual concluída.
6. Exportação cifrada e sinalização de dados sensíveis.

A migração aqui cobre o envelope local; não é uma migração completa de todos os modelos do roadmap. Recuperação automática externa, OCR local, colaboração e testes com jornalistas continuam pendentes.

- Revisão cruzada adicional: tela de recuperação acessível mesmo com caso atual ausente; importação de texto acrescenta ao rascunho e não o substitui; URLs dos arquivos atualizadas para evitar cache da versão anterior.
