import { updateClaimRequirement } from './claim-requirements.mjs?v=20261017-reverse1';
import { summarizeChecklist } from './lai-item-checklist.mjs?v=20261017-lai-items1';
// Validate portable investigations before touching browser storage or attachments.
const schemas = new Set(['evidence-desk-investigation-v0.1', 'evidence-desk-complete-backup-v1']);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const objectLists = ['actionItems', 'sourceDiscovery', 'transparencyLog', 'followUpDrafts', 'qaChecklist', 'processGuide', 'hypotheses', 'evidenceBlocks', 'sources', 'requests', 'requestComparisons', 'gaps', 'claims', 'localAttachments', 'evidence', 'evidenceRelations', 'methodologicalEvents', 'observations', 'quickNotes', 'verifiedEvidence', 'reporterNotes', 'methodRules', 'claimSuggestionDecisions', 'radarDecisions'];
export function validateInvestigationImport(payload, defaults = {}) {
  if (!object(payload)) throw new Error('O arquivo deve conter uma investigação.');
  if ('schema' in payload && !schemas.has(payload.schema)) throw new Error('Versão de backup não reconhecida.');
  const item = 'investigation' in payload ? payload.investigation : payload;
  if (!object(item)) throw new Error('Investigação inválida.');
  for (const field of ['title', 'country', 'language', 'centralQuestion']) {
    if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error('Campo obrigatório inválido: ' + field);
  }
  // Check the established shape recursively. Preserve extensions and old optional fields.
  function check(value, template, path) {
    if (Array.isArray(template)) {
      if (!Array.isArray(value)) throw new Error('Lista inválida: ' + path);
      if (template.length) value.forEach(entry => check(entry, template[0], path));
    } else if (object(template)) {
      if (!object(value)) throw new Error('Registro inválido: ' + path);
      for (const name of Object.keys(template)) if (name in value) check(value[name], template[name], path + '.' + name);
    } else if (typeof template === 'string' && typeof value !== 'string') {
      throw new Error('Texto inválido: ' + path);
    }
  }
  check(item, defaults, 'investigation');
  for (const field of objectLists) if (field in item && (!Array.isArray(item[field]) || item[field].some(entry => !object(entry)))) throw new Error('Lista de registros inválida: ' + field);
  for (const field of ['secondaryQuestions', 'nextReviewItems']) if (field in item && (!Array.isArray(item[field]) || item[field].some(entry => typeof entry !== 'string'))) throw new Error('Lista de textos inválida: ' + field);
  for (const field of ['claimSuggestionDecisions', 'radarDecisions']) for (const decision of item[field] || []) {
    if (typeof decision.fingerprint !== 'string' || !decision.fingerprint || !['accepted','rejected'].includes(decision.status)) throw new Error('Decisão de sugestão inválida.');
  }
  for (const request of item.requests || []) if ('itemChecklist' in request) summarizeChecklist(request.itemChecklist);
  for (const claim of item.claims || []) if ('requirements' in claim) {
    if (!Array.isArray(claim.requirements)) throw new Error('Lista de requisitos inválida.');
    const ids = new Set();
    for (const requirement of claim.requirements) {
      updateClaimRequirement(requirement, {});
      if (!Number.isFinite(Date.parse(requirement.updatedAt)) || ids.has(requirement.id)) throw new Error('Requisito com data ou identificador inválido.');
      ids.add(requirement.id);
    }
  }
  if ('id' in item && typeof item.id !== 'string') throw new Error('Identificador inválido.');
  if (payload.schema === 'evidence-desk-complete-backup-v1' && !Array.isArray(payload.attachments)) throw new Error('Lista de anexos ausente no backup completo.');
  return item;
}
