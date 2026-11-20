// Deterministic, local literal search over materials explicitly supplied by the caller.
// This module never calls an AI provider, reads storage, or infers evidentiary meaning.
export const MAX_LITERAL_QUERY_LENGTH = 500;
export const MAX_LITERAL_RESULTS = 200;
export const MAX_LITERAL_MATERIAL_LENGTH = 1000000;

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function normalize(value) {
  return value.normalize('NFKC').toLocaleLowerCase();
}

function locatorFor(text, offset) {
  const prefix = text.slice(0, offset);
  const markers = [...prefix.matchAll(/^[\t ]*\[(?:P[áa]gina|Page)[\t ]+(\d{1,6})\][\t ]*$/gimu)];
  if (markers.length) return 'p. ' + markers[markers.length - 1][1];
  const line = prefix.split(/\r?\n/).length;
  return 'linha ' + line + ' · offset ' + offset;
}

function excerptFor(text, start, end, radius) {
  const from = Math.max(0, start - radius);
  const to = Math.min(text.length, end + radius);
  return { text: text.slice(from, to), start: from, end: to };
}

/**
 * Search only the supplied materials. Each match keeps exact UTF-16 offsets,
 * a bounded context excerpt and a reproducible line/page locator.
 */
export function searchLiteralMaterials(materials, query, { limit = MAX_LITERAL_RESULTS, context = 120 } = {}) {
  if (!Array.isArray(materials) || materials.some(material => !object(material) || typeof material.id !== 'string' || !material.id.trim() || typeof material.text !== 'string' || material.text.length > MAX_LITERAL_MATERIAL_LENGTH)) {
    throw new Error('Coleção de materiais inválida.');
  }
  if (typeof query !== 'string' || !query.trim()) return { query: '', total: 0, results: [] };
  if (query.length > MAX_LITERAL_QUERY_LENGTH) throw new Error('A busca é longa demais.');
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_LITERAL_RESULTS) throw new Error('Limite de busca inválido.');
  if (!Number.isSafeInteger(context) || context < 0 || context > 1000) throw new Error('Contexto de busca inválido.');

  const normalizedQuery = normalize(query.trim());
  const results = [];
  let total = 0;
  for (const material of materials) {
    const normalizedText = normalize(material.text);
    let cursor = 0;
    while (cursor <= normalizedText.length - normalizedQuery.length) {
      const start = normalizedText.indexOf(normalizedQuery, cursor);
      if (start === -1) break;
      const end = start + normalizedQuery.length;
      total++;
      if (results.length < limit) {
        const excerpt = excerptFor(material.text, start, end, context);
        results.push({
          materialId: material.id,
          materialName: material.originalAttachment?.name || material.materialOrigin || material.id,
          match: material.text.slice(start, end),
          start,
          end,
          locator: locatorFor(material.text, start),
          excerpt: excerpt.text,
          excerptStart: excerpt.start,
          excerptEnd: excerpt.end,
          verificationStatus: material.verificationStatus || 'unverified',
        });
      }
      // Advance by one code unit so overlapping literal occurrences are not silently lost.
      cursor = start + 1;
    }
  }
  return { query: query.trim(), total, results };
}
