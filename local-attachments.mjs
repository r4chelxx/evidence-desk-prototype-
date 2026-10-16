// Browser-local attachments. Metadata is stored with the investigation; bytes stay in IndexedDB.
const DB_NAME = 'evidence-desk-attachments-v1';
const STORE = 'files';
export const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;
export function validateAttachment(file) {
  if (!file || typeof file.name !== 'string' || !Number.isFinite(file.size)) return 'Arquivo inválido.';
  if (file.size <= 0) return 'Arquivo vazio.';
  if (file.size > MAX_ATTACHMENT_BYTES) return 'Arquivo maior que 20 MB. Nenhum dado foi salvo.';
  return null;
}
function database() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB indisponível neste navegador.'));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
async function transact(mode, operation) {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE, mode);
      const request = operation(transaction.objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error || new Error('Transação cancelada.'));
    });
  } finally { db.close(); }
}
export async function storeAttachment(investigationId, file) {
  const error = validateAttachment(file);
  if (error) throw new Error(error);
  if (!investigationId) throw new Error('Investigação não identificada.');
  const id = 'attachment-' + (globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2));
  const record = { id, investigationId: String(investigationId), name: file.name, type: file.type || 'application/octet-stream', size: file.size, createdAt: new Date().toISOString(), blob: file };
  await transact('readwrite', store => store.put(record));
  const { blob, ...metadata } = record;
  return metadata;
}
export async function readAttachment(id, investigationId) {
  const record = await transact('readonly', store => store.get(id));
  if (!record || record.investigationId !== String(investigationId)) return null;
  return record;
}
export async function deleteAttachment(id, investigationId) {
  const record = await readAttachment(id, investigationId);
  if (!record) return false;
  await transact('readwrite', store => store.delete(id));
  return true;
}
