import { spawn, execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';

const exec = promisify(execFile);
export async function hasPdfExtractor() {
  try { await exec('pdftotext', ['-v'], { timeout: 2000 }); return true; } catch { return false; }
}

export async function extractPdf({ base64, fileName }) {
  if (typeof base64 !== 'string' || base64.length > 7000000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64) ||
      typeof fileName !== 'string' || fileName.length > 250) throw new Error('INVALID_PDF');
  const bytes = Buffer.from(base64, 'base64');
  if (bytes.length > 5 * 1024 * 1024 || bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('INVALID_PDF');
  const output = await new Promise((resolve, reject) => {
    // No shell, no user-controlled flags, URLs or paths. Both streams stay in memory.
    const process = spawn('pdftotext', ['-layout', '-enc', 'UTF-8', '-', '-'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let length = 0, settled = false;
    const chunks = [];
    const timer = setTimeout(() => finish(new Error('PDF_TIMEOUT')), 10000);
    function finish(error, value) {
      if (settled) return;
      settled = true; clearTimeout(timer);
      if (error) { process.kill('SIGKILL'); reject(error); } else resolve(value);
    }
    process.on('error', () => finish(new Error('PDF_UNAVAILABLE')));
    process.stdin.on('error', () => {});
    process.stderr.on('data', () => {});
    process.stdout.on('data', chunk => {
      length += chunk.length;
      if (length > 500000) return finish(new Error('PDF_TOO_LARGE'));
      chunks.push(chunk);
    });
    process.on('close', code => code === 0 ? finish(null, Buffer.concat(chunks).toString('utf8')) : finish(new Error('PDF_UNREADABLE')));
    process.stdin.end(bytes);
  });
  const pages = output.split('\f');
  if (!pages.at(-1)?.trim()) pages.pop();
  if (!output.trim()) throw new Error('PDF_NO_TEXT');
  if (pages.length > 100 || output.length > 40000) throw new Error('PDF_TOO_LARGE');
  const text = pages.map((page, index) => `[Página ${index + 1}]\n${page.trim()}`).join('\n\n');
  if (text.length > 40000) throw new Error('PDF_TOO_LARGE');
  return {
    text, fileName, pages: pages.length, sha256: createHash('sha256').update(bytes).digest('hex'),
    warning: 'Extração de texto, sem OCR. Páginas digitalizadas, gráficos e tabelas podem exigir conferência no original.',
  };
}
