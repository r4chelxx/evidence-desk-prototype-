import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDate, addCalendarDays, daysBetween, getDeadlineInfo } from '../lai-deadlines.mjs';

test('date arithmetic rejects rollover dates and is independent of DST', () => {
  assert.equal(parseDate('2026-02-30'), null);
  assert.equal(parseDate('not a date'), null);
  assert.equal(addCalendarDays('2024-02-20', 20), '2024-03-11');
  assert.equal(daysBetween('2026-03-08', '2026-03-09'), 1);
});
test('uses 20-day reference only when Brazilian rule and receipt are explicitly supplied', () => {
  assert.equal(getDeadlineInfo({ sentDate: '2026-07-02' }, '2026-07-04').date, null);
  const request = { deadlineConfig: { rule: 'br-lai-reference', receivedDate: '2026-07-02' } };
  assert.equal(getDeadlineInfo(request, '2026-07-04').date, '2026-07-22');
  assert.equal(getDeadlineInfo(request, '2026-07-04').kind, 'reference');
});
test('does not assume extension; requires justification and communication date', () => {
  const request = { deadlineConfig: { rule: 'br-lai-reference', receivedDate: '2026-07-02', extension: true } };
  assert.equal(getDeadlineInfo(request, '2026-07-04').reference, '2026-07-22');
  Object.assign(request.deadlineConfig, { extensionReason: 'Busca em arquivos físicos', extensionNotifiedDate: '2026-07-20' });
  assert.equal(getDeadlineInfo(request, '2026-07-04').reference, '2026-08-01');
});
test('preserves official recorded dates and distinguishes a current checkpoint from original deadline', () => {
  const request = { dueDate: '2026-07-23', deadlineConfig: { rule: 'br-lai-reference', receivedDate: '2026-07-02' } };
  assert.equal(getDeadlineInfo(request, '2026-07-04').date, '2026-07-23');
  assert.equal(getDeadlineInfo(request, '2026-07-04').discrepancy, true);
  request.currentCheckpoint = { date: '2026-08-10' };
  assert.equal(getDeadlineInfo(request, '2026-07-04').kind, 'checkpoint');
  assert.equal(getDeadlineInfo(request, '2026-07-04').date, '2026-08-10');
  assert.equal(request.dueDate, '2026-07-23');
});
