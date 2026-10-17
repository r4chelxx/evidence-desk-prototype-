import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { validateInvestigationImport } from '../investigation-import.mjs';
import { createMaterialCitation, validateMaterialCitation } from '../material-citations.mjs';
import { createMaterialRecord, remapMaterialAttachments } from '../material-provenance.mjs';
import { createInvestigationCheckpoint, diffInvestigationCheckpoints } from '../investigation-changes.mjs';
import { loadInvestigationStore, saveInvestigationStore } from '../investigation-storage.mjs';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const extract=name=>{const start=source.indexOf('function '+name+'('); return source.slice(start,source.indexOf('\nfunction ',start+1));};
function fixture() {
  const metadata={id:'attachment-original',name:'original.txt',size:42,type:'text/plain',sha256:'a'.repeat(64)};
  const note=createMaterialRecord({id:'note-1',text:'Original: nenhum trecho é automaticamente prova.',attachment:metadata,createdAt:'2026-10-17T08:00:00Z'});
  const item={id:'case-original',title:'Caso',country:'Brasil',language:'Português',centralQuestion:'Pergunta?',reporterNotes:[note],materialCitations:[],localAttachments:[metadata]};
  const before=createInvestigationCheckpoint(item);
  const citation=createMaterialCitation(note,{start:0,end:8,locator:'p. 1'},{id:'citation-1',now:'2026-10-17T08:01:00Z'});
  item.materialCitations=[citation];
  const diff=diffInvestigationCheckpoints(before,createInvestigationCheckpoint(item),{sourceMaterialId:note.id});
  item.materialChangeEvents=[{id:'change-1',sourceMaterialId:note.id,label:'Trecho selecionado manualmente',summary:'Trechos citáveis: 0 → 1',createdAt:'2026-10-17T08:01:00Z',changes:diff.changes,total:diff.total,truncated:diff.truncated,causalityInferred:false}];
  return item;
}
function normalize(payload) {
  const context=vm.createContext({validateInvestigationImport,createEmptyInvestigation:draft=>({...draft,freshness:{},accessLaw:{},languagePlan:{}}),todayIsoDate:()=> '2026-10-17',slugify:value=>value.toLowerCase()});
  vm.runInContext(extract('normalizeImportedInvestigation'),context);
  return context.normalizeImportedInvestigation(payload);
}

test('portable and complete backup roundtrips preserve exact citations, provenance and noncausal history',()=>{
  for(const schema of ['evidence-desk-investigation-v0.1','evidence-desk-complete-backup-v1']) {
    const original=fixture();
    const payload=JSON.parse(JSON.stringify({schema,investigation:original,...(schema==='evidence-desk-complete-backup-v1' ? {attachments:[]} : {})}));
    const imported=normalize(payload);
    assert.notEqual(imported.id,original.id);
    assert.deepEqual(imported.materialCitations,original.materialCitations);
    assert.deepEqual(imported.materialChangeEvents,original.materialChangeEvents);
    assert.equal(imported.materialCitations[0].verificationStatus,'unverified');
    const values=new Map();
    const storage={getItem:key=>values.get(key) ?? null,setItem:(key,value)=>values.set(key,value)};
    assert.equal(saveInvestigationStore(storage,'cases',[imported]).saved,true);
    const recovered=loadInvestigationStore(storage,'cases').investigations[0];
    assert.deepEqual(recovered.materialCitations,original.materialCitations);
    assert.deepEqual(recovered.materialChangeEvents,original.materialChangeEvents);
  }
});

test('altered excerpt and false attachment provenance are rejected before import writes',()=>{
  for(const patch of [{text:'Texto adulterado'},{sourceText:'Alterado: nenhum trecho é automaticamente prova.',text:'Alterado'},{noteId:'missing-note'},{attachmentId:'wrong-file'},{originalAttachmentId:'wrong-historical-original'},{sha256:'b'.repeat(64)},{verificationStatus:'verified'}]) {
    const item=fixture(); item.materialCitations[0]={...item.materialCitations[0],...patch};
    const before=JSON.stringify(item);
    assert.throws(()=>validateInvestigationImport({schema:'evidence-desk-investigation-v0.1',investigation:item}));
    assert.equal(JSON.stringify(item),before);
  }
});

test('a material change event cannot import an asserted causal conclusion',()=>{
  for(const causalityInferred of [true,undefined,'false']) {
    const item=fixture(); item.materialChangeEvents[0].causalityInferred=causalityInferred;
    assert.throws(()=>validateInvestigationImport(item),/Histórico de mudanças/);
  }
});

test('real app remap helper updates citation attachment identity after restored bytes retain historical provenance',()=>{
  const item=fixture();
  const original=JSON.stringify(item);
  const restored=[{...item.localAttachments[0],id:'attachment-restored',originalId:'attachment-original'}];
  const notes=remapMaterialAttachments(item.reporterNotes,item.localAttachments,restored);
  const context=vm.createContext({validateMaterialCitation});
  vm.runInContext(extract('remapMaterialCitationAttachments'),context);
  const citations=context.remapMaterialCitationAttachments(item.materialCitations,notes);
  assert.equal(citations[0].attachmentId,'attachment-restored');
  assert.equal(notes[0].attachmentId,'attachment-restored');
  assert.equal(citations[0].originalAttachmentId,'attachment-original');
  assert.equal(citations[0].sha256,'a'.repeat(64));
  assert.equal(citations[0].text,item.materialCitations[0].text);
  assert.equal(citations[0].verificationStatus,'unverified');
  validateInvestigationImport({...item,reporterNotes:notes,materialCitations:citations,localAttachments:restored});
  assert.equal(JSON.stringify(item),original);
});
