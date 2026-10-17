// Browser persistence is deliberately separate from portable single-case backups.
import { validateInvestigationImport } from './investigation-import.mjs?v=20261017-reverse1';

export const INVESTIGATION_STORE_SCHEMA = 'evidence-desk-investigations';
export const INVESTIGATION_STORE_VERSION = 1;
export const getInvestigationBackupKey = key => `${key}:previous-valid`;
export const getInvestigationRecoveryKey = key => `${key}:recovery-original`;
const clone = value => JSON.parse(JSON.stringify(value));

function validateItems(items) {
  if (!Array.isArray(items)) throw new Error('A lista de investigações é inválida.');
  const ids = new Set();
  for (const item of items) {
    validateInvestigationImport(item);
    if (typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) {
      throw new Error('Há investigações com identificadores inválidos ou repetidos.');
    }
    ids.add(item.id);
  }
  return items;
}

function decode(raw) {
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return { investigations: validateItems(parsed), source: 'legacy' };
  if (!parsed || typeof parsed !== 'object' || parsed.schema !== INVESTIGATION_STORE_SCHEMA || parsed.version !== INVESTIGATION_STORE_VERSION) {
    throw new Error('Formato ou versão de armazenamento não reconhecido.');
  }
  return { investigations: validateItems(parsed.investigations), source: 'versioned' };
}

function read(storage, key) {
  if (!storage || typeof storage.getItem !== 'function') throw new Error('O armazenamento do navegador está indisponível.');
  return storage.getItem(key);
}

function validBackup(storage, key) {
  try {
    const raw = read(storage, getInvestigationBackupKey(key));
    return raw === null ? null : { raw, ...decode(raw) };
  } catch {
    return null;
  }
}

export function loadInvestigationStore(storage, key, seeds = []) {
  try {
    const raw = read(storage, key);
    if (raw === null) return { investigations: clone(validateItems(seeds)), blocked: false, error: null, source: 'seed', recoveryAvailable: Boolean(validBackup(storage, key)) };
    return { ...decode(raw), blocked: false, error: null, recoveryAvailable: Boolean(validBackup(storage, key)) };
  } catch (error) {
    // Never fall back to examples or silently promote a backup over the original.
    return { investigations: [], blocked: true, error, source: 'unavailable', recoveryAvailable: Boolean(validBackup(storage, key)) };
  }
}

export function saveInvestigationStore(storage, key, investigations) {
  let raw;
  let serialized;
  try {
    validateItems(investigations);
    serialized = JSON.stringify({ schema: INVESTIGATION_STORE_SCHEMA, version: INVESTIGATION_STORE_VERSION, savedAt: new Date().toISOString(), investigations });
    // Serialization can change unsupported JavaScript values; validate the actual write.
    decode(serialized);
    raw = read(storage, key);
    if (raw !== null) decode(raw);
  } catch (error) {
    return { saved: false, blocked: true, error };
  }

  let backupError = null;
  if (raw !== null) {
    try {
      storage.setItem(getInvestigationBackupKey(key), raw);
    } catch (error) {
      // Backup quota must not prevent saving a smaller current investigation set.
      backupError = error;
    }
  }
  try {
    // localStorage.setItem is atomic: a failed write leaves the old value intact.
    storage.setItem(key, serialized);
    return { saved: true, blocked: false, error: null, backupError };
  } catch (error) {
    return { saved: false, blocked: false, error, backupError };
  }
}

export function recoverInvestigationStore(storage, key) {
  const backup = validBackup(storage, key);
  if (!backup) return { saved: false, blocked: true, error: new Error('Não há uma cópia anterior válida para recuperar.') };
  try {
    const original = read(storage, key);
    // Explicit recovery keeps the damaged/newer value available for manual export.
    if (original !== null) storage.setItem(getInvestigationRecoveryKey(key), original);
    storage.setItem(key, backup.raw);
    return { saved: true, blocked: false, error: null, investigations: clone(backup.investigations) };
  } catch (error) {
    return { saved: false, blocked: true, error };
  }
}
