import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createClaimRequirement, updateClaimRequirement, assessClaimRequirements } from '../claim-requirements.mjs';
import { adaptLegacyInvestigation } from '../investigation-adapter.mjs';
import { suggestClaimRequirements } from '../claim-suggestions.mjs';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('function renderReverseInvestigation(item) {');
const code = source.slice(start, source.indexOf('function renderClaims(item) {', start));
const requirement = () => createClaimRequirement({ text: 'Localizar contrato original' }, { id: 'req-1', now: '2026-10-17T06:00:00Z' });
function entryForm(role) {
  const handlers = {}; const taskHandlers = {};
  const fields = {
    requirementText: { value: '' }, requirementKind: { value: 'document' },
    requirementStatus: { value: 'open' }, requirementNotes: { value: '' }, notice: { textContent: '' }
  };
  const form = {
    dataset: { claimId: 'claim-1', ...(role === 'review' ? { requirementId: 'req-1' } : {}) },
    fields, handlers, taskHandlers, checked: [],
    addEventListener: (event, handler) => { handlers[event] = handler; },
    querySelector(selector) {
      if (selector === '[data-requirement-notice]') return fields.notice;
      if (selector === '[data-action="requirement-task"]') return { addEventListener: (event, handler) => { taskHandlers[event] = handler; } };
      const name = selector.match(/name="([^"]+)"/)?.[1];
      return fields[name];
    },
    querySelectorAll() { return form.checked.map(value => ({ value })); }
  };
  return form;
}
function setup(withRequirement = true) {
  const item = { id: 'case-1', claims: [{ id: 'claim-1', text: 'Afirmação', requirements: withRequirement ? [requirement()] : [] }], sources: [], verifiedEvidence: [], actionItems: [], transparencyLog: [] };
  const add = entryForm('add'); const review = entryForm('review');
  const picker = { value: 'claim-1', handlers: {}, addEventListener(event, handler) { this.handlers[event] = handler; } };
  const reverseNotice = { textContent: '' };
  let saved = true; let renders = 0;
  const state = { currentId: item.id, reverseSelections: {} };
  const context = vm.createContext({
    document: { querySelector: () => reverseNotice, querySelectorAll(selector) { return selector.includes('data-reverse-claim') ? [picker] : selector.includes('requirement-add') ? [add] : selector.includes('requirement-review') && withRequirement ? [review] : []; } },
    getCurrentInvestigation: () => item, createClaimRequirement, updateClaimRequirement, assessClaimRequirements, adaptLegacyInvestigation, suggestClaimRequirements, proposalDraftMemory: new Map(),
    todayIsoDate: () => '2026-10-17', saveInvestigations: () => saved, renderInvestigation: () => { renders++; }, saveUiState() {}, state,
    escapeHtml: value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
  });
  vm.runInContext(code + '\nbindReverseInvestigation();', context);
  return { item, add, review, picker, reverseNotice, state, context, get renders() { return renders; }, set saved(value) { saved = value; }, submit: form => form.handlers.submit({ preventDefault() {} }) };
}

test('claim switching preserves unsaved add or review changes and permits clean switches', () => {
  const modifications = [
    env => { env.add.fields.requirementText.value = 'Novo requisito ainda não salvo'; },
    env => { env.review.fields.requirementNotes.value = 'Notas pendentes'; },
    env => { env.review.fields.requirementStatus.value = 'partial'; },
    env => { env.review.checked = ['doc-1']; }
  ];
  for (const modify of modifications) {
    const env = setup(); env.item.claims.push({ id: 'claim-2', text: 'Outra afirmação', requirements: [] });
    modify(env); env.picker.value = 'claim-2'; env.picker.handlers.change();
    assert.equal(env.picker.value, 'claim-1'); assert.equal(env.renders, 0);
    assert.match(env.reverseNotice.textContent, /preenchimento foi mantido/);
    assert.equal(env.state.reverseSelections[env.item.id], undefined);
  }
  const clean = setup(); clean.item.claims.push({ id: 'claim-2', text: 'Outra afirmação', requirements: [] });
  clean.picker.value = 'claim-2'; clean.picker.handlers.change();
  assert.equal(clean.state.reverseSelections[clean.item.id], 'claim-2'); assert.equal(clean.renders, 1);
});

test('actual add handler records a manual open requirement without generating tasks or evidence', () => {
  const env = setup(false); env.add.fields.requirementText.value = 'Conferir dados originais';
  env.add.fields.requirementKind.value = 'data'; env.submit(env.add);
  const created = env.item.claims[0].requirements[0];
  assert.equal(created.text, 'Conferir dados originais'); assert.equal(created.kind, 'data'); assert.equal(created.status, 'open');
  assert.equal(env.item.actionItems.length, 0); assert.equal(env.item.verifiedEvidence.length, 0);
  assert.equal(env.item.transparencyLog[0].origin, 'claim-requirements'); assert.equal(env.renders, 1);
  env.submit(env.add); assert.equal(env.item.claims[0].requirements.length, 1);
  assert.match(env.add.fields.notice.textContent, /já foi registrado/);
});

