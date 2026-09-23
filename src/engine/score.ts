import { globalUtilization } from './cardMetrics';
import { monthlyDebtCommitment, totalDebt } from './debtMetrics';
import { averageMonthlyIncome } from './incomeMetrics';
import type { CreditCard, Income, Loan } from './types';

export type ScoreLevel = 'bajo' | 'medio' | 'bueno' | 'excelente';
export type ScoreFactorKey = 'utilization' | 'dti' | 'debtLoad' | 'diversity';

export interface ScoreFactor {
  key: ScoreFactorKey;
  /** Peso en la fórmula, como fracción (0.35 = 35%). */
  weight: number;
  /** Valor del factor entre 0 y 1. */
  value: number;
  /** Puntos que aporta al score: 1000 × peso × valor. */
  points: number;
  /** Métrica cruda que alimenta el factor (%, veces el ingreso o productos). */
  metric: number;
}

export interface ScoreResult {
  score: number;
  level: ScoreLevel;
  factors: ScoreFactor[];
}

type Point = readonly [x: number, y: number];

/** Interpolación lineal por tramos; fuera del rango se queda en el extremo. */
const interpolate = (points: readonly Point[], x: number): number => {
  if (x <= points[0][0]) return points[0][1];
  for (let index = 1; index < points.length; index += 1) {
    const [x1, y1] = points[index];
    if (x <= x1) {
      const [x0, y0] = points[index - 1];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
  }
  return points[points.length - 1][1];
};

/** Utilización global de TCs (%): 1.0 bajo 10%, 0.9 en 30%, 0.5 en 70%, 0.15 desde 90%. */
const UTILIZATION_CURVE: readonly Point[] = [[10, 1], [30, 0.9], [70, 0.5], [90, 0.15]];
/** Compromisos / ingreso mensual (%): 1.0 bajo 20%, 0.7 en 35%, 0.3 en 50%, 0.1 desde 65%. */
const DTI_CURVE: readonly Point[] = [[20, 1], [35, 0.7], [50, 0.3], [65, 0.1]];
/** Saldo total de deuda / ingreso anual (veces): 1.0 bajo 0.5x, baja hasta 0.2 en 3x. */
const DEBT_LOAD_CURVE: readonly Point[] = [[0.5, 1], [3, 0.2]];

const WEIGHTS: Record<ScoreFactorKey, number> = { utilization: 0.35, dti: 0.30, debtLoad: 0.20, diversity: 0.15 };

/** Nivel cualitativo del score: bajo < 500 ≤ medio < 700 ≤ bueno ≤ 850 < excelente. */
export const scoreLevel = (score: number): ScoreLevel =>
  score < 500 ? 'bajo' : score < 700 ? 'medio' : score <= 850 ? 'bueno' : 'excelente';

/**
 * Score financiero SIMULADO entre 0 y 1000.
 *
 * AVISO: es una heurística educativa para visualizar la salud financiera. NO es,
 * ni aproxima, el score real de DataCrédito, TransUnion ni ninguna central de
 * riesgo, que usan historial de pagos, moras y variables que esta app no conoce.
 *
 * score = 1000 × (0.35 × utilización + 0.30 × DTI + 0.20 × carga de deuda + 0.15 × diversidad)
 *
 * - utilización: saldo total / cupo total de las TCs (sin tarjetas cuenta como 0%).
 * - DTI: (cuotas de préstamos + mínimos de TC) / ingreso mensual promedio.
 * - carga de deuda: deuda total / ingreso anual (ingreso promedio × 12).
 * - diversidad: 0.5 base, +0.25 si tiene TCs, +0.25 si tiene préstamos.
 *
 * Cada factor se interpola linealmente entre los puntos de su curva. Sin ingresos,
 * cualquier compromiso o saldo se trata como ratio infinito (peor valor posible).
 */
export const calculateScore = (incomes: Income[], loans: Loan[], cards: CreditCard[], referenceDate: Date = new Date()): ScoreResult => {
  const avgIncome = averageMonthlyIncome(incomes, referenceDate);
  const committed = monthlyDebtCommitment(loans, cards);
  const debt = totalDebt(loans, cards);
  const ratio = (part: number, whole: number): number => whole > 0 ? part / whole : part > 0 ? Number.POSITIVE_INFINITY : 0;

  const utilizationPercent = globalUtilization(cards);
  const dtiPercent = ratio(committed, avgIncome) * 100;
  const debtLoad = ratio(debt, avgIncome * 12);
  const products = (cards.length > 0 ? 1 : 0) + (loans.length > 0 ? 1 : 0);

  const values: Record<ScoreFactorKey, [value: number, metric: number]> = {
    utilization: [interpolate(UTILIZATION_CURVE, utilizationPercent), utilizationPercent],
    dti: [interpolate(DTI_CURVE, dtiPercent), dtiPercent],
    debtLoad: [interpolate(DEBT_LOAD_CURVE, debtLoad), debtLoad],
    diversity: [0.5 + 0.25 * products, products],
  };

  const factors = (Object.keys(WEIGHTS) as ScoreFactorKey[]).map((key): ScoreFactor => {
    const [value, metric] = values[key];
    return { key, weight: WEIGHTS[key], value, points: 1000 * WEIGHTS[key] * value, metric };
  });
  const score = Math.round(factors.reduce((total, factor) => total + factor.points, 0));
  return { score, level: scoreLevel(score), factors };
};
