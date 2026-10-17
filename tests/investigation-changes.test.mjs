import test from 'node:test';
import assert from 'node:assert/strict';
import { createInvestigationCheckpoint, diffInvestigationCheckpoints } from '../investigation-changes.mjs';

test('checkpoints and diffs deterministically report exact counts and explicit IDs without changing the case',()=>{
  const before={id:'case',reporterNotes:[{id:'note-a',text:'Original'}],gaps:[]};
  const after={...before,reporterNotes:[...before.reporterNotes,{id:'note-b',text:'Não é prova'}],gaps:[{id:'gap-1',description:'Conferir',sourceMaterialId:'note-b'}]};
  const original=JSON.stringify(after);
  const a=createInvestigationCheckpoint(before),b=createInvestigationCheckpoint(after);
  const diff=diffInvestigationCheckpoints(a,b,{sourceMaterialId:'note-b'});
  assert.deepEqual(b,createInvestigationCheckpoint(after));
  assert.deepEqual(diff,diffInvestigationCheckpoints(a,b,{sourceMaterialId:'note-b'}));
  assert.equal(diff.total,4);
  assert.deepEqual(diff.counts.notes,{before:1,after:2,delta:1});
  assert.equal(diff.changes.find(change=>change.id==='gap-1').sourceMaterialId,'note-b');
  assert.equal(diff.changes.find(change=>change.id==='note-b').sourceMaterialId,'note-b');
  assert.equal(diff.causalityInferred,false);
  assert.equal(JSON.stringify(after),original);
});

test('wording, review status and claim truth are never inferred as changes from a count checkpoint',()=>{
  const a=createInvestigationCheckpoint({id:'c',gaps:[{id:'g',description:'Antes',status:'Aberta'}],claims:[{id:'claim',requirements:[{id:'req',status:'open'}]}]});
  const b=createInvestigationCheckpoint({id:'c',gaps:[{id:'g',description:'Depois',status:'Resolvida'}],claims:[{id:'claim',requirements:[{id:'req',status:'documented'}]}]});
  assert.equal(diffInvestigationCheckpoints(a,b).total,0);
});

test('requirements and decisions retain explicit parent scopes, with opaque fingerprints as decision identities',()=>{
  const a=createInvestigationCheckpoint({id:'c'});
  const b=createInvestigationCheckpoint({id:'c',claims:[{id:'a',requirements:[{id:'same'}]},{id:'b',requirements:[{id:'same'}]}],radarDecisions:[{fingerprint:'exact-fingerprint',status:'accepted'}],claimSuggestionDecisions:[{fingerprint:'exact-fingerprint',status:'rejected'}],actionItems:[{id:'task'}],verifiedEvidence:[{id:'doc'}]});
  const diff=diffInvestigationCheckpoints(a,b);
  assert.deepEqual(diff.changes.filter(change=>change.collection==='requirements' && change.type==='added').map(change=>change.scope),['a','b']);
  assert.equal(diff.changes.filter(change=>change.collection==='decisions' && change.type==='added').length,2);
  assert.equal(diff.counts.evidence.delta,1);
  assert.equal(diff.counts.actions.delta,1);
});

test('records without explicit IDs or with duplicate IDs contribute only honest counts',()=>{
  const a=createInvestigationCheckpoint({id:'c',gaps:[{id:'same'},{id:'same'},{}]});
  const b=createInvestigationCheckpoint({id:'c',gaps:[{id:'same'}]});
  assert.equal(a.collections.gaps.unidentified,1);
  assert.equal(a.collections.gaps.ambiguousIds.length,1);
  const changes=diffInvestigationCheckpoints(a,b).changes;
  assert.equal(changes.length,1);
  assert.equal(changes[0].type,'count');
  assert.equal(changes[0].delta,-2);
});

test('explicit source material wins over round context, which never asserts causality',()=>{
  const a=createInvestigationCheckpoint({id:'c',actionItems:[{id:'old',originMaterialId:'source-old'}]});
  const b=createInvestigationCheckpoint({id:'c',actionItems:[{id:'new',sourceMaterialId:'source-new'}]});
  const diff=diffInvestigationCheckpoints(a,b,{sourceMaterialId:'round-context'});
  assert.equal(diff.changes.find(change=>change.type==='removed').sourceMaterialId,'source-old');
  assert.equal(diff.changes.find(change=>change.type==='added').sourceMaterialId,'source-new');
  assert.ok(diff.changes.every(change=>change.causalityInferred===false));
});

