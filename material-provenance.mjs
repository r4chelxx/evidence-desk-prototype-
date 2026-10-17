// Material registration records provenance, never an evidentiary conclusion.
const KINDS = new Set(['note', 'document', 'response', 'lead']);
const METADATA_FIELDS = ['id', 'investigationId', 'name', 'type', 'size', 'sha256', 'lastModified', 'createdAt'];

function metadataSnapshot(attachment) {
  const snapshot = {};
  for (const field of METADATA_FIELDS) {
    const value = attachment?.[field];
    if (typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)) || value === null) snapshot[field] = value;
  }
  return snapshot;
}

export function createMaterialRecord({ text = '', kind = 'note', origin = null, attachment = null,
  id = 'note-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)),
  createdAt = new Date().toISOString() } = {}) {
  if (typeof text !== 'string' || !KINDS.has(kind)) throw new Error('Material inválido.');
  if (origin !== null && typeof origin !== 'string') throw new Error('Origem inválida.');
  if (typeof id !== 'string' || !id.trim() || typeof createdAt !== 'string' || !Number.isFinite(Date.parse(createdAt))) throw new Error('Identificação do material inválida.');
  if (attachment !== null && (typeof attachment !== 'object' || typeof attachment.id !== 'string' || !attachment.id.trim() || typeof attachment.name !== 'string' || !Number.isSafeInteger(attachment.size) || attachment.size <= 0)) throw new Error('Referência de anexo inválida.');
  if (!text.trim() && !attachment) throw new Error('Informe um texto ou anexo.');
  return {
    id, createdAt, version: 1, text: text.trim(), materialKind: kind,
    materialOrigin: origin?.trim() || null, verificationStatus: 'unverified',
    ...(attachment ? { attachmentId: attachment.id, attachmentStatus: 'available', originalAttachment: metadataSnapshot(attachment) } : {})
  };
}

function sameFile(original, restored) {
  if (!original || !restored || typeof restored.id !== 'string' || !restored.id ||
      typeof original.name !== 'string' || !Number.isSafeInteger(original.size) || original.size <= 0 ||
      original.name !== restored.name || original.size !== restored.size) return false;
  if (original.type && restored.type && original.type !== restored.type) return false;
  // A recorded checksum must survive restore; a missing checksum is not a match.
  if (original.sha256 && original.sha256 !== restored.sha256) return false;
  return true;
}

/**
 * Bundle restoration preserves export order. Equal-length legacy collections can
 * therefore be paired by position, after checking file identity. Newer restorers
 * may instead supply originalId on each restored metadata entry. Ambiguous or
 * unknown references remain explicitly missing, never linked by filename alone.
 * The originalAttachment snapshot always describes the historical original.
 */
export function remapMaterialAttachments(notes = [], oldMetadata = [], restoredMetadata = []) {
  if (!Array.isArray(notes) || !Array.isArray(oldMetadata) || !Array.isArray(restoredMetadata)) throw new Error('Referências de materiais inválidas.');
  const oldById = new Map();
  const newById = new Map();
  for (const entry of oldMetadata) {
    if (entry && typeof entry.id === 'string') oldById.set(entry.id, oldById.has(entry.id) ? null : entry);
  }
  for (const entry of restoredMetadata) {
    if (entry && typeof entry.id === 'string') newById.set(entry.id, newById.has(entry.id) ? null : entry);
  }
  const mappings = new Map();
  const explicit = restoredMetadata.some(entry => typeof entry?.originalId === 'string');
  for (let index = 0; index < restoredMetadata.length; index++) {
    const restored = restoredMetadata[index];
    const oldId = explicit ? restored?.originalId : oldMetadata.length === restoredMetadata.length ? oldMetadata[index]?.id : undefined;
    if (typeof oldId !== 'string') continue;
    const original = oldById.get(oldId);
    const valid = newById.get(restored?.id) && sameFile(original, restored);
    mappings.set(oldId, mappings.has(oldId) ? null : valid ? restored.id : null);
  }
  return notes.map(note => {
    if (!note || typeof note !== 'object' || Array.isArray(note) || typeof note.attachmentId !== 'string') return note;
    const original = oldById.get(note.attachmentId);
    const attachmentId = mappings.get(note.attachmentId);
    // A note's own snapshot can expose a mismatch in corrupted imported metadata.
    const snapshotMatches = !note.originalAttachment || sameFile(note.originalAttachment, original);
    return {
      ...note,
      ...(note.originalAttachment ? { originalAttachment: metadataSnapshot(note.originalAttachment) } : original ? { originalAttachment: metadataSnapshot(original) } : {}),
      attachmentId: attachmentId && snapshotMatches ? attachmentId : note.attachmentId,
      attachmentStatus: attachmentId && snapshotMatches ? 'available' : 'missing'
    };
  });
}
