import { analyzeInvestigation } from "./investigation-intelligence.mjs";

// Conservative adapter: legacy evidence blocks describe evidence needs, not verified evidence.
const arr = value => Array.isArray(value) ? value : [];
const str = value => String(value ?? "").trim();
export function adaptLegacyInvestigation(item = {}) {
  const hypotheses = arr(item.hypotheses).map((x,i) => ({ id: str(x.id) || "hypothesis-"+i, text: str(x.text || x.title || x.hypothesis), status: x.status }));
  const sources = arr(item.sources).map((x,i) => ({ id: str(x.id) || "source-"+i, title: str(x.name || x.title), type: x.type, provenance: x.url || null, verification_status: x.status, primary_origin_id: str(x.primary_origin_id || x.original_source_id) || null }));
  const claims = arr(item.claims).map((x,i) => ({ id: str(x.id) || "claim-"+i, statement: str(x.statement || x.text || x.claim || x.title), status: x.status }));
  const gaps = arr(item.gaps).map((x,i) => ({ id: str(x.id) || "gap-"+i, description: str(x.description || x.text || x.gap || x.title), status: x.status }));
  // Only explicitly documented source-to-evidence links qualify as verified graph edges.
  const evidence = arr(item.verifiedEvidence).filter(x => x?.id && x?.source_id);
  const evidenceRelations = arr(item.evidenceRelations).filter(x => x?.claim_id && x?.evidence_id && ["supports","contradicts","limits"].includes(x.relation));
  return { id: item.id, hypotheses, sources, claims, gaps, evidence, evidenceRelations, evidenceNeeds: arr(item.evidenceBlocks), methodologicalEvents: arr(item.methodologicalEvents) };
}
export function summarizeLegacyInvestigation(item) {
  const adapted = adaptLegacyInvestigation(item);
  const analysis = analyzeInvestigation(adapted);
  return { ...analysis, evidenceNeedsCount: adapted.evidenceNeeds.length, warnings: [
    ...(adapted.evidenceNeeds.length ? ["Evidence blocks are requirements, not verified documents."] : []),
    ...(!adapted.evidenceRelations.length && adapted.claims.length ? ["Legacy claim-to-evidence links require reporter validation before graphing."] : [])
  ] };
}
