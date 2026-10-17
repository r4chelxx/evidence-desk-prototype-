// Explainable wording templates only: no semantic verification or external AI.
export const MAX_SUGGESTION_CLAIM_LENGTH = 12000;
const list = value => Array.isArray(value) ? value : [];
const normalize = value => typeof value === 'string' ? value.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase() : '';
const dictionaries = {
  pt: {
    'original-source': ['Localizar a fonte original, se disponível, e registrar a origem e os limites da informação.', 'Sugestão geral de rastreabilidade para revisão humana; não avalia a veracidade da afirmação.'],
    numeric: ['Conferir a origem, o recorte e o cálculo dos números citados.', 'A redação contém um número ou expressão numérica; a necessidade e o escopo da checagem devem ser revisados.'],
    comparison: ['Verificar se as bases, os períodos e os critérios da comparação são compatíveis.', 'A redação contém uma expressão de comparação ou mudança; isso não estabelece quais bases existem.'],
    causal: ['Examinar o fundamento do vínculo causal e considerar explicações alternativas.', 'A redação contém uma expressão causal; o vínculo não foi verificado.'],
    attribution: ['Conferir a declaração no registro original, se disponível, incluindo contexto e autoria.', 'A redação contém uma expressão de atribuição; a existência e a fidelidade do registro precisam de revisão.']
  },
  en: {
    'original-source': ['Locate the original source, if available, and record its origin and limitations.', 'General traceability suggestion for human review; this does not assess whether the claim is true.'],
    numeric: ['Check the source, scope and calculation of the numbers cited.', 'The wording contains a number or numeric expression; a reporter must review the need and scope of this check.'],
    comparison: ['Check whether the comparison uses compatible sources, periods and criteria.', 'The wording contains a comparison or change expression; this does not establish which records exist.'],
    causal: ['Examine the basis for the causal link and consider alternative explanations.', 'The wording contains a causal expression; the link has not been verified.'],
    attribution: ['Check the statement against the original record, if available, including context and authorship.', 'The wording contains an attribution expression; the record and its accuracy require review.']
  },
  es: {
    'original-source': ['Localizar la fuente original, si está disponible, y registrar su origen y sus limitaciones.', 'Sugerencia general de trazabilidad para revisión humana; no evalúa la veracidad de la afirmación.'],
    numeric: ['Comprobar el origen, el alcance y el cálculo de los números citados.', 'La redacción contiene un número o expresión numérica; una persona debe revisar la necesidad y el alcance de esta comprobación.'],
    comparison: ['Comprobar si las fuentes, los períodos y los criterios de comparación son compatibles.', 'La redacción contiene una expresión de comparación o cambio; no establece qué registros existen.'],
    causal: ['Examinar el fundamento del vínculo causal y considerar explicaciones alternativas.', 'La redacción contiene una expresión causal; el vínculo no ha sido verificado.'],
    attribution: ['Comprobar la declaración en el registro original, si está disponible, incluidos el contexto y la autoría.', 'La redacción contiene una expresión de atribución; el registro y su fidelidad requieren revisión.']
  }
};
const rules = [
  { name: 'original-source', kind: 'document' },
  { name: 'numeric', kind: 'data', pattern: /\d|\b(?:percent(?:age)?|por cento|por ciento|milh[ãõ]o|milhões|millions?|millón|millones|bilhões|billion)\b/iu },
  { name: 'comparison', kind: 'data', pattern: /(?:^|[^\p{L}])(?:mais|menos|maior(?:es)?|menor(?:es)?|aument\p{L}*|reduz\p{L}*|queda|cresceu|higher|lower|more|less|increas\p{L}*|decreas\p{L}*|más|mayor(?:es)?|reduj\p{L}*)(?=$|[^\p{L}])/iu },
  { name: 'causal', kind: 'verification', pattern: /(?:^|[^\p{L}])(?:caus\p{L}*|provoc\p{L}*|levou a|devido a|resultou|because|due to|led to|resulted in|por causa|debido a|generó)(?=$|[^\p{L}])/iu },
  { name: 'attribution', kind: 'verification', pattern: /(?:^|[^\p{L}])(?:segundo|afirm\p{L}*|declar\p{L}*|disse|according to|said|states|says|según|dijo)(?=$|[^\p{L}])/iu }
];

// Synchronous SHA-256 provides compact stable IDs; equality/decision memory uses
// the exact canonical fingerprint below, never a lossy text normalization.
function sha256(text) {
  const constants = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const input = new TextEncoder().encode(text);
  const bytes = new Uint8Array(Math.ceil((input.length + 9) / 64) * 64);
  bytes.set(input); bytes[input.length] = 0x80;
  const view = new DataView(bytes.buffer);
  view.setUint32(bytes.length - 8, Math.floor(input.length / 0x20000000));
  view.setUint32(bytes.length - 4, input.length * 8);
  const state = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotate = (value, count) => (value >>> count) | (value << (32 - count));
  const words = new Uint32Array(64);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i++) words[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = words[i-15], b = words[i-2];
      words[i] = (words[i-16] + (rotate(a,7) ^ rotate(a,18) ^ (a >>> 3)) + words[i-7] + (rotate(b,17) ^ rotate(b,19) ^ (b >>> 10))) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = state;
    for (let i = 0; i < 64; i++) {
      const first = (h + (rotate(e,6) ^ rotate(e,11) ^ rotate(e,25)) + ((e & f) ^ (~e & g)) + constants[i] + words[i]) >>> 0;
      const second = ((rotate(a,2) ^ rotate(a,13) ^ rotate(a,22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      [a,b,c,d,e,f,g,h] = [(first + second) >>> 0,a,b,c,(d + first) >>> 0,e,f,g];
    }
    [a,b,c,d,e,f,g,h].forEach((value,index) => { state[index] = (state[index] + value) >>> 0; });
  }
  return state.map(value => value.toString(16).padStart(8, '0')).join('');
}

export function suggestClaimRequirements({ claimId, text, requirements = [], decisions = [], locale = 'pt' } = {}) {
  if (typeof claimId !== 'string' || !claimId.trim() || claimId.length > 512 || typeof text !== 'string' || !text.trim() || text.length > MAX_SUGGESTION_CLAIM_LENGTH) return [];
  const language = typeof locale === 'string' && /^(en|es)(?:-|$)/i.test(locale) ? locale.slice(0,2).toLowerCase() : 'pt';
  const existing = new Set(list(requirements).map(requirement => normalize(requirement?.text)).filter(Boolean));
  const suppressed = new Set(list(decisions).filter(decision => ['accepted','rejected'].includes(decision?.status)).map(decision => decision.fingerprint));
  const proposals = [];
  for (const rule of rules) {
    const match = rule.pattern?.exec(text);
    if (rule.pattern && !match) continue;
    const fingerprint = JSON.stringify(['claim-suggestions-v1', claimId, text, rule.name]);
    if (suppressed.has(fingerprint) || Object.values(dictionaries).some(dictionary => existing.has(normalize(dictionary[rule.name][0])))) continue;
    const [proposalText, rationale] = dictionaries[language][rule.name];
    proposals.push({ id: 'suggestion-' + sha256(fingerprint), fingerprint, rule: rule.name, text: proposalText, kind: rule.kind, rationale, basisExcerpt: match ? match[0] : text, status: 'proposed', requiresReporterApproval: true });
    if (proposals.length === 4) break;
  }
  return proposals;
}
