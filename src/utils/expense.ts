import type { Expense, ExpenseKind } from '../engine';

export const expenseKindLabels: Record<ExpenseKind, string> = { fixed: 'Fijo', variable: 'Variable' };

export const expensePeriodLabels: Record<Expense['period'], string> = { monthly: 'Mensual', unique: 'Único' };

const joinDays = (days: number[]): string => days.length === 1 ? `${days[0]}` : `${days.slice(0, -1).join(', ')} y ${days[days.length - 1]}`;

export const formatPaymentDays = (expense: Expense): string => {
  if (expense.period === 'unique') return 'Pago único';
  if (expense.paymentDays.length === 0) return 'Sin días definidos';
  return `${joinDays(expense.paymentDays)} de cada mes`;
};




export const loans = [
    {
        id: 'loans-1',
        createdAt: new Date('2026-01-05T12:00:00'),
        updatedAt: new Date('2026-01-05T12:00:00'),
        dateDesembolso: new Date('2026-01-05T12:00:00'),
        NumberCredit: '123456789',
        name: 'Préstamo Banco X',
        originalAmount: 1000000,
        eAInterestRate: 5.5,
        eAMoraInterestRate: 1.5,
        secureLife: 40000,
        SecureCar: 400000,
        secureQuote: 40000,
        quote: 100000,
        term: 12,
        numberQuote: 6,
        totalNumberQuote: 24,
        paymentDay: 15,
        otherConcepts: 0,
    }, 
    {
        id: 'loans-2',
        createdAt: new Date('2026-01-05T12:00:00'),
        updatedAt: new Date('2026-01-05T12:00:00'),
        dateDesembolso: new Date('2026-01-05T12:00:00'),
        numberCredit: '987654321',
        name: 'Préstamo Banco Y',
        originalAmount: 2000000,
        eAInterestRate: 5.5,
        eAMoraInterestRate: 1.5,
        secureLife: 40000,
        SecureCar: 400000,
        secureQuote: 40000,
        quote: 100000,
        term: 12,
        numberQuote: 6,
        totalNumberQuote: 24,
        paymentDay: 15,
        otherConcepts: 0,
    }
]