import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInvestigationRadar } from '../investigation-radar.mjs';
const requirement = {id:'req-1',text:'  Obter o contrato original.\nConferir assinatura. ',kind:'document',status:'open',evidenceIds:[],notes:''};
const base = () => ({claims:[{id:'claim-1',risk:'Alto',requirements:[{...requirement}]}],gaps:[{id:'gap-1',description:'  Conferir meses ausentes. ',status:'Aberta',severity:'Crítica',target_claim_id:'claim-1'}],actionItems:[],sources:[],verifiedEvidence:[]});

test('priority uses explicit severity, risk and linked claim impact deterministically', () => {
  const item=base();
  const result=buildInvestigationRadar(item);
  assert.deepEqual(result,buildInvestigationRadar(item));
  assert.equal(result.proposals[0].gapId,'gap-1');
  assert.equal(result.proposals[0].score,321);
  assert.equal(result.proposals[0].priority,'Alta');
  assert.equal(result.proposals[0].basis.excerpt,'  Conferir meses ausentes. ');
  assert.equal(result.proposals[1].basis.excerpt,requirement.text);
  assert.deepEqual(result.proposals[1].effort,{known:false,value:null});
  assert.equal(result.proposals[0].score,result.proposals[0].rationale.reduce((sum,row)=>sum+row.points,0));
});

test('closed gaps and actually documented requirements are omitted without fabricating sources', () => {
  const item=base();
  item.gaps[0].status='Resolvida';
  item.claims[0].requirements[0]={...requirement,status:'documented',evidenceIds:['doc']};
  assert.equal(buildInvestigationRadar(item).proposals.length,1,'missing provenance must keep coverage open');
  item.sources=[{id:'source'}]; item.verifiedEvidence=[{id:'doc',source_id:'source'}];
  assert.equal(buildInvestigationRadar(item).total,0);
  assert.deepEqual(buildInvestigationRadar({}),{proposals:[],total:0,suppressed:0,waiting:0});
});

test('accepted and rejected fingerprints are remembered until their basis changes', () => {
  for (const decision of ['accepted','rejected']) {
    const item=base();
    const original=buildInvestigationRadar(item).proposals[0];
    item.radarDecisions=[{fingerprint:original.fingerprint,decision}];
    assert.equal(buildInvestigationRadar(item).proposals.some(proposal=>proposal.gapId==='gap-1'),false);
    for (const patch of [{description:'Texto revisto'},{status:'Em revisão'},{severity:'Alta'},{risk:'Médio'},{notes:'Nota revista'},{nextStep:'Próximo passo revisto'},{dependencyIds:['missing']}]) {
      const changed={...item,gaps:[{...item.gaps[0],...patch}]};
      const next=buildInvestigationRadar(changed).proposals.find(proposal=>proposal.gapId==='gap-1');
      assert.ok(next);
      assert.notEqual(next.fingerprint,original.fingerprint);
    }
  }
});

test('tasks already linked by exact fingerprint, gap or requirement suppress duplicate work', () => {
  for (const origin of ['fingerprint','gap','requirement']) {
    const item=base();
    const proposal=buildInvestigationRadar(item).proposals[origin==='requirement' ? 1 : 0];
    item.actionItems=[origin==='fingerprint' ? {originRadarFingerprint:proposal.fingerprint} : origin==='gap' ? {originGapId:'gap-1'} : {originRequirementId:'req-1',target_claim_id:'claim-1'}];
    const result=buildInvestigationRadar(item);
    assert.equal(result.total,1);
    assert.equal(result.suppressed,1);
  }
});

test('unresolved explicit dependencies wait behind actionable work; cycles and unknown IDs stay visible', () => {
  const item=base();
  item.gaps[0].dependencyIds=['task-1'];
  item.actionItems=[{id:'task-1',status:'Aberta',dependencyIds:['gap-1']}];
  let result=buildInvestigationRadar(item);
  assert.equal(result.proposals[0].requirementId,'req-1');
  assert.equal(result.proposals[1].waiting,true);
  assert.equal(result.proposals[1].dependencyCycle,true);
  assert.deepEqual(result.proposals[1].unresolvedDependencyIds,['task-1']);
  item.actionItems[0].status='Concluída';
  result=buildInvestigationRadar(item);
  assert.equal(result.proposals[0].gapId,'gap-1');
  assert.equal(result.proposals[0].waiting,false);
  item.gaps[0].dependencyIds=['unknown'];
  assert.deepEqual(buildInvestigationRadar(item).proposals[1].unresolvedDependencyIds,['unknown']);
});

