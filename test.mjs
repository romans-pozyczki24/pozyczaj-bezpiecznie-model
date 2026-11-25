import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSimulation } from './model.js';

test('spłata jednorazowa na 1 miesiąc liczy 12% kosztu i poprawne RRSO', () => {
  const res = calculateSimulation(1000, 1);
  assert.equal(res.isSingle, true);
  assert.equal(res.costCents, 12000);
  assert.equal(res.totalCents, 112000);
  assert.equal(res.schedule.length, 1);
  assert.equal(res.schedule[0].balanceCents, 0);
  assert.ok(Math.abs(res.apr - 289.5976) < 0.01);
});

test('harmonogram ratalny zeruje kapitał i domyka sumy do grosza', () => {
  const res = calculateSimulation(4500, 12);
  assert.equal(res.isSingle, false);
  assert.equal(res.schedule.length, 12);
  assert.equal(res.schedule.at(-1).balanceCents, 0);
  const sumPrincipal = res.schedule.reduce((s, r) => s + r.principalPartCents, 0);
  const sumPayments = res.schedule.reduce((s, r) => s + r.paymentCents, 0);
  assert.equal(sumPrincipal, res.principalCents);
  assert.equal(sumPayments, res.totalCents);
  assert.ok(Math.abs(res.apr - 60) < 0.5);
});

test('walidacja odrzuca wartości spoza zakresu', () => {
  assert.throws(() => calculateSimulation(50, 12), RangeError);
  assert.throws(() => calculateSimulation(25000, 12), RangeError);
  assert.throws(() => calculateSimulation(1000, 25), RangeError);
});
