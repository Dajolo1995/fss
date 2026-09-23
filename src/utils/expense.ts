import type { Expense, ExpenseKind } from '../engine';

export const expenseKindLabels: Record<ExpenseKind, string> = { fixed: 'Fijo', variable: 'Variable' };

export const expensePeriodLabels: Record<Expense['period'], string> = { monthly: 'Mensual', unique: 'Único' };

const joinDays = (days: number[]): string => days.length === 1 ? `${days[0]}` : `${days.slice(0, -1).join(', ')} y ${days[days.length - 1]}`;

export const formatPaymentDays = (expense: Expense): string => {
  if (expense.period === 'unique') return 'Pago único';
  if (expense.paymentDays.length === 0) return 'Sin días definidos';
  return `${joinDays(expense.paymentDays)} de cada mes`;
};
