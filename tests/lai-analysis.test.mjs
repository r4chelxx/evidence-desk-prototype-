import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRequest, validateAnalysis, validateInput } from '../server/lai-analysis.mjs';

const input = { request: 'Envie os totais por ano e município.', response: 'Em 2025: 12 casos.', attachments: '' };
const result = { summary: 'Falta recorte municipal.', items: [
  { requested: 'Totais por ano', responseExcerpt: 'Em 2025: 12 casos.', status: 'answered', reason: 'Há total para 2025.' },
  { requested: 'Totais por município', responseExcerpt: '', status: 'missing', reason: 'O texto não traz municípios.' },
], nextStep: 'Solicitar recorte municipal.', draft: 'Solicito complementar a resposta com os totais por município.', limitations: ['Outros anos não foram esclarecidos.'] };

test('requires both original request and received response, with bounded fields', () => {
  assert.throws(() => validateInput({ request: '', response: 'x' }));
  assert.throws(() => validateInput({ ...input, attachments: 'x'.repeat(40001) }));
  assert.deepEqual(validateInput(input), input);
});
test('rejects invented supporting quotations and unsupported affirmative conclusions', () => {
  assert.throws(() => validateAnalysis({ ...result, items: [{ ...result.items[0], responseExcerpt: 'Texto inventado' }] }, input));
  assert.throws(() => validateAnalysis({ ...result, items: [{ ...result.items[0], responseExcerpt: '' }] }, input));
  assert.deepEqual(validateAnalysis(result, input), result);
});
test('sends structured schema and no storage instruction to provider, validates returned content', async () => {
  const analysis = await analyzeRequest(input, { apiKey: 'test-only', model: 'test-model', fetchImpl: async (url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    return { ok: true, json: async () => ({ status: 'completed', output: [{ content: [{ type: 'output_text', text: JSON.stringify(result) }] }] }) };
  } });
  assert.deepEqual(analysis, result);
});
test('does not present provider failures, refusals or truncated output as an assessment', async () => {
  for (const response of [
    { ok: false },
    { ok: true, json: async () => ({ status: 'incomplete' }) },
    { ok: true, json: async () => ({ status: 'completed', output: [{ content: [{ type: 'refusal' }] }] }) },
  ]) await assert.rejects(analyzeRequest(input, { apiKey: 'test-only', model: 'test-model', fetchImpl: async () => response }));
  await assert.rejects(analyzeRequest(input, { apiKey: '', model: '' }), /NOT_CONFIGURED/);
});
