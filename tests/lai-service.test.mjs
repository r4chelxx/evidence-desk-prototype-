import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeServiceUrl, configureService, connectService, disconnectService, serviceFetch, getServiceUrl, DEFAULT_SERVICE_URL } from '../lai-service.mjs';

test('remote configuration rejects insecure URLs, embedded credentials and redirects via URL parameters', () => {
  assert.equal(normalizeServiceUrl('https://example.org/'), 'https://example.org');
  assert.equal(normalizeServiceUrl('http://127.0.0.1:4173'), 'http://127.0.0.1:4173');
  for (const url of ['http://example.org', 'https://user:password@example.org', 'https://example.org?key=x', 'https://example.org/path', 'javascript:alert(1)']) {
    assert.throws(() => normalizeServiceUrl(url));
  }
});

test('stores only the service URL, keeps session credentials in memory and removes them on disconnect', async () => {
  const previousWindow = globalThis.window, previousFetch = globalThis.fetch;
  const storage = new Map(); let lastHeaders;
  globalThis.window = { localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) } };
  globalThis.fetch = async (_url, options) => {
    lastHeaders = options.headers;
    assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error');
    return { ok: true, status: 200, json: async () => ({ token: 'synthetic-token-only' }) };
  };
  try {
    configureService('https://example.org');
    await connectService('synthetic-password-only');
    await serviceFetch('status'); assert.equal(lastHeaders.Authorization, 'Bearer synthetic-token-only');
    assert.equal(storage.size, 1); assert.equal([...storage.values()][0], 'https://example.org');
    disconnectService(); await serviceFetch('status'); assert.equal(lastHeaders.Authorization, undefined);
  } finally { globalThis.window = previousWindow; globalThis.fetch = previousFetch; }
});

test('Pages uses the deployed backend by default while local preview stays same-origin', () => {
  const previousWindow = globalThis.window;
  try {
    globalThis.window = { location: { origin: 'https://r4chelxx.github.io' }, localStorage: { getItem: () => null } };
    assert.equal(getServiceUrl(), DEFAULT_SERVICE_URL);
    globalThis.window.localStorage.getItem = () => '';
    assert.equal(getServiceUrl(), DEFAULT_SERVICE_URL);
    globalThis.window.localStorage.getItem = () => null;
    globalThis.window.location.origin = 'http://127.0.0.1:4173';
    assert.equal(getServiceUrl(), '');
    globalThis.window.localStorage.getItem = () => 'https://custom.example';
    assert.equal(getServiceUrl(), 'https://custom.example');
  } finally { globalThis.window = previousWindow; }
});
