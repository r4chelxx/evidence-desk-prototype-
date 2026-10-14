export const LAI_REFERENCE = {
  label: 'LAI brasileira — referência geral',
  source: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm',
  verifiedAt: '2026-10-14',
  explanation: 'Art. 11: acesso imediato quando disponível; até 20 dias quando isso não for possível. Prorrogação de até 10 dias exige justificativa expressa comunicada ao requerente.',
};

export function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}

export function addCalendarDays(value, days) {
  const date = parseDate(value);
  if (!date || !Number.isInteger(days)) return null;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from, to) {
  const start = parseDate(from), end = parseDate(to);
  return start && end ? Math.round((end - start) / 86400000) : null;
}

export function getDeadlineInfo(request, today) {
  const config = request.deadlineConfig || {};
  const received = config.receivedDate;
  const originalReference = config.rule === 'br-lai-reference' ? addCalendarDays(received, 20) : null;
  const extensionDocumented = Boolean(config.extension && config.extensionReason?.trim() && parseDate(config.extensionNotifiedDate));
  const reference = originalReference && extensionDocumented ? addCalendarDays(received, 30) : originalReference;
  const checkpoint = parseDate(request.currentCheckpoint?.date) ? request.currentCheckpoint.date : null;
  const registered = parseDate(config.confirmedDueDate) ? config.confirmedDueDate : parseDate(request.dueDate) ? request.dueDate : null;
  const date = checkpoint || registered || reference;
  return {
    date, originalReference, reference, extensionDocumented,
    days: daysBetween(today, date),
    kind: checkpoint ? 'checkpoint' : registered ? 'registered' : reference ? 'reference' : 'unknown',
    // Reference dates are arithmetic aids; local rules, holidays and office closures are not inferred.
    discrepancy: Boolean(registered && reference && registered !== reference),
  };
}
