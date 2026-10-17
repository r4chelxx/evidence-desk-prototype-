import test from 'node:test';
import assert from 'node:assert/strict';
import { createMaterialViewer,selectMaterialSegment,MAX_VIEWER_TEXT_LENGTH,MAX_VIEWER_SEGMENTS } from '../material-viewer.mjs';
import { createMaterialCitation } from '../material-citations.mjs';

test('explicit PT/EN markers preserve exact source offsets and only declared page numbers',()=>{
  const text='[Página 3]\r\n  Ação e dados.\r\n[Page 8]\nOutro trecho.';
  const viewer=createMaterialViewer(text);
  assert.equal(viewer.pagination,'explicit'); assert.equal(viewer.segments.length,2);
  assert.deepEqual(viewer.segments.map(segment=>segment.pageNumber),[3,8]);
  assert.equal(viewer.segments[0].text,'  Ação e dados.\r\n');
  for (const segment of viewer.segments) assert.equal(text.slice(segment.start,segment.end),segment.text);
  const selected=selectMaterialSegment(viewer,viewer.segments[0].id,{start:0,end:6});
  assert.equal(selected.text,'  Ação'); assert.equal(text.slice(selected.start,selected.end),selected.text); assert.equal(selected.locator,'p. 3');
  const citation=createMaterialCitation({id:'note-1',text},selected);
  assert.equal(citation.text,selected.text); assert.equal(citation.start,selected.start); assert.equal(citation.locator,'p. 3');
});

test('unmarked text is one unpaged section and inline page mentions do not create pagination',()=>{
  const text='A referência [Página 2] aparece no texto.\nOutra linha.';
  const viewer=createMaterialViewer(text);
  assert.equal(viewer.pagination,'unpaged'); assert.equal(viewer.segments.length,1);
  assert.equal(viewer.segments[0].pageNumber,null); assert.equal(viewer.segments[0].text,text);
  assert.equal(selectMaterialSegment(viewer,viewer.segments[0].id,{start:0,end:1}).locator,null);
  assert.equal(createMaterialViewer('').segments[0].text,'');
});

test('form-feed creates unnumbered sections without invented sequential page locators',()=>{
  const viewer=createMaterialViewer('Primeiro\fSegundo\fTerceiro');
  assert.equal(viewer.pagination,'separated'); assert.deepEqual(viewer.segments.map(segment=>segment.text),['Primeiro','Segundo','Terceiro']);
  assert.equal(viewer.segments.every(segment=>segment.pageNumber === null && segment.locatorSuggestion === null),true);
  const selected=selectMaterialSegment(viewer,viewer.segments[1].id,{start:0,end:7,locator:'Seção conferida pela repórter'});
  assert.equal(selected.start,9); assert.equal(selected.text,'Segundo'); assert.equal(selected.locator,'Seção conferida pela repórter');
});

test('prefaces, explicit empty pages, repeated nonsequential labels and mixed boundaries remain literal',()=>{
  const viewer=createMaterialViewer('Prefácio\n[Pagina 01]\n[PAGE 01]\nTexto\fOutro');
  assert.deepEqual(viewer.segments.map(segment=>segment.pageNumber),[null,1,1,null]);
  assert.equal(viewer.segments[0].text,'Prefácio\n'); assert.equal(viewer.segments[1].text,'');
  assert.equal(viewer.segments[1].locatorSuggestion,'p. 01'); assert.equal(viewer.segments[3].text,'Outro');
  assert.equal(viewer.segments[3].locatorSuggestion,null);
});

test('Unicode boundaries, selection bounds and segment identity are validated without mutation',()=>{
  const viewer=createMaterialViewer('[Página 5]\nA😀B'); const segment=viewer.segments[0]; const before=JSON.stringify(viewer);
  assert.equal(selectMaterialSegment(viewer,segment.id,{start:1,end:3}).text,'😀');
  for (const selection of [{start:1,end:2},{start:2,end:3},{start:-1,end:1},{start:0,end:100},{start:0,end:0},{start:0.1,end:2}]) assert.throws(()=>selectMaterialSegment(viewer,segment.id,selection));
  assert.throws(()=>selectMaterialSegment(viewer,'missing',{start:0,end:1}));
  assert.throws(()=>selectMaterialSegment({...viewer,segments:[{...segment,start:0}]},segment.id,{start:0,end:1}));
  assert.equal(JSON.stringify(viewer),before);
});

test('limits reject oversized input or excessive segments rather than dropping text',()=>{
  assert.throws(()=>createMaterialViewer(null));
  assert.throws(()=>createMaterialViewer('x'.repeat(MAX_VIEWER_TEXT_LENGTH+1)));
  assert.equal(createMaterialViewer('x'.repeat(MAX_VIEWER_TEXT_LENGTH)).segments[0].text.length,MAX_VIEWER_TEXT_LENGTH);
  assert.throws(()=>createMaterialViewer('x\f'.repeat(MAX_VIEWER_SEGMENTS)));
  const viewer=createMaterialViewer('  Texto');
  assert.throws(()=>selectMaterialSegment(viewer,viewer.segments[0].id,{start:0,end:2}));
});