test('limits disclose truncation without modifying complete collection counts',()=>{
  const a=createInvestigationCheckpoint({id:'c'});
  const b=createInvestigationCheckpoint({id:'c',gaps:Array.from({length:50},(_,index)=>({id:'g'+index}))});
  const diff=diffInvestigationCheckpoints(a,b,{limit:2});
  assert.equal(diff.changes.length,2);
  assert.equal(diff.total,51);
  assert.equal(diff.truncated,true);
  assert.equal(diff.counts.gaps.after,50);
  assert.throws(()=>diffInvestigationCheckpoints(a,b,{limit:201}));
  assert.throws(()=>createInvestigationCheckpoint({gaps:Array.from({length:5001},()=>({}))}));
});

test('foreign or malformed snapshots cannot produce a misleading history',()=>{
  const a=createInvestigationCheckpoint({id:'a'});
  assert.throws(()=>diffInvestigationCheckpoints(a,createInvestigationCheckpoint({id:'b'})));
  assert.throws(()=>diffInvestigationCheckpoints(a,{...a,version:99}));
  assert.throws(()=>diffInvestigationCheckpoints(a,{...a,collections:{...a.collections,gaps:{count:-1}}}));
  assert.throws(()=>diffInvestigationCheckpoints(a,{...a,collections:{...a.collections,gaps:{...a.collections.gaps,count:100}}}),/Contagens incompatíveis/);
  assert.throws(()=>createInvestigationCheckpoint({gaps:[null]}));
  assert.throws(()=>diffInvestigationCheckpoints(a,a,{sourceMaterialId:{}}));
});

test('explicit excerpt selections record citation IDs and their linked note as source material',()=>{
  const before={id:'case',reporterNotes:[{id:'note-original',text:'Trecho original completo'}],materialCitations:[]};
  const after={...before,materialCitations:[{id:'citation-1',noteId:'note-original',sourceMaterialId:'different-context',excerpt:'Trecho original',start:0,end:15}]};
  const raw=JSON.stringify(after);
  const diff=diffInvestigationCheckpoints(createInvestigationCheckpoint(before),createInvestigationCheckpoint(after),{sourceMaterialId:'round-context'});
  assert.deepEqual(diff.counts.citations,{before:0,after:1,delta:1});
  const selection=diff.changes.find(change=>change.collection==='citations' && change.type==='added');
  assert.equal(selection.id,'citation-1');
  assert.equal(selection.scope,'materialCitations');
  assert.equal(selection.sourceMaterialId,'note-original');
  assert.equal(selection.causalityInferred,false);
  assert.equal(JSON.stringify(after),raw);
  assert.equal(diff.counts.notes.delta,0);
  assert.equal(diff.counts.evidence.delta,0);
});

test('removed citations retain note provenance and citation duplicates stay count-only',()=>{
  const citation={id:'citation-1',noteId:'note-a',excerpt:'Original'};
  const before=createInvestigationCheckpoint({id:'c',materialCitations:[citation]});
  const after=createInvestigationCheckpoint({id:'c'});
  const removal=diffInvestigationCheckpoints(before,after).changes.find(change=>change.type==='removed');
  assert.equal(removal.sourceMaterialId,'note-a');
  const duplicate=createInvestigationCheckpoint({id:'c',materialCitations:[citation,{...citation}]});
  const changes=diffInvestigationCheckpoints(before,duplicate).changes;
  assert.equal(changes.length,1);
  assert.equal(changes[0].type,'count');
  assert.equal(changes[0].collection,'citations');
});

test('manual classification as hypothesis, source or gap records only explicit new identities and provenance',()=>{
  for(const [collection,field] of [['hypotheses','hypotheses'],['sources','sources'],['gaps','gaps']]) {
    for(const origin of ['originMaterialId','originNoteId']) {
      const before={id:'case',reporterNotes:[{id:'note-classified',text:'Material original'}]};
      const after={...before,[field]:[{id:'record-created',[origin]:'note-classified',text:'Texto classificado manualmente'}]};
      const raw=JSON.stringify(after);
      const diff=diffInvestigationCheckpoints(createInvestigationCheckpoint(before),createInvestigationCheckpoint(after));
      assert.deepEqual(diff.counts[collection],{before:0,after:1,delta:1});
      const added=diff.changes.find(change=>change.collection===collection && change.type==='added');
      assert.equal(added.id,'record-created');
      assert.equal(added.sourceMaterialId,'note-classified');
      assert.equal(added.causalityInferred,false);
      assert.equal(diff.counts.evidence.delta,0);
      assert.equal(JSON.stringify(after),raw);
    }
  }
});
