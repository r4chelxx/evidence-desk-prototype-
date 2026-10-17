import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createMaterialCitation, validateMaterialCitation } from '../material-citations.mjs';
import { createInvestigationCheckpoint, diffInvestigationCheckpoints } from '../investigation-changes.mjs';
import { createMaterialViewer, selectMaterialSegment } from '../material-viewer.mjs';

const app = readFileSync(new URL('../app.js',import.meta.url),'utf8');
const handlersCode = app.slice(app.indexOf('function materialChangeSummary(diff) {'),app.indexOf('function bindNoteClassification() {'));
const historyCode = app.slice(app.indexOf('function renderMaterialHistory(item) {'),app.indexOf('function renderOverview(item) {'));
function setup(saved = true, text = 'Antes. Trecho exato, ação. Depois.') {
  const note = { id:'note-1', text, attachmentId:'file-1', originalAttachment:{id:'original-1',name:'original.pdf',sha256:'a'.repeat(64)} };
  const item = {id:'case-1',reporterNotes:[note],materialCitations:[],materialChangeEvents:[],updatedAt:'2026-10-16'};
  const sources = createMaterialViewer(note.text).segments.map(segment=>({value:segment.text,dataset:{segmentId:segment.id},selectionStart:0,selectionEnd:0}));
  const source = sources[0];
  if (sources.length === 1 && source.value.length >= 24) { source.selectionStart=7; source.selectionEnd=24; }
  const locator = {value:'p. 3, linhas 4–8'}; const notice={textContent:''};
  let submit; let renders=0;
  const form={dataset:{noteId:note.id},addEventListener(event,handler){submit=handler;},querySelectorAll:()=>sources,querySelector(selector){return selector.includes('citationSegment') ? source : selector.includes('citationLocator') ? locator : notice;}};
  const context=vm.createContext({document:{querySelectorAll:()=>[form]},getCurrentInvestigation:()=>item,createMaterialCitation,validateMaterialCitation,createMaterialViewer,selectMaterialSegment,createInvestigationCheckpoint,diffInvestigationCheckpoints,crypto:{randomUUID},saveInvestigations:()=>saved,todayIsoDate:()=> '2026-10-17',renderInvestigation:()=>{renders++;},state:{locale:'pt'},escapeHtml:value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')});
  vm.runInContext(handlersCode+'\n'+historyCode+'\nbindMaterialCitations();',context);
  return {item,note,source,sources,locator,notice,context,get renders(){return renders;},submit:()=>submit({preventDefault(){}})};
}

test('actual citation handler saves exact selection with original locator and explicitly noncausal change event',()=>{
  const env=setup(); const excerpt=env.note.text.slice(env.source.selectionStart,env.source.selectionEnd); env.submit();
  const citation=env.item.materialCitations[0];
  assert.equal(citation.text,excerpt); assert.equal(citation.noteId,env.note.id); assert.equal(citation.locator,env.locator.value);
  assert.equal(citation.attachmentId,'file-1'); assert.equal(citation.sha256,'a'.repeat(64)); assert.equal(citation.verificationStatus,'unverified');
  const event=env.item.materialChangeEvents[0]; assert.equal(event.sourceMaterialId,env.note.id); assert.equal(event.causalityInferred,false);
  assert.match(event.summary,/Trechos citáveis: 0 → 1/); assert.equal(env.item.verifiedEvidence,undefined); assert.equal(env.renders,1);
});

test('failed citation persistence rolls back citation, event and updated date without losing selection or locator',()=>{
  const env=setup(false); const citations=env.item.materialCitations; const events=env.item.materialChangeEvents;
  env.submit(); assert.equal(env.item.materialCitations,citations); assert.equal(env.item.materialChangeEvents,events);
  assert.equal(env.item.updatedAt,'2026-10-16'); assert.equal(env.source.selectionStart,7); assert.equal(env.source.selectionEnd,24);
  assert.equal(env.locator.value,'p. 3, linhas 4–8'); assert.match(env.notice.textContent,/seleção foi mantida/); assert.equal(env.renders,0);
});

test('empty selection is rejected before creating citation or changing event history',()=>{
  const env=setup(); env.source.selectionEnd=env.source.selectionStart; env.submit();
  assert.equal(env.item.materialCitations.length,0); assert.equal(env.item.materialChangeEvents.length,0); assert.equal(env.renders,0);
  assert.match(env.notice.textContent,/exatamente uma página ou seção/);
});

test('actual UI selection on explicitly marked second page saves global offsets and suggested locator without inventing sequence',()=>{
  const text='[Página 1]\nPrimeiro bloco.\n[Página 7]\nSegundo: ação e dados.';
  const env=setup(true,text); env.locator.value=''; env.sources[1].selectionStart=9; env.sources[1].selectionEnd=13;
  env.submit(); const citation=env.item.materialCitations[0];
  assert.equal(citation.text,'ação'); assert.equal(citation.start,text.indexOf('ação')); assert.equal(citation.end,citation.start+4);
  assert.equal(citation.locator,'p. 7'); assert.equal(citation.sourceText,text); assert.equal(env.renders,1);
  env.submit(); assert.equal(env.item.materialCitations.length,1); assert.match(env.notice.textContent,/já foram guardados/);
  const failed=setup(false,text); failed.locator.value=''; failed.sources[1].selectionStart=9; failed.sources[1].selectionEnd=13;
  failed.submit(); assert.equal(failed.item.materialCitations.length,0); assert.equal(failed.item.materialChangeEvents.length,0);
  assert.equal(failed.sources[1].selectionStart,9); assert.equal(failed.sources[1].selectionEnd,13); assert.equal(failed.renders,0);
});

test('unmarked material saves no inferred page locator and renders as unpaged text',()=>{
  const env=setup(); env.locator.value=''; env.submit();
  assert.equal(env.item.materialCitations[0].locator,null);
  const history=env.context.renderMaterialHistory(env.item);
  assert.match(history,/Texto sem paginação informada/); assert.equal(/Página \d/.test(history),false);
});

test('selection on multiple segments is rejected rather than joining unrelated excerpts',()=>{
  const env=setup(true,'[Página 1]\nPrimeiro\n[Página 7]\nSegundo');
  env.sources[0].selectionEnd=3; env.sources[1].selectionEnd=3; env.submit();
  assert.equal(env.item.materialCitations.length,0); assert.match(env.notice.textContent,/exatamente uma página/);
});

test('checkpoint errors after citation creation restore original memory and preserve selection',()=>{
  const env=setup(); env.item.actionItems=Array.from({length:4999},(_,index)=>({id:'task-'+index}));
  const citations=env.item.materialCitations; env.submit();
  assert.equal(env.item.materialCitations,citations); assert.equal(env.item.materialChangeEvents.length,0);
  assert.equal(env.item.updatedAt,'2026-10-16'); assert.equal(env.source.selectionStart,7); assert.equal(env.source.selectionEnd,24);
  assert.match(env.notice.textContent,/checkpoint/); assert.equal(env.renders,0);
});

test('actual material history escapes citation text, locator, note text and noncausal summaries',()=>{
  const env=setup(); env.note.text='</textarea><script>note</script>';
  env.item.materialCitations=[createMaterialCitation(env.note,{start:0,end:env.note.text.length,locator:'<img src=x onerror=alert(1)>'})];
  const history=env.context.renderMaterialHistory(env.item);
  assert.equal(history.includes('<script>'),false); assert.equal(history.includes('<img src=x'),false);
  assert.match(history,/&lt;\/textarea&gt;/); assert.match(history,/&lt;img/);
  env.item.materialChangeEvents=[{label:'<script>x</script>',summary:'<img src=x>',sourceMaterialId:'<script>id</script>'}];
  const changes=env.context.renderMaterialChanges(env.item);
  assert.equal(changes.includes('<script>'),false); assert.match(changes,/Causalidade não inferida/);
});
