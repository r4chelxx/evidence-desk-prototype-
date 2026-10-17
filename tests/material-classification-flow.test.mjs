import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createInvestigationCheckpoint, diffInvestigationCheckpoints } from '../investigation-changes.mjs';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const extract=name=>{const start=source.indexOf('function '+name+'(');return source.slice(start,source.indexOf('\nfunction ',start+1));};
const code=['materialChangeSummary','recordMaterialChange','bindNoteClassification'].map(extract).join('\n');
function setup(kind,saved=true) {
  const note={id:'note-1',text:'  Material com redação exata. ',verificationStatus:'unverified',materialOrigin:'Documento indicado pela repórter'};
  const item={id:'case',reporterNotes:[note],hypotheses:[],gaps:[],sources:[],materialChangeEvents:[],verifiedEvidence:[],evidence:[],updatedAt:'2026-10-16'};
  const button={dataset:{noteId:note.id,kind},addEventListener(_type,fn){this.click=fn;}};
  const state={renders:0,alerts:[]};
  const context=vm.createContext({document:{querySelectorAll:()=>[button]},getCurrentInvestigation:()=>item,createInvestigationCheckpoint,diffInvestigationCheckpoints,crypto:globalThis.crypto,todayIsoDate:()=> '2026-10-17',saveInvestigations:()=>saved,renderInvestigation:()=>{state.renders++;},window:{alert:message=>state.alerts.push(message)}});
  vm.runInContext(code+'\nbindNoteClassification();',context);
  return {item,note,button,state};
}

test('real classification handler records each manual type with localized count summary and material provenance',()=>{
  for(const [kind,collection,label,field] of [['hypothesis','hypotheses','Hipóteses','text'],['gap','gaps','Lacunas','description'],['source','sources','Fontes','name']]) {
    const env=setup(kind);
    env.button.click();
    assert.equal(env.item[collection].length,1);
    assert.equal(env.item[collection][0][field],env.note.text);
    assert.equal(env.item[collection][0].originMaterialId,env.note.id);
    assert.equal(env.item[collection][0].originNoteId,env.note.id);
    assert.equal(env.note.classifiedAs,kind);
    assert.equal(env.note.verificationStatus,'unverified');
    assert.equal(env.item.materialChangeEvents.length,1);
    const event=env.item.materialChangeEvents[0];
    assert.equal(event.sourceMaterialId,env.note.id);
    assert.equal(event.causalityInferred,false);
    assert.match(event.summary,new RegExp(label+': 0 → 1'));
    assert.equal(event.changes.find(change=>change.type==='added' && change.collection===collection).sourceMaterialId,env.note.id);
    assert.equal(env.item.verifiedEvidence.length,0);
    assert.equal(env.item.evidence.length,0);
    assert.equal(env.state.renders,1);
    env.button.click();
    assert.equal(env.item[collection].length,1,'already-classified notes cannot create duplicate records');
    assert.equal(env.item.materialChangeEvents.length,1);
  }
});

test('real classification handler rolls back every collection, note flag and event when storage fails',()=>{
  for(const kind of ['hypothesis','gap','source']) {
    const env=setup(kind,false);
    const originals={hypotheses:env.item.hypotheses,gaps:env.item.gaps,sources:env.item.sources,events:env.item.materialChangeEvents};
    env.button.click();
    assert.equal(env.item.hypotheses,originals.hypotheses);
    assert.equal(env.item.gaps,originals.gaps);
    assert.equal(env.item.sources,originals.sources);
    assert.equal(env.item.materialChangeEvents,originals.events);
    assert.equal('classifiedAs' in env.note,false);
    assert.equal(env.note.text,'  Material com redação exata. ');
    assert.equal(env.note.verificationStatus,'unverified');
    assert.equal(env.item.updatedAt,'2026-10-16');
    assert.equal(env.item.verifiedEvidence.length,0);
    assert.equal(env.state.renders,0);
    assert.match(env.state.alerts[0],/Não foi possível salvar/);
  }
});
