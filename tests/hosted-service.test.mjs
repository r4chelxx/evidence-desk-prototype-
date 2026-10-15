import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from '../server.mjs';

test('hosted API requires origin and authentication before analysis or extraction', async () => {
  let providerCalls = 0;
  const password = 'synthetic-password-only';
  const server = await createServer({ mode: 'hosted', password,
    secret: 'synthetic-session-secret-for-testing-only', origins: ['https://example.org'],
    apiKey: 'synthetic-test-only', model: 'test-only', pdfExtraction: true,
    analyze: async () => { providerCalls++; return { summary: 'synthetic' }; },
    extract: async () => ({ text: 'synthetic PDF' }),
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const headers = { Origin: 'https://example.org', 'Content-Type': 'application/json' };
  try {
    assert.equal((await fetch(`${base}/api/lai/status`)).status, 403);
    assert.equal((await fetch(`${base}/api/lai/status`, { headers: { Origin: 'https://wrong.example' } })).status, 403);
    assert.equal((await fetch(`${base}/api/lai/analyze`, { method: 'POST', headers, body: '{}' })).status, 401);
    assert.equal((await fetch(`${base}/api/lai/extract`, { method: 'POST', headers, body: '{}' })).status, 401);
    assert.equal(providerCalls, 0);
    const preflight = await fetch(`${base}/api/lai/analyze`, { method: 'OPTIONS', headers });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://example.org');
    const login = await fetch(`${base}/api/lai/login`, { method: 'POST', headers, body: JSON.stringify({ password }) });
    const { token } = await login.json(); assert.equal(login.status, 200);
    const authorized = { ...headers, Authorization: `Bearer ${token}` };
    assert.equal((await (await fetch(`${base}/api/lai/status`, { headers: authorized })).json()).available, true);
    assert.equal((await fetch(`${base}/api/lai/analyze`, { method: 'POST', headers: authorized, body: '{"request":"x","response":"y"}' })).status, 200);
    assert.equal(providerCalls, 1);
    assert.equal((await fetch(`${base}/server/access.mjs`)).status, 404);
    assert.equal((await fetch(`${base}/lai-service.mjs`)).status, 200);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('local mode stays usable without API credentials', async () => {
  const server = await createServer({ mode: 'local', apiKey: '', model: '', pdfExtraction: false });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const status = await (await fetch(`${base}/api/lai/status`)).json();
    assert.equal(status.available, false); assert.equal(status.authRequired, false);
    assert.equal((await fetch(`${base}/api/lai/status`, { headers: { Origin: 'https://wrong.example' } })).status, 403);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});

test('hosted service permits its Render-provided HTTPS origin without permitting unrelated origins', async () => {
  const previousUrl = process.env.RENDER_EXTERNAL_URL;
  const previousOrigins = process.env.EVIDENCE_DESK_ALLOWED_ORIGINS;
  let server;
  try {
    process.env.RENDER_EXTERNAL_URL = 'https://self.example.org';
    process.env.EVIDENCE_DESK_ALLOWED_ORIGINS = 'https://example.org';
    server = await createServer({ mode: 'hosted', password: 'synthetic-password-only', secret: 'synthetic-session-secret-for-testing-only', pdfExtraction: false });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    const own = await fetch(`${base}/api/lai/status`, { headers: { Origin: 'https://self.example.org' } });
    assert.equal(own.status, 200); assert.equal((await own.json()).authRequired, true);
    assert.equal((await fetch(`${base}/api/lai/status`, { headers: { Origin: 'https://untrusted.example.org' } })).status, 403);
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    if (previousUrl === undefined) delete process.env.RENDER_EXTERNAL_URL; else process.env.RENDER_EXTERNAL_URL = previousUrl;
    if (previousOrigins === undefined) delete process.env.EVIDENCE_DESK_ALLOWED_ORIGINS; else process.env.EVIDENCE_DESK_ALLOWED_ORIGINS = previousOrigins;
  }
});
