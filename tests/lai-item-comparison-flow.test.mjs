import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {suggestLaiItemComparisons} from '../lai-item-comparison.mjs';
import {createChecklistItem,updateChecklistItem} from '../lai-item-checklist.mjs';
import {validateInvestigationImport} from '../investigation-import.mjs';
import {saveInvestigationStore,loadInvestigationStore} from '../investigation-storage.mjs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=source.indexOf('function currentLaiItemSuggestions(');
const code=source.slice(start,source.indexOf('\nfunction renderLaiAnalysis(',start));
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function setup(saved=true) {
  const entry=createChecklistItem({requestedText:'Contratos e despesas de 2024',notes:'Revisão ainda pendente.'},{id:'item-1'});
  const request={title:'Pedido',itemChecklist:[entry]};
  const item={id:'case',title:'Caso',country:'Brasil',language:'Português',centralQuestion:'Pergunta?',requests:[request],laiItemSuggestionDecisions:[],transparencyLog:[],verifiedEvidence:[]};
  const fields={response:{value:'Contratos e despesas de 2024 <script>copiados do original</script>.'},attachments:{value:''}};
  const reviewFields=Object.fromEntries(['status','responseExcerpt','locator','notes','targetClaimId'].map(name=>[name,{value:entry[name] || ''}]));
  const reviewNotice={textContent:''};
  const review={dataset:{itemId:entry.id},querySelector(selector){return selector==='[data-checklist-notice]' ? reviewNotice : reviewFields[selector.match(/name="(.+)"/)?.[1]];}};
  const button={addEventListener(_event,fn){this.click=fn;}};
  let markup='';
  const target={panels:[],textContent:'',get innerHTML(){return markup;},set innerHTML(value){
    markup=value;
    this.panels=[...value.matchAll(/data-lai-suggestion-id="([^"]+)"/g)].map(match=>{
      const notice={textContent:''};
      const accept={addEventListener(_event,fn){this.click=fn;}};
      const reject={addEventListener(_event,fn){this.click=fn;}};
      return {dataset:{laiSuggestionId:match[1]},notice,accept,reject,querySelector(selector){return selector.includes('accept-lai') ? accept : selector.includes('reject-lai') ? reject : notice;}};
    });
  },querySelectorAll(){return this.panels;}};
  const card={dataset:{laiRequest:'0'},querySelector(selector){return selector==='[data-lai-response]' ? fields.response : selector==='[data-lai-attachments]' ? fields.attachments : selector==='[data-lai-item-suggestions]' ? target : button;},querySelectorAll:()=>[review]};
  const context=vm.createContext({document:{querySelectorAll:()=>[card]},getCurrentInvestigation:()=>item,suggestLaiItemComparisons,updateChecklistItem,escapeHtml,state:{locale:'pt'},saveInvestigations:()=>saved,todayIsoDate:()=> '2026-10-17'});
  vm.runInContext(code+'\nbindLocalLaiItemComparisons();',context);
  return {item,request,entry,fields,reviewFields,reviewNotice,target,button,card,get panel(){return target.panels[0];}};
}

test('real local comparison uses current fields and accepting copies only excerpt/locator with status unchanged',()=>{
  const env=setup(); env.button.click();
  const suggestion=env.card.laiItemSuggestionBundle.result.suggestions[0];
  assert.equal(suggestion.materialId,'request-0-response');
  env.panel.accept.click();
  const saved=env.request.itemChecklist[0];
  assert.equal(saved.status,'pending');
  assert.equal(saved.responseExcerpt,suggestion.excerpt);
  assert.match(saved.locator,/Resposta integral · caracteres/);
  assert.equal(saved.notes,env.entry.notes);
  assert.equal(saved.targetClaimId,env.entry.targetClaimId);
  assert.equal(env.item.laiItemSuggestionDecisions[0].status,'accepted');
  assert.equal(env.item.transparencyLog.length,1);
  assert.equal(env.item.verifiedEvidence.length,0);
  assert.equal(env.reviewFields.responseExcerpt.value,saved.responseExcerpt);
  assert.equal(env.target.panels.length,0);
});

test('rejecting lexical suggestion preserves the exact checklist and records only decision/log',()=>{
  const env=setup(); const original=env.request.itemChecklist;
  env.button.click(); env.panel.reject.click();
  assert.equal(env.request.itemChecklist,original);
  assert.equal(env.item.laiItemSuggestionDecisions[0].status,'rejected');
  assert.equal(env.item.transparencyLog.length,1);
  assert.equal(env.entry.status,'pending');
});

