import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPdf, hasPdfExtractor } from '../server/pdf-extraction.mjs';

// Synthetic in-memory PDF; no investigation material or external file is used.
function fixture(text) {
  const stream = text ? `BT /F1 12 Tf 50 100 Td (${text}) Tj ET` : '';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let doc = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(doc.length); doc += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = doc.length;
  doc += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(doc).toString('base64');
}
test('rejects non-PDF content and oversized input before starting extraction', async () => {
  await assert.rejects(extractPdf({ fileName: 'x.pdf', base64: Buffer.from('not PDF').toString('base64') }), /INVALID_PDF/);
  await assert.rejects(extractPdf({ fileName: 'x.pdf', base64: 'A'.repeat(7000001) }), /INVALID_PDF/);
});
test('extracts text with page markers and original-file checksum', { skip: !(await hasPdfExtractor()) }, async () => {
  const result = await extractPdf({ fileName: 'example.pdf', base64: fixture('Total: 12 cases') });
  assert.match(result.text, /\[Página 1\]/);
  assert.match(result.text, /Total: 12 cases/);
  assert.equal(result.pages, 1);
  assert.match(result.sha256, /^[a-f0-9]{64}$/);
});
test('does not present a PDF without selectable text as an analyzed empty response', { skip: !(await hasPdfExtractor()) }, async () => {
  await assert.rejects(extractPdf({ fileName: 'blank.pdf', base64: fixture('') }), /PDF_NO_TEXT/);
});
