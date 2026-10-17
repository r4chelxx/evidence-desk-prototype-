import test from 'node:test';
import assert from 'node:assert/strict';
import { loadInvestigationStore, saveInvestigationStore, recoverInvestigationStore, getInvestigationBackupKey, getInvestigationRecoveryKey, INVESTIGATION_STORE_SCHEMA } from '../investigation-storage.mjs';

const key = 'cases';
const item = {id:'case-1',title:'Caso',country:'Brasil',language:'Português',centralQuestion:'Pergunta?',claims:[],extension:{note:'Preservar'}};
function memory(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { values, fail: new Set(), getItem(k) { return values.get(k) ?? null; }, setItem(k,v) { if (this.fail.has(k)) throw new Error('QuotaExceededError'); values.set(k,String(v)); } };
}

test('first launch clones examples; legacy empty sets never reinsert examples', () => {
  const store = memory();
  const result = loadInvestigationStore(store,key,[item]);
  assert.equal(result.source,'seed');
  result.investigations[0].extension.note = 'Changed';
  assert.equal(item.extension.note,'Preservar');
  assert.equal(store.values.size,0);
  store.setItem(key,'[]');
  assert.deepEqual(loadInvestigationStore(store,key,[item]).investigations,[]);
});

test('legacy writes become versioned and retain extensions plus previous valid raw data', () => {
  const original = JSON.stringify([item]);
  const store = memory({[key]:original});
  assert.equal(loadInvestigationStore(store,key).source,'legacy');
  assert.equal(saveInvestigationStore(store,key,[{...item,title:'Updated'}]).saved,true);
  const result = loadInvestigationStore(store,key);
  assert.equal(result.source,'versioned');
  assert.equal(result.investigations[0].extension.note,'Preservar');
  assert.equal(store.getItem(getInvestigationBackupKey(key)),original);
  assert.equal(result.recoveryAvailable,true);
});

test('corrupted, unsupported and malformed current data block all automatic writes', () => {
  for (const raw of ['', '{', '{}', JSON.stringify({schema:INVESTIGATION_STORE_SCHEMA,version:2,investigations:[item]}), JSON.stringify([{...item,claims:{}}]), JSON.stringify([item,item])]) {
    const store = memory({[key]:raw});
    assert.equal(loadInvestigationStore(store,key,[item]).blocked,true);
    assert.equal(saveInvestigationStore(store,key,[item]).saved,false);
    assert.equal(store.getItem(key),raw);
    assert.equal(store.values.size,1);
  }
});

test('read failures block saving and never present examples as the saved investigation', () => {
  const store = {getItem() { throw new Error('SecurityError'); },setItem() { assert.fail('must not write'); }};
  assert.deepEqual(loadInvestigationStore(store,key,[item]).investigations,[]);
  assert.equal(loadInvestigationStore(store,key,[item]).blocked,true);
  assert.equal(saveInvestigationStore(store,key,[item]).saved,false);
});

test('failed main writes preserve current data and failed backup writes allow atomic current saves', () => {
  const original = JSON.stringify([item]);
  const store = memory({[key]:original});
  store.fail.add(key);
  assert.equal(saveInvestigationStore(store,key,[]).saved,false);
  assert.equal(store.getItem(key),original);
  assert.equal(store.getItem(getInvestigationBackupKey(key)),original);
  store.fail.delete(key);
  store.fail.add(getInvestigationBackupKey(key));
  const result = saveInvestigationStore(store,key,[]);
  assert.equal(result.saved,true);
  assert.ok(result.backupError);
  assert.deepEqual(loadInvestigationStore(store,key).investigations,[]);
});

test('explicit recovery restores the last valid copy and archives the damaged original', () => {
  const store = memory({[key]:'{broken',[getInvestigationBackupKey(key)]:JSON.stringify([item])});
  assert.equal(loadInvestigationStore(store,key).recoveryAvailable,true);
  assert.equal(recoverInvestigationStore(store,key).saved,true);
  assert.equal(store.getItem(getInvestigationRecoveryKey(key)),'{broken');
  assert.equal(loadInvestigationStore(store,key).blocked,false);
  assert.deepEqual(loadInvestigationStore(store,key).investigations,[item]);
});

test('recovery refuses invalid backups or failures to preserve the damaged original', () => {
  const store = memory({[key]:'{broken',[getInvestigationBackupKey(key)]:'{}'});
  assert.equal(recoverInvestigationStore(store,key).saved,false);
  store.setItem(getInvestigationBackupKey(key),JSON.stringify([item]));
  store.fail.add(getInvestigationRecoveryKey(key));
  assert.equal(recoverInvestigationStore(store,key).saved,false);
  assert.equal(store.getItem(key),'{broken');
});

test('saving rechecks current storage if another tab replaced it after loading', () => {
  const store = memory({[key]:JSON.stringify([item])});
  const loaded = loadInvestigationStore(store,key);
  store.setItem(key,'{"schema":"future-store"}');
  assert.equal(saveInvestigationStore(store,key,loaded.investigations).blocked,true);
  assert.equal(store.getItem(key),'{"schema":"future-store"}');
});

test('all current demonstration cases fit the storage format', async () => {
  const { investigations } = await import('../data.js');
  const store = memory();
  assert.equal(saveInvestigationStore(store,key,investigations).saved,true);
  assert.deepEqual(loadInvestigationStore(store,key).investigations,investigations);
});
