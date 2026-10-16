import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSourceIndependence } from '../investigation-intelligence.mjs';

const caseData = {
  claims: [{ id: 'c1' }],
  sources: [{ id: 's1', primary_origin_id: 'registry' }, { id: 's2', primary_origin_id: 'registry' }, { id: 's3' }],
  evidence: [{ id: 'e1', source_id: 's1' }, { id: 'e2', source_id: 's2' }, { id: 'e3', source_id: 's3' }],
  evidenceRelations: ['e1','e2','e3'].map(evidence_id => ({ claim_id: 'c1', evidence_id, relation: 'supports' }))
};

test('flags repeated declared primary origin and preserves unknown origins', () => {
  const original = JSON.stringify(caseData);
  const result = analyzeSourceIndependence(caseData, 'c1');
  assert.equal(result.supportingEvidence, 3);
  assert.equal(result.repeatedOrigins.length, 1);
  assert.equal(result.repeatedOrigins[0].originId, 'registry');
  assert.equal(result.unknownOriginGroups.length, 1);
  assert.equal(result.independenceVerified, false);
  assert.equal(JSON.stringify(caseData), original);
});

test('different declared origins can be independently documented', () => {
  const data = { ...caseData, sources: [{id:'s1',primary_origin_id:'a'},{id:'s2',primary_origin_id:'b'}], evidence: caseData.evidence.slice(0,2), evidenceRelations: caseData.evidenceRelations.slice(0,2) };
  const result = analyzeSourceIndependence(data, 'c1');
  assert.equal(result.independenceVerified, true);
  assert.equal(result.repeatedOrigins.length, 0);
});

test('a missing claim link cannot imply independence', () => {
  const result = analyzeSourceIndependence(caseData, 'other');
  assert.equal(result.supportingEvidence, 0);
  assert.equal(result.independenceVerified, false);
});

test('duplicate support links do not inflate evidence count', () => {
  const data = { ...caseData, evidenceRelations: [...caseData.evidenceRelations, caseData.evidenceRelations[0]] };
  const result = analyzeSourceIndependence(data, 'c1');
  assert.equal(result.supportingEvidence, 3);
  assert.equal(result.repeatedOrigins[0].evidenceIds.length, 2);
});
