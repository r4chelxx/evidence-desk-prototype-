import assert from 'node:assert/strict';

// Credentials are read once from stdin, never from command arguments or a file.
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
console.log('Ready for private verification input.');
const input = await new Promise(resolve => {
  let text = '';
  process.stdin.on('data', chunk => {
    text += chunk;
    if (text.includes('\n')) { process.stdin.pause(); resolve(text.slice(0, text.indexOf('\n'))); }
  });
});
if (process.stdin.isTTY) process.stdin.setRawMode(false);
const config = JSON.parse(input);
const base = new URL(config.url);
assert.equal(base.protocol, 'https:');
assert.equal(base.username, ''); assert.equal(base.password, '');
const origin = config.origin;
const headers = { Origin: origin, 'Content-Type': 'application/json' };
const call = (path, options = {}) => fetch(new URL(path, base), { ...options, redirect: 'error', signal: AbortSignal.timeout(20000) });
let stage = 'health';
try {
  assert.equal((await call('/healthz')).status, 200);
  stage = 'anonymous-access';
  assert.equal((await call('/api/lai/extract', { method: 'POST', headers, body: '{}' })).status, 401);
  assert.equal((await call('/api/lai/status', { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  stage = 'login';
  const login = await call('/api/lai/login', { method: 'POST', headers, body: JSON.stringify({ password: config.password }) });
  assert.equal(login.status, 200);
  assert.equal(login.headers.get('access-control-allow-origin'), origin);
  const { token } = await login.json(); assert.equal(typeof token, 'string');
  const authorized = { ...headers, Authorization: `Bearer ${token}` };
  stage = 'capabilities';
  const status = await (await call('/api/lai/status', { headers: authorized })).json();
  assert.equal(status.authRequired, false); assert.equal(status.pdfExtraction, true);
  stage = 'pdf-extraction';
  const stream = 'BT /F1 12 Tf 50 100 Td (Synthetic total: 12 cases) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n'; const offsets = [];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const extraction = await call('/api/lai/extract', { method: 'POST', headers: authorized, body: JSON.stringify({ fileName: 'synthetic-test.pdf', base64: Buffer.from(pdf).toString('base64') }) });
  assert.equal(extraction.status, 200);
  const extracted = await extraction.json();
  assert.match(extracted.text, /Synthetic total: 12 cases/); assert.equal(extracted.pages, 1);
  stage = 'unconfigured-ai';
  if (!status.available) assert.equal((await call('/api/lai/analyze', { method: 'POST', headers: authorized, body: JSON.stringify({ request: 'Synthetic request', response: 'Synthetic response' }) })).status, 503);
  console.log(JSON.stringify({ ok: true, health: true, protectedAccess: true, cors: true, authenticatedPdfExtraction: true, aiConfigured: status.available, liveAiCallMade: false }));
} catch {
  console.error(JSON.stringify({ ok: false, stage })); process.exitCode = 1;
}
