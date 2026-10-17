import test from 'node:test';
import assert from 'node:assert/strict';
import {suggestLaiItemComparisons,MAX_COMPARISON_TEXT_LENGTH} from '../lai-item-comparison.mjs';
const input=()=>({items:[{id:'item-1',requestedText:'  Solicito CONTRATOS e despesas de 2024. ',status:'pending'}],materials:[{id:'response-1',text:'Resposta recebida.\nOs contratos e despesas de 2024 estão em conferência.\nA existência dos anexos deve ser revisada.'}]});

test('explicit lexical overlap produces exact original offsets and review-only status deterministically',()=>{
  const data=input(); const before=JSON.stringify(data);
  const result=suggestLaiItemComparisons(data);
  assert.deepEqual(result,suggestLaiItemComparisons(data));
  const suggestion=result.suggestions[0];
  assert.equal(suggestion.status,'review-needed');
  assert.equal(suggestion.requiresReporterReview,true);
  assert.equal(suggestion.excerpt,data.materials[0].text.slice(suggestion.start,suggestion.end));
  assert.equal(suggestion.requestedText,data.items[0].requestedText);
  assert.deepEqual(suggestion.matchedTerms,['2024','contratos','despesas']);
  assert.equal(suggestion.score,100);
  assert.match(suggestion.rationale,/não atendimento/);
  assert.equal(JSON.stringify(data),before);
  assert.equal(data.items[0].status,'pending');
});

test('no literal matching terms yields no missing, denied or answered assertion',()=>{
  const result=suggestLaiItemComparisons({items:[{id:'i',requestedText:'Contrato integral'}],materials:[{id:'m',text:'Licitação pública e orçamento municipal.'}]});
  assert.equal(result.suggestions.length,0);
  assert.equal(result.itemsWithoutMatches,1);
  assert.match(result.limitation,/não significa ausência/);
});

test('accent and case normalization work in PT, EN and ES without translating or stemming terms',()=>{
  for(const [locale,requestedText,responseText,term] of [['pt','Solicito LICITAÇÕES','Licitações foram registradas.','licitacoes'],['en','Please provide CONTRACTS','The contracts require review.','contracts'],['es','Solicito INFORMACIÓN','Información disponible para revisión.','informacion']]) {
    const result=suggestLaiItemComparisons({items:[{id:'i',requestedText}],materials:[{id:'m',text:responseText}],locale});
    assert.deepEqual(result.suggestions[0].matchedTerms,[term]);
    assert.equal(result.suggestions[0].excerpt,responseText);
  }
  assert.equal(suggestLaiItemComparisons({items:[{id:'i',requestedText:'Contratos'}],materials:[{id:'m',text:'Contract'}]}).total,0);
});

test('only the best exact lexical window is proposed per item; repeated tokens cannot inflate scores',()=>{
  const result=suggestLaiItemComparisons({items:[{id:'i',requestedText:'Contratos despesas receitas'}],materials:[{id:'weak',text:'Contratos contratos contratos.'},{id:'strong',text:'Despesas e receitas no contrato.'}]});
  assert.equal(result.total,1);
  assert.equal(result.suggestions[0].materialId,'strong');
  assert.deepEqual(result.suggestions[0].matchedTerms,['despesas','receitas']);
  assert.equal(result.suggestions[0].score,67);
});

test('terms counted in the score must appear inside the exact limited excerpt',()=>{
  const material='Contratos iniciais. '+ 'x'.repeat(1000)+' Despesas finais.';
  const result=suggestLaiItemComparisons({items:[{id:'i',requestedText:'Contratos despesas'}],materials:[{id:'m',text:material}]});
  const suggestion=result.suggestions[0];
  assert.ok(suggestion.excerpt.length<=600);
  assert.equal(suggestion.matchedTerms.length,1);
  assert.equal(suggestion.score,50);
  assert.equal(suggestion.excerpt,material.slice(suggestion.start,suggestion.end));
});

test('accepted and rejected decisions suppress identical text and a wording change resurfaces for review',()=>{
  for(const status of ['accepted','rejected']) {
    const data=input();
    const proposal=suggestLaiItemComparisons(data).suggestions[0];
    data.decisions=[{fingerprint:proposal.fingerprint,status}];
    assert.equal(suggestLaiItemComparisons(data).total,0);
    data.materials[0].text+='\nTexto adicional.';
    const next=suggestLaiItemComparisons(data).suggestions[0];
    assert.notEqual(next.fingerprint,proposal.fingerprint);
    assert.equal(next.status,'review-needed');
    data.materials[0].text=input().materials[0].text;
    data.items[0].requestedText+=' ';
    assert.equal(suggestLaiItemComparisons(data).total,1);
  }
});

test('limits disclose hidden proposals and oversized input is rejected instead of silently truncating material',()=>{
  const result=suggestLaiItemComparisons({items:Array.from({length:5},(_,index)=>({id:'i'+index,requestedText:'Contratos'})),materials:[{id:'m',text:'Contratos'}],limit:2});
  assert.equal(result.suggestions.length,2);assert.equal(result.total,5);assert.equal(result.truncated,true);
  assert.throws(()=>suggestLaiItemComparisons({items:[{id:'i',requestedText:'Contratos'}],materials:[{id:'m',text:'x'.repeat(MAX_COMPARISON_TEXT_LENGTH+1)}]}));
  assert.throws(()=>suggestLaiItemComparisons({limit:21}));
  assert.throws(()=>suggestLaiItemComparisons({items:[{id:'same',requestedText:'Texto'},{id:'same',requestedText:'Outro'}]}));
  assert.throws(()=>suggestLaiItemComparisons({materials:[{id:'same',text:'A'},{id:'same',text:'B'}]}));
});

test('frozen inputs and original Unicode source text remain untouched',()=>{
  const data={items:Object.freeze([Object.freeze({id:'i',requestedText:'Informação despesas'})]),materials:Object.freeze([Object.freeze({id:'m',text:'📰 INFORMAÇÃO — despesas.\n'} )])};
  Object.freeze(data);
  const result=suggestLaiItemComparisons(data);
  assert.equal(result.suggestions[0].excerpt,'📰 INFORMAÇÃO — despesas.\n');
  assert.equal(result.suggestions[0].status,'review-needed');
});
