import test from 'node:test';
import assert from 'node:assert/strict';
import { createMaterialCitation, validateMaterialCitation, MAX_CITATION_SOURCE_LENGTH } from '../material-citations.mjs';

const hash = 'a'.repeat(64);
const note = { id: 'note-1', text: 'Antes.  Trecho exato, com acento: ação.\nDepois.', verificationStatus: 'unverified', attachmentId: 'file-current', originalAttachment: { id: 'file-original', name: 'documento.pdf', sha256: hash, blob: 'never copied' } };
const selection = { start: 7, end: 37, locator: 'p. 3, linhas 4–8' };
const options = { id: 'citation-1', now: '2026-10-17T09:00:00.000Z' };

test('manual citation preserves the exact selected characters, locator and original references without evidence promotion', () => {
  const citation = createMaterialCitation(note, selection, options);
  assert.equal(citation.text, note.text.slice(selection.start,selection.end));
  assert.equal(citation.text.startsWith(' '), true);
  assert.equal(citation.noteId, note.id); assert.equal(citation.attachmentId, note.attachmentId);
  assert.equal(citation.originalAttachmentId, 'file-original'); assert.equal(citation.sha256, hash);
  assert.equal(citation.locator, selection.locator); assert.equal(citation.verificationStatus, 'unverified');
  assert.equal(citation.createdAt, options.now); assert.equal(citation.updatedAt, options.now); assert.equal(citation.version, 1);
  assert.equal(citation.evidenceId, undefined); assert.equal(citation.editorialApproval, undefined);
  assert.equal(JSON.stringify(citation).includes('never copied'), false);
  assert.equal(validateMaterialCitation(citation, { notes: [note] }), citation);
});

test('text-only citations allow optional locator and never inherit verified source-note status', () => {
  const citation = createMaterialCitation({ id: 'plain', text: 'Trecho', verificationStatus: 'verified' }, { start: 0, end: 6 }, options);
  assert.equal(citation.locator, null); assert.equal(citation.attachmentId, undefined);
  assert.equal(citation.sha256, undefined); assert.equal(citation.verificationStatus, 'unverified');
});

test('invalid, reversed, whitespace-only and surrogate-splitting selections are rejected without truncating', () => {
  for (const range of [{ start: -1, end: 2 }, { start: 3, end: 2 }, { start: 2, end: 2 }, { start: 0, end: 1000 }, { start: 0.5, end: 2 }, { start: 7, end: 8 }]) assert.throws(() => createMaterialCitation(note, range, options));
  const emoji = { id: 'emoji', text: 'A😀B' };
  assert.equal(createMaterialCitation(emoji, { start: 1, end: 3 }, options).text, '😀');
  assert.throws(() => createMaterialCitation(emoji, { start: 1, end: 2 }, options));
  assert.throws(() => createMaterialCitation(emoji, { start: 2, end: 3 }, options));
  assert.throws(() => createMaterialCitation({ id: 'large', text: 'x'.repeat(MAX_CITATION_SOURCE_LENGTH + 1) }, { start: 0, end: 1 }, options));
});

test('validation rejects fabricated excerpts, altered provenance, future formats and approval fields', () => {
  const citation = createMaterialCitation(note, selection, options);
  for (const patch of [{ text: 'Texto inventado' }, { version: 2 }, { verificationStatus: 'verified' }, { evidenceId: 'evidence-1' }, { sha256: 'not-a-checksum' }, { locator: {} }, { createdAt: 'never' }]) assert.throws(() => validateMaterialCitation({ ...citation, ...patch }));
  for (const patch of [{ attachmentId: 'other' }, { originalAttachmentId: 'other' }, { sha256: 'b'.repeat(64) }, { sourceText: citation.sourceText + ' ', text: citation.text }]) assert.throws(() => validateMaterialCitation({ ...citation, ...patch }, { notes: [note] }));
  assert.throws(() => validateMaterialCitation(citation, { notes: [] }));
  assert.throws(() => validateMaterialCitation(citation, { notes: [note, note] }));
});

test('creation and validation are immutable and current storage IDs remain distinct from historical original IDs', () => {
  const before = JSON.stringify([note,selection,options]);
  const citation = createMaterialCitation(note,selection,options);
  assert.equal(JSON.stringify([note,selection,options]), before);
  const snapshot = JSON.stringify(citation); validateMaterialCitation(citation); assert.equal(JSON.stringify(citation), snapshot);
  const restoredNote = { ...note, attachmentId: 'restored-file' };
  const afterRestore = createMaterialCitation(restoredNote, selection, options);
  assert.equal(afterRestore.attachmentId, 'restored-file'); assert.equal(afterRestore.originalAttachmentId, note.originalAttachment.id);
  assert.equal(afterRestore.sha256, hash);
  assert.throws(() => validateMaterialCitation(citation, { notes: [restoredNote] }));
});
