import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccess } from '../server/access.mjs';

const options = { mode: 'hosted', password: 'synthetic-password-only', secret: 'synthetic-session-secret-for-testing-only', origins: ['https://example.org'] };
test('hosted mode refuses missing credentials or non-HTTPS allowed origins', () => {
  assert.throws(() => createAccess({ mode: 'hosted' }));
  assert.throws(() => createAccess({ ...options, origins: ['https://example.org/path'] }));
  assert.throws(() => createAccess({ ...options, origins: ['http://example.org'] }));
});
test('authenticates signed sessions and rejects forged and expired tokens', () => {
  let time = 1000;
  const access = createAccess({ ...options, now: () => time });
  const token = access.login(options.password);
  assert.equal(access.authorized(`Bearer ${token}`), true);
  assert.equal(access.authorized(`Bearer ${token}x`), false);
  assert.equal(access.authorized('Bearer forged.token'), false);
  time += 3600000;
  assert.equal(access.authorized(`Bearer ${token}`), true);
  time += 30 * 86400000;
  assert.equal(access.authorized(`Bearer ${token}`), false);
  assert.equal(access.allowsOrigin('https://evil.example.org'), false);
});
test('limits login attempts and analysis across sessions', () => {
  const access = createAccess(options);
  for (let i = 0; i < 5; i++) assert.throws(() => access.login('incorrect'), /UNAUTHORIZED/);
  assert.throws(() => access.login(options.password), /RATE_LIMIT/);
  for (let i = 0; i < 20; i++) assert.equal(access.allowAnalysis(), true);
  assert.equal(access.allowAnalysis(), false);
});