test('queue limits stay at four while totals count all proposals and tie order stays stable', () => {
  const item={gaps:Array.from({length:6},(_,index)=>({id:'g'+index,description:'Lacuna '+index,status:'Aberta'}))};
  const result=buildInvestigationRadar(item,{limit:100});
  assert.equal(result.total,6);
  assert.deepEqual(result.proposals.map(proposal=>proposal.gapId),['g0','g1','g2','g3']);
  assert.equal(buildInvestigationRadar(item,{limit:2}).proposals.length,2);
  assert.equal(buildInvestigationRadar(item,{limit:0}).proposals.length,0);
});

test('recorded effort is preserved and ranking does not infer estimates, evidence or publication readiness', () => {
  const item=base(); item.gaps[0].effort='A confirmar com a equipe';
  const before=JSON.stringify(item);
  const result=buildInvestigationRadar(item);
  assert.deepEqual(result.proposals[0].effort,{known:true,value:'A confirmar com a equipe'});
  assert.equal(JSON.stringify(item),before);
  for (const proposal of result.proposals) {
    assert.equal('editorialApproval' in proposal,false);
    assert.equal('sourceIds' in proposal,false);
    assert.equal('estimatedHours' in proposal,false);
  }
  const frozen=Object.freeze({gaps:Object.freeze([Object.freeze({id:'g',description:'Manual',status:'Aberta'})])});
  assert.equal(buildInvestigationRadar(frozen).total,1);
});

test('requirements with matching local IDs in different claims receive independent proposal identities', () => {
  const item={claims:[{id:'claim-a',requirements:[{...requirement}]},{id:'claim-b',requirements:[{...requirement}]}]};
  const result=buildInvestigationRadar(item);
  assert.equal(result.total,2);
  assert.notEqual(result.proposals[0].id,result.proposals[1].id);
  assert.notEqual(result.proposals[0].fingerprint,result.proposals[1].fingerprint);
});

test('ambiguous gap and within-claim requirement identifiers produce no actionable proposal', () => {
  for (const secondStatus of ['Aberta','Resolvida']) {
    const item={gaps:[{id:'duplicate',description:'Primeiro registro',status:'Aberta'},{id:'duplicate',description:'Segundo registro',status:secondStatus}]};
    assert.equal(buildInvestigationRadar(item).total,0);
  }
  assert.equal(buildInvestigationRadar({claims:[{id:'c',requirements:[{...requirement},{...requirement,status:'documented',evidenceIds:['doc']}]}]}).total,0);
});

test('a rejected waiting proposal resurfaces when a declared dependency is completed or located', () => {
  const item=base();
  item.gaps[0].dependencyIds=['task-1'];
  item.actionItems=[{id:'task-1',status:'Planejada'}];
  const waiting=buildInvestigationRadar(item).proposals.find(proposal=>proposal.gapId==='gap-1');
  item.radarDecisions=[{fingerprint:waiting.fingerprint,status:'rejected'}];
  assert.equal(buildInvestigationRadar(item).proposals.some(proposal=>proposal.gapId==='gap-1'),false);
  item.actionItems[0].status='Concluída';
  const ready=buildInvestigationRadar(item).proposals.find(proposal=>proposal.gapId==='gap-1');
  assert.ok(ready);
  assert.equal(ready.waiting,false);
  assert.notEqual(ready.fingerprint,waiting.fingerprint);
  item.actionItems=[];
  const missing=buildInvestigationRadar(item).proposals.find(proposal=>proposal.gapId==='gap-1');
  assert.notEqual(missing.fingerprint,waiting.fingerprint);
});
