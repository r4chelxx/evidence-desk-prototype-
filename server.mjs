import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { analyzeRequest } from './server/lai-analysis.mjs';
import { hasPdfExtractor, extractPdf } from './server/pdf-extraction.mjs';
import { createAccess } from './server/access.mjs';

const root = new URL('./', import.meta.url);
const staticFiles = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']], ['/data.js', ['data.js', 'text/javascript']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/lai-deadlines.mjs', ['lai-deadlines.mjs', 'text/javascript']],
  ['/lai-service.mjs', ['lai-service.mjs', 'text/javascript']],
]);
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}
async function readJson(req, maxSize) {
  if (!(req.headers['content-type'] || '').startsWith('application/json')) throw new Error('CONTENT_TYPE');
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxSize) throw new Error('BODY_TOO_LARGE');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function createServer(options = {}) {
  const mode = options.mode || process.env.EVIDENCE_DESK_MODE || 'local';
  const origins = options.origins || (process.env.EVIDENCE_DESK_ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);
  if (mode === 'hosted' && !options.origins && process.env.RENDER_EXTERNAL_URL) {
    const ownOrigin = new URL(process.env.RENDER_EXTERNAL_URL).origin;
    if (ownOrigin.startsWith('https://') && !origins.includes(ownOrigin)) origins.push(ownOrigin);
  }
  const access = createAccess({ mode, origins, password: options.password || process.env.EVIDENCE_DESK_LOGIN_PASSWORD, secret: options.secret || process.env.EVIDENCE_DESK_SESSION_SECRET });
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-5.6-terra';
  const configured = Boolean(apiKey && model);
  const pdfExtraction = options.pdfExtraction ?? await hasPdfExtractor();
  const analyze = options.analyze || analyzeRequest;
  const extract = options.extract || extractPdf;
  let activeAnalyses = 0, activePdfs = 0;
  const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    const path = new URL(req.url, 'http://internal').pathname;
    if (path === '/healthz' && req.method === 'GET') return send(res, 200, { ready: true });
    if (access.hosted) {
      if (path.startsWith('/api/') && !access.allowsOrigin(origin)) return send(res, 403, { error: 'Origem inválida.' });
      if (origin && access.allowsOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      }
    } else {
      const port = server.address()?.port;
      const hosts = [`127.0.0.1:${port}`, `localhost:${port}`];
      if (!hosts.includes(req.headers.host) || (origin && !hosts.map(host => `http://${host}`).includes(origin))) return send(res, 403, { error: 'Origem inválida.' });
    }
    if (req.method === 'OPTIONS' && path.startsWith('/api/lai/')) { res.writeHead(204); return res.end(); }
    if (path === '/api/lai/status' && req.method === 'GET') {
      const authorized = access.authorized(req.headers.authorization);
      return send(res, 200, { available: authorized && configured, pdfExtraction: authorized && pdfExtraction, authRequired: !authorized });
    }
    if (path === '/api/lai/login' && req.method === 'POST' && access.hosted) {
      try { const body = await readJson(req, 2048); return send(res, 200, { token: access.login(body.password), expiresIn: 3600 }); }
      catch (error) { return send(res, error.message === 'RATE_LIMIT' ? 429 : 401, { error: 'Acesso indisponível. Confira a senha ou tente mais tarde.' }); }
    }
    if (path === '/api/lai/extract' && req.method === 'POST') {
      if (!access.authorized(req.headers.authorization)) return send(res, 401, { error: 'Entre no serviço para continuar.' });
      if (!pdfExtraction) return send(res, 503, { error: 'Extração de PDF indisponível. Cole o texto ou importe um arquivo de texto.' });
      if (activePdfs >= 2 || !access.allowPdf()) return send(res, 429, { error: 'Limite de extrações atingido. Tente mais tarde.' });
      activePdfs++;
      try { return send(res, 200, await extract(await readJson(req, 7100000))); }
      catch (error) {
        const messages = {
          PDF_NO_TEXT: 'Não foi encontrado texto selecionável. Este PDF pode precisar de OCR; nenhuma análise de completude foi feita.',
          PDF_TOO_LARGE: 'O PDF excede o limite de 100 páginas ou 40 mil caracteres. Divida o documento; nenhum trecho foi importado.',
          PDF_TIMEOUT: 'A extração demorou demais. Tente um arquivo menor.', BODY_TOO_LARGE: 'PDF acima do limite de 5 MB.',
        };
        return send(res, error.message === 'BODY_TOO_LARGE' ? 413 : 422, { error: messages[error.message] || 'Não foi possível ler o PDF. Confira se está válido e sem proteção.' });
      } finally { activePdfs--; }
    }
    if (path === '/api/lai/analyze' && req.method === 'POST') {
      if (!access.authorized(req.headers.authorization)) return send(res, 401, { error: 'Entre no serviço para continuar.' });
      if (!configured) return send(res, 503, { error: 'Análise por IA indisponível: serviço não configurado.' });
      if (activeAnalyses >= 1 || !access.allowAnalysis()) return send(res, 429, { error: 'Limite de análises atingido. Tente mais tarde.' });
      activeAnalyses++;
      try { const result = await analyze(await readJson(req, 300000), { apiKey, model }); return send(res, 200, { analysis: result }); }
      catch (error) {
        const invalid = error.message === 'INVALID_INPUT' || error instanceof SyntaxError;
        const code = error.message === 'BODY_TOO_LARGE' ? 413 : error.message === 'CONTENT_TYPE' ? 415 : invalid ? 400 : 502;
        return send(res, code, { error: invalid ? 'Informe o pedido e a resposta em texto, até 40 mil caracteres por campo.' : 'Não foi possível concluir a análise. Seus textos continuam na ferramenta.' });
      } finally { activeAnalyses--; }
    }
    const file = staticFiles.get(path);
    if (!file || req.method !== 'GET') return send(res, 404, { error: 'Não encontrado.' });
    try {
      const bytes = await readFile(fileURLToPath(new URL(file[0], root)));
      res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(bytes);
    } catch { send(res, 500, { error: 'Arquivo indisponível.' }); }
  });
  server.requestTimeout = 20000; server.headersTimeout = 10000;
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await createServer();
  const port = Number(process.env.EVIDENCE_DESK_PORT || process.env.PORT || 4173);
  const hosted = process.env.EVIDENCE_DESK_MODE === 'hosted';
  server.listen(port, hosted ? '0.0.0.0' : '127.0.0.1', () => console.log(`Evidence Desk service listening on port ${port} (${hosted ? 'hosted' : 'local'})`));
}
