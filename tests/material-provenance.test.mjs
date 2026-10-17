import test from 'node:test';
import assert from 'node:assert/strict';
import { createMaterialRecord, remapMaterialAttachments } from '../material-provenance.mjs';

const original = { id: 'old-file', investigationId: 'old-case', name: 'original.pdf', type: 'application/pdf', size: 42, sha256: 'abc', createdAt: '2026-10-01T00:00:00.000Z', lastModified: 123 };
const restored = { ...original, id: 'new-file', investigationId: 'new-case' };
const input = { id: 'note-1', createdAt: '2026-10-02T00:00:00.000Z', text: ' Material recebido ', kind: 'document', origin: ' Assessoria ', attachment: original };

test('registration records immutable provenance without promoting material to evidence', () => {
  const attachment = { ...original, blob: new Blob(['secret']), base64: 'secret', bytes: [1], verificationStatus: 'verified' };
  const note = createMaterialRecord({ ...input, attachment, verificationStatus: 'verified', classifiedAs: 'evidence' });
  assert.equal(note.text, 'Material recebido');
  assert.equal(note.materialOrigin, 'Assessoria');
  assert.equal(note.verificationStatus, 'unverified');
  assert.equal(note.version, 1);
  assert.equal(note.createdAt, input.createdAt);
  assert.equal(note.classifiedAs, undefined);
  assert.deepEqual(note.originalAttachment, original);
  attachment.name = 'changed';
  assert.equal(note.originalAttachment.name, 'original.pdf');
});

test('text-only and attachment-only material is supported; empty or malformed records fail', () => {
  assert.equal(createMaterialRecord({ text: 'Pista' }).materialKind, 'note');
  assert.equal(createMaterialRecord({ text: 'Pista', origin: null }).materialOrigin, null);
  assert.equal(createMaterialRecord({ text: 'Pista', origin: '   ' }).materialOrigin, null);
  assert.equal(createMaterialRecord({ attachment: original }).attachmentId, original.id);
  for (const data of [{}, { text: ' ' }, { text: 'Pista', kind: 'evidence' }, { text: 'Pista', createdAt: 'nunca' }, { text: 'Pista', attachment: { id: 'x' } }]) assert.throws(() => createMaterialRecord(data));
});

test('successive restores keep original timestamp, checksum and ID while updating current attachment ID', () => {
  const note = createMaterialRecord(input);
  const [first] = remapMaterialAttachments([note], [original], [{ ...restored, originalId: original.id }]);
  const secondRestored = { ...restored, id: 'third-file', originalId: restored.id };
  const [second] = remapMaterialAttachments([first], [restored], [secondRestored]);
  assert.equal(second.attachmentId, 'third-file');
  assert.equal(second.attachmentStatus, 'available');
  assert.deepEqual(second.originalAttachment, original);
  assert.equal(second.createdAt, input.createdAt);
});

test('ordered restore changes current reference and preserves historical metadata and verification state', () => {
  const note = createMaterialRecord(input);
  const before = JSON.stringify([note, original, restored]);
  const [mapped] = remapMaterialAttachments([note], [original], [restored]);
  assert.equal(mapped.attachmentId, restored.id);
  assert.equal(mapped.attachmentStatus, 'available');
  assert.deepEqual(mapped.originalAttachment, original);
  assert.equal(mapped.createdAt, note.createdAt);
  assert.equal(mapped.verificationStatus, 'unverified');
  assert.equal(JSON.stringify([note, original, restored]), before);
  mapped.originalAttachment.name = 'mutated';
  assert.equal(note.originalAttachment.name, original.name);
});

test('legacy notes remain unchanged and legacy attachment notes gain only provenance', () => {
  const legacy = { id: 'legacy', text: 'Apuração', custom: 7 };
  assert.deepEqual(remapMaterialAttachments([legacy]), [legacy]);
  assert.deepEqual(remapMaterialAttachments(), []);
  const [mapped] = remapMaterialAttachments([{ ...legacy, attachmentId: original.id }], [original], [restored]);
  assert.equal(mapped.attachmentId, restored.id);
  assert.deepEqual(mapped.originalAttachment, original);
  assert.equal(mapped.verificationStatus, undefined);
});

test('unknown, incomplete, duplicate or mismatched references are explicitly missing', () => {
  const note = createMaterialRecord(input);
  const scenarios = [
    [[], [restored]],
    [[original], []],
    [[original], [{ ...restored, sha256: 'different' }]],
    [[original], [{ ...restored, sha256: undefined }]],
    [[original], [{ ...restored, name: 'other.pdf' }]],
    [[original, original], [restored, { ...restored, id: 'another' }]],
    [[original], [restored, { ...restored, id: 'another' }]],
    [[{ ...original, sha256: 'different' }], [{ ...restored, sha256: 'different' }]]
  ];
  for (const [oldFiles, newFiles] of scenarios) {
    const [mapped] = remapMaterialAttachments([note], oldFiles, newFiles);
    assert.equal(mapped.attachmentId, original.id);
    assert.equal(mapped.attachmentStatus, 'missing');
  }
});

test('explicit original IDs permit safe reordered restoration and reject duplicate candidates', () => {
  const second = { ...original, id: 'old-2', name: 'other.pdf' };
  const note = createMaterialRecord(input);
  const newFiles = [{ ...second, id: 'new-2', originalId: second.id }, { ...restored, originalId: original.id }];
  assert.equal(remapMaterialAttachments([note], [original, second], newFiles)[0].attachmentId, restored.id);
  const duplicate = [...newFiles, { ...restored, id: 'new-3', originalId: original.id }];
  assert.equal(remapMaterialAttachments([note], [original, second], duplicate)[0].attachmentStatus, 'missing');
});
