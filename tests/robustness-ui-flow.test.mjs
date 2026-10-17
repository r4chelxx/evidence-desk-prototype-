import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { adaptLegacyInvestigation } from '../investigation-adapter.mjs';
import { simulateSourceRemoval, simulateEvidenceRemoval } from '../investigation-intelligence.mjs';
import { createClaimRequirement, assessClaimRequirements } from '../claim-requirements.mjs';

const source = readFileSync(new URL('../app.js',import.meta.url),'utf8');
const renderStart = source.indexOf('function renderRobustnessSimulator(');
const handlerStart = source.indexOf('function bindRobustnessSimulator() {');
const code = source.slice(renderStart,source.indexOf('\nfunction ',handlerStart+1));
const escapeHtml = value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function investigation() {
  return {
    id:'case-1',sources:[{id:'source-a',name:'Fonte A'},{id:'source-b',name:'Fonte B'},{id:'source-zero',name:'Sem documentos'}],
    claims:[{id:'claim-1',statement:'Afirmação <script>não executar</script>'}],
    verifiedEvidence:[{id:'support',source_id:'source-a',title:'Documento de apoio'},{id:'counter',source_id:'source-b',title:'Documento divergente'},{id:'limit',source_id:'source-b',title:'Limite documentado'}],
    evidenceRelations:[{claim_id:'claim-1',evidence_id:'support',relation:'supports'},{claim_id:'claim-1',evidence_id:'counter',relation:'contradicts'},{claim_id:'claim-1',evidence_id:'limit',relation:'limits'}],
    requests:[{title:'Pedido original'}],gaps:[],evidenceBlocks:[{id:'need-only',description:'Necessidade de prova'}],
  };
}
function setup(item = investigation()) {
  let click;
  let html='';
  let text='';
  const result={get innerHTML(){return html;},set innerHTML(value){html=value;text='';},get textContent(){return text;},set textContent(value){text=value;html='';}};
  const select={value:''};
  const calls=[];
  const context=vm.createContext({document:{querySelectorAll:()=>[{addEventListener(_type,fn){click=fn;}}],querySelector(selector){return selector.includes('robustness-target') ? select : result;}},getCurrentInvestigation:()=>item,adaptLegacyInvestigation,assessClaimRequirements,escapeHtml,simulateSourceRemoval(data,id){calls.push({mode:'source',id});return simulateSourceRemoval(data,id);},simulateEvidenceRemoval(data,id){calls.push({mode:'evidence',id});return simulateEvidenceRemoval(data,id);}});
  vm.runInContext(code+'\nbindRobustnessSimulator();',context);
  return {item,select,result,calls,render:context.renderRobustnessSimulator,simulate(value){select.value=value;click();}};
}

test('source selection invokes source simulation and reports removed documents, counters and human review', () => {
  const env=setup();
  const before=JSON.stringify(env.item);
  env.simulate('source:source-b');
  assert.deepEqual(env.calls,[{mode:'source',id:'source-b'}]);
  assert.match(env.result.innerHTML,/2 evidência\(s\) retiradas/);
  assert.match(env.result.innerHTML,/Afirmações afetadas \(1\)/);
  assert.match(env.result.innerHTML,/Apoios: 1 → 1/);
  assert.match(env.result.innerHTML,/Contradições: 1 → 0/);
  assert.match(env.result.innerHTML,/Limitações: 1 → 0/);
  assert.match(env.result.innerHTML,/Com contradição registrada → Exige revisão editorial/);
  assert.match(env.result.innerHTML,/não elimina a necessidade de confrontá-la na investigação real/);
  assert.match(env.result.innerHTML,/&lt;script&gt;não executar&lt;\/script&gt;/);
  assert.doesNotMatch(env.result.innerHTML,/<script>/);
  assert.equal(JSON.stringify(env.item),before);
});

