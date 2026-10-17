import test from 'node:test';
import assert from 'node:assert/strict';
import { getMaterialDraftKey, loadMaterialDraft, saveMaterialDraft, clearMaterialDraft, hasMaterialDraft } from '../material-drafts.mjs';

function storage() {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
const draft = { text: ' Texto em apuração\n', kind: 'document', origin: ' Assessoria ', attachmentId: 'attachment-1' };

test('drafts preserve typed fields and are isolated by investigation', () => {
  const db = storage();
  assert.equal(loadMaterialDraft(db, 'one').status, 'empty');
  assert.equal(saveMaterialDraft(db, 'one', draft).saved, true);
  assert.deepEqual(loadMaterialDraft(db, 'one').draft, draft);
  assert.equal(loadMaterialDraft(db, 'two').status, 'empty');
  saveMaterialDraft(db, 'two', { text: 'Outra investigação' });
  clearMaterialDraft(db, 'one');
  assert.equal(loadMaterialDraft(db, 'one').status, 'empty');
  assert.equal(loadMaterialDraft(db, 'two').draft.text, 'Outra investigação');
  assert.notEqual(getMaterialDraftKey('a/b'), getMaterialDraftKey('a%2Fb'));
});

test('blank input is empty; origin-only and file-only drafts are meaningful', () => {
  const db = storage();
  for (const value of [{}, { text: ' \n ', origin: '\t', kind: 'response' }, { attachmentId: ' ' }]) assert.equal(hasMaterialDraft(value), false);
  assert.equal(hasMaterialDraft({ origin: 'Pessoa' }), true);
  assert.equal(hasMaterialDraft({ attachmentId: 'file' }), true);
  saveMaterialDraft(db, 'one', draft);
  assert.equal(saveMaterialDraft(db, 'one', { text: ' \n ' }).saved, true);
  assert.equal(loadMaterialDraft(db, 'one').status, 'empty');
});

test('corrupt, future and cross-case draft data is preserved and blocks implicit overwrite', () => {
  const db = storage();
  const key = getMaterialDraftKey('one');
  for (const [raw, status] of [
    ['{broken', 'invalid'],
    ['null', 'invalid'],
    [JSON.stringify({ schema: 'evidence-desk-material-draft', version: 2, caseId: 'one', draft }), 'unsupported'],
    [JSON.stringify({ schema: 'evidence-desk-material-draft', version: 1, caseId: 'two', draft }), 'invalid'],
    [JSON.stringify({ schema: 'evidence-desk-material-draft', version: 1, caseId: 'one', draft: { text: 4 } }), 'invalid']
  ]) {
    db.setItem(key, raw);
    assert.equal(loadMaterialDraft(db, 'one').status, status);
    assert.equal(saveMaterialDraft(db, 'one', draft).blocked, true);
    assert.equal(saveMaterialDraft(db, 'one', {}).saved, false);
    assert.equal(db.getItem(key), raw);
  }
  assert.equal(clearMaterialDraft(db, 'one').saved, true);
  assert.equal(saveMaterialDraft(db, 'one', draft).saved, true);
});

test('failed storage writes and removals retain the previous draft and caller input', () => {
  const db = storage();
  saveMaterialDraft(db, 'one', draft);
  const previous = db.getItem(getMaterialDraftKey('one'));
  const input = { ...draft, text: 'Mais recente' };
  db.setItem = () => { throw new Error('Quota'); };
  assert.equal(saveMaterialDraft(db, 'one', input).saved, false);
  assert.equal(db.getItem(getMaterialDraftKey('one')), previous);
  assert.equal(input.text, 'Mais recente');
  db.removeItem = () => { throw new Error('Bloqueado'); };
  assert.equal(clearMaterialDraft(db, 'one').saved, false);
  assert.equal(saveMaterialDraft(db, 'one', {}).saved, false);
  assert.equal(db.getItem(getMaterialDraftKey('one')), previous);
});

test('unavailable reads and invalid IDs do not overwrite data', () => {
  const db = storage();
  assert.equal(loadMaterialDraft(null, 'one').status, 'unavailable');
  assert.equal(saveMaterialDraft(null, 'one', draft).saved, false);
  assert.equal(clearMaterialDraft(null, 'one').saved, false);
  db.getItem = () => { throw new Error('Denied'); };
  assert.equal(loadMaterialDraft(db, 'one').status, 'unavailable');
  assert.equal(saveMaterialDraft(db, 'one', draft).saved, false);
  assert.equal(saveMaterialDraft(storage(), '', draft).saved, false);
  assert.throws(() => getMaterialDraftKey(' '));
});

test('draft schema rejects invalid fields and stores no verification or evidence classifications', () => {
  const db = storage();
  for (const invalid of [null, [], { text: 7 }, { kind: 'evidence' }, { origin: {} }, { attachmentId: {} }]) assert.equal(saveMaterialDraft(db, 'one', invalid).saved, false);
  const extended = { ...draft, verificationStatus: 'verified', classifiedAs: 'evidence', originalAttachment: { bytes: 'secret' } };
  saveMaterialDraft(db, 'one', extended);
  assert.deepEqual(loadMaterialDraft(db, 'one').draft, draft);
  assert.equal(JSON.stringify(extended).includes('verified'), true);
  const returned = loadMaterialDraft(db, 'one').draft;
  returned.text = 'Changed';
  assert.equal(loadMaterialDraft(db, 'one').draft.text, draft.text);
});