test('actual review handler blocks planned or untraceable evidence and accepts manual documented review with source', () => {
  const env = setup(); env.review.fields.requirementStatus.value = 'documented'; env.review.checked = ['doc-1'];
  env.item.evidenceBlocks = [{ id: 'doc-1', source_id: 'source-1' }]; env.submit(env.review);
  assert.equal(env.item.claims[0].requirements[0].status, 'open'); assert.equal(env.renders, 0);
  env.item.verifiedEvidence = [{ id: 'doc-1', source_id: 'source-1' }]; env.submit(env.review);
  assert.equal(env.item.claims[0].requirements[0].status, 'open'); assert.match(env.review.fields.notice.textContent, /fonte identificada/);
  env.item.sources = [{ id: 'source-1', name: 'Documento original' }]; env.submit(env.review);
  assert.equal(env.item.claims[0].requirements[0].status, 'documented');
  assert.equal(env.item.actionItems.length, 0); assert.equal(env.renders, 1);
});

test('tasks are explicit, blocked for dirty reviews and never duplicated', () => {
  const env = setup(); env.review.fields.requirementNotes.value = 'Conferir autenticidade';
  env.review.taskHandlers.click(); assert.equal(env.item.actionItems.length, 0);
  assert.match(env.review.fields.notice.textContent, /Salve a revisão/);
  assert.equal(env.review.fields.requirementNotes.value, 'Conferir autenticidade');
  env.submit(env.review); env.review.taskHandlers.click(); env.review.taskHandlers.click();
  assert.equal(env.item.actionItems.length, 1);
  assert.equal(env.item.actionItems[0].originRequirementId, 'req-1');
  assert.equal(env.item.actionItems[0].target_claim_id, 'claim-1');
  assert.equal(env.item.claims[0].requirements[0].status, 'open');
});

test('failed add, review and task persistence roll back records without clearing form input', () => {
  const addEnv = setup(false); addEnv.saved = false; addEnv.add.fields.requirementText.value = 'Preservar preenchimento'; addEnv.submit(addEnv.add);
  assert.equal(addEnv.item.claims[0].requirements.length, 0); assert.equal(addEnv.add.fields.requirementText.value, 'Preservar preenchimento');
  assert.equal(addEnv.item.transparencyLog.length, 0); assert.equal(addEnv.renders, 0);
  const env = setup(); env.saved = false; env.review.fields.requirementNotes.value = 'Notas ainda não salvas'; env.submit(env.review);
  assert.equal(env.item.claims[0].requirements[0].notes, ''); assert.equal(env.review.fields.requirementNotes.value, 'Notas ainda não salvas');
  env.review.fields.requirementNotes.value = ''; env.review.taskHandlers.click();
  assert.equal(env.item.actionItems.length, 0); assert.equal(env.item.transparencyLog.length, 0); assert.equal(env.renders, 0);
  assert.match(env.review.fields.notice.textContent, /preenchimento foi mantido/);
});

test('reverse requirement rendering escapes manually authored text, notes and evidence labels', () => {
  const env = setup();
  env.item.claims[0].requirements[0].text = '<img src=x onerror=alert(1)>';
  env.item.claims[0].requirements[0].notes = '</textarea><script>alert(1)</script>';
  env.item.verifiedEvidence = [{ id: 'doc-1', source_id: 'source-1', title: '<script>document</script>' }];
  const html = env.context.renderReverseInvestigation(env.item);
  assert.equal(html.includes('<script>'), false); assert.equal(html.includes('<img src=x'), false);
  assert.match(html, /&lt;img/); assert.match(html, /&lt;\/textarea&gt;/);
});

test('requirement task wording stays literal across queue, summary and mobile surfaces', () => {
 const names=['escapeHtml','renderQueueSection','renderExecutiveSummary','renderMobileFocusCard'];
 const chunks=names.map(name=>{const a=source.indexOf('function '+name+'('); return source.slice(a,source.indexOf('\nfunction ',a+1));}).join('\n');
 const text='<img src=x onerror=alert(1)>';
 const queue={deadlineItems:[],reviewItems:[],actionItems:[{title:text,meta:text,status:'Planejada',detail:text}]};
 const item={hypotheses:[],evidenceBlocks:[],sources:[],requests:[],claims:[],gaps:[],qaChecklist:[]};
 const ctx=vm.createContext({t:key=>key,statusClass:()=> 'neutral',getEditorialQueue:()=>queue,getStoryDraft:()=>({sections:[],workingThesis:'',editorQuestion:''}),countOpenGaps:()=>0,countOpenClaims:()=>0,countQaBlockers:()=>0,countReviewedResponses:()=>0,countRequestFollowUps:()=>0,countLateRequests:()=>0,queue,item});
 vm.runInContext(chunks,ctx);
 for(const expression of ['renderQueueSection("Fila",queue.actionItems)','renderExecutiveSummary(item)','renderMobileFocusCard(item)']) {
 const html=vm.runInContext(expression,ctx); assert.ok(!html.includes('<img')); assert.ok(html.includes('&lt;img'));
 }
});
