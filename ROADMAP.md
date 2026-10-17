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
