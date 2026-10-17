// Reporting proposals from explicit records only. Scores order work, never truth.
import { adaptLegacyInvestigation } from './investigation-adapter.mjs';
import { assessClaimRequirements } from './claim-requirements.mjs';

const array = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : '';
const normalize = value => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const closed = value => ['resolved','closed','resolvida','resolvido','fechada','fechado','concluida','concluido','done','completed','cancelled','cancelada','cancelado'].includes(normalize(value));
const level = value => {
  const label = normalize(value);
  if (['critical','critica','critico','very high','muito alto','muito alta'].includes(label)) return 3;
  if (['high','alto','alta','grave'].includes(label)) return 2;
  if (['medium','moderate','medio','media','moderado','moderada'].includes(label)) return 1;
  return 0;
};
const dependencies = record => [...new Set(array(record.dependencyIds).filter(id => typeof id === 'string' && id.trim()))];
const stableRecordId = (record, prefix, index) => text(record?.id).trim() || `${prefix}-${index}`;

export function buildInvestigationRadar(item = {}, {limit = 4} = {}) {
  const claims = array(item.claims);
  const gaps = array(item.gaps);
  const tasks = array(item.actionItems);
  const adapted = adaptLegacyInvestigation(item);
  const candidates = [];
  const records = new Map();
  const gapIds = new Map();
  function remember(id, record, done) {
    if (records.has(id)) records.set(id,{ambiguous:true,done:false,dependencyIds:[]});
    else records.set(id,{done,dependencyIds:dependencies(record)});
  }
  gaps.forEach((gap,index) => {
    if (gap && typeof gap === 'object') {
      const id=stableRecordId(gap,'gap',index);
      gapIds.set(id,(gapIds.get(id)||0)+1);
      remember(id,gap,closed(gap.status));
    }
  });
  tasks.forEach((task,index) => {
    if (task && typeof task === 'object') remember(stableRecordId(task,'task',index),task,closed(task.status));
  });
  const requirementRecords = [];
  claims.forEach((claim,claimIndex) => {
    if (!claim || typeof claim !== 'object') return;
    const claimId = stableRecordId(claim,'claim',claimIndex);
    const requirements = array(claim.requirements);
    const assessed = assessClaimRequirements(requirements,adapted).requirements;
    requirements.forEach((requirement,index) => {
      if (!requirement || typeof requirement !== 'object') return;
      const id = stableRecordId(requirement,`${claimId}-requirement`,index);
      remember(id,requirement,assessed[index].status === 'documented');
      requirementRecords.push({requirement,id,claim,claimId,audit:assessed[index]});
    });
  });

  function propose(record, type, id, excerpt, linkedClaims, extra, assessment = null) {
    if (!excerpt.trim()) return;
    const claimRisk = linkedClaims.map(claim=>text(claim.risk));
    const severity = level(record.severity);
    const risk = Math.max(level(record.risk),...claimRisk.map(level),0);
    const impact = linkedClaims.length;
    const dependencyIds = dependencies(record);
    const dependencyStates = dependencyIds.map(id => ({id,state:!records.has(id) ? 'missing' : records.get(id).ambiguous ? 'ambiguous' : records.get(id).done ? 'resolved' : 'unresolved'}));
    const basis = {type,id,excerpt};
    // An exact canonical fingerprint avoids silently treating changed text as an old decision.
    const fingerprint = 'radar-v1:' + JSON.stringify({basis,status:record.status ?? null,severity:record.severity ?? null,risk:record.risk ?? null,notes:record.notes ?? null,nextStep:record.nextStep ?? null,claimRisk,claimIds:linkedClaims.map(claim=>claim.id),dependencyIds,dependencyStates,effort:record.effort ?? null,assessment});
    candidates.push({
      id:type === 'requirement' ? `radar:requirement:${encodeURIComponent(extra.claimId)}:${encodeURIComponent(id)}` : `radar:gap:${encodeURIComponent(id)}`,
      fingerprint,
      title:(type === 'gap' ? 'Apurar lacuna: ' : 'Conferir requisito: ') + excerpt,
      basis,
      ...extra,
      priority: Math.max(severity,risk) >= 2 ? 'Alta' : Math.max(severity,risk) === 1 ? 'Média' : 'A revisar',
      score:severity * 100 + risk * 10 + impact,
      rationale:[
        {factor:'Gravidade registrada',value:text(record.severity) || null,points:severity*100},
        {factor:'Risco registrado no item ou nas afirmações vinculadas',value:{item:text(record.risk) || null,claims:claimRisk},points:risk*10},
        {factor:'Afirmações explicitamente vinculadas',value:impact,points:impact},
      ],
      effort:{known:record.effort !== undefined && record.effort !== null && record.effort !== '',value:record.effort ?? null},
      dependencyIds,
    });
  }

  gaps.forEach((gap,index) => {
    if (!gap || typeof gap !== 'object' || closed(gap.status)) return;
    const id = stableRecordId(gap,'gap',index);
    if (gapIds.get(id) !== 1) return;
    const linked = claims.flatMap((claim,claimIndex) => {
      if (!claim || typeof claim !== 'object') return [];
      const claimId = stableRecordId(claim,'claim',claimIndex);
      return gap.target_claim_id === claimId || array(gap.target_claim_ids).includes(claimId) ? [{...claim,id:claimId}] : [];
    });
    propose(gap,'gap',id,text(gap.description || gap.text || gap.title),linked,{gapId:id,...(linked.length === 1 ? {claimId:linked[0].id} : {})});
  });
  for (const {requirement,id,claim,claimId,audit} of requirementRecords) {
    if (requirementRecords.filter(entry=>entry.claimId === claimId && entry.id === id).length !== 1) continue;
    if (audit.status === 'documented' || closed(requirement.status)) continue;
    propose(requirement,'requirement',id,text(requirement.text),[{...claim,id:claimId}],{claimId,requirementId:id},{status:audit.status,linkedEvidenceIds:audit.linkedEvidenceIds,missingEvidenceIds:audit.missingEvidenceIds});
  }

  function cycleFrom(id, path = new Set()) {
    if (path.has(id)) return true;
    const record = records.get(id);
    if (!record || record.done || record.ambiguous) return false;
    const next = new Set(path); next.add(id);
    return record.dependencyIds.some(dependency => cycleFrom(dependency,next));
  }
  const decisions = new Set(array(item.radarDecisions).filter(decision => decision && ['accepted','rejected'].includes(decision.decision || decision.status)).map(decision => decision.fingerprint));
  const basisCounts = new Map();
  for (const candidate of candidates) basisCounts.set(candidate.id,(basisCounts.get(candidate.id) || 0)+1);
  let suppressed = 0;
  const proposals = candidates.filter(candidate => {
    if (basisCounts.get(candidate.id) !== 1) { suppressed++; return false; }
    const existing = tasks.some(task => task && (task.originRadarFingerprint === candidate.fingerprint || candidate.gapId && task.originGapId === candidate.gapId || candidate.requirementId && task.originRequirementId === candidate.requirementId && task.target_claim_id === candidate.claimId));
    if (existing || decisions.has(candidate.fingerprint)) { suppressed++; return false; }
    return true;
  }).map(candidate => {
    const unresolvedDependencyIds = candidate.dependencyIds.filter(id => !records.get(id)?.done);
    return {...candidate,unresolvedDependencyIds,waiting:unresolvedDependencyIds.length > 0,dependencyCycle:cycleFrom(candidate.basis.id)};
  }).sort((a,b) => Number(a.waiting)-Number(b.waiting) || b.score-a.score);
  const total = proposals.length;
  return {proposals:proposals.slice(0,Number.isFinite(limit) ? Math.min(4,Math.max(0,Math.floor(limit))) : 4),total,suppressed,waiting:proposals.filter(proposal=>proposal.waiting).length};
}
