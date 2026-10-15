import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateEvidenceRemoval } from './investigation-intelligence.mjs';

const example = () => ({
  sources: [{ id: 's1' }, { id: 's2' }],
  evidence: [{ id: 'e1', source_id: 's1' }, { id: 'e2', source_id: 's2' }],
  claims: [{ id: 'c1' }, { id: 'c2' }],
  evidenceRelations: [
    { claim_id: 'c1', evidence_id: 'e1', relation: 'supports' },
    { claim_id: 'c1', evidence_id: 'e2', relation: 'supports' },
    { claim_id: 'c2', evidence_id: 'e1', relation: 'supports' }
  ]
});

test('removing evidence changes only affected claims without changing the case', () => {
  const data = example();
  const snapshot = JSON.stringify(data);
  const result = simulateEvidenceRemoval(data, 'e1');
  assert.equal(result.found, true);
  assert.equal(result.hypothetical, true);
  assert.equal(JSON.stringify(data), snapshot);
  assert.equal(result.affectedClaims.length, 2);
  assert.equal(result.affectedClaims.find(x => x.claimId === 'c1').lostSupportingLinks, 1);
  assert.equal(result.affectedClaims.find(x => x.claimId === 'c2').after.status, 'needs-evidence');
});

test('unknown evidence is not silently treated as a valid scenario', () => {
  const result = simulateEvidenceRemoval(example(), 'missing');
  assert.equal(result.found, false);
  assert.deepEqual(result.affectedClaims, []);
});

test('unrelated evidence does not produce an affected claim', () => {
  const data = example();
  data.evidence.push({ id: 'e3', source_id: 's2' });
  const result = simulateEvidenceRemoval(data, 'e3');
  assert.deepEqual(result.affectedClaims, []);
});
