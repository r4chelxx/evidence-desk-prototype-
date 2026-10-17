import test from 'node:test';
import assert from 'node:assert/strict';
import { createClaimRequirement, updateClaimRequirement, assessClaimRequirements } from '../claim-requirements.mjs';

const options = { id: 'requirement-1', now: '2026-10-17T06:00:00.000Z' };
const caseData = { sources: [{ id: 'source-1' }], evidence: [{ id: 'document-1', source_id: 'source-1' }] };
const make = input => createClaimRequirement({ text: '  Obter documento original\n', ...input }, options);

test('requirements preserve authored wording and timestamps without inferring evidence or approval', () => {
  const input = { text: '  Obter documento original\n', notes: 'Confirmar escopo', evidenceIds: ['document-1', 'document-1'], editorialApproval: true };
  const before = JSON.stringify(input);
  const record = createClaimRequirement(input, options);
  assert.equal(record.text, input.text);
  assert.equal(record.status, 'open');
  assert.equal(record.createdAt, options.now);
  assert.deepEqual(record.evidenceIds, ['document-1']);
  assert.equal(record.editorialApproval, undefined);
  record.evidenceIds.push('other');
  assert.equal(JSON.stringify(input), before);
});

test('updates are immutable, retain identity and creation time, and require explicit coverage review', () => {
  const record = make({ evidenceIds: ['document-1'] });
  const before = JSON.stringify(record);
  const updated = updateClaimRequirement(record, { id: 'forged', createdAt: '2000-01-01', status: 'documented', notes: 'Escopo conferido' }, { now: () => '2026-10-17T07:00:00Z' });
  assert.equal(updated.id, record.id);
  assert.equal(updated.createdAt, record.createdAt);
  assert.equal(updated.updatedAt, '2026-10-17T07:00:00.000Z');
  assert.equal(updated.status, 'documented');
  assert.equal(JSON.stringify(record), before);
  assert.throws(() => updateClaimRequirement(updated, { evidenceIds: [] }));
});

test('links alone never promote an open or partial requirement to documented', () => {
  const result = assessClaimRequirements([make({ evidenceIds: ['document-1'] }), make({ status: 'partial', evidenceIds: ['document-1'] })], caseData);
  assert.deepEqual(result.requirements.map(record => record.status), ['open', 'partial']);
  assert.equal(result.hasOpenRequirements, true);
  assert.equal(result.editorialApproval, false);
});

test('documented requires manual review and traceable existing evidence; unresolved links remain visible', () => {
  const records = [make({ status: 'documented', evidenceIds: ['document-1'] }), make({ status: 'documented', evidenceIds: ['document-1', 'missing'] })];
  const before = JSON.stringify([records, caseData]);
  const result = assessClaimRequirements(records, caseData);
  assert.deepEqual(result.requirements.map(record => record.status), ['documented', 'partial']);
  assert.deepEqual(result.requirements[1].missingEvidenceIds, ['missing']);
  assert.deepEqual(result.counts, { total: 2, open: 0, partial: 1, documented: 1 });
  assert.equal(JSON.stringify([records, caseData]), before);
  const complete = assessClaimRequirements([records[0]], caseData);
  assert.equal(complete.hasOpenRequirements, false);
  assert.equal(complete.editorialApproval, false);
  assert.equal(complete.requirements[0].editorialApproval, false);
});

test('planned evidence, dangling sources, explicit unverified flags and duplicate IDs cannot satisfy requirements', () => {
  const requirement = make({ status: 'documented', evidenceIds: ['document-1'] });
  for (const input of [
    { ...caseData, evidence: [], evidenceNeeds: caseData.evidence },
    { ...caseData, sources: [] },
    { ...caseData, sources: [{ id: 'source-1' }, { id: 'source-1' }] },
    { ...caseData, evidence: [...caseData.evidence, ...caseData.evidence] },
    { ...caseData, evidence: [{ ...caseData.evidence[0], verified: false }] },
    { ...caseData, evidence: [{ ...caseData.evidence[0], verification_status: 'unverified' }] },
    { ...caseData, evidence: [{ ...caseData.evidence[0], status: 'planned' }] }
  ]) {
    const result = assessClaimRequirements([requirement], input);
    assert.equal(result.requirements[0].status, 'open');
    assert.deepEqual(result.requirements[0].missingEvidenceIds, ['document-1']);
  }
});

test('invalid authored records fail validation and malformed imported requirements stay open', () => {
  for (const input of [{ text: ' ' }, { text: 'Documento', status: 'proven' }, { text: 'Documento', evidenceIds: [null] }, { text: 'Documento', status: 'documented' }, { text: 'Documento', notes: {} }]) assert.throws(() => createClaimRequirement(input, options));
  assert.throws(() => createClaimRequirement({ text: 'Documento' }, { now: 'never' }));
  const result = assessClaimRequirements([null, { id: 'bad', status: 'documented', evidenceIds: ['document-1'] }], caseData);
  assert.equal(result.counts.open, 2);
  assert.equal(result.editorialApproval, false);
});
