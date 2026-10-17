import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createChecklistItem, updateChecklistItem, summarizeChecklist, canTrackGap } from '../lai-item-checklist.mjs';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('function bindLaiItemChecklist() {');
const code = source.slice(start, source.indexOf('\nfunction ', start + 1));
const make = (status='pending') => createChecklistItem({requestedText:'  Item original.\nSem divisão. ',status,notes:status === 'answered' ? 'Conferido no original' : ''},{id:'item-1',now:'2026-10-17T00:00:00Z'});

function setup(entries = [], saved = true) {
  const request = {title:'Pedido de dados',itemChecklist:entries};
  const originalLog = [{event:'Histórico anterior'}];
  const item = {id:'case-1',requests:[request],transparencyLog:originalLog,gaps:[],claims:[{id:'claim-1',statement:'Afirmação',strength:'incerta'}],evidence:[],evidenceBlocks:[]};
  const operations = {saved,renders:0};
  const forms = [];
  function form(role, entry) {
    const fields = role === 'add' ? {requestedText:{value:'  Novo item original.\nSem divisão. '}} : Object.fromEntries(['status','responseExcerpt','locator','notes','targetClaimId'].map(name => [name,{value:entry[name] || ''}]));
    const notice = {textContent:''};
    const actions = Object.fromEntries(['track-checklist-gap','close-checklist-gap'].map(name => [name,{addEventListener(_type,fn){this.click=fn;}}]));
    const result = {dataset:{requestIndex:'0',...(entry ? {itemId:entry.id} : {})},fields,notice,actions,addEventListener(type,fn){this[type]=fn;},querySelector(selector){
      if (selector === '[data-checklist-notice]') return notice;
      const field = selector.match(/^\[name="(.+)"\]$/)?.[1];
      if (field) return fields[field];
      return actions[selector.match(/^\[data-action="(.+)"\]$/)?.[1]] || null;
    }};
    forms.push({role,result});
    return result;
  }
  const add = form('add');
  const reviews = entries.map(entry=>form('review',entry));
  const context = vm.createContext({document:{querySelectorAll(selector){return selector.includes('checklist-add') ? [add] : selector.includes('checklist-review') ? reviews : [];}},getCurrentInvestigation:()=>item,saveInvestigations:()=>operations.saved,todayIsoDate:()=> '2026-10-17',renderInvestigation:()=>{operations.renders++;},createChecklistItem,updateChecklistItem,canTrackGap});
  vm.runInContext(code+'\nbindLaiItemChecklist();',context);
  return {item,request,originalLog,operations,add,reviews,submit(form){form.submit({preventDefault(){}});}};
}

test('actual add handler stores one exact manual item and logs review without creating evidence', () => {
  const env = setup();
  env.submit(env.add);
  assert.equal(env.request.itemChecklist.length,1);
  assert.equal(env.request.itemChecklist[0].requestedText,env.add.fields.requestedText.value);
  assert.equal(env.request.itemChecklist[0].status,'pending');
  assert.equal(env.item.transparencyLog.length,2);
  assert.equal(env.item.evidence.length,0);
  assert.equal(env.item.evidenceBlocks.length,0);
  assert.equal(env.item.gaps.length,0);
  assert.equal(env.operations.renders,1);
});

test('actual add handler preserves the draft and old records when saving fails', () => {
  const entries = [make()];
  const env = setup(entries,false);
  const draft = env.add.fields.requestedText.value;
  env.submit(env.add);
  assert.equal(env.request.itemChecklist,entries);
  assert.equal(env.item.transparencyLog,env.originalLog);
  assert.equal(env.add.fields.requestedText.value,draft);
  assert.match(env.add.notice.textContent,/Não foi possível salvar/);
  assert.equal(env.operations.renders,0);
});

test('actual review handler updates only the selected item and requires an explicit affirmative record', () => {
  const original = make();
  const env = setup([original]);
  const review = env.reviews[0];
  review.fields.status.value = 'answered';
  env.submit(review);
  assert.equal(env.request.itemChecklist[0],original);
  assert.match(review.notice.textContent,/trecho, localizador ou nota/);
  review.fields.notes.value = 'Conferido no arquivo original.';
  review.fields.targetClaimId.value = 'claim-1';
  env.submit(review);
  assert.equal(env.request.itemChecklist[0].status,'answered');
  assert.equal(env.request.itemChecklist[0].targetClaimId,'claim-1');
  assert.equal(env.request.itemChecklist[0].requestedText,original.requestedText);
  assert.equal(original.status,'pending');
  assert.equal(env.item.claims[0].strength,'incerta');
  assert.equal(env.item.evidence.length,0);
  assert.equal(env.item.gaps.length,0);
});

test('actual review handler rolls back on quota failure and rejects nonexistent claim links', () => {
  const original = make();
  const entries = [original];
  const env = setup(entries,false);
  const review = env.reviews[0];
  review.fields.status.value = 'missing';
  review.fields.notes.value = 'Conferi o arquivo.';
  env.submit(review);
  assert.equal(env.request.itemChecklist,entries);
  assert.equal(env.item.transparencyLog,env.originalLog);
  assert.equal(review.fields.notes.value,'Conferi o arquivo.');
  env.operations.saved=true;
  review.fields.targetClaimId.value = 'claim-missing';
  env.submit(review);
  assert.equal(env.request.itemChecklist,entries);
  assert.match(review.notice.textContent,/não foi encontrada/);
});

