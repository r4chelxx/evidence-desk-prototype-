import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createMaterialRecord } from '../material-provenance.mjs';
const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const notesCode = source.slice(source.indexOf('function bindQuickNotes() {'), source.indexOf('function bindActions() {'));
const attachmentStart = source.indexOf("  document.querySelectorAll('[data-role=\"original-attachment-file\"]')", source.indexOf('function bindActions() {'));
const attachmentCode = source.slice(attachmentStart, source.indexOf("  document.querySelectorAll('[data-action=\"download-local-attachment\"]')", attachmentStart));
function setup(saved = true) {
 const item = {id:'case',reporterNotes:[],localAttachments:[]};
 const handlers = {};
 const textarea = {value:'Trecho ainda não salvo',setCustomValidity(){},reportValidity(){},addEventListener(){}};
 const notice = {textContent:''}; const submit = {disabled:false};
 const form = {dataset:{}, addEventListener(name,fn){handlers[name]=fn;},querySelector(selector){return selector.includes('textarea') ? textarea : selector.includes('attachment-notice') ? notice : selector.includes('submit') ? submit : {value:''};}};
 const input = {files:[{name:'original.txt'}], value:'original.txt', closest(){return form;},addEventListener(name,fn){handlers.attachment=fn;}};
 let renders=0, deleted=0;
 const context = vm.createContext({document:{querySelectorAll(selector){return selector.includes('original-attachment-file') ? [input] : selector.includes('quick-note') ? [form] : [];}},getCurrentInvestigation:()=>item,state:{locale:'pt'},createMaterialRecord,storeAttachment:async()=>({id:'file-1',name:'original.txt',size:12,sha256:'a'.repeat(64)}),deleteAttachment:async()=>{deleted++;},saveInvestigations:()=>saved,todayIsoDate:()=> '2026-10-17',renderInvestigation:()=>{renders++;}});
 vm.runInContext(notesCode + '\nbindQuickNotes();\n' + attachmentCode, context);
 return {item,handlers,textarea,form,notice,submit,input,get renders(){return renders;},get deleted(){return deleted;}};
}
test('attaching retains draft and submitting preserves the original reference', async()=>{
 const env=setup(); await env.handlers.attachment();
 assert.equal(env.textarea.value,'Trecho ainda não salvo'); assert.equal(env.renders,0);
 assert.equal(env.form.dataset.attachmentId,'file-1'); assert.equal(env.submit.disabled,false);
 env.handlers.submit({preventDefault(){}});
 assert.equal(env.item.reporterNotes[0].attachmentId,'file-1');
 assert.equal(env.item.reporterNotes[0].verificationStatus,'unverified'); assert.equal(env.renders,1);
});
test('metadata save failure removes orphan bytes and retains the draft', async()=>{
 const env=setup(false); await env.handlers.attachment();
 assert.equal(env.deleted,1); assert.equal(env.item.localAttachments.length,0);
 assert.equal(env.textarea.value,'Trecho ainda não salvo'); assert.equal(env.renders,0);
 assert.equal(env.form.dataset.attachmentId,undefined);
});
test('file-only capture is allowed and a failed note save does not clear the form', async()=>{
 const env=setup(); await env.handlers.attachment(); env.textarea.value=''; env.handlers.submit({preventDefault(){}});
 assert.equal(env.item.reporterNotes[0].text,'original.txt');
 const failed=setup(false); failed.handlers.submit({preventDefault(){}});
 assert.equal(failed.item.reporterNotes.length,0); assert.equal(failed.textarea.value,'Trecho ainda não salvo'); assert.equal(failed.renders,0);
});
