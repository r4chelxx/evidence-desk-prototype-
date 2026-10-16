import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAttachment, MAX_ATTACHMENT_BYTES, restoreAttachmentBundle } from '../local-attachments.mjs';
test('attachment validation rejects empty and oversized files', () => {
 assert.match(validateAttachment({name:'empty.pdf',size:0}), /vazio/);
 assert.match(validateAttachment({name:'large.pdf',size:MAX_ATTACHMENT_BYTES+1}), /20 MB/);
 assert.equal(validateAttachment({name:'valid.pdf',size:1024}), null);
});

test('restore rejects malformed size without writing to IndexedDB', async () => {
 await assert.rejects(restoreAttachmentBundle('case-1', [{name:'bad.pdf',size:MAX_ATTACHMENT_BYTES+1,base64:'YQ=='}]), /Invalid backup size/);
 await assert.rejects(restoreAttachmentBundle('case-1', [{name:'bad.pdf',size:0,base64:'YQ=='}]), /Invalid backup size/);
});
test('restore rejects invalid input before writing', async () => {
 await assert.rejects(restoreAttachmentBundle('case-1', [{name:'bad.pdf',size:1}]), /inválido/);
});
