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
      let result;
      request.onsuccess = () => { result = request.result; };
      transaction.oncomplete = () => resolve(result);
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

export async function exportAttachmentBundle(investigationId, metadata = []) {
  const files = [];
  for (const entry of metadata) {
    const record = await readAttachment(entry.id, investigationId);
    if (!record) throw new Error('Anexo ausente: ' + entry.name + '. Backup interrompido para evitar arquivo incompleto.');
    const buffer = await record.blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    files.push({ name: record.name, type: record.type, size: record.size, createdAt: record.createdAt, base64: btoa(binary) });
  }
  return files;
}
export async function restoreAttachmentBundle(investigationId, files = []) {
  if (!Array.isArray(files)) throw new Error('Pacote de anexos inválido.');
  const restored = [];
  try {
    for (const file of files) {
      if (!file || typeof file.base64 !== 'string' || typeof file.name !== 'string') throw new Error('Anexo inválido.');
      if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > MAX_ATTACHMENT_BYTES) throw new Error('Invalid backup size');
      if (file.base64.length > Math.ceil(MAX_ATTACHMENT_BYTES / 3) * 4 + 8) throw new Error('Backup attachment exceeds encoded size limit');
      const binary = atob(file.base64);
      const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      if (bytes.length !== file.size) throw new Error('Tamanho do anexo não corresponde ao backup: ' + file.name);
      const blob = new File([bytes], file.name, { type: file.type || 'application/octet-stream' });
      restored.push(await storeAttachment(investigationId, blob));
    }
    return restored;
  } catch (error) {
    await Promise.allSettled(restored.map(entry => deleteAttachment(entry.id, investigationId)));
    throw error;
  }
}
