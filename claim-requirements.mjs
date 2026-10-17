// Reporter-authored requirements describe what to investigate. Coverage is never proof.
const statuses = new Set(['open', 'partial', 'documented']);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const list = value => Array.isArray(value) ? value : [];
const nonempty = value => typeof value === 'string' && Boolean(value.trim());

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now ?? new Date();
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Data do requisito inválida.');
  return date.toISOString();
}

function fields(input) {
  if (!object(input) || !nonempty(input.text)) throw new Error('Descreva o requisito da afirmação.');
  const { text, kind = 'document', status = 'open', evidenceIds = [], notes = '' } = input;
  if (!nonempty(kind) || !statuses.has(status) || typeof notes !== 'string' || !Array.isArray(evidenceIds) || evidenceIds.some(id => !nonempty(id))) throw new Error('Campos do requisito inválidos.');
  const ids = [...new Set(evidenceIds)];
  if (status === 'documented' && !ids.length) throw new Error('Vincule um documento antes de marcar o requisito como documentado.');
  // Keep the reporter's wording verbatim; no inferred requirements or classifications.
  return { text, kind, status, evidenceIds: ids, notes };
}

export function createClaimRequirement(input, { id = 'requirement-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)), now } = {}) {
  if (!nonempty(id)) throw new Error('Identificador do requisito inválido.');
  const time = timestamp(now);
  return { id, ...fields(input), createdAt: time, updatedAt: time };
}

export function updateClaimRequirement(requirement, patch, { now } = {}) {
  if (!object(requirement) || !nonempty(requirement.id) || !nonempty(requirement.createdAt) || !Number.isFinite(Date.parse(requirement.createdAt)) || !object(patch)) throw new Error('Requisito inválido.');
  return { id: requirement.id, ...fields({ ...requirement, ...patch }), createdAt: requirement.createdAt, updatedAt: timestamp(now) };
}

function uniqueRecords(records) {
  const byId = new Map();
  for (const record of list(records)) {
    if (nonempty(record?.id)) byId.set(record.id, byId.has(record.id) ? null : record);
  }
  return byId;
}

function documentedEvidence(record) {
  if (!record) return false;
  // The adapted evidence collection contains explicitly registered verifiedEvidence.
  // Respect an explicit contrary verification flag if present in imported records.
  if (record.verified === false) return false;
  if (record.verification_status !== undefined && !['verified', 'verificado', 'verificada', 'validated', 'validado', 'validada', 'documented', 'documentado', 'documentada'].includes(String(record.verification_status).toLocaleLowerCase())) return false;
  return !['planned', 'unverified', 'a verificar', 'planejado', 'planejada'].includes(String(record.status || '').toLocaleLowerCase());
}

/** Assess only explicit links into an adapted case's verified evidence collection. */
export function assessClaimRequirements(requirements = [], caseData = {}) {
  const evidence = uniqueRecords(caseData?.evidence);
  const sources = uniqueRecords(caseData?.sources);
  const assessed = list(requirements).map(requirement => {
    const ids = [...new Set(list(requirement?.evidenceIds).filter(nonempty))];
    const linkedEvidenceIds = ids.filter(id => {
      const record = evidence.get(id);
      return documentedEvidence(record) && nonempty(record.source_id) && Boolean(sources.get(record.source_id));
    });
    const missingEvidenceIds = ids.filter(id => !linkedEvidenceIds.includes(id));
    const reviewStatus = statuses.has(requirement?.status) ? requirement.status : 'open';
    const valid = object(requirement) && nonempty(requirement.id) && nonempty(requirement.text) && statuses.has(requirement.status) && Array.isArray(requirement.evidenceIds) && requirement.evidenceIds.every(nonempty);
    const status = !valid || reviewStatus === 'open' || !linkedEvidenceIds.length ? 'open'
      : reviewStatus === 'documented' && !missingEvidenceIds.length ? 'documented' : 'partial';
    return { id: nonempty(requirement?.id) ? requirement.id : null, reviewStatus, status, linkedEvidenceIds, missingEvidenceIds, valid, editorialApproval: false };
  });
  const counts = { total: assessed.length, open: 0, partial: 0, documented: 0 };
  for (const requirement of assessed) counts[requirement.status]++;
  return { requirements: assessed, counts, hasOpenRequirements: assessed.some(requirement => requirement.status !== 'documented'), editorialApproval: false };
}
