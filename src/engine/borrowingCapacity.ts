import { monthlyDebtCommitment } from './debtMetrics';
import { averageMonthlyIncome } from './incomeMetrics';
import { monthlyRateFromEA } from './loanMetrics';
import type { CreditCard, Income, Loan } from './types';

/** Porción del ingreso que se considera sano destinar a deuda. */
export const MAX_DEBT_TO_INCOME = 0.40;
/** Tasa E.A. de referencia (fracción) para estimar un crédito nuevo. */
export const REFERENCE_EA_RATE = 0.24;
/** Plazo de referencia, en meses, para estimar un crédito nuevo. */
export const REFERENCE_TERM_MONTHS = 60;

/**
 * Cuota mensual que todavía cabe en el presupuesto: el 40% del ingreso mensual
 * promedio menos los compromisos actuales (cuotas de préstamos + mínimos de TC).
 * Nunca es negativa.
 */
export const maxMonthlyQuota = (incomes: Income[], loans: Loan[], cards: CreditCard[], referenceDate: Date = new Date()): number =>
  Math.max(0, averageMonthlyIncome(incomes, referenceDate) * MAX_DEBT_TO_INCOME - monthlyDebtCommitment(loans, cards));

/**
 * Monto máximo de crédito que soporta `maxQuota`, por amortización francesa inversa:
 * P = cuota × (1 − (1 + i)^−n) / i, con i la tasa mensual equivalente a `eaRate`.
 * `eaRate` va como fracción (0.24 = 24% E.A.).
 */
export const borrowingCapacity = (maxQuota: number, eaRate: number = REFERENCE_EA_RATE, termMonths: number = REFERENCE_TERM_MONTHS): number => {
  if (maxQuota <= 0 || termMonths <= 0) return 0;
  const rate = monthlyRateFromEA(eaRate * 100);
  if (rate <= 0) return maxQuota * termMonths;
  return maxQuota * (1 - Math.pow(1 + rate, -termMonths)) / rate;
};

export interface BorrowingCapacityReport {
  maxQuota: number;
  capacity: number;
  /** Deuda / ingreso mensual, en porcentaje (35 = 35%). */
  dti: number;
  committedMonthly: number;
  avgIncome: number;
}

/**
 * Diagnóstico completo de capacidad de endeudamiento. Sin ingresos el DTI se
 * reporta en 100% si hay compromisos (todo el flujo está comprometido) y en 0% si no.
 */
export const borrowingCapacityReport = (incomes: Income[], loans: Loan[], cards: CreditCard[], referenceDate: Date = new Date()): BorrowingCapacityReport => {
  const avgIncome = averageMonthlyIncome(incomes, referenceDate);
  const committedMonthly = monthlyDebtCommitment(loans, cards);
  const maxQuota = maxMonthlyQuota(incomes, loans, cards, referenceDate);
  const dti = avgIncome > 0 ? committedMonthly / avgIncome * 100 : committedMonthly > 0 ? 100 : 0;
  return { maxQuota, capacity: borrowingCapacity(maxQuota), dti, committedMonthly, avgIncome };
};
