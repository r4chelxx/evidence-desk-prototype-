// Manually selected note excerpts preserve provenance, never evidentiary approval.
export const MAX_CITATION_SOURCE_LENGTH = 100000;
export const MAX_CITATION_LOCATOR_LENGTH = 500;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonempty = value => typeof value === 'string' && Boolean(value.trim());
const allowedFields = new Set(['id','version','noteId','text','start','end','sourceText','locator','verificationStatus','createdAt','updatedAt','attachmentId','originalAttachmentId','sha256']);
const validHash = value => typeof value === 'string' && /^[a-f\d]{64}$/i.test(value);

function validBoundary(text, offset) {
  if (offset === 0 || offset === text.length) return true;
  const before = text.charCodeAt(offset - 1), after = text.charCodeAt(offset);
  return !(before >= 0xd800 && before <= 0xdbff && after >= 0xdc00 && after <= 0xdfff);
}

function validateSelection(sourceText, start, end) {
  if (typeof sourceText !== 'string' || sourceText.length > MAX_CITATION_SOURCE_LENGTH || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end > sourceText.length || !validBoundary(sourceText,start) || !validBoundary(sourceText,end)) throw new Error('Selecione um trecho válido do texto da anotação.');
  const excerpt = sourceText.slice(start,end);
  if (!excerpt.trim()) throw new Error('O trecho selecionado contém apenas espaços.');
  return excerpt;
}

function timestamp(now) {
  const value = typeof now === 'function' ? now() : now ?? new Date();
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Data do trecho inválida.');
  return date.toISOString();
}

/** Offsets use UTF-16 code units, matching textarea selectionStart/selectionEnd. */
export function createMaterialCitation(note, { start, end, locator = null } = {}, { id = 'citation-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2)), now } = {}) {
  if (!object(note) || !nonempty(note.id) || !nonempty(id)) throw new Error('Anotação ou identificação do trecho inválida.');
  const text = validateSelection(note.text,start,end);
  const time = timestamp(now);
  const citation = {
    id, version: 1, noteId: note.id, text, start, end, sourceText: note.text, locator,
    verificationStatus: 'unverified', createdAt: time, updatedAt: time,
    ...(note.attachmentId ? { attachmentId: note.attachmentId } : {}),
    ...(note.attachmentId && note.originalAttachment?.id ? { originalAttachmentId: note.originalAttachment.id } : {}),
    ...(note.attachmentId && note.originalAttachment?.sha256 ? { sha256: note.originalAttachment.sha256 } : {})
  };
  return validateMaterialCitation(citation, { notes: [note] });
}

/**
 * Pure structural/import validation; returns the same object or throws.
 * Optional notes checks the live note link as well as the exact saved snapshot.
 * No original file bytes are read, and a valid excerpt is still unverified.
 */
export function validateMaterialCitation(citation, { notes } = {}) {
  if (!object(citation) || Object.keys(citation).some(key => !allowedFields.has(key)) || citation.version !== 1 || !nonempty(citation.id) || !nonempty(citation.noteId) || citation.verificationStatus !== 'unverified') throw new Error('Registro de trecho citável inválido.');
  const excerpt = validateSelection(citation.sourceText,citation.start,citation.end);
  if (citation.text !== excerpt) throw new Error('O trecho não corresponde à seleção exata da anotação.');
  if (citation.locator !== null && (typeof citation.locator !== 'string' || citation.locator.length > MAX_CITATION_LOCATOR_LENGTH)) throw new Error('Localizador do trecho inválido.');
  for (const field of ['createdAt','updatedAt']) if (typeof citation[field] !== 'string' || !Number.isFinite(Date.parse(citation[field]))) throw new Error('Data do trecho inválida.');
  for (const field of ['attachmentId','originalAttachmentId']) if (field in citation && !nonempty(citation[field])) throw new Error('Referência de original inválida.');
  if ('sha256' in citation && !validHash(citation.sha256)) throw new Error('Identificação SHA-256 do original inválida.');
  if (('sha256' in citation || 'originalAttachmentId' in citation) && !citation.attachmentId) throw new Error('Original do trecho não identificado.');
  if (notes !== undefined) {
    if (!Array.isArray(notes)) throw new Error('Lista de anotações inválida.');
    const matches = notes.filter(note => object(note) && note.id === citation.noteId);
    if (matches.length !== 1) throw new Error('Anotação de origem ausente ou ambígua.');
    const note = matches[0];
    if (note.text !== citation.sourceText) throw new Error('A anotação de origem mudou; revise o trecho selecionado.');
    if (citation.attachmentId && citation.attachmentId !== note.attachmentId) throw new Error('O original vinculado não corresponde à anotação.');
    if (citation.originalAttachmentId && citation.originalAttachmentId !== note.originalAttachment?.id) throw new Error('A referência histórica do original não corresponde à anotação.');
    if (citation.sha256 && citation.sha256 !== note.originalAttachment?.sha256) throw new Error('A identificação do original não corresponde à anotação.');
  }
  return citation;
}
