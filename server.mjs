import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { analyzeRequest } from './server/lai-analysis.mjs';

const root = new URL('./', import.meta.url);
const port = Number(process.env.EVIDENCE_DESK_PORT || 4173);
const configured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL);
const staticFiles = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/app.js', ['app.js', 'text/javascript']], ['/data.js', ['data.js', 'text/javascript']],
  ['/styles.css', ['styles.css', 'text/css']],
]);

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

export const server = http.createServer(async (req, res) => {
  // This adapter is intentionally local. A public deployment needs authenticated access.
  const host = req.headers.host;
  if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(host)) return send(res, 403, { error: 'Origem inválida.' });
  const origin = req.headers.origin;
  if (origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(origin)) {
    return send(res, 403, { error: 'Origem inválida.' });
  }
  const path = new URL(req.url, `http://${host}`).pathname;
  if (path === '/api/lai/status' && req.method === 'GET') return send(res, 200, { available: configured });
  if (path === '/api/lai/analyze' && req.method === 'POST') {
    if (!configured) return send(res, 503, { error: 'Análise por IA indisponível: serviço não configurado.' });
    if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'Envie JSON.' });
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 300000) { send(res, 413, { error: 'Texto acima do limite.' }); return; }
        chunks.push(chunk);
      }
      const result = await analyzeRequest(JSON.parse(Buffer.concat(chunks).toString('utf8')), { apiKey: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL });
      return send(res, 200, { analysis: result });
    } catch (error) {
      const invalid = error.message === 'INVALID_INPUT' || error instanceof SyntaxError;
      return send(res, invalid ? 400 : 502, { error: invalid ? 'Informe o pedido e a resposta em texto, até 40 mil caracteres por campo.' : 'Não foi possível concluir uma análise verificável. Seu registro foi preservado; tente novamente.' });
    }
  }
  const file = staticFiles.get(path);
  if (!file || req.method !== 'GET') return send(res, 404, { error: 'Não encontrado.' });
  try {
    const bytes = await readFile(fileURLToPath(new URL(file[0], root)));
    res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    res.end(bytes);
  } catch { send(res, 500, { error: 'Arquivo indisponível.' }); }
});
server.listen(port, '127.0.0.1', () => console.log(`Evidence Desk: http://127.0.0.1:${port} · IA ${configured ? 'configurada' : 'não configurada'}`));
