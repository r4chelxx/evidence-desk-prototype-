import test from 'node:test';
import assert from 'node:assert/strict';
import { createChecklistItem, updateChecklistItem, summarizeChecklist, canTrackGap, getChecklistGapCandidates, CHECKLIST_STATUSES } from '../lai-item-checklist.mjs';
const first = '2026-10-17T12:00:00.000Z';
const later = '2026-10-18T12:00:00.000Z';
const make = (input = {}, id = 'item-1') => createChecklistItem({requestedText:'  Item 1.\nCópia EXATA do pedido; sem divisão.  ', ...input}, {id,now:first});

test('manually entered original text remains exact and is never split into inferred items', () => {
  const item = make();
  assert.equal(item.requestedText,'  Item 1.\nCópia EXATA do pedido; sem divisão.  ');
  assert.equal(item.status,'pending');
  assert.equal(item.reviewedAt,null);
  assert.equal(item.createdAt,first);
  assert.equal(summarizeChecklist([item]).total,1);
  assert.deepEqual(getChecklistGapCandidates([item]),[]);
});

test('manual reviews return immutable records, preserve IDs and date the review', () => {
  const item = Object.freeze(make());
  const patch = Object.freeze({status:'partial',responseExcerpt:'  Foram fornecidos dois meses.\n ',locator:'p. 3',notes:'Conferir demais meses.',targetClaimId:'claim-1'});
  const updated = updateChecklistItem(item,patch,{now:later});
  assert.equal(item.status,'pending');
  assert.equal(item.reviewedAt,null);
  assert.equal(updated.id,item.id);
  assert.equal(updated.createdAt,first);
  assert.equal(updated.updatedAt,later);
  assert.equal(updated.reviewedAt,later);
  assert.equal(updated.responseExcerpt,patch.responseExcerpt);
  assert.equal(updated.requestedText,item.requestedText);
  assert.equal(updated.targetClaimId,'claim-1');
});

test('all explicit statuses are counted and only partial, missing or denied propose gaps', () => {
  const items = CHECKLIST_STATUSES.map((status,index) => make({status,notes:status === 'answered' ? 'Conferido manualmente.' : ''},'item-'+index));
  assert.deepEqual(summarizeChecklist(items),{total:5,pending:1,answered:1,partial:1,missing:1,denied:1,unresolved:4});
  assert.deepEqual(items.map(canTrackGap),[false,false,true,true,true]);
  const candidates = getChecklistGapCandidates(items);
  assert.deepEqual(candidates.map(item=>item.status),['partial','missing','denied']);
  for (const candidate of candidates) {
    assert.match(candidate.limitation,/não comprova irregularidade/);
    assert.equal('supportsClaim' in candidate,false);
    assert.equal('strength' in candidate,false);
  }
});

test('answered requires a reporter record, accepting an excerpt, locator or explicit note', () => {
  assert.throws(()=>make({status:'answered'}),/trecho, localizador ou nota/);
  assert.throws(()=>make({status:'answered',notes:'  '}));
  for (const field of ['responseExcerpt','locator','notes']) {
    const item = make({status:'answered',[field]:'Conferido'});
    assert.equal(item.status,'answered');
    assert.equal(item.reviewedAt,first);
    assert.equal(canTrackGap(item),false);
  }
});

test('bogus IDs, unknown fields, statuses and invalid text types are rejected', () => {
  for (const id of ['',null,{},'with space','<script>','a'.repeat(201)]) assert.throws(()=>make({},id));
  for (const patch of [{id:'replacement'},{reviewedAt:later},{supportsClaim:true},{status:'irregular'},{requestedText:' '},{notes:{}},{locator:42},{targetClaimId:'bad id'},{responseExcerpt:'x'.repeat(20001)}]) {
    assert.throws(()=>updateChecklistItem(make(),patch,{now:later}));
  }
  for (const input of [{requestedText:null},{requestedText:42},{requestedText:'x'.repeat(12001)},{notes:false},{status:42},{id:'custom'}]) assert.throws(()=>make(input));
  assert.throws(()=>make({targetClaimId:[] }));
  assert.throws(()=>updateChecklistItem(make(),{notes:'note'},{now:'bad date'}));
});

test('missing response text alone never changes pending status or proposes an evidentiary conclusion', () => {
  const item = make({notes:'Ainda não conferi a resposta.'});
  assert.equal(item.status,'pending');
  assert.deepEqual(getChecklistGapCandidates([item]),[]);
  const missing = updateChecklistItem(item,{status:'missing'},{now:later});
  assert.equal(getChecklistGapCandidates([missing])[0].requestedText,item.requestedText);
  const pending = updateChecklistItem(missing,{status:'pending'},{now:later});
  assert.equal(canTrackGap(pending),false);
  assert.deepEqual(getChecklistGapCandidates([pending]),[]);
});

test('summaries reject duplicate identifiers and malformed records without mutating lists', () => {
  const item = Object.freeze(make());
  const list = Object.freeze([item]);
  assert.equal(summarizeChecklist(list).pending,1);
  assert.throws(()=>summarizeChecklist([item,item]),/repetido/);
  assert.throws(()=>summarizeChecklist({}));
  assert.throws(()=>canTrackGap({...item,status:'missing',reviewedAt:null}));
});

test('default creation generates independent stable identifiers', () => {
  const a = createChecklistItem({requestedText:'Item A'});
  const b = createChecklistItem({requestedText:'Item B'});
  assert.notEqual(a.id,b.id);
  assert.equal(updateChecklistItem(a,{notes:'Revisado'}).id,a.id);
});
