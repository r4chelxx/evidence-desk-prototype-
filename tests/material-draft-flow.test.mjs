import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { loadMaterialDraft, saveMaterialDraft, hasMaterialDraft } from '../material-drafts.mjs';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('const materialDraftMemory = new Map();'), source.indexOf('function bindQuickNotes() {'));
const unloadStart = source.indexOf("window.addEventListener('beforeunload', event => {");
const unload = source.slice(unloadStart, source.indexOf('\n\nif (state.view', unloadStart));
function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
function form() {
  const fields = {
    'textarea[name="note"]': { value: '' },
    '[name="materialKind"]': { value: 'note' },
    '[name="materialOrigin"]': { value: '' },
    '[data-role="attachment-notice"]': { textContent: '' },
    '[data-role="material-draft-notice"]': { textContent: '' }
  };
  for (const field of Object.values(fields)) {
    field.handlers = {};
    field.addEventListener = (event, handler) => { field.handlers[event] = handler; };
  }
  return { dataset: {}, fields, querySelector: selector => fields[selector], querySelectorAll: () => Object.values(fields).slice(0, 3) };
}
function setup(db = storage()) {
  let beforeunload;
  const context = vm.createContext({
    loadMaterialDraft, saveMaterialDraft, hasMaterialDraft, investigationStorage: () => db,
    window: { addEventListener(name, handler) { if (name === 'beforeunload') beforeunload = handler; } }
  });
  vm.runInContext(helpers + '\n' + unload, context);
  return { context, db, restore: context.restoreMaterialDraft, capture: context.captureMaterialDraft,
    close() { const event = { prevented: false, preventDefault() { this.prevented = true; } }; beforeunload(event); return event; } };
}

test('actual form helpers restore drafts after rerender and a new page session, scoped by case', () => {
  const env = setup();
  const original = form();
  env.restore(original, { id: 'one' });
  original.fields['textarea[name="note"]'].value = 'Texto antes de trocar de aba';
  original.fields['[name="materialKind"]'].value = 'response';
  original.fields['[name="materialOrigin"]'].value = 'Órgão';
  original.fields['textarea[name="note"]'].handlers.input();
  const other = form(); env.restore(other, { id: 'two' });
  assert.equal(other.fields['textarea[name="note"]'].value, '');
  const rerendered = form(); env.restore(rerendered, { id: 'one' });
  assert.equal(rerendered.fields['textarea[name="note"]'].value, 'Texto antes de trocar de aba');
  const reloaded = form(); setup(env.db).restore(reloaded, { id: 'one' });
  assert.equal(reloaded.fields['textarea[name="note"]'].value, 'Texto antes de trocar de aba');
  assert.equal(reloaded.fields['[name="materialKind"]'].value, 'response');
  assert.equal(reloaded.fields['[name="materialOrigin"]'].value, 'Órgão');
  assert.equal(env.close().prevented, false);
});

test('failed persistence keeps latest draft in session and warns before leaving; retry removes warning', () => {
  const env = setup(); const entry = form(); env.restore(entry, { id: 'one' });
  entry.fields['textarea[name="note"]'].value = 'Versão salva'; env.capture(entry);
  const write = env.db.setItem;
  env.db.setItem = () => { throw new Error('Quota'); };
  entry.fields['textarea[name="note"]'].value = 'Versão mais recente'; env.capture(entry);
  assert.match(entry.fields['[data-role="material-draft-notice"]'].textContent, /apenas nesta sessão/);
  assert.equal(loadMaterialDraft(env.db, 'one').draft.text, 'Versão salva');
  const rerendered = form(); env.restore(rerendered, { id: 'one' });
  assert.equal(rerendered.fields['textarea[name="note"]'].value, 'Versão mais recente');
  assert.equal(env.close().prevented, true);
  env.db.setItem = write; env.capture(rerendered);
  assert.equal(env.close().prevented, false);
  assert.equal(loadMaterialDraft(env.db, 'one').draft.text, 'Versão mais recente');
});

test('restored attachment references show current metadata or explicit missing-original warning', () => {
  const env = setup();
  saveMaterialDraft(env.db, 'one', { text: 'Trecho', attachmentId: 'file-1' });
  const available = form(); env.restore(available, { id: 'one', localAttachments: [{ id: 'file-1', name: 'original.pdf' }] });
  assert.equal(available.dataset.attachmentId, 'file-1');
  assert.match(available.fields['[data-role="attachment-notice"]'].textContent, /original.pdf/);
  const missing = form(); env.restore(missing, { id: 'one', localAttachments: [] });
  assert.equal(missing.dataset.attachmentId, 'file-1');
  assert.match(missing.fields['[data-role="attachment-notice"]'].textContent, /não está disponível/);
  assert.equal(missing.fields['textarea[name="note"]'].value, 'Trecho');
});
