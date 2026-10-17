import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { suggestClaimRequirements, MAX_SUGGESTION_CLAIM_LENGTH } from '../claim-suggestions.mjs';

const input = { claimId: 'claim-1', text: 'Segundo a fonte, 25% mais registros causaram a mudança.' };
test('suggestions are capped, explainable proposals with exact source excerpts and stable IDs', () => {
  const proposals = suggestClaimRequirements(input);
  assert.equal(proposals.length, 4);
  assert.equal(proposals[0].rule, 'original-source');
  for (const proposal of proposals) {
    assert.equal(input.text.includes(proposal.basisExcerpt), true);
    assert.equal(proposal.status, 'proposed'); assert.equal(proposal.requiresReporterApproval, true);
    assert.equal(proposal.id, 'suggestion-' + createHash('sha256').update(proposal.fingerprint).digest('hex'));
    assert.equal(proposal.editorialApproval, undefined);
    assert.equal(typeof proposal.rationale, 'string');
  }
  assert.deepEqual(suggestClaimRequirements(input), proposals);
});

test('decision memory suppresses exact accepted or rejected fingerprints and changed wording resurfaces', () => {
  const initial = suggestClaimRequirements(input);
  const decisions = initial.map((proposal,index) => ({ fingerprint: proposal.fingerprint, status: index % 2 ? 'accepted' : 'rejected' }));
  const next = suggestClaimRequirements({ ...input, decisions });
  assert.equal(next.some(proposal => decisions.some(decision => decision.fingerprint === proposal.fingerprint)), false);
  const changed = suggestClaimRequirements({ ...input, text: input.text + ' ', decisions });
  assert.equal(changed[0].rule, 'original-source');
  assert.notEqual(changed[0].fingerprint, initial[0].fingerprint);
  assert.notEqual(changed[0].id, initial[0].id);
  assert.equal(suggestClaimRequirements({ ...input, decisions: [{ fingerprint: initial[0].fingerprint, status: 'proposed' }] })[0].id, initial[0].id);
});

test('existing requirements are deduplicated across spacing, case and translated templates', () => {
  const first = suggestClaimRequirements(input)[0];
  const requirements = [{ text: '  ' + first.text.toUpperCase().replaceAll(' ', '\n ') + ' ' }];
  assert.equal(suggestClaimRequirements({ ...input, requirements }).some(proposal => proposal.rule === first.rule), false);
  assert.equal(suggestClaimRequirements({ ...input, requirements, locale: 'en' }).some(proposal => proposal.rule === first.rule), false);
});

test('PT, EN and ES wording triggers basic numeric, comparison, causal and attribution rules', () => {
  for (const [locale, text] of [
    ['pt', 'Segundo a fonte, há 10 registros e menos casos devido a uma mudança.'],
    ['en', 'According to a source, 10 records show more cases because the scope changed.'],
    ['es', 'Según la fuente, hay 10 registros y más casos debido a un cambio.']
  ]) {
    const proposals = suggestClaimRequirements({ claimId: 'multilingual', text, locale });
    assert.deepEqual(proposals.map(proposal => proposal.rule), ['original-source','numeric','comparison','causal']);
    const suppressed = proposals.map(proposal => ({ fingerprint: proposal.fingerprint, status: 'rejected' }));
    assert.equal(suggestClaimRequirements({ claimId: 'multilingual', text, locale, decisions: suppressed })[0].rule, 'attribution');
  }
  assert.match(suggestClaimRequirements({ ...input, locale: 'en-US' })[0].text, /Locate/);
  assert.match(suggestClaimRequirements({ ...input, locale: 'es' })[0].text, /Localizar la fuente/);
});

test('unknown wording gets a cautious generic proposal without invented named entities or findings', () => {
  const [proposal] = suggestClaimRequirements({ claimId: 'claim', text: 'Um registro menciona uma situação.' });
  assert.equal(proposal.rule, 'original-source'); assert.match(proposal.text, /se disponível/);
  assert.equal(proposal.basisExcerpt, 'Um registro menciona uma situação.');
  assert.equal(/comprovad|culpad|fraude|Ministério|Secretaria|polícia/i.test(proposal.text), false);
});

test('inputs remain immutable, claim identity and exact full wording affect fingerprints, and invalid lengths do not truncate', () => {
  const value = { ...input, requirements: [{ text: 'Outro requisito' }], decisions: [] };
  const before = JSON.stringify(value); suggestClaimRequirements(value); assert.equal(JSON.stringify(value), before);
  const first = suggestClaimRequirements(input)[0];
  assert.notEqual(suggestClaimRequirements({ ...input, claimId: 'claim-2' })[0].fingerprint, first.fingerprint);
  assert.notEqual(suggestClaimRequirements({ ...input, text: input.text.replace('25', '26') })[0].fingerprint, first.fingerprint);
  for (const invalid of [{}, { claimId: 'c', text: ' ' }, { claimId: '', text: 'Texto' }, { claimId: 'c', text: 'x'.repeat(MAX_SUGGESTION_CLAIM_LENGTH + 1) }]) assert.deepEqual(suggestClaimRequirements(invalid), []);
  assert.equal(suggestClaimRequirements({ claimId: 'c', text: 'x'.repeat(MAX_SUGGESTION_CLAIM_LENGTH) }).length, 1);
});
