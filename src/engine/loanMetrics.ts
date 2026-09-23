import type { Loan } from './types';

/**
 * Convierte una tasa efectiva anual (en porcentaje) a su equivalente mensual.
 * Usa la equivalencia compuesta colombiana: i_m = (1 + EA)^(1/12) - 1.
 */
export const monthlyRateFromEA = (eAInterestRate: number): number => Math.pow(1 + eAInterestRate / 100, 1 / 12) - 1;

/** Cuotas que faltan por pagar según el plazo pactado. */
export const remainingQuotes = (loan: Loan): number => Math.max(0, loan.term - loan.numberQuote);

/** Porcentaje del plazo ya cubierto, entre 0 y 100. */
export const amortizedPercent = (loan: Loan): number => loan.term > 0 ? Math.min(100, Math.max(0, loan.numberQuote / loan.term * 100)) : 0;

/**
 * Cuota francesa para un saldo, una tasa mensual y un número de periodos.
 * Con tasa cero degrada a un reparto lineal del capital.
 */
export const frenchPayment = (balance: number, monthlyRate: number, months: number): number => {
  if (months <= 0 || balance <= 0) return 0;
  if (monthlyRate <= 0) return balance / months;
  return balance * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
};

/**
 * Meses (fraccionarios) que tarda un saldo en extinguirse pagando `payment` al mes.
 * Devuelve Infinity cuando la cuota no alcanza a cubrir el interés del periodo,
 * porque en ese escenario el saldo nunca baja.
 */
export const monthsToPayOff = (balance: number, monthlyRate: number, payment: number): number => {
  if (balance <= 0) return 0;
  if (payment <= 0) return Number.POSITIVE_INFINITY;
  if (monthlyRate <= 0) return balance / payment;
  if (payment <= balance * monthlyRate) return Number.POSITIVE_INFINITY;
  return -Math.log(1 - balance * monthlyRate / payment) / Math.log(1 + monthlyRate);
};

/** Intereses totales que se pagan al extinguir `balance` con cuotas de `payment`. */
export const totalInterestToPayOff = (balance: number, monthlyRate: number, payment: number): number => {
  const months = monthsToPayOff(balance, monthlyRate, payment);
  if (!Number.isFinite(months)) return Number.POSITIVE_INFINITY;
  return Math.max(0, payment * months - balance);
};

/**
 * Saldo de capital estimado tras `numberQuote` cuotas, por amortización francesa:
 * B_n = P * (1 + i)^n - cuota * ((1 + i)^n - 1) / i.
 *
 * ESTIMACIÓN: parte del monto desembolsado, la cuota pactada y la tasa E.A. del
 * crédito. No contempla abonos extraordinarios, mora, refinanciaciones ni
 * seguros capitalizados, así que el saldo real debe tomarse del extracto de la
 * entidad. Sirve para priorizar y simular, no para pagar el crédito.
 */
export const estimatedRemainingBalance = (loan: Loan): number => {
  const rate = monthlyRateFromEA(loan.eAInterestRate);
  const paid = Math.max(0, Math.min(loan.numberQuote, loan.term));
  if (paid === 0) return Math.max(0, loan.originalAmount);
  if (rate <= 0) return Math.max(0, loan.originalAmount - loan.quote * paid);
  const growth = Math.pow(1 + rate, paid);
  return Math.max(0, loan.originalAmount * growth - loan.quote * (growth - 1) / rate);
};

/** Desembolso mensual real del crédito: cuota + seguros + otros conceptos. */
export const totalMonthlyPayment = (loan: Loan): number =>
  loan.quote + loan.secureLife + loan.secureQuote + (loan.secureCar ?? 0) + loan.otherConcepts;

/**
 * Tasa E.A. ponderada por saldo restante estimado.
 * Responde "¿a qué tasa se está endeudando realmente cada peso que debo?".
 */
export const weightedEARate = (loans: Loan[]): number => {
  const totalBalance = loans.reduce((total, loan) => total + estimatedRemainingBalance(loan), 0);
  if (totalBalance <= 0) return 0;
  return loans.reduce((total, loan) => total + loan.eAInterestRate * estimatedRemainingBalance(loan), 0) / totalBalance;
};

/**
 * Intereses que faltan por pagar, sumando (cuota * cuotas restantes) - saldo estimado.
 *
 * ESTIMACIÓN: asume que cada crédito se extingue exactamente en las cuotas que le
 * restan del plazo pactado. Si la cuota registrada amortiza más rápido que el plazo
 * (datos inconsistentes) la cifra queda sobreestimada; para la proyección fina usa
 * `totalInterestToPayOff`, que sí resuelve el plazo real por amortización.
 */
