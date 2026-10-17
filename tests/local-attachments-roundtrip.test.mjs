import test from 'node:test';
import assert from 'node:assert/strict';
import { storeAttachment, readAttachment, exportAttachmentBundle, restoreAttachmentBundle } from '../local-attachments.mjs';

// Minimal asynchronous IndexedDB contract for testing committed transactions.
function fakeIndexedDB() {
  const records = new Map();
  return {
    open() {
      const request = { result: {
        objectStoreNames: { contains: () => true },
        transaction(_name, mode) {
          const tx = { oncomplete: null, onabort: null, onerror: null, objectStore() {
            return {
              put(value) { return perform(() => { records.set(value.id, value); return value.id; }); },
              get(id) { return perform(() => records.get(id)); },
              delete(id) { return perform(() => records.delete(id)); },
            };
          }};
          function perform(fn) {
            const operation = { result: undefined, onsuccess: null, onerror: null };
            queueMicrotask(() => {
              operation.result = fn();
              operation.onsuccess?.();
              queueMicrotask(() => tx.oncomplete?.());
            });
            return operation;
          }
          return tx;
        },
        close() {},
      }};
      queueMicrotask(() => request.onsuccess?.());
      return request;
    },
  };
}
test('attachment round trip retains original bytes and isolates investigations', async () => {
  const previous = globalThis.indexedDB;
  globalThis.indexedDB = fakeIndexedDB();
  try {
    const original = new File([Uint8Array.from([0, 1, 2, 127, 255])], 'original.bin', { type: 'application/octet-stream' });
    const meta = await storeAttachment('investigation-A', original);
    assert.equal(meta.size, 5);
    assert.match(meta.sha256, /^[a-f0-9]{64}$/);
    assert.equal(await readAttachment(meta.id, 'investigation-B'), null);
    const backup = await exportAttachmentBundle('investigation-A', [meta]);
    assert.equal(backup.length, 1);
    assert.equal(backup[0].sha256, meta.sha256);
    await assert.rejects(restoreAttachmentBundle("tampered", [{...backup[0], base64: btoa("abcde")}]), /Integridade/);
    const restored = await restoreAttachmentBundle('investigation-C', backup);
    assert.equal(restored[0].sha256, meta.sha256);
    const record = await readAttachment(restored[0].id, 'investigation-C');
    assert.deepEqual(new Uint8Array(await record.blob.arrayBuffer()), new Uint8Array(await original.arrayBuffer()));
  } finally {
    if (previous === undefined) delete globalThis.indexedDB;
    else globalThis.indexedDB = previous;
  }
});