test('only explicit partial, missing or denied items can be tracked and never create supporting evidence', () => {
  for (const status of ['pending','answered','partial','missing','denied']) {
    const env = setup([make(status)]);
    env.reviews[0].actions['track-checklist-gap'].click();
    assert.equal(env.item.gaps.length,['partial','missing','denied'].includes(status) ? 1 : 0);
    assert.equal(env.item.evidence.length,0);
    assert.equal(env.item.evidenceBlocks.length,0);
    assert.equal(env.item.claims[0].strength,'incerta');
    if (env.item.gaps.length) {
      assert.equal(env.item.gaps[0].originChecklistItemId,'item-1');
      assert.match(env.item.gaps[0].provenance,/não é conclusão de irregularidade/);
      env.reviews[0].actions['track-checklist-gap'].click();
      assert.equal(env.item.gaps.length,1);
    }
  }
});

test('tracking a gap rolls back both gap and log on failed persistence', () => {
  const env = setup([make('partial')],false);
  const oldGaps = env.item.gaps;
  env.reviews[0].actions['track-checklist-gap'].click();
  assert.equal(env.item.gaps,oldGaps);
  assert.equal(env.item.transparencyLog,env.originalLog);
  assert.equal(env.operations.renders,0);
});

test('tracking and closing preserve every unsaved review field and require saving first', () => {
  const changedFields = {status:'pending',responseExcerpt:'Trecho ainda não salvo.',locator:'Nova página 12',notes:'Nota de revisão pendente.',targetClaimId:'claim-1'};
  for (const action of ['track-checklist-gap','close-checklist-gap']) {
    for (const [field,value] of Object.entries(changedFields)) {
      const env = setup([make(action === 'track-checklist-gap' ? 'partial' : 'answered')]);
      const oldGaps = [{id:'gap-existing',originChecklistItemId:'item-1',status:'Aberta'}];
      if (action === 'close-checklist-gap') env.item.gaps = oldGaps;
      const beforeGaps = env.item.gaps;
      const beforeEntries = env.request.itemChecklist;
      const review = env.reviews[0];
      review.fields[field].value = value;
      review.actions[action].click();
      assert.equal(review.fields[field].value,value,action+' preserves '+field);
      assert.equal(env.item.gaps,beforeGaps);
      assert.equal(env.request.itemChecklist,beforeEntries);
      assert.equal(env.item.transparencyLog,env.originalLog);
      assert.equal(env.operations.renders,0);
      assert.match(review.notice.textContent,/Salve a conferência/);
    }
  }
});

test('closing a linked gap is manual and rolls back on failed persistence', () => {
  const env = setup([make('answered')],false);
  const gaps = [{id:'gap-1',originChecklistItemId:'item-1',status:'Aberta'}];
  env.item.gaps = gaps;
  env.reviews[0].actions['close-checklist-gap'].click();
  assert.equal(env.item.gaps,gaps);
  assert.equal(env.item.transparencyLog,env.originalLog);
  env.operations.saved=true;
  env.reviews[0].actions['close-checklist-gap'].click();
  assert.equal(env.item.gaps[0].status,'Resolvida');
  assert.ok(env.item.gaps[0].resolvedAt);
  assert.equal(gaps[0].status,'Aberta');
});

test('actual checklist renderer escapes copied originals and isolates invalid checklist records', () => {
  const renderStart = source.indexOf('function renderLaiItemChecklist(');
  const renderCode = source.slice(renderStart,source.indexOf('\nfunction ',renderStart+1));
  const escapeHtml = value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const context = vm.createContext({summarizeChecklist,canTrackGap,escapeHtml});
  vm.runInContext(renderCode,context);
  const entry=createChecklistItem({requestedText:'<script>copiado</script>'},{id:'item-x'});
  const html=context.renderLaiItemChecklist({claims:[],gaps:[]},{itemChecklist:[entry]},0);
  assert.match(html,/&lt;script&gt;copiado&lt;\/script&gt;/);
  assert.doesNotMatch(html,/<script>/);
  assert.match(context.renderLaiItemChecklist({},{itemChecklist:[{}]},0),/não pôde ser lido/);
});

test('request item text remains inert when shown in the transparency diary', () => {
 const a=source.indexOf('function renderTransparencyLog(item) {');
 const b=source.indexOf('\nfunction ',a+1);
 const escStart=source.indexOf('function escapeHtml(');
 const escEnd=source.indexOf('\nfunction ',escStart+1);
 const context=vm.createContext({renderTransparencyAddForm:()=>'',t:key=>key,statusClass:()=> 'neutral'});
 vm.runInContext(source.slice(escStart,escEnd)+'\n'+source.slice(a,b),context);
 const unsafe='<img src=x onerror=alert(1)>';
 context.item={transparencyLog:[{date:unsafe,actor:unsafe,event:unsafe,status:unsafe,nextStep:unsafe}]};
 const html=vm.runInContext('renderTransparencyLog(item)',context);
 assert.ok(!html.includes('<img')); assert.ok(html.includes('&lt;img'));
});
