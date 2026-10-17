// Preserve the imported text verbatim. Pagination exists only when explicitly marked.
export const MAX_VIEWER_TEXT_LENGTH = 100000;
export const MAX_VIEWER_SEGMENTS = 500;
const markerPattern = /^[\t ]*\[(?:P[áa]gina|Page)[\t ]+([0-9]{1,6})\][\t ]*(?:\r?\n|$)/gimu;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);

export function createMaterialViewer(text) {
  if (typeof text !== 'string' || text.length > MAX_VIEWER_TEXT_LENGTH) throw new Error('Texto do visualizador inválido ou acima do limite de 100 mil caracteres.');
  const boundaries = [];
  for (const match of text.matchAll(markerPattern)) {
    boundaries.push({ start: match.index, end: match.index + match[0].length, boundary: 'marker', pageNumber: Number(match[1]), marker: match[0].replace(/\r?\n$/u,''), locatorSuggestion: 'p. ' + match[1] });
  }
  for (let index = text.indexOf('\f'); index !== -1; index = text.indexOf('\f',index + 1)) boundaries.push({ start:index,end:index+1,boundary:'form-feed',pageNumber:null,marker:'\f',locatorSuggestion:null });
  boundaries.sort((a,b) => a.start - b.start);
  if (boundaries.length >= MAX_VIEWER_SEGMENTS + 1) throw new Error('Há delimitadores demais no texto. Nenhum trecho foi descartado.');
  const segments = [];
  let cursor = 0;
  let current = { boundary:'none',pageNumber:null,marker:null,locatorSuggestion:null };
  function append(end) {
    if (segments.length >= MAX_VIEWER_SEGMENTS) throw new Error('Há segmentos demais no texto. Nenhum trecho foi descartado.');
    segments.push({ id:'segment-' + segments.length + '-' + cursor + '-' + end, text:text.slice(cursor,end), start:cursor, end,
      boundary:current.boundary,pageNumber:current.pageNumber,marker:current.marker,locatorSuggestion:current.locatorSuggestion });
  }
  for (const boundary of boundaries) {
    // A leading numbered marker labels its content; it does not create a phantom preface.
    // Form-feed retains even empty sections because it explicitly separates text.
    if (boundary.start > cursor || boundary.boundary === 'form-feed' || current.boundary !== 'none' || segments.length) append(boundary.start);
    cursor = boundary.end;
    current = boundary;
  }
  append(text.length);
  return {sourceText:text,pagination:boundaries.some(boundary=>boundary.boundary === 'marker') ? 'explicit' : boundaries.length ? 'separated' : 'unpaged',segments};
}

function validBoundary(text,offset) {
  if (!offset || offset === text.length) return true;
  const a=text.charCodeAt(offset-1),b=text.charCodeAt(offset);
  return !(a>=0xd800 && a<=0xdbff && b>=0xdc00 && b<=0xdfff);
}

/** Local UTF-16 offsets match textarea selectionStart/selectionEnd. */
export function selectMaterialSegment(viewer,segmentId,{start,end,locator}={}) {
  if (!object(viewer) || !Array.isArray(viewer.segments) || typeof segmentId !== 'string') throw new Error('Visualizador ou segmento inválido.');
  const canonical=createMaterialViewer(viewer.sourceText);
  const matches=viewer.segments.filter(segment=>segment?.id === segmentId);
  const segment=canonical.segments.find(entry=>entry.id === segmentId);
  if (matches.length !== 1 || !segment || matches[0].start !== segment.start || matches[0].end !== segment.end || matches[0].text !== segment.text) throw new Error('O segmento não corresponde ao texto original.');
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start<0 || end<=start || end>segment.text.length || !validBoundary(segment.text,start) || !validBoundary(segment.text,end)) throw new Error('Selecione um trecho válido dentro deste segmento.');
  const text=segment.text.slice(start,end);
  if (!text.trim()) throw new Error('A seleção contém apenas espaços.');
  const selectedLocator=locator === undefined ? segment.locatorSuggestion : locator;
  if (selectedLocator !== null && (typeof selectedLocator !== 'string' || selectedLocator.length>500)) throw new Error('Localizador inválido.');
  return {start:segment.start+start,end:segment.start+end,text,locator:selectedLocator};
}
