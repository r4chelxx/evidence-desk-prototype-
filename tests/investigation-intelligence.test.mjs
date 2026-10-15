import test from "node:test";
import assert from "node:assert/strict";
import { analyzeInvestigation, appendMethodEvent, detectContradictions } from "../investigation-intelligence.mjs";

test("graph retains valid edges and exposes unlinked evidence", () => {
 const result = analyzeInvestigation({ sources:[{id:"s"}], evidence:[{id:"e",source_id:"s"},{id:"orphan"}], claims:[{id:"c"}], evidenceRelations:[{evidence_id:"e",claim_id:"c",relation:"supports"},{evidence_id:"missing",claim_id:"c",relation:"supports"}] });
 assert.equal(result.graph.edges.length,2);
 assert.deepEqual(result.graph.unlinked,["evidence:orphan"]);
 assert.equal(result.claims[0].status,"needs-evidence");
});
test("conflicts require identical variable, period, scope and unit", () => {
 const base={variable:"budget",period:"2025",scope:"city",unit:"BRL"};
 assert.equal(detectContradictions({observations:[{...base,id:"a",value:2},{...base,id:"b",value:3,unit:"USD"}]}).length,0);
 assert.equal(detectContradictions({observations:[{...base,id:"a",value:2},{...base,id:"b",value:3}]}).length,1);
});
test("contradictions block unqualified claim readiness and propose review", () => {
 const result=analyzeInvestigation({claims:[{id:"c"}],evidence:[{id:"e"}],evidenceRelations:[{claim_id:"c",evidence_id:"e",relation:"contradicts"}]});
 assert.equal(result.claims[0].status,"contradicted");
 assert.ok(result.proposedActions.every(action=>action.requiresReporterApproval));
});
test("methodological events reject duplicates and do not mutate previous history", () => {
 const initial=[{id:"1",timestamp:"2026-10-15",actor:"reporter",type:"review"}];
 const next=appendMethodEvent(initial,{id:"2",timestamp:"2026-10-16",actor:"reporter",type:"decision"});
 assert.equal(initial.length,1);
 assert.equal(next.length,2);
 assert.throws(()=>appendMethodEvent(next,next[0]),/Duplicate/);
});
