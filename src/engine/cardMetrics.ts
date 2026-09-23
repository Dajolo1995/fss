import { frenchPayment } from './loanMetrics';
import type { CreditCard } from './types';

export type UtilizationLevel = 'safe' | 'warning' | 'risk';

/** Cupo que todavía se puede usar. */
export const availableCredit = (card: CreditCard): number => card.creditLimit - card.balance;

/** Porcentaje del cupo consumido. Un cupo en cero se reporta como 0% para no dividir por cero. */
export const utilization = (card: CreditCard): number => card.creditLimit > 0 ? card.balance / card.creditLimit * 100 : 0;

/**
 * Nivel de sanidad crediticia según el porcentaje de utilización:
 * por debajo de 30% es seguro, hasta 70% es alerta y por encima es riesgo.
 */
export const utilizationLevel = (percent: number): UtilizationLevel => percent < 30 ? 'safe' : percent > 70 ? 'risk' : 'warning';

export const totalLimit = (cards: CreditCard[]): number => cards.reduce((total, card) => total + card.creditLimit, 0);

export const totalBalance = (cards: CreditCard[]): number => cards.reduce((total, card) => total + card.balance, 0);

export const totalAvailable = (cards: CreditCard[]): number => cards.reduce((total, card) => total + availableCredit(card), 0);

export const totalMinPayment = (cards: CreditCard[]): number => cards.reduce((total, card) => total + card.minPayment, 0);

/** Utilización consolidada: deuda total sobre cupo total otorgado. */
export const globalUtilization = (cards: CreditCard[]): number => {
  const limit = totalLimit(cards);
  return limit > 0 ? totalBalance(cards) / limit * 100 : 0;
};

/**
 * Días que faltan para el próximo día de pago. Si el día del mes ya pasó cuenta
 * hasta el mes siguiente, y recorta el día al último del mes (un pago el 31 cae
 * el 28 o 29 en febrero).
 */
export const daysUntilPaymentDay = (paymentDay: number, today: Date): number => {
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const occurrence = (year: number, month: number): Date => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(Math.max(1, paymentDay), lastDay));
  };
  const thisMonth = occurrence(startOfDay.getFullYear(), startOfDay.getMonth());
  const target = thisMonth >= startOfDay ? thisMonth : occurrence(startOfDay.getFullYear(), startOfDay.getMonth() + 1);
  return Math.round((target.getTime() - startOfDay.getTime()) / 86400000);
};

/** Tarjeta cuyo día límite de pago vence primero. */
export const nearestPaymentDay = (cards: CreditCard[], today: Date): CreditCard | undefined =>
  cards.reduce<CreditCard | undefined>((closest, card) =>
    closest === undefined || daysUntilPaymentDay(card.paymentDay, today) < daysUntilPaymentDay(closest.paymentDay, today)
      ? card
      : closest, undefined);

/** Convierte una tasa mes vencido a efectiva anual. Ambas en porcentaje (1.5 → 19.56). */
export const mvToEA = (mv: number): number => (Math.pow(1 + mv / 100, 12) - 1) * 100;

/** Convierte una tasa efectiva anual a mes vencido. Ambas en porcentaje (19.56 → 1.5). */
export const eAToMV = (ea: number): number => (Math.pow(1 + ea / 100, 1 / 12) - 1) * 100;

export interface FinancingCost {
  monthlyQuote: number;
  totalPaid: number;
  interestCost: number;
}

/**
 * Costo de diferir una compra, por amortización francesa real.
 * `monthlyRate` va en porcentaje mes vencido (1.9 = 1.9% M.V.).
 * Una sola cuota es pago de contado: no genera intereses.
 */
export const financingCost = (amount: number, monthlyRate: number, installments: number): FinancingCost => {
  if (installments <= 1 || amount <= 0) return { monthlyQuote: amount, totalPaid: amount, interestCost: 0 };
  const rate = monthlyRate / 100;
  if (rate <= 0) return { monthlyQuote: amount / installments, totalPaid: amount, interestCost: 0 };
  const monthlyQuote = frenchPayment(amount, rate, installments);
  const totalPaid = monthlyQuote * installments;
  return { monthlyQuote, totalPaid, interestCost: Math.max(0, totalPaid - amount) };
};
