// Drafts are browser-local working text, independent of saved investigation material.
export const MATERIAL_DRAFT_SCHEMA = 'evidence-desk-material-draft';
export const MATERIAL_DRAFT_VERSION = 1;
const kinds = new Set(['note', 'document', 'response', 'lead']);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const emptyDraft = () => ({ text: '', kind: 'note', origin: '', attachmentId: null });

function failure(message, status = 'invalid') {
  const error = new Error(message);
  error.draftStatus = status;
  return error;
}

export function getMaterialDraftKey(caseId) {
  if (typeof caseId !== 'string' || !caseId.trim()) throw failure('Investigação do rascunho não identificada.');
  return 'evidence-desk-material-draft:' + encodeURIComponent(caseId);
}

function normalizeDraft(draft) {
  if (!object(draft)) throw failure('Rascunho inválido.');
  const result = { ...emptyDraft(), ...draft };
  if (typeof result.text !== 'string' || typeof result.origin !== 'string' || !kinds.has(result.kind) ||
      (result.attachmentId !== null && typeof result.attachmentId !== 'string')) throw failure('Campos do rascunho inválidos.');
  // Preserve typed whitespace, but never add verification, source or evidence fields.
  return { text: result.text, kind: result.kind, origin: result.origin, attachmentId: result.attachmentId?.trim() || null };
}

function decode(raw, caseId) {
  let envelope;
  try { envelope = JSON.parse(raw); } catch { throw failure('O rascunho salvo não pôde ser lido.'); }
  if (!object(envelope)) throw failure('Formato de rascunho inválido.');
  if (envelope.schema !== MATERIAL_DRAFT_SCHEMA || envelope.version !== MATERIAL_DRAFT_VERSION) throw failure('Versão de rascunho não reconhecida.', 'unsupported');
  if (envelope.caseId !== caseId) throw failure('O rascunho pertence a outra investigação.');
  return normalizeDraft(envelope.draft);
}

function read(storage, key) {
  if (typeof storage?.getItem !== 'function') throw failure('Armazenamento de rascunhos indisponível.', 'unavailable');
  return storage.getItem(key);
}

export function hasMaterialDraft(draft) {
  try {
    const normalized = normalizeDraft(draft);
    return Boolean(normalized.text.trim() || normalized.origin.trim() || normalized.attachmentId);
  } catch { return false; }
}

export function loadMaterialDraft(storage, caseId) {
  try {
    const raw = read(storage, getMaterialDraftKey(caseId));
    return raw === null ? { draft: emptyDraft(), status: 'empty', error: null } : { draft: decode(raw, caseId), status: 'loaded', error: null };
  } catch (error) {
    // Loading never removes or replaces malformed or newer data.
    return { draft: emptyDraft(), status: error.draftStatus || 'unavailable', error };
  }
}

export function saveMaterialDraft(storage, caseId, draft) {
  let key;
  let normalized;
  try {
    key = getMaterialDraftKey(caseId);
    normalized = normalizeDraft(draft);
    const previous = read(storage, key);
    if (previous !== null) decode(previous, caseId);
  } catch (error) {
    return { saved: false, blocked: true, error };
  }
  try {
    if (!hasMaterialDraft(normalized)) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, JSON.stringify({ schema: MATERIAL_DRAFT_SCHEMA, version: MATERIAL_DRAFT_VERSION, caseId, draft: normalized }));
    }
    return { saved: true, blocked: false, error: null };
  } catch (error) {
    // localStorage writes/removals are atomic. Keep the previous draft on failure.
    return { saved: false, blocked: false, error };
  }
}

// Call after a successful material save or an explicit user request to discard.
export function clearMaterialDraft(storage, caseId) {
  try {
    storage.removeItem(getMaterialDraftKey(caseId));
    return { saved: true, blocked: false, error: null };
  } catch (error) {
    return { saved: false, blocked: false, error };
  }
}
