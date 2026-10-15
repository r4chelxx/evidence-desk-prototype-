# Backend de análise — piloto

O frontend no GitHub Pages já pode se conectar a um serviço remoto. O backend tem
dois modos: `local`, ligado apenas a 127.0.0.1; e `hosted`, com sessão autenticada,
origens autorizadas e limites por instância. Nenhum serviço remoto foi provisionado
e nenhuma chave real está incluída no repositório.

## Preparação

O arquivo `render.yaml` prepara a criação de um Web Service Docker no Render,
com plano `free`, endpoint de saúde e geração de senha/segredo no ambiente privado
da hospedagem. A disponibilidade do plano precisa ser confirmada na conta; não
substitua por um plano pago sem aprovação. A integração Render ainda precisa ser
conectada para que o serviço seja criado e o deploy seja validado. Não há serviço
online só pela presença deste arquivo no Git.

A chave e o modelo são solicitados no painel privado durante a criação inicial
do Blueprint (`sync: false`). Não coloque valores reais neste arquivo. Em um
serviço já existente, configure essas variáveis diretamente no ambiente privado.
Referência: https://render.com/docs/blueprint-spec.

Hospede o `Dockerfile` deste repositório em um serviço de contêineres com HTTPS.
O processo lê a porta em `EVIDENCE_DESK_PORT`, depois `PORT`, e usa 4173 como padrão.
O endpoint de saúde é `/healthz`. O contêiner usa Node 24 e Poppler para PDFs.
Docker não está disponível no ambiente de desenvolvimento desta rodada; o build
da imagem precisa ser conferido na hospedagem. O servidor Node e suas rotas foram
testados diretamente, incluindo autenticação e CORS.

Configure as variáveis no painel privado da hospedagem:

| Variável | Conteúdo |
| --- | --- |
| `EVIDENCE_DESK_MODE` | `hosted` (já definido no Dockerfile) |
| `EVIDENCE_DESK_ALLOWED_ORIGINS` | `https://r4chelxx.github.io` (adicione outras origens HTTPS exatas separadas por vírgula, se necessário) |
| `EVIDENCE_DESK_LOGIN_PASSWORD` | Senha exclusiva do piloto, com pelo menos 16 caracteres |
| `EVIDENCE_DESK_SESSION_SECRET` | Segredo aleatório com pelo menos 32 caracteres, distinto da senha |
| `OPENAI_API_KEY` | Chave da conta de API, apenas no servidor |
| `OPENAI_MODEL` | Modelo habilitado nessa conta, compatível com Responses e Structured Outputs |

Sem senha, segredo ou origens válidas, o modo hosted não inicia. Sem chave/modelo,
o serviço pode extrair PDFs após autenticação, mas informa que a IA está indisponível.
Não envie credenciais pelo chat, não use arquivos públicos e não as inclua no Git.

## Conexão com o protótipo

1. Abra uma investigação e entre em **LAI e respostas**.
2. Expanda **Conectar o serviço de análise**.
3. Informe a URL HTTPS do backend, sem caminho ou parâmetros, e a senha do piloto.
4. Clique **Conectar** e confira as disponibilidades indicadas.
5. Teste com um pedido e resposta sintéticos antes de enviar material de apuração.

A URL fica salva neste navegador. A senha não é persistida e a sessão fica somente
na memória da página, com validade de uma hora. Recarregar a página exige nova
autenticação. Encerrar a sessão remove o token do navegador; um token já emitido
continua válido no servidor até expirar. Alterar o segredo invalida todos os tokens.
O cliente não usa cookies e não segue redirecionamentos nas chamadas do serviço.

## Limites do piloto

- Acesso por senha única: adequado para avaliação individual, não para uma redação
  com usuários, papéis, permissões ou colaboração.
- Limites por processo: 5 tentativas de login por minuto; 20 análises por hora e 50
  por dia; 30 extrações de PDF por hora. Uma análise e duas extrações simultâneas.
- Os contadores ficam na memória e reiniciam com o processo. Não são um teto de
  faturamento; instâncias adicionais têm contadores próprios.
- Não há banco de dados neste serviço. Investigações e rascunhos seguem locais
  ao navegador. Os arquivos PDF são processados em memória e não arquivados.
- Sem OCR. Leia tabelas, imagens e documentos digitalizados no original.
- Regras jurídicas específicas e calendários de feriados não são inferidos pela IA.
- A validação com um modelo real continua pendente da configuração da conta.

## Verificação

Execute `node --test tests/*.test.mjs`. Os testes usam dados sintéticos e um provedor
simulado; não enviam documentos de investigação nem geram custo de IA. Depois do
deploy, confirme HTTPS, origem permitida, bloqueio sem login, acesso após login,
extração de um PDF selecionável e uma análise real com material sintético.
