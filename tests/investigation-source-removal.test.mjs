import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateSourceRemoval, simulateEvidenceRemoval } from '../investigation-intelligence.mjs';

function caseData() {
  return {
    sources:[{id:'source-a'},{id:'source-b'},{id:'source-unused'}],
    claims:[{id:'shared-1'},{id:'shared-2'},{id:'unrelated'}],
    evidence:[{id:'doc-a',source_id:'source-a'},{id:'doc-b',source_id:'source-b'}],
    evidenceRelations:[
      {claim_id:'shared-1',evidence_id:'doc-a',relation:'supports'},
      {claim_id:'shared-2',evidence_id:'doc-a',relation:'supports'},
      {claim_id:'shared-2',evidence_id:'doc-b',relation:'supports'},
      {claim_id:'unrelated',evidence_id:'doc-b',relation:'supports'},
    ],
    requests:[{id:'request-1',title:'Pedido preservado'}],
  };
}

test('removing a source exposes all shared claims while retaining unrelated support', () => {
  const original = caseData();
  const before = JSON.stringify(original);
  const result = simulateSourceRemoval(original,'source-a');
  assert.equal(result.found,true);
  assert.equal(result.hypothetical,true);
  assert.deepEqual(result.removedEvidenceIds,['doc-a']);
  assert.deepEqual(result.affectedClaims.map(claim=>claim.claimId),['shared-1','shared-2']);
  for (const claim of result.affectedClaims) {
    assert.equal(claim.lostSupportingLinks,1);
    assert.equal(claim.after.status,'needs-evidence');
    assert.equal(claim.after.editorialApproval,false);
    assert.deepEqual(claim.after.unresolvedEvidenceIds,['doc-a']);
  }
  assert.equal(result.affectedClaims[1].after.supporting,1);
  assert.equal(JSON.stringify(original),before);
});

test('single-document source produces the same claim impacts as evidence removal', () => {
  const original=caseData();
  assert.deepEqual(simulateSourceRemoval(original,'source-a').affectedClaims,simulateEvidenceRemoval(original,'doc-a').affectedClaims);
});

test('source removal includes all its documents and counts relation impacts once per evidence link', () => {
  const original=caseData();
  original.evidence.push({id:'doc-a-2',source_id:'source-a'},{id:'doc-a',source_id:'source-a'});
  original.evidenceRelations.push({claim_id:'shared-1',evidence_id:'doc-a-2',relation:'supports'});
  const result=simulateSourceRemoval(original,'source-a');
  assert.deepEqual(result.removedEvidenceIds,['doc-a','doc-a-2']);
  assert.equal(result.affectedClaims.find(claim=>claim.claimId==='shared-1').lostSupportingLinks,2);
  assert.equal(result.affectedClaims.find(claim=>claim.claimId==='shared-2').lostSupportingLinks,1);
});

test('removing contradictory and limiting documents requires review rather than editorial approval', () => {
  const original={
    sources:[{id:'warning-source'},{id:'support-source'}],
    claims:[{id:'contradicted'},{id:'limited'}],
    evidence:[{id:'support',source_id:'support-source'},{id:'counter',source_id:'warning-source'},{id:'limit',source_id:'warning-source'}],
    evidenceRelations:[
      {claim_id:'contradicted',evidence_id:'support',relation:'supports'},
      {claim_id:'limited',evidence_id:'support',relation:'supports'},
      {claim_id:'contradicted',evidence_id:'counter',relation:'contradicts'},
      {claim_id:'limited',evidence_id:'limit',relation:'limits'},
    ],
  };
  const result=simulateSourceRemoval(original,'warning-source');
  assert.deepEqual(result.removedEvidenceIds,['counter','limit']);
  assert.equal(result.affectedClaims[0].before.status,'contradicted');
  assert.equal(result.affectedClaims[0].after.contradictory,0);
  assert.equal(result.affectedClaims[1].before.status,'qualified');
  assert.equal(result.affectedClaims[1].after.limiting,0);
  for (const claim of result.affectedClaims) {
    assert.equal(claim.after.status,'review-required');
    assert.equal(claim.after.editorialApproval,false);
    assert.equal(claim.lostSupportingLinks,0);
  }
});

test('unrelated contradictions and limits remain after a different source disappears', () => {
  const original=caseData();
  original.evidenceRelations.push({claim_id:'shared-2',evidence_id:'doc-b',relation:'contradicts'},{claim_id:'shared-2',evidence_id:'doc-b',relation:'limits'});
  const changed=simulateSourceRemoval(original,'source-a').affectedClaims.find(claim=>claim.claimId==='shared-2');
  assert.equal(changed.after.status,'contradicted');
  assert.equal(changed.after.contradictory,1);
  assert.equal(changed.after.limiting,1);
});

test('an existing source without evidence is found and produces no hypothetical claim changes', () => {
  assert.deepEqual(simulateSourceRemoval(caseData(),'source-unused'),{found:true,sourceId:'source-unused',hypothetical:true,removedEvidenceIds:[],affectedClaims:[]});
});

test('unknown or empty IDs never remove orphan evidence or change the original', () => {
  const original=caseData();
  original.evidence.push({id:'orphan',source_id:'unknown'});
  const before=JSON.stringify(original);
  for (const id of ['unknown','',null]) {
    const result=simulateSourceRemoval(original,id);
    assert.equal(result.found,false);
    assert.deepEqual(result.removedEvidenceIds,[]);
    assert.deepEqual(result.affectedClaims,[]);
  }
  assert.equal(JSON.stringify(original),before);
  assert.equal(simulateSourceRemoval().found,false);
});

test('frozen inputs are supported without rewriting requests, sources or evidence', () => {
  const original=caseData();
  for (const list of Object.values(original)) { list.forEach(Object.freeze); Object.freeze(list); }
  Object.freeze(original);
  assert.equal(simulateSourceRemoval(original,' source-a ').sourceId,'source-a');
  assert.equal(original.requests[0].title,'Pedido preservado');
  assert.equal(original.sources.length,3);
  assert.equal(original.evidence.length,2);
});
