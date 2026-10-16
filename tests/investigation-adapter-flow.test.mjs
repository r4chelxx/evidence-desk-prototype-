import test from 'node:test';
import assert from 'node:assert/strict';
import { adaptLegacyInvestigation } from '../investigation-adapter.mjs';
import { analyzeSourceIndependence, simulateEvidenceRemoval } from '../investigation-intelligence.mjs';

test('legacy adapter retains primary origins, claim-gap links, and explicit evidence links', () => {
 const legacy = { id: 'case', sources: [{id:'s1',name:'Original',primary_origin_id:'document-a'}], claims: [{id:'c1',text:'Claim'}], gaps:[{id:'g1',description:'Missing response',target_claim_id:'c1'}], verifiedEvidence:[{id:'e1',source_id:'s1'}], evidenceRelations:[{claim_id:'c1',evidence_id:'e1',relation:'supports'}], evidenceBlocks:[{type:'Requested material'}] };
 const snapshot = JSON.stringify(legacy);
 const adapted = adaptLegacyInvestigation(legacy);
 assert.equal(adapted.sources[0].primary_origin_id, 'document-a');
 assert.equal(adapted.gaps[0].target_claim_id, 'c1');
 assert.equal(adapted.evidence.length, 1);
 assert.equal(adapted.evidenceNeeds.length, 1);
 assert.equal(analyzeSourceIndependence(adapted,'c1').supportingEvidence, 1);
 assert.equal(simulateEvidenceRemoval(adapted,'e1').affectedClaims.length, 1);
 assert.equal(JSON.stringify(legacy), snapshot);
});

test('planned evidence never enters the verified evidence graph', () => {
 const adapted = adaptLegacyInvestigation({sources:[{id:'s1'}],claims:[{id:'c1'}],evidenceBlocks:[{id:'e1',source_id:'s1'}],evidenceRelations:[{claim_id:'c1',evidence_id:'e1',relation:'supports'}]});
 assert.equal(adapted.evidence.length, 0);
 assert.equal(analyzeSourceIndependence(adapted,'c1').supportingEvidence, 0);
});
