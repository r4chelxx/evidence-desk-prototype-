// Lexical navigation into already-imported text, never an assessment of compliance.
export const MAX_COMPARISON_TEXT_LENGTH = 100000;
const WINDOW_LENGTH = 600;
const stopwords=new Set(('a ao aos as o os da das de do dos e em na nas no nos para por que se um uma uns umas com como seu sua seus suas este esta estes estas esse essa esses essas isso favor solicito solicitar solicitado solicitada pedido informe informar envie enviar resposta anexo the and for from into this that these those with without please request requested provide response attachment el la las los del al en con sin para por que una uno unos unas este esta estos estas favor solicito solicitar solicitado solicitud informe enviar respuesta adjunto').split(' '));
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const nonempty=value=>typeof value==='string' && value.trim().length>0;
const labels={
  pt:{rationale:'Coincidência lexical de termos; confira o trecho e seu contexto no original. A pontuação mede apenas termos coincidentes, não atendimento do pedido.',limitation:'Sem correspondência lexical não significa ausência de resposta; nenhum status do item foi alterado.'},
  en:{rationale:'Lexical term overlap; review the excerpt and its original context. The score measures matching terms only, not fulfillment of the request.',limitation:'No lexical match does not mean no response; no item status has been changed.'},
  es:{rationale:'Coincidencia léxica de términos; revise el fragmento y su contexto original. La puntuación mide solo términos coincidentes, no el cumplimiento de la solicitud.',limitation:'Sin coincidencia léxica no significa ausencia de respuesta; no se ha cambiado el estado de ningún ítem.'},
};
function tokenize(text) {
  return [...text.matchAll(/[\p{L}\p{N}]+/gu)].map(match=>({term:normalize(match[0]),text:match[0],start:match.index,end:match.index+match[0].length})).filter(token=>token.term.length>=3 && !stopwords.has(token.term) || /^\d+$/.test(token.term));
}
function boundary(text,index) {
  if(index>0 && index<text.length && /[\uD800-\uDBFF]/.test(text[index-1]) && /[\uDC00-\uDFFF]/.test(text[index])) return index-1;
  return index;
}
function bestWindow(material,requested) {
  const matches=material.tokens.filter(token=>requested.has(token.term));
  if(!matches.length) return null;
  let best=null,right=0,left=0;
  const active=new Map();
  for(const anchor of matches) {
    const start=boundary(material.text,Math.max(0,anchor.start-80));
    const end=boundary(material.text,Math.min(material.text.length,start+WINDOW_LENGTH));
    while(right<matches.length && matches[right].end<=end) {const term=matches[right++].term;active.set(term,(active.get(term)||0)+1);}
    while(left<right && matches[left].start<start) {const term=matches[left++].term;const count=active.get(term)-1;if(count)active.set(term,count);else active.delete(term);}
    if(!best || active.size>best.matchedTerms.length) best={start,end,matchedTerms:[...active.keys()].sort()};
  }
  return {...best,excerpt:material.text.slice(best.start,best.end)};
}

export function suggestLaiItemComparisons({items=[],materials=[],decisions=[],limit=4,locale='pt'}={}) {
  if(!Array.isArray(items) || items.length>100 || !Array.isArray(materials) || materials.length>40 || !Array.isArray(decisions)) throw new Error('Listas de comparação inválidas ou extensas demais.');
  if(!Number.isInteger(limit) || limit<0 || limit>20) throw new Error('O limite de sugestões deve estar entre 0 e 20.');
  const itemIds=new Set(),materialIds=new Set();
  const prepared=materials.map(material=>{
    if(!material || !nonempty(material.id) || material.id.length>1000 || typeof material.text!=='string' || material.text.length>MAX_COMPARISON_TEXT_LENGTH || materialIds.has(material.id)) throw new Error('Texto ou identificação do material inválido.');
    materialIds.add(material.id);
    return {...material,tokens:tokenize(material.text)};
  });
  if(prepared.reduce((sum,material)=>sum+material.text.length,0)>500000) throw new Error('Os materiais excedem o limite total de texto. Nenhum trecho foi descartado.');
  const suppressed=new Set(decisions.filter(decision=>decision && ['accepted','rejected'].includes(decision.status || decision.decision)).map(decision=>decision.fingerprint));
  const dictionary=labels[locale] || labels.pt;
  const suggestions=[];
  let itemsWithoutMatches=0;
  for(const item of items) {
    if(!item || !nonempty(item.id) || item.id.length>1000 || !nonempty(item.requestedText) || item.requestedText.length>12000 || itemIds.has(item.id)) throw new Error('Item solicitado inválido ou repetido.');
    itemIds.add(item.id);
    const requested=new Set(tokenize(item.requestedText).map(token=>token.term));
    let best=null;
    for(const material of prepared) {
      const candidate=bestWindow(material,requested);
      if(candidate && (!best || candidate.matchedTerms.length>best.matchedTerms.length)) best={...candidate,material};
    }
    if(!best) {itemsWithoutMatches++;continue;}
    const fingerprint=JSON.stringify(['lai-item-comparison-v1',item.id,item.requestedText,best.material.id,best.material.text]);
    if(suppressed.has(fingerprint)) continue;
    suggestions.push({
      id:`lai-comparison:${encodeURIComponent(item.id)}:${encodeURIComponent(best.material.id)}`,
      fingerprint,itemId:item.id,materialId:best.material.id,status:'review-needed',
      requestedText:item.requestedText,excerpt:best.excerpt,start:best.start,end:best.end,
      matchedTerms:best.matchedTerms,requestedTermCount:requested.size,
      score:Math.round(best.matchedTerms.length/requested.size*100),
      rationale:dictionary.rationale,requiresReporterReview:true,
      limitation:dictionary.limitation,
    });
  }
  return {suggestions:suggestions.slice(0,limit),total:suggestions.length,truncated:suggestions.length>limit,itemsWithoutMatches,limitation:dictionary.limitation};
}