test('evidence selection continues to invoke evidence simulation with localized status transitions', () => {
  const env=setup();
  const before=JSON.stringify(env.item);
  env.simulate('evidence:counter');
  assert.deepEqual(env.calls,[{mode:'evidence',id:'counter'}]);
  assert.match(env.result.innerHTML,/uma evidência retirada/);
  assert.match(env.result.innerHTML,/Contradições: 1 → 0/);
  assert.match(env.result.innerHTML,/Limitações: 1 → 1/);
  assert.match(env.result.innerHTML,/Com contradição registrada → Exige ressalvas/);
  assert.equal(JSON.stringify(env.item),before);
});

test('source with no evidence reports no verifiable impact without claiming robustness or independence', () => {
  const env=setup();
  env.simulate('source:source-zero');
  assert.match(env.result.textContent,/fonte e 0 evidência\(s\)/);
  assert.match(env.result.textContent,/Nenhuma afirmação com vínculo explícito foi afetada/);
  assert.match(env.result.textContent,/não demonstra robustez nem independência/);
  assert.equal(env.result.innerHTML,'');
});

test('empty, malformed and unknown selections fail honestly and clear stale output', () => {
  const env=setup();
  for (const selected of ['', 'evidence:', 'source:', 'random:source-a']) {
    env.simulate('source:source-b');
    const calls=env.calls.length;
    env.simulate(selected);
    assert.match(env.result.textContent,/Selecione uma evidência ou fonte/);
    assert.equal(env.result.innerHTML,'');
    assert.equal(env.calls.length,calls);
  }
  for (const selected of ['source:unknown','evidence:unknown']) {
    env.simulate(selected);
    assert.match(env.result.textContent,/Elemento não encontrado/);
    assert.equal(env.result.innerHTML,'');
  }
});

test('real renderer exposes distinct source and evidence choices and excludes evidence needs', () => {
  const env=setup();
  const before=JSON.stringify(env.item);
  const markup=env.render(env.item);
  assert.match(markup,/value="source:source-a"/);
  assert.match(markup,/value="source:source-zero"/);
  assert.match(markup,/value="evidence:support"/);
  assert.doesNotMatch(markup,/value="evidence:need-only"/);
  assert.match(markup,/nunca certifica uma afirmação/);
  assert.equal(JSON.stringify(env.item),before);
});

test('sources without documented evidence stay selectable while entirely empty cases request documentation', () => {
  const env=setup();
  const sourceOnly={sources:[{id:'zero',name:'Fonte cadastrada'}],claims:[],evidenceBlocks:[{id:'need'}]};
  assert.match(env.render(sourceOnly),/value="source:zero"/);
  assert.match(env.render({sources:[],claims:[],evidenceBlocks:[{id:'need'}]}),/Cadastre uma fonte e evidências documentadas/);
  assert.doesNotMatch(env.render({sources:[],claims:[]}),/data-robustness-target/);
});

test('losing requirement coverage stays distinct from claim proof even without evidence relations', () => {
  for (const selection of ['source:source-a','evidence:support']) {
    const item=investigation();
    item.evidenceRelations=[];
    item.claims[0].requirements=[createClaimRequirement({text:'Original assinado <b>integral</b>',status:'documented',evidenceIds:['support']},{id:'requirement-1'})];
    const before=JSON.stringify(item);
    const env=setup(item);
    env.simulate(selection);
    assert.match(env.result.innerHTML,/Afirmações afetadas \(0\)/);
    assert.match(env.result.innerHTML,/Requisitos documentais afetados \(1\)/);
    assert.match(env.result.innerHTML,/Original assinado &lt;b&gt;integral&lt;\/b&gt;: 1 → 0 documento\(s\) com procedência/);
    assert.match(env.result.innerHTML,/A cobertura exige nova revisão/);
    assert.match(env.result.innerHTML,/investigação original permanece intacta/);
    assert.doesNotMatch(env.result.textContent,/Nenhuma afirmação/);
    assert.equal(item.evidenceRelations.length,0);
    assert.equal(item.claims[0].requirements[0].status,'documented');
    assert.equal(JSON.stringify(item),before);
  }
});
