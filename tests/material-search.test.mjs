import test from 'node:test';
import assert from 'node:assert/strict';
import { searchLiteralMaterials } from '../material-search.mjs';

const materials = [
  {id:'a', text:'[Página 3]\nA água foi medida.\nA ÁGUA voltou.', originalAttachment:{name:'relatorio.pdf'}, verificationStatus:'unverified'},
  {id:'b', text:'Outro documento sem o termo.', materialOrigin:'nota'},
];

test('finds case/diacritic variants deterministically and preserves exact offsets', () => {
  const result = searchLiteralMaterials(materials, 'água');
  assert.equal(result.total, 2);
  assert.equal(result.results.length, 2);
  assert.equal(result.results[0].materialId, 'a');
  assert.equal(result.results[0].locator, 'p. 3');
  assert.equal(result.results[0].match, 'água');
  assert.equal(result.results[1].match, 'ÁGUA');
  assert.equal(materials[0].text.slice(result.results[1].start, result.results[1].end), 'ÁGUA');
});

test('returns bounded context and line locator when no explicit page marker exists', () => {
  const result = searchLiteralMaterials([{id:'x',text:'linha 1\nlinha 2 com termo\nlinha 3'}], 'termo', {context:2});
  assert.equal(result.results[0].locator, 'linha 2 · offset 20');
  assert.equal(result.results[0].excerpt, 'm term');
});

test('counts all matches while limiting returned results', () => {
  const result = searchLiteralMaterials([{id:'x',text:'aaaa'}], 'aa', {limit:2});
  assert.equal(result.total, 3);
  assert.equal(result.results.length, 2);
  assert.deepEqual(result.results.map(item => [item.start,item.end]), [[0,2],[1,3]]);
});

test('empty query is a safe empty result and malformed inputs fail', () => {
  assert.deepEqual(searchLiteralMaterials(materials, '   '), {query:'', total:0, results:[]});
  assert.throws(() => searchLiteralMaterials(null, 'x'));
  assert.throws(() => searchLiteralMaterials([{id:'x',text:1}], 'x'));
  assert.throws(() => searchLiteralMaterials(materials, 'x', {limit:0}));
  assert.throws(() => searchLiteralMaterials(materials, 'x'.repeat(501)));
});

test('search is isolated to the supplied collection', () => {
  const result = searchLiteralMaterials([materials[1]], 'água');
  assert.equal(result.total, 0);
  assert.deepEqual(result.results, []);
});