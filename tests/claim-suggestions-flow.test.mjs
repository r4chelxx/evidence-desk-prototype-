import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { suggestClaimRequirements } from '../claim-suggestions.mjs';
import { createClaimRequirement } from '../claim-requirements.mjs';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const code = source.slice(source.indexOf('function proposalDraftKey('), source.indexOf('function bindReverseInvestigation() {'));
function proposalForm(proposal) {
  const handlers = {};
  const fields = { text: { value: proposal.text, defaultValue: proposal.text, addEventListener(event, handler) { handlers['text-' + event] = handler; } }, notice: { textContent: '' } };
  return { fields, handlers, dataset: { role: 'claim-suggestion', caseId: 'case-1', claimId: 'claim-1', proposalId: proposal.id, proposalFingerprint: proposal.fingerprint, originalText: proposal.text },
    addEventListener(event, handler) { handlers[event] = handler; },
    querySelector(selector) {
      if (selector === '[name="proposalText"]') return fields.text;
      if (selector === '[data-proposal-notice]') return fields.notice;
      return { addEventListener(event, handler) { handlers.reject = handler; } };
    }
  };
}
function setup() {
  const item = { id: 'case-1', claims: [{ id: 'claim-1', text: 'O registro contém 25 casos.', requirements: [] }], actionItems: [], transparencyLog: [] };
  const state = { locale: 'pt', currentId: item.id };
  const initial = suggestClaimRequirements({ claimId: 'claim-1', text: item.claims[0].text });
  const forms = initial.map(proposalForm); const addText = { value: '' };
  const add = { querySelector: () => addText }; const reviewForms = [];
  let saved = true; let renders = 0;
  const context = vm.createContext({
    document: { querySelectorAll(selector) { return selector.includes('requirement-add') ? [add] : selector.includes('requirement-review') ? reviewForms : forms; } },
    getCurrentInvestigation: () => item, suggestClaimRequirements, createClaimRequirement, state, proposalDraftMemory: new Map(),
    todayIsoDate: () => '2026-10-17', saveInvestigations: () => saved, renderInvestigation: () => { renders++; },
    escapeHtml: value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
  });
  vm.runInContext(code + '\nbindAutomaticProposals();', context);
  return { item, state, initial, forms, addText, reviewForms, context, get renders() { return renders; }, set saved(value) { saved = value; }, accept: form => form.handlers.submit({ preventDefault() {} }) };
}

test('accepting an edited suggestion creates an open requirement with decision provenance, never proof or tasks', () => {
  const env = setup(); const form = env.forms[0]; const edited = 'Conferir a referência original e registrar suas limitações'; form.fields.text.value = edited; form.handlers['text-input'](); env.accept(form);
  const requirement = env.item.claims[0].requirements[0]; const decision = env.item.claimSuggestionDecisions[0];
  assert.equal(requirement.text, edited); assert.equal(requirement.status, 'open'); assert.deepEqual(requirement.evidenceIds, []);
  assert.equal(form.fields.text.value, env.initial[0].text);
  env.context.captureProposalEdits(); assert.equal(env.context.proposalDraftMemory.size, 0);
  assert.equal(decision.status, 'accepted'); assert.equal(decision.createdRequirementId, requirement.id);
  assert.equal(decision.claimId, 'claim-1'); assert.equal(decision.fingerprint, env.initial[0].fingerprint);
  assert.equal(decision.basisExcerpt, env.initial[0].basisExcerpt); assert.equal(decision.actor, 'Repórter');
  assert.equal(env.item.actionItems.length, 0); assert.equal(env.renders, 1);
  env.accept(form); assert.equal(env.item.claims[0].requirements.length, 1);
});

test('actual proposal helpers preserve edits across rerender and case switches using full fingerprint and original case ID', () => {
  const env = setup(); const proposal = env.initial[0]; const form = env.forms[0];
  const edited = 'Texto editado antes de navegar'; form.fields.text.value = edited;
  form.handlers['text-input']();
  assert.match(env.context.renderProposalCard(proposal, 'claim', 'claim-1', 'case-1'), /Texto editado antes de navegar/);
  // Rendering another case captures the old DOM after currentId already changed.
  env.state.currentId = 'case-2'; env.context.captureProposalEdits();
  const otherCase = env.context.renderProposalCard(proposal, 'claim', 'claim-1', 'case-2');
  assert.equal(otherCase.includes(edited), false);
  env.state.currentId = 'case-1';
  const restored = env.context.renderProposalCard(proposal, 'claim', 'claim-1', 'case-1');
  assert.equal(restored.includes(edited), true);
  const changed = suggestClaimRequirements({ claimId: 'claim-1', text: env.item.claims[0].text + ' Mudança.' })[0];
  assert.equal(env.context.renderProposalCard(changed, 'claim', 'claim-1', 'case-1').includes(edited), false);
  form.fields.text.value = form.dataset.originalText; form.handlers['text-input']();
  assert.equal(env.context.proposalDraftMemory.size, 0);
});

test('rejecting preserves decision memory and produces no requirement after rerender', () => {
  const env = setup(); env.forms[0].handlers.reject();
  assert.equal(env.item.claims[0].requirements.length, 0); assert.equal(env.item.actionItems.length, 0);
  assert.equal(env.item.claimSuggestionDecisions[0].status, 'rejected');
  const proposals = env.context.claimProposals(env.item, env.item.claims[0], 'claim-1');
  assert.equal(proposals.some(proposal => proposal.id === env.initial[0].id), false);
  assert.equal(env.renders, 1);
});

test('failed decision persistence rolls back requirements, tasks, decisions and transparency, retaining edited input', () => {
  for (const accept of [true, false]) {
    const env = setup(); env.saved = false; env.forms[0].fields.text.value = 'Minha revisão preservada';
    const requirements = env.item.claims[0].requirements; const actions = env.item.actionItems; const log = env.item.transparencyLog;
    if (accept) env.accept(env.forms[0]); else env.forms[0].handlers.reject();
    assert.equal(env.item.claims[0].requirements, requirements); assert.equal(env.item.actionItems, actions); assert.equal(env.item.transparencyLog, log);
    assert.equal(env.item.claimSuggestionDecisions, undefined); assert.equal(env.renders, 0);
    assert.equal(env.forms[0].fields.text.value, 'Minha revisão preservada'); assert.match(env.forms[0].fields.notice.textContent, /nenhum registro foi criado/);
  }
});

test('pending manual add, review or another proposal edit blocks acceptance without losing fields', () => {
  const cases = [
    env => { env.addText.value = 'Requisito manual pendente'; },
    env => {
      const requirement = createClaimRequirement({ text: 'Requisito existente' }, { id: 'manual-1' }); env.item.claims[0].requirements.push(requirement);
      env.reviewForms.push({ dataset: { claimId: 'claim-1', requirementId: requirement.id }, querySelector(selector) { return { value: selector.includes('requirementStatus') ? 'open' : 'Notas pendentes' }; }, querySelectorAll: () => [] });
    },
    env => { env.forms[1].fields.text.value = 'Outra sugestão editada'; }
  ];
  for (const modify of cases) {
    const env = setup(); modify(env); const count = env.item.claims[0].requirements.length; env.accept(env.forms[0]);
    assert.equal(env.item.claims[0].requirements.length, count); assert.equal(env.item.claimSuggestionDecisions, undefined);
    assert.equal(env.renders, 0); assert.match(env.forms[0].fields.notice.textContent, /outras alterações pendentes/);
  }
});

test('stale proposal IDs cannot be accepted after the exact source claim changes', () => {
  const env = setup(); env.item.claims[0].text += ' Texto atualizado.'; env.accept(env.forms[0]);
  assert.equal(env.item.claims[0].requirements.length, 0); assert.equal(env.item.claimSuggestionDecisions, undefined);
  assert.match(env.forms[0].fields.notice.textContent, /origem mudou/); assert.equal(env.renders, 0);
});

test('an unchanged proposal ID with a mismatched full fingerprint is refused', () => {
  const env = setup(); env.forms[0].dataset.proposalFingerprint += 'tampered'; env.accept(env.forms[0]);
  assert.equal(env.item.claims[0].requirements.length, 0); assert.equal(env.item.claimSuggestionDecisions, undefined);
  assert.match(env.forms[0].fields.notice.textContent, /origem mudou/);
});

test('proposal cards escape source excerpts and editable suggestion text', () => {
  const env = setup();
  const html = env.context.renderProposalCard({ ...env.initial[0], text: '</textarea><script>x</script>', basisExcerpt: '<img src=x onerror=alert(1)>' }, 'claim', 'claim-1');
  assert.equal(html.includes('<script>'), false); assert.equal(html.includes('<img src=x'), false);
  assert.match(html, /&lt;\/textarea&gt;/); assert.match(html, /&lt;img/);
});
