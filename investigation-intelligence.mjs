// Pure, provider-independent investigative intelligence core.
// All outputs are suggestions; never infer that an allegation is proven.
const list = (value) => Array.isArray(value) ? value : [];
const key = (value) => String(value ?? "").trim();
const unique = (items) => [...new Set(items.filter(Boolean))];

export function buildEvidenceGraph(caseData = {}) {
  const nodes = [];
  const edges = [];
  const ids = new Set();
  const add = (kind, item) => {
    const id = key(item?.id);
    if (!id || ids.has(kind + ":" + id)) return;
    ids.add(kind + ":" + id);
    nodes.push({ id: kind + ":" + id, kind, label: key(item.title || item.statement || item.text || item.description || id), status: key(item.status), source: item });
  };
  for (const [kind, field] of [["hypothesis", "hypotheses"], ["source", "sources"], ["evidence", "evidence"], ["claim", "claims"], ["gap", "gaps"]]) {
    list(caseData[field]).forEach(item => add(kind, item));
  }
  const connect = (from, to, relation) => {
    if (ids.has(from) && ids.has(to)) edges.push({ from, to, relation });
  };
  for (const item of list(caseData.evidence)) {
    connect("source:" + key(item.source_id), "evidence:" + key(item.id), "provenance");
  }
  for (const relation of list(caseData.evidenceRelations)) {
    if (!["supports", "contradicts", "limits"].includes(relation.relation)) continue;
    connect("evidence:" + key(relation.evidence_id), "claim:" + key(relation.claim_id), relation.relation);
  }
  for (const gap of list(caseData.gaps)) connect("gap:" + key(gap.id), "claim:" + key(gap.target_claim_id), "unresolved");
  return { nodes, edges, unlinked: nodes.filter(node => node.kind === "evidence" && !edges.some(edge => edge.from === node.id || edge.to === node.id)).map(node => node.id) };
}

export function detectContradictions(caseData = {}) {
  const findings = [];
  const observations = list(caseData.observations).filter(x => x && key(x.id) && key(x.variable) && key(x.period) && key(x.scope) && key(x.unit) && x.value !== undefined && x.value !== null);
  for (let i = 0; i < observations.length; i++) for (let j = i + 1; j < observations.length; j++) {
    const a = observations[i], b = observations[j];
    const sameContext = ["variable", "period", "scope", "unit"].every(field => key(a[field]).toLocaleLowerCase() === key(b[field]).toLocaleLowerCase());
    if (sameContext && key(a.value) !== key(b.value)) findings.push({
      type: "value-conflict", observationIds: [a.id, b.id], sourceIds: unique([a.source_id, b.source_id]),
      status: "requires-human-review", rationale: "Different values were recorded for the same variable, period, scope and unit; check definitions and provenance."
    });
  }
  for (const relation of list(caseData.evidenceRelations)) {
    if (relation?.relation === "contradicts" && key(relation.claim_id) && key(relation.evidence_id)) findings.push({
      type: "documented-contradiction", claimId: relation.claim_id, evidenceId: relation.evidence_id,
      status: "requires-human-review", rationale: key(relation.rationale) || "A reporter marked this evidence as contradicting the claim."
    });
  }
  return findings;
}

export function auditClaims(caseData = {}) {
  return list(caseData.claims).filter(x => key(x?.id)).map(claim => {
    const validEvidence = new Set(list(caseData.evidence).filter(e => key(e?.id) && key(e?.source_id) && list(caseData.sources).some(s => key(s?.id) === key(e.source_id))).map(e => key(e.id)));
    const relations = list(caseData.evidenceRelations).filter(r => r.claim_id === claim.id && validEvidence.has(key(r.evidence_id)));
    const supporting = relations.filter(r => r.relation === "supports");
    const contradictory = relations.filter(r => r.relation === "contradicts");
    const limiting = relations.filter(r => r.relation === "limits");
    const unresolved = list(caseData.evidenceRelations).filter(r => r.claim_id === claim.id && r.relation === "supports" && !validEvidence.has(key(r.evidence_id)));
    const status = contradictory.length ? "contradicted" : (!supporting.length || unresolved.length) ? "needs-evidence" : limiting.length ? "qualified" : "review-required";
    return { claimId: claim.id, status, supporting: supporting.length, contradictory: contradictory.length, limiting: limiting.length, unresolvedEvidenceIds: unresolved.map(r => r.evidence_id), editorialApproval: false, provenanceChecked: supporting.length > 0 && unresolved.length === 0 };
  });
}

export function suggestNextSteps(caseData = {}) {
  const actions = [];
  for (const gap of list(caseData.gaps)) {
    if (!key(gap?.id) || ["resolved", "closed"].includes(key(gap.status).toLowerCase())) continue;
    actions.push({ id: "gap:" + gap.id, gapId: gap.id, type: "investigate-gap", title: "Verify missing or incomplete evidence", rationale: key(gap.description || gap.title), sourceIds: list(gap.basis_evidence_ids), status: "proposed", requiresReporterApproval: true });
  }
  for (const finding of detectContradictions(caseData)) actions.push({ id: "conflict:" + actions.length, type: "reconcile-conflict", title: "Reconcile conflicting records", rationale: finding.rationale, sourceIds: finding.sourceIds || [], status: "proposed", requiresReporterApproval: true });
  for (const audit of auditClaims(caseData)) if (audit.status !== "review-required") actions.push({ id: "claim:" + audit.claimId, type: "review-claim", title: "Review claim evidence and caveats", rationale: audit.status, claimId: audit.claimId, sourceIds: [], status: "proposed", requiresReporterApproval: true });
  return actions;
}

export function appendMethodEvent(events = [], event = {}) {
  if (!key(event.id) || !key(event.timestamp) || !key(event.actor) || !key(event.type)) throw new Error("Event requires id, timestamp, actor and type");
  if (list(events).some(previous => previous.id === event.id)) throw new Error("Duplicate event id");
  const snapshot = JSON.parse(JSON.stringify(event));
  return [...list(events).map(item => JSON.parse(JSON.stringify(item))), snapshot];
}

export function analyzeInvestigation(caseData = {}) {
  return { graph: buildEvidenceGraph(caseData), contradictions: detectContradictions(caseData), claims: auditClaims(caseData), proposedActions: suggestNextSteps(caseData), methodologicalEvents: list(caseData.methodologicalEvents) };
}
