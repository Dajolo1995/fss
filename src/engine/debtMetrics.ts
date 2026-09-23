import { daysUntilPaymentDay, totalBalance, totalMinPayment } from './cardMetrics';
import { estimatedRemainingBalance, monthlyRateFromEA, remainingQuotes, totalMonthlyPayment } from './loanMetrics';
import type { CreditCard, Expense, Loan } from './types';

/** Créditos a los que todavía les quedan cuotas por pagar. */
const activeLoans = (loans: Loan[]): Loan[] => loans.filter((loan) => remainingQuotes(loan) > 0);

/**
 * Compromiso mensual de deuda: desembolso real de cada crédito vivo (cuota +
 * seguros + otros conceptos) más el pago mínimo de cada tarjeta. Es el numerador
 * del DTI y lo que se descuenta de la capacidad de endeudamiento.
 */
export const monthlyDebtCommitment = (loans: Loan[], cards: CreditCard[]): number =>
  activeLoans(loans).reduce((total, loan) => total + totalMonthlyPayment(loan), 0) + totalMinPayment(cards);

/** Deuda total: saldo estimado de los préstamos más el saldo de las tarjetas. */
export const totalDebt = (loans: Loan[], cards: CreditCard[]): number =>
  loans.reduce((total, loan) => total + estimatedRemainingBalance(loan), 0) + totalBalance(cards);

export interface DebtProjectionPoint {
  /** Mes proyectado en formato 'YYYY-MM'. */
  month: string;
  total: number;
}

const monthKey = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

/**
 * Proyección de la deuda total mes a mes pagando solo lo pactado. Devuelve
 * `months + 1` puntos: el primero es el saldo de hoy.
 *
 * - Préstamos: saldo por amortización francesa tras `numberQuote + m` cuotas
 *   (`estimatedRemainingBalance`); en cero una vez se cumple el plazo.
 * - Tarjetas: capitaliza el interés mensual y descuenta el pago mínimo constante,
 *   sin compras nuevas. Si el mínimo no cubre el interés el saldo crece.
 *
 * ESTIMACIÓN: hereda los supuestos de `estimatedRemainingBalance`.
 */
export const projectDebtSeries = (loans: Loan[], cards: CreditCard[], months: number, referenceDate: Date = new Date()): DebtProjectionPoint[] => {
  const cardBalances = cards.map((card) => card.balance);
  const cardRates = cards.map((card) => monthlyRateFromEA(card.eAInterestRate));
  const series: DebtProjectionPoint[] = [];

  for (let offset = 0; offset <= months; offset += 1) {
    if (offset > 0) {
      cards.forEach((card, index) => {
        cardBalances[index] = Math.max(0, cardBalances[index] * (1 + cardRates[index]) - card.minPayment);
      });
    }
    const loansTotal = loans.reduce((total, loan) => {
      const paid = loan.numberQuote + offset;
      return paid >= loan.term ? total : total + estimatedRemainingBalance({ ...loan, numberQuote: paid });
    }, 0);
    const cardsTotal = cardBalances.reduce((total, balance) => total + balance, 0);
    series.push({
      month: monthKey(new Date(referenceDate.getFullYear(), referenceDate.getMonth() + offset, 1)),
      total: Math.round(loansTotal + cardsTotal),
    });
  }
  return series;
};

export type UpcomingPaymentSource = 'loan' | 'creditCard' | 'expense';

export interface UpcomingPayment {
  id: string;
  name: string;
  source: UpcomingPaymentSource;
  /** Día del mes pactado para el pago. */
  paymentDay: number;
  dueDate: Date;
  daysUntil: number;
  amount: number;
}

/**
 * Próximos pagos ordenados por fecha: desembolso de cada crédito vivo, mínimo de
 * cada tarjeta con saldo y cada día de pago de los gastos fijos mensuales. Un gasto
 * con varios días de pago reparte su monto mensual entre ellos.
 */
export const upcomingPayments = (loans: Loan[], cards: CreditCard[], expenses: Expense[], today: Date, limit: number): UpcomingPayment[] => {
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const build = (id: string, name: string, source: UpcomingPaymentSource, paymentDay: number, amount: number): UpcomingPayment => {
    const daysUntil = daysUntilPaymentDay(paymentDay, startOfDay);
    const dueDate = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate() + daysUntil);
    return { id, name, source, paymentDay, dueDate, daysUntil, amount };
  };

  const payments = [
    ...activeLoans(loans).map((loan) => build(`loan-${loan.id}`, loan.name, 'loan', loan.paymentDay, totalMonthlyPayment(loan))),
    ...cards
      .filter((card) => card.balance > 0 && card.minPayment > 0)
      .map((card) => build(`card-${card.id}`, `${card.bank} ${card.name}`.trim(), 'creditCard', card.paymentDay, card.minPayment)),
    ...expenses
      .filter((expense) => expense.kind === 'fixed' && expense.period === 'monthly')
      .flatMap((expense, index) => expense.paymentDays.map((day) =>
        // El índice evita llaves repetidas si dos gastos comparten id.
        build(`expense-${expense.id}-${index}-${day}`, expense.name, 'expense', day, expense.amount / expense.paymentDays.length))),
  ];

  return payments.sort((first, second) => first.daysUntil - second.daysUntil || second.amount - first.amount).slice(0, limit);
};
