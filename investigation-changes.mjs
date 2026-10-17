// Checkpoints describe recorded counts and identities, never causes or proof.
export const CHANGE_CHECKPOINT_SCHEMA = 'evidence-desk-investigation-checkpoint';
const collections = Object.freeze(['notes','citations','hypotheses','sources','gaps','requirements','evidence','actions','decisions']);
const MAX_RECORDS = 5000;
const MAX_SNAPSHOT_LENGTH = 2_000_000;
const array = value => Array.isArray(value) ? value : [];
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const explicitId = value => typeof value === 'string' && value.trim() ? value : null;
const identity = entry => JSON.stringify([entry.scope,entry.id]);

function checkedSize(snapshot) {
  if (JSON.stringify(snapshot).length > MAX_SNAPSHOT_LENGTH) throw new Error('O checkpoint excede o limite de tamanho. Nenhum registro foi descartado.');
  return snapshot;
}

export function createInvestigationCheckpoint(item = {}) {
  if (!record(item)) throw new Error('A investigação deve ser um registro.');
  const raw = Object.fromEntries(collections.map(name=>[name,[]]));
  function collect(name, values, scope) {
    for (const entry of array(values)) {
      if (!record(entry)) throw new Error('Registro inválido em ' + name);
      const id = explicitId(entry.id) || (name === 'decisions' ? explicitId(entry.fingerprint) : null);
      const sourceMaterialId = (name === 'citations' ? explicitId(entry.noteId) : null) || explicitId(entry.sourceMaterialId) || explicitId(entry.originMaterialId) || explicitId(entry.originNoteId) || (name === 'notes' ? id : null);
      raw[name].push({id,scope,sourceMaterialId});
    }
  }
  collect('notes',item.reporterNotes,'reporterNotes');
  collect('notes',item.quickNotes,'quickNotes');
  collect('citations',item.materialCitations,'materialCitations');
  collect('hypotheses',item.hypotheses,'hypotheses');
  collect('sources',item.sources,'sources');
  collect('gaps',item.gaps,'gaps');
  collect('evidence',item.verifiedEvidence,'verifiedEvidence');
  collect('evidence',item.evidence,'evidence');
  collect('actions',item.actionItems,'actionItems');
  collect('decisions',item.radarDecisions,'radarDecisions');
  collect('decisions',item.claimSuggestionDecisions,'claimSuggestionDecisions');
  for (const claim of array(item.claims)) {
    if (!record(claim)) throw new Error('Afirmação inválida no checkpoint.');
    collect('requirements',claim.requirements,explicitId(claim.id));
  }
  const total = Object.values(raw).reduce((sum,entries)=>sum+entries.length,0);
  if (total > MAX_RECORDS) throw new Error('Há registros demais para um checkpoint. Nenhum registro foi descartado.');
  const result = {schema:CHANGE_CHECKPOINT_SCHEMA,version:1,investigationId:explicitId(item.id),collections:{}};
  for (const name of collections) {
    const entries = raw[name];
    const identities = new Map();
    for (const entry of entries) if (entry.id !== null) {
      const key=identity(entry);
      identities.set(key,[...(identities.get(key)||[]),entry]);
    }
    result.collections[name]={
      count:entries.length,
      unidentified:entries.filter(entry=>entry.id === null).length,
      ambiguousIds:[...identities.values()].filter(matches=>matches.length > 1).map(matches=>({id:matches[0].id,scope:matches[0].scope,count:matches.length})).sort((a,b)=>identity(a).localeCompare(identity(b),'en')),
      records:[...identities.values()].filter(matches=>matches.length === 1).map(matches=>matches[0]).sort((a,b)=>identity(a).localeCompare(identity(b),'en')),
    };
  }
  return checkedSize(result);
}

function validateCheckpoint(snapshot) {
  if (!record(snapshot) || snapshot.schema !== CHANGE_CHECKPOINT_SCHEMA || snapshot.version !== 1 || !record(snapshot.collections)) throw new Error('Formato ou versão de checkpoint inválido.');
  let total=0;
  for (const name of collections) {
    const group=snapshot.collections[name];
    if (!record(group) || !Number.isSafeInteger(group.count) || group.count < 0 || !Number.isSafeInteger(group.unidentified) || group.unidentified < 0 || !Array.isArray(group.records) || !Array.isArray(group.ambiguousIds)) throw new Error('Contagens de checkpoint inválidas.');
    total+=group.count;
    const ids=new Set();
    for (const entry of [...group.records,...group.ambiguousIds]) {
      if (!record(entry) || !explicitId(entry.id) || !(entry.scope === null || typeof entry.scope === 'string')) throw new Error('Identificador de checkpoint inválido.');
      if (ids.has(identity(entry))) throw new Error('Identificador repetido no checkpoint.');
      ids.add(identity(entry));
    }
    for (const entry of group.records) if (!(entry.sourceMaterialId === null || explicitId(entry.sourceMaterialId))) throw new Error('Material de origem inválido no checkpoint.');
    if (group.ambiguousIds.some(entry=>!Number.isSafeInteger(entry.count) || entry.count < 2) || group.records.length + group.unidentified + group.ambiguousIds.reduce((sum,entry)=>sum+entry.count,0) !== group.count) throw new Error('Contagens incompatíveis no checkpoint.');
  }
  if (total > MAX_RECORDS) throw new Error('Há registros demais no checkpoint.');
  checkedSize(snapshot);
}

export function diffInvestigationCheckpoints(before, after, {sourceMaterialId=null,limit=40} = {}) {
  validateCheckpoint(before); validateCheckpoint(after);
  if (before.investigationId !== after.investigationId) throw new Error('Os checkpoints pertencem a investigações diferentes.');
  if (sourceMaterialId !== null && !explicitId(sourceMaterialId)) throw new Error('Identificador do material inválido.');
  if (!Number.isInteger(limit) || limit < 0 || limit > 200) throw new Error('O limite de mudanças deve estar entre 0 e 200.');
  const changes=[];
  const counts={};
  for (const collection of collections) {
    const old=before.collections[collection], now=after.collections[collection];
    counts[collection]={before:old.count,after:now.count,delta:now.count-old.count};
    if (old.count !== now.count) changes.push({type:'count',collection,...counts[collection],sourceMaterialId,causalityInferred:false});
    const oldIds=new Map(old.records.map(entry=>[identity(entry),entry]));
    const newIds=new Map(now.records.map(entry=>[identity(entry),entry]));
    // Ambiguous identities never become apparent additions/removals by resolving a duplicate.
    const ambiguous=new Set([...old.ambiguousIds,...now.ambiguousIds].map(identity));
    for (const [type,from,to] of [['removed',oldIds,newIds],['added',newIds,oldIds]]) {
      for (const [key,entry] of from) if (!to.has(key) && !ambiguous.has(key)) changes.push({type,collection,id:entry.id,scope:entry.scope,sourceMaterialId:entry.sourceMaterialId || sourceMaterialId,causalityInferred:false});
    }
  }
  return {changes:changes.slice(0,limit),total:changes.length,truncated:changes.length > limit,counts,sourceMaterialId,causalityInferred:false};
}