export const projectedRemainingInterest = (loans: Loan[]): number =>
  loans.reduce((total, loan) => total + Math.max(0, loan.quote * remainingQuotes(loan) - estimatedRemainingBalance(loan)), 0);

/**
 * Próxima fecha de pago entre todos los créditos, tomando el `paymentDay` de cada
 * uno en el mes en curso y, si ya pasó, el del mes siguiente. El día se recorta al
 * último día del mes (un pago el 31 cae el 28/29 en febrero).
 */
export const nextPaymentDate = (loans: Loan[], referenceDate: Date): Date | undefined => {
  const startOfDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const occurrence = (year: number, month: number, day: number): Date => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(Math.max(1, day), lastDay));
  };
  const dates = loans.map((loan) => {
    const thisMonth = occurrence(startOfDay.getFullYear(), startOfDay.getMonth(), loan.paymentDay);
    return thisMonth >= startOfDay ? thisMonth : occurrence(startOfDay.getFullYear(), startOfDay.getMonth() + 1, loan.paymentDay);
  });
  return dates.length === 0 ? undefined : dates.reduce((closest, date) => date < closest ? date : closest);
};

export type ExtraPaymentMode = 'term' | 'quote';

export interface ExtraPaymentResult {
  mode: ExtraPaymentMode;
  /** Abono efectivamente aplicado (recortado al saldo restante). */
  appliedAmount: number;
  interestSaved: number;
  baselineRemainingMonths: number;
  newRemainingMonths: number;
  baselineQuote: number;
  newQuote: number;
}

/**
 * Simula un abono extraordinario a capital sobre el saldo estimado del crédito,
 * resolviendo la amortización francesa real en ambos escenarios.
 *
 * - `term` ("reducir plazo"): mantiene la cuota y recalcula en cuántos meses se
 *   extingue el saldo ya rebajado.
 * - `quote` ("reducir cuota"): mantiene el horizonte de meses del escenario base y
 *   recalcula la cuota francesa sobre el saldo rebajado.
 *
 * El ahorro es la diferencia de intereses entre el escenario base y el nuevo.
 * ESTIMACIÓN: se apoya en `estimatedRemainingBalance`, así que hereda sus supuestos.
 */
export const simulateExtraPayment = (loan: Loan, amount: number, mode: ExtraPaymentMode): ExtraPaymentResult => {
  const rate = monthlyRateFromEA(loan.eAInterestRate);
  const balance = estimatedRemainingBalance(loan);
  const appliedAmount = Math.max(0, Math.min(amount, balance));
  // Un residuo por debajo de un peso se da por saldado: evita que el error de coma
  // flotante reporte "1 mes" más cuando el abono liquida el crédito completo.
  const residual = balance - appliedAmount;
  const newBalance = residual < 1 ? 0 : residual;

  const baselineExactMonths = monthsToPayOff(balance, rate, loan.quote);
  const baselineMonths = Number.isFinite(baselineExactMonths) ? Math.ceil(baselineExactMonths) : remainingQuotes(loan);
  const baselineInterest = totalInterestToPayOff(balance, rate, loan.quote);

  if (mode === 'term') {
    const newExactMonths = monthsToPayOff(newBalance, rate, loan.quote);
    const newInterest = totalInterestToPayOff(newBalance, rate, loan.quote);
    return {
      mode,
      appliedAmount,
      interestSaved: Number.isFinite(baselineInterest) && Number.isFinite(newInterest) ? Math.max(0, baselineInterest - newInterest) : 0,
      baselineRemainingMonths: baselineMonths,
      newRemainingMonths: Number.isFinite(newExactMonths) ? Math.ceil(newExactMonths) : baselineMonths,
      baselineQuote: loan.quote,
      newQuote: newBalance > 0 ? loan.quote : 0,
    };
  }

  const newQuote = frenchPayment(newBalance, rate, baselineMonths);
  const newInterest = Math.max(0, newQuote * baselineMonths - newBalance);
  return {
    mode,
    appliedAmount,
    interestSaved: Number.isFinite(baselineInterest) ? Math.max(0, baselineInterest - newInterest) : 0,
    baselineRemainingMonths: baselineMonths,
    newRemainingMonths: baselineMonths,
    baselineQuote: loan.quote,
    newQuote,
  };
};
