import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildInvestigationRadar } from '../investigation-radar.mjs';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=source.indexOf('function proposalFactorText(');
const code=source.slice(start,source.indexOf('\nfunction bindReverseInvestigation()',start));
const escapeHtml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const base=()=>({id:'case',claims:[{id:'c',risk:'Alto'}],gaps:[{id:'g',description:'  Conferir <script>original</script>. ',status:'Aberta',target_claim_id:'c',severity:'Alta'}],actionItems:[],transparencyLog:[],radarDecisions:[],verifiedEvidence:[],sources:[]});
function setup({saved=true,dirtyAdd=false,otherDirty=false,item=base()}={}) {
  const proposal=buildInvestigationRadar(item).proposals[0];
  const input={value:proposal.title,defaultValue:proposal.title,handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}};
  const notice={textContent:''};
  const reject={addEventListener(_type,fn){this.click=fn;}};
  const form={dataset:{role:'radar-proposal',caseId:item.id,originalText:proposal.title,proposalId:proposal.id,proposalFingerprint:proposal.fingerprint,claimId:''},querySelector(selector){return selector.includes('proposalText') ? input : selector.includes('reject-proposal') ? reject : notice;},addEventListener(type,fn){this[type]=fn;}};
  const other={querySelector(){return {value:'Edição pendente',defaultValue:'Texto anterior'};},dataset:{role:'radar-proposal'}};
  const control={saved,renders:0};
  const document={querySelectorAll(selector){
    if(selector==='[data-role="requirement-add"]') return dirtyAdd ? [{querySelector:()=>({value:'Requisito ainda não salvo'})}] : [];
    if(selector==='[data-role="requirement-review"]') return [];
    return otherDirty ? [form,other] : [form];
  }};
  // The other dirty form only participates in draft detection, not handler binding.
  let binding=true;
  const originalQuery=document.querySelectorAll.bind(document);
  document.querySelectorAll=selector=>binding && selector.includes('radar-proposal') ? [form] : originalQuery(selector);
  const proposalDraftMemory=new Map();
  const context=vm.createContext({document,proposalDraftMemory,getCurrentInvestigation:()=>item,buildInvestigationRadar,saveInvestigations:()=>control.saved,renderInvestigation:()=>{control.renders++;},todayIsoDate:()=> '2026-10-17',crypto:globalThis.crypto,state:{locale:'pt',currentId:item.id},escapeHtml});
  vm.runInContext(code+'\nbindAutomaticProposals();',context); binding=false;
  return {item,proposal,input,notice,form,reject,control,proposalDraftMemory,render:context.renderProposalCard,accept(){form.submit({preventDefault(){}});}};
}

test('accepting radar proposal creates a traceable editable task and decision without proving claims',()=>{
  const env=setup();
  env.input.value='  Checar original e registrar limites.  ';
  env.accept();
  assert.equal(env.item.actionItems.length,1);
  const task=env.item.actionItems[0];
  assert.equal(task.action,'Checar original e registrar limites.');
  assert.equal(task.originRadarFingerprint,env.proposal.fingerprint);
  assert.equal(task.originGapId,'g');
  assert.equal(task.target_claim_id,'c');
  assert.doesNotMatch(task.rationale,/\[object Object\]/);
  assert.match(task.rationale,/Alto/);
  assert.equal(env.item.radarDecisions[0].status,'accepted');
  assert.equal(env.item.transparencyLog.length,1);
  assert.equal(env.item.verifiedEvidence.length,0);
  assert.equal(env.item.claims[0].editorialApproval,undefined);
  assert.equal(env.control.renders,1);
});

test('rejecting proposal records the decision and creates no task',()=>{
  const env=setup(); env.reject.click();
  assert.equal(env.item.actionItems.length,0);
  assert.equal(env.item.radarDecisions[0].status,'rejected');
  assert.equal(buildInvestigationRadar(env.item).total,0);
  assert.equal(env.item.transparencyLog.length,1);
});

test('quota failure rolls back actions, decisions and log while retaining edited text',()=>{
  for(const accepted of [true,false]) {
    const env=setup({saved:false});
    const actions=env.item.actionItems, decisions=env.item.radarDecisions, log=env.item.transparencyLog;
    env.input.value='Texto revisado ainda não salvo';
    accepted ? env.accept() : env.reject.click();
    assert.equal(env.item.actionItems,actions);
    assert.equal(env.item.radarDecisions,decisions);
    assert.equal(env.item.transparencyLog,log);
    assert.equal(env.input.value,'Texto revisado ainda não salvo');
    assert.match(env.notice.textContent,/Não foi possível salvar/);
    assert.equal(env.control.renders,0);
  }
});

test('proposal quote and rationale are escaped and object values remain understandable',()=>{
  const env=setup();
  const html=env.render(env.proposal,'radar');
  assert.match(html,/<blockquote>  Conferir &lt;script&gt;original&lt;\/script&gt;\. <\/blockquote>/);
  assert.doesNotMatch(html,/<script>/);
  assert.doesNotMatch(html,/\[object Object\]/);
  assert.match(html,/afirmações: Alto/);
  assert.match(html,/não mede a veracidade/);
});

test('other unsaved requirement and proposal drafts block decisions without clearing them',()=>{
  for(const options of [{dirtyAdd:true},{otherDirty:true}]) {
    const env=setup(options); env.accept();
    assert.equal(env.item.actionItems.length,0);
    assert.equal(env.item.radarDecisions.length,0);
    assert.match(env.notice.textContent,/alterações pendentes/);
    assert.equal(env.input.value,env.proposal.title);
    assert.equal(env.control.renders,0);
  }
});

test('stale proposal cards cannot accept a changed basis or repeat an already decided proposal',()=>{
  const changed=setup();
  changed.item.gaps[0].description='Nova base que não foi revisada no card';
  changed.accept();
  assert.equal(changed.item.actionItems.length,0);
  assert.equal(changed.item.radarDecisions.length,0);
  assert.match(changed.notice.textContent,/mudou|Atualize/);
  const decided=setup(); decided.reject.click(); decided.accept();
  assert.equal(decided.item.actionItems.length,0);
  assert.equal(decided.item.radarDecisions.length,1);
});

test('edited proposal drafts survive redraw and failed saves but clear after a persisted decision',()=>{
  const env=setup({saved:false});
  env.input.value='  Edição específica da repórter <b>original</b>.  ';
  env.input.handlers.input();
  assert.equal(env.proposalDraftMemory.size,1);
  assert.match(env.render(env.proposal,'radar'),/Edição específica da repórter &lt;b&gt;original&lt;\/b&gt;/);
  env.accept();
  assert.equal(env.proposalDraftMemory.size,1);
  assert.equal(env.input.value,'  Edição específica da repórter <b>original</b>.  ');
  env.control.saved=true;
  env.accept();
  assert.equal(env.proposalDraftMemory.size,0);
  assert.equal(env.input.value,env.proposal.title);
  assert.equal(env.item.actionItems[0].action,'Edição específica da repórter <b>original</b>.');
});