test('changed response or requested wording invalidates old lexical panels without losing inputs',()=>{
  for(const field of ['response','requested']) {
    const env=setup(); env.button.click(); const panel=env.panel;
    if(field==='response') env.fields.response.value+=' Nova redação recebida.';
    else env.request.itemChecklist[0]={...env.entry,requestedText:env.entry.requestedText+' revisados'};
    panel.accept.click();
    assert.match(panel.notice.textContent,/textos mudaram|Procure novamente/);
    assert.equal(env.item.laiItemSuggestionDecisions.length,0);
    assert.equal(env.request.itemChecklist[0].responseExcerpt,'');
    assert.ok(env.fields.response.value.includes('Contratos'));
  }
});

test('save failure rolls back checklist, decisions and log for acceptance and rejection',()=>{
  for(const accepted of [true,false]) {
    const env=setup(false); env.button.click(); const panel=env.panel;
    const entries=env.request.itemChecklist,decisions=env.item.laiItemSuggestionDecisions,log=env.item.transparencyLog;
    accepted ? panel.accept.click() : panel.reject.click();
    assert.equal(env.request.itemChecklist,entries);
    assert.equal(env.item.laiItemSuggestionDecisions,decisions);
    assert.equal(env.item.transparencyLog,log);
    assert.equal(env.reviewFields.responseExcerpt.value,'');
    assert.match(panel.notice.textContent,/Não foi possível salvar/);
    assert.match(env.fields.response.value,/Contratos/);
  }
});

test('dirty checklist fields block excerpt acceptance and preserve the manual review draft',()=>{
  for(const [field,value] of Object.entries({status:'missing',responseExcerpt:'Trecho manual',locator:'Página manual',notes:'Nota ainda não salva',targetClaimId:'claim-1'})) {
    const env=setup();env.button.click();const panel=env.panel;
    env.reviewFields[field].value=value;
    panel.accept.click();
    assert.equal(env.reviewFields[field].value,value);
    assert.equal(env.request.itemChecklist[0],env.entry);
    assert.equal(env.item.laiItemSuggestionDecisions.length,0);
    assert.match(panel.notice.textContent,/Salve ou descarte/);
  }
});

test('rendered excerpts are escaped and blank response fields require imported text',()=>{
  const env=setup(); env.button.click();
  assert.match(env.target.innerHTML,/&lt;script&gt;copiados do original&lt;\/script&gt;/);
  assert.doesNotMatch(env.target.innerHTML,/<script>/);
  assert.match(env.target.innerHTML,/cobertura lexical/);
  env.fields.response.value='';env.fields.attachments.value='Contratos e despesas de 2024 anexos';env.button.click();
  assert.equal(env.card.laiItemSuggestionBundle.result.suggestions[0].materialId,'request-0-attachments');
  env.fields.attachments.value='';env.button.click();
  assert.match(env.target.textContent,/Cole a resposta/);
});

test('accepted and rejected local lexical decisions survive import/storage and invalid fingerprints/statuses fail',()=>{
  for(const status of ['accepted','rejected']) {
    const env=setup();env.button.click();
    status==='accepted' ? env.panel.accept.click() : env.panel.reject.click();
    const payload=JSON.parse(JSON.stringify({schema:'evidence-desk-investigation-v0.1',investigation:env.item}));
    const imported=validateInvestigationImport(payload);
    const values=new Map();const storage={getItem:key=>values.get(key) ?? null,setItem:(key,value)=>values.set(key,value)};
    assert.equal(saveInvestigationStore(storage,'cases',[imported]).saved,true);
    const restored=loadInvestigationStore(storage,'cases').investigations[0];
    assert.deepEqual(restored.laiItemSuggestionDecisions,JSON.parse(JSON.stringify(env.item.laiItemSuggestionDecisions)));
    assert.equal(suggestLaiItemComparisons({items:restored.requests[0].itemChecklist,materials:env.card.laiItemSuggestionBundle.materials,decisions:restored.laiItemSuggestionDecisions}).total,0);
  }
  for(const decision of [{fingerprint:'',status:'accepted'},{fingerprint:42,status:'rejected'},{fingerprint:'prior',status:'answered'}]) {
    const env=setup();env.item.laiItemSuggestionDecisions=[decision];
    assert.throws(()=>validateInvestigationImport(env.item));
  }
});
