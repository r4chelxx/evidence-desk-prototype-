# Investigation Intelligence Engine — implementation contract

Status: architecture and acceptance criteria, not a claim of shipped functionality.

## Core idea
One evidence graph powers five views: living evidence map, contradiction detection, next-step recommendations, continuous claim audit, and methodological memory. Never treat procedural events or institutional statements as verified substantive claims.

## Shared entities
- Investigation: id, question, jurisdiction, owner.
- Hypothesis: id, investigation_id, text, status, created_at.
- Source: id, investigation_id, type, provenance, retrieval_at, document_hash, sensitivity.
- Evidence: id, source_id, locator (page/row/paragraph), excerpt, captured_at, verification_status.
- Claim: id, investigation_id, statement, claim_type (procedural/substantive/inference), editorial_status.
- EvidenceRelation: claim_id, evidence_id, relation (supports/contradicts/limits), rationale, reviewer_id, reviewed_at.
- Gap: id, investigation_id, target_claim_id?, description, basis_evidence_ids, severity, status.
- Action: id, investigation_id, gap_id?, proposed_step, rationale, citations, jurisdiction, legal_uncertainty, status, reviewer_id.
- DecisionEvent: id, investigation_id, timestamp, actor, entity_refs, before, after, reason, model_version?, source_hashes.

## Invariants
1. Suggestions are proposals until a reporter accepts or rejects them.
2. Every finding links to exact excerpts and provenance; absent evidence is never proof of wrongdoing.
3. Preserve conflicting records, rather than overwriting them.
4. Deadline guidance must distinguish verified protocol dates from arithmetic reference estimates.
5. No sensitive source material is sent to a provider without explicit reporter action.
6. AI failure leaves manual workflows usable.
7. Log editorial changes as append-only events; redaction and export must remain possible.

## Delivery slices and acceptance tests
### 1. Evidence map
Derive graph nodes and links from current case data, show unmapped evidence and unsubstantiated claims, filter by type and verification state. Test that every visible edge resolves to two existing entities.

### 2. Contradictions
Start with deterministic checks (same variable/period/unit but inconsistent values, conflicting status, missing requested item); add source-cited AI suggestions as a second pass. Test false positives from different units, dates, and geographic scope.

### 3. Next steps
Generate ranked, source-linked action proposals from gaps and LAI/FOIA events. Jurisdiction-specific guidance must label unverified legal assumptions. Test rejection/acceptance and no automatic dispatch.

### 4. Continuous audit
Calculate claim readiness from provenance, independent corroboration, contradictory evidence, and explicit limitations; never equate a score with truth. Test that procedural events do not automatically support substantive allegations.

### 5. Methodological memory
Record source ingestion, comparison, suggested actions and human decisions as immutable events with timestamps and version IDs. Support chronological review and redacted export. Test reproducibility and preservation of superseded assessments.

## Rollout
Ship behind a feature flag with existing mock cases; add persistence and authenticated access before multi-user pilot. Test desktop and mobile flows, keyboard navigation, empty/error states, and Portuguese/English strings. Run the repository's Node tests and conduct journalist usability sessions before calling the engine production-ready.
