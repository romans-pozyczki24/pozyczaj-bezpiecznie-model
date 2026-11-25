export const MODEL_VERSION = '2026-11-v1';

export const LIMITS = Object.freeze({
  minAmount: 100,
  maxAmount: 20000,
  minMonths: 1,
  maxMonths: 24,
});

const toCents = (amount) => Math.round((amount + Number.EPSILON) * 100);

export function validateInputs(amount, months) {
  if (
    !Number.isFinite(amount) ||
    amount < LIMITS.minAmount ||
    amount > LIMITS.maxAmount ||
    Math.abs(toCents(amount) / 100 - amount) > 1e-8
  ) {
    throw new RangeError('Wpisz kwotę od 100 do 20 000 zł, z dokładnością do grosza.');
  }
  if (!Number.isInteger(months) || months < LIMITS.minMonths || months > LIMITS.maxMonths) {
    throw new RangeError('Wybierz okres od 1 do 24 miesięcy.');
  }
}

export function getTargetApr(months) {
  if (months <= 6) return 85;
  if (months <= 9) return 72;
  if (months <= 12) return 60;
  if (months <= 15) return 55;
  if (months <= 18) return 50;
  if (months <= 21) return 45;
  return 40;
}

export function calculateApr(principalCents, schedule) {
  if (!Number.isSafeInteger(principalCents) || principalCents <= 0 || !Array.isArray(schedule) || !schedule.length) {
    throw new RangeError('Nieprawidłowe przepływy.');
  }
  let prevMonth = 0;
  for (const row of schedule) {
    if (!Number.isSafeInteger(row.paymentCents) || row.paymentCents <= 0 || !Number.isFinite(row.month) || row.month <= prevMonth) {
      throw new RangeError('Nieprawidłowy harmonogram.');
    }
    prevMonth = row.month;
  }
  const totalCents = schedule.reduce((sum, row) => sum + row.paymentCents, 0);
  if (totalCents < principalCents) throw new RangeError('Model nie obsługuje ujemnego kosztu.');
  if (totalCents === principalCents) return 0;

  const npv = (x) => schedule.reduce((sum, row) => sum + row.paymentCents * Math.exp((-x * row.month) / 12), 0) - principalCents;
  let lo = 0;
  let hi = 1;
  while (npv(hi) > 0 && hi < 128) hi *= 2;
  if (npv(hi) > 0) throw new RangeError('Nie udało się wyznaczyć RRSO.');

  for (let i = 0; i < 120; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid;
    else hi = mid;
  }
  return Math.expm1((lo + hi) / 2) * 100;
}

export function buildInstallmentSchedule(principalCents, months, targetApr) {
  const monthlyRate = Math.expm1(Math.log1p(targetApr / 100) / 12);
  const exactPayment =
    monthlyRate === 0
      ? principalCents / months
      : (principalCents * monthlyRate) / -Math.expm1(-months * Math.log1p(monthlyRate));
  const basePayment = Math.round(exactPayment);

  let balanceCents = principalCents;
  const schedule = [];
  for (let month = 1; month <= months; month++) {
    const interestCents = Math.round(balanceCents * monthlyRate);
    const paymentCents = month === months ? balanceCents + interestCents : Math.min(basePayment, balanceCents + interestCents);
    const principalPartCents = paymentCents - interestCents;
    balanceCents -= principalPartCents;
    schedule.push({ month, paymentCents, principalPartCents, interestCents, balanceCents });
  }
  return schedule;
}

export function calculateSimulation(amount, months) {
  validateInputs(amount, months);
  const principalCents = toCents(amount);
  const isSingle = months <= 3;

  let schedule;
  let assumption;
  if (isSingle) {
    const costPercent = [0, 12, 18, 24][months];
    const interestCents = Math.round((principalCents * costPercent) / 100);
    schedule = [
      { month: months, paymentCents: principalCents + interestCents, principalPartCents: principalCents, interestCents, balanceCents: 0 },
    ];
    assumption = { kind: 'single', costPercent };
  } else {
    const targetApr = getTargetApr(months);
    schedule = buildInstallmentSchedule(principalCents, months, targetApr);
    assumption = { kind: 'installments', targetApr };
  }

  const totalCents = schedule.reduce((sum, row) => sum + row.paymentCents, 0);
  return {
    modelVersion: MODEL_VERSION,
    amount,
    months,
    isSingle,
    principalCents,
    schedule,
    assumption,
    paymentCents: schedule[0].paymentCents,
    lastPaymentCents: schedule.at(-1).paymentCents,
    totalCents,
    costCents: totalCents - principalCents,
    apr: calculateApr(principalCents, schedule),
  };
}
