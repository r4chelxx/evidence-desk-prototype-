import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAttachment, MAX_ATTACHMENT_BYTES } from '../local-attachments.mjs';
test('attachment validation rejects empty and oversized files', () => {
 assert.match(validateAttachment({name:'empty.pdf',size:0}), /vazio/);
 assert.match(validateAttachment({name:'large.pdf',size:MAX_ATTACHMENT_BYTES+1}), /20 MB/);
 assert.equal(validateAttachment({name:'valid.pdf',size:1024}), null);
});
