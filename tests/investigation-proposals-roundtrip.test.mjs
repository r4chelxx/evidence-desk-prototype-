import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { validateInvestigationImport } from '../investigation-import.mjs';
import { buildInvestigationRadar } from '../investigation-radar.mjs';
import { suggestClaimRequirements } from '../claim-suggestions.mjs';
import { loadInvestigationStore, saveInvestigationStore } from '../investigation-storage.mjs';

const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=source.indexOf('function normalizeImportedInvestigation(');
const normalizeCode=source.slice(start,source.indexOf('\nfunction ',start+1));
function normalize(payload) {
  const context=vm.createContext({validateInvestigationImport,createEmptyInvestigation:draft=>({...draft,freshness:{},accessLaw:{},languagePlan:{}}),todayIsoDate:()=> '2026-10-17',slugify:value=>value.toLowerCase()});
  vm.runInContext(normalizeCode,context);
  return context.normalizeImportedInvestigation(payload);
}
function fixture() {
  const item={id:'original-case',title:'Caso',country:'Brasil',language:'Português',centralQuestion:'Pergunta?',claims:[{id:'claim-1',statement:'Segundo a fonte, 25% mais registros causaram a mudança.'}],gaps:[{id:'gap-a',description:'Conferir contrato',status:'Aberta'},{id:'gap-b',description:'Localizar anexo',status:'Aberta'}],actionItems:[],sources:[],verifiedEvidence:[]};
  item.radarDecisions=buildInvestigationRadar(item).proposals.map((proposal,index)=>({fingerprint:proposal.fingerprint,status:index % 2 ? 'rejected' : 'accepted',proposalId:proposal.id,basisExcerpt:proposal.basis.excerpt}));
  item.claimSuggestionDecisions=suggestClaimRequirements({claimId:'claim-1',text:item.claims[0].statement}).map((proposal,index)=>({fingerprint:proposal.fingerprint,status:index % 2 ? 'accepted' : 'rejected',claimId:'claim-1',basisExcerpt:proposal.basisExcerpt}));
  return item;
}

test('portable and full backup imports preserve accepted/rejected fingerprints and suppression despite a new case ID',()=>{
  for(const schema of ['evidence-desk-investigation-v0.1','evidence-desk-complete-backup-v1']) {
    const original=fixture();
    const payload=JSON.parse(JSON.stringify({schema,investigation:original,...(schema==='evidence-desk-complete-backup-v1' ? {attachments:[]} : {})}));
    const imported=normalize(payload);
    assert.notEqual(imported.id,original.id);
    assert.deepEqual(imported.radarDecisions,original.radarDecisions);
    assert.deepEqual(imported.claimSuggestionDecisions,original.claimSuggestionDecisions);
    assert.equal(buildInvestigationRadar(imported).total,0);
    const proposals=suggestClaimRequirements({claimId:'claim-1',text:imported.claims[0].statement,decisions:imported.claimSuggestionDecisions});
    assert.equal(proposals.some(proposal=>original.claimSuggestionDecisions.some(decision=>decision.fingerprint===proposal.fingerprint)),false);
  }
});

test('versioned browser storage roundtrip keeps decisions and only changed recorded bases resurface',()=>{
  const original=normalize({schema:'evidence-desk-investigation-v0.1',investigation:fixture()});
  const values=new Map();
  const storage={getItem:key=>values.get(key) ?? null,setItem:(key,value)=>values.set(key,value)};
  assert.equal(saveInvestigationStore(storage,'cases',[original]).saved,true);
  const recovered=loadInvestigationStore(storage,'cases').investigations[0];
  assert.deepEqual(recovered.radarDecisions,original.radarDecisions);
  assert.equal(buildInvestigationRadar(recovered).total,0);
  recovered.gaps[0].description+=' · nova informação';
  const next=buildInvestigationRadar(recovered);
  assert.equal(next.total,1);
  assert.equal(next.proposals[0].gapId,'gap-a');
});

test('invalid imported proposal decisions fail validation rather than silently clearing editorial memory',()=>{
  for(const field of ['radarDecisions','claimSuggestionDecisions']) {
    for(const invalid of [{status:'accepted',fingerprint:''},{status:'pending',fingerprint:'prior'},{status:'rejected',fingerprint:42}]) {
      const item=fixture(); item[field]=[invalid];
      const before=JSON.stringify(item);
      assert.throws(()=>validateInvestigationImport({schema:'evidence-desk-investigation-v0.1',investigation:item}),/Decisão/);
      assert.equal(JSON.stringify(item),before);
    }
  }
});
