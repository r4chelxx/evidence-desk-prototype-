import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInvestigationImport } from '../investigation-import.mjs';
const item = {title:'Caso',country:'Brasil',language:'Português',centralQuestion:'Pergunta?',claims:[]};
test('imports legacy and versioned cases without mutating or dropping extension fields', () => {
 const original = {...item, custom: {note:'Preservar'}};
 const before = JSON.stringify(original);
 assert.equal(validateInvestigationImport(original), original);
 assert.equal(validateInvestigationImport({schema:'evidence-desk-investigation-v0.1',investigation:original}).custom.note,'Preservar');
 assert.equal(JSON.stringify(original), before);
});
test('rejects incompatible schema, wrong field types and malformed collections', () => {
 for (const invalid of [null, [], {...item,title:{}}, {...item,claims:{}}, {...item,claims:[null]}, {...item,id:12}, {schema:'future-v99',investigation:item}]) assert.throws(() => validateInvestigationImport(invalid));
 assert.throws(() => validateInvestigationImport({...item,accessLaw:[]},{accessLaw:{framework:''}}));
 assert.throws(() => validateInvestigationImport({...item,languagePlan:{publicationLanguages:[{}]}},{languagePlan:{publicationLanguages:['Português']}}));
});
test('complete backup requires explicit attachment collection', () => {
 assert.throws(() => validateInvestigationImport({schema:'evidence-desk-complete-backup-v1',investigation:item}), /anexos/);
 assert.equal(validateInvestigationImport({schema:'evidence-desk-complete-backup-v1',investigation:item,attachments:[]}).title,'Caso');
});

test('current demonstration cases remain compatible with portable import', async () => {
 const {investigations} = await import('../data.js');
 for (const investigation of investigations) assert.equal(validateInvestigationImport({schema:'evidence-desk-investigation-v0.1',investigation}), investigation);
});
