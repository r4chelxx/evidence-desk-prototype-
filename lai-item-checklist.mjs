// Each requested item is entered and reviewed by a reporter. No sentence splitting,
// response interpretation, legal conclusion, or claim support is inferred here.
export const CHECKLIST_STATUSES = Object.freeze(['pending', 'answered', 'partial', 'missing', 'denied']);
const editable = new Set(['requestedText', 'status', 'responseExcerpt', 'locator', 'notes', 'targetClaimId']);
const stored = new Set(['id', ...editable, 'createdAt', 'updatedAt', 'reviewedAt']);
const gapStatuses = new Set(['partial', 'missing', 'denied']);
const limits = { requestedText: 12000, responseExcerpt: 20000, locator: 2000, notes: 12000 };

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function checkFields(value, allowed) {
  if (!object(value)) throw new Error('O item deve ser um registro.');
  for (const field of Object.keys(value)) if (!allowed.has(field)) throw new Error('Campo não permitido: ' + field);
}

function identifier(value, field) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(value)) throw new Error('Identificador inválido: ' + field);
}

function timestamp(value) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) throw new Error('Data de revisão inválida.');
  return value;
}

function validate(item) {
  checkFields(item, stored);
  identifier(item.id, 'id');
  for (const [field, max] of Object.entries(limits)) {
    if (typeof item[field] !== 'string' || item[field].length > max) throw new Error('Texto inválido ou extenso demais: ' + field);
  }
  if (!item.requestedText.trim()) throw new Error('Copie o texto do item solicitado.');
  if (!CHECKLIST_STATUSES.includes(item.status)) throw new Error('Situação do item inválida.');
  if (item.targetClaimId !== null) identifier(item.targetClaimId, 'targetClaimId');
  for (const field of ['createdAt', 'updatedAt']) timestamp(item[field]);
  if (item.reviewedAt !== null) timestamp(item.reviewedAt);
  if (item.status !== 'pending' && item.reviewedAt === null) throw new Error('A avaliação precisa de uma data de revisão.');
  if (item.status === 'answered' && ![item.responseExcerpt, item.locator, item.notes].some(text => text.trim())) {
    throw new Error('Registre um trecho, localizador ou nota de revisão para marcar o item como respondido.');
  }
  return item;
}

export function createChecklistItem(input, options = {}) {
  checkFields(input, editable);
  const now = timestamp(options.now ?? new Date().toISOString());
  const status = Object.hasOwn(input, 'status') ? input.status : 'pending';
  return validate({
    id: Object.hasOwn(options, 'id') ? options.id : `request-item-${globalThis.crypto.randomUUID()}`,
    requestedText: input.requestedText,
    status,
    responseExcerpt: Object.hasOwn(input, 'responseExcerpt') ? input.responseExcerpt : '',
    locator: Object.hasOwn(input, 'locator') ? input.locator : '',
    notes: Object.hasOwn(input, 'notes') ? input.notes : '',
    targetClaimId: Object.hasOwn(input, 'targetClaimId') ? input.targetClaimId : null,
    createdAt: now,
    updatedAt: now,
    reviewedAt: status === 'pending' ? null : now,
  });
}

export function updateChecklistItem(item, patch, options = {}) {
  validate(item);
  checkFields(patch, editable);
  const now = timestamp(options.now ?? new Date().toISOString());
  // Calling this function is an explicit reporter review, including returning to pending.
  return validate({ ...item, ...patch, updatedAt: now, reviewedAt: now });
}

export function summarizeChecklist(items) {
  if (!Array.isArray(items)) throw new Error('A lista de itens é inválida.');
  const summary = { total: items.length, pending: 0, answered: 0, partial: 0, missing: 0, denied: 0, unresolved: 0 };
  const ids = new Set();
  for (const item of items) {
    validate(item);
    if (ids.has(item.id)) throw new Error('Identificador de item repetido.');
    ids.add(item.id);
    summary[item.status] += 1;
    if (item.status !== 'answered') summary.unresolved += 1;
  }
  return summary;
}

export function canTrackGap(item) {
  validate(item);
  return gapStatuses.has(item.status);
}

export function getChecklistGapCandidates(items) {
  summarizeChecklist(items);
  const reasons = {
    partial: 'A revisão manual registrou atendimento parcial deste item.',
    missing: 'A revisão manual registrou que este item não foi localizado na resposta revisada.',
    denied: 'A revisão manual registrou uma negativa para este item.',
  };
  return items.filter(canTrackGap).map(item => ({
    itemId: item.id,
    requestedText: item.requestedText,
    status: item.status,
    responseExcerpt: item.responseExcerpt,
    locator: item.locator,
    notes: item.notes,
    targetClaimId: item.targetClaimId,
    reason: reasons[item.status],
    limitation: 'Pendência de apuração registrada pela pessoa responsável; não comprova irregularidade nem sustenta automaticamente uma afirmação.',
  }));
}
