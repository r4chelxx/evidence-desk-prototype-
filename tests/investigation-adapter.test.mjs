import test from "node:test";
import assert from "node:assert/strict";
import { adaptLegacyInvestigation, summarizeLegacyInvestigation } from "../investigation-adapter.mjs";
test("legacy evidence needs never become verified evidence", () => {
 const result=adaptLegacyInvestigation({evidenceBlocks:[{id:"b",type:"records"}],sources:[{name:"agency"}],claims:[{text:"allegation"}]});
 assert.equal(result.evidence.length,0);
 assert.equal(result.evidenceNeeds.length,1);
 assert.equal(result.sources[0].id,"source-0");
 assert.equal(summarizeLegacyInvestigation({evidenceBlocks:[{type:"records"}]}).warnings.length,1);
});
test("only explicit valid claim relations pass the adapter",()=>{
 const data=adaptLegacyInvestigation({evidenceRelations:[{claim_id:"c",evidence_id:"e",relation:"supports"},{claim_id:"c",evidence_id:"e",relation:"unknown"}]});
 assert.equal(data.evidenceRelations.length,1);
});
