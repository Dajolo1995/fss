import { useMemo } from 'react';
import { borrowingCapacityReport, calculateScore, projectDebtSeries, totalDebt, upcomingPayments } from '../../../engine';
import { useFinance } from '../../../providers/financeContext';
import type { DashboardData } from '../types';

export const PROJECTION_MONTHS = 36;
const UPCOMING_LIMIT = 5;

/** Cruza en vivo los datos de todas las features para armar el dashboard. */
export const useDashboard = (): DashboardData => {
  const { income, expense, loan, creditCard } = useFinance();
  const { incomes } = income;
  const { expenses, totalFixed } = expense;
  const { loans } = loan;
  const { cards } = creditCard;

  return useMemo<DashboardData>(() => {
    const today = new Date();
    const capacity = borrowingCapacityReport(incomes, loans, cards, today);
    const totalCommitment = capacity.committedMonthly + totalFixed;
    return {
      isEmpty: incomes.length === 0 && expenses.length === 0 && loans.length === 0 && cards.length === 0,
      score: calculateScore(incomes, loans, cards, today),
      capacity,
      kpis: {
        averageIncome: capacity.avgIncome,
        fixedExpenses: totalFixed,
        totalDebt: totalDebt(loans, cards),
        totalCommitment,
        commitmentPercent: capacity.avgIncome > 0 ? totalCommitment / capacity.avgIncome * 100 : 0,
      },
      projection: projectDebtSeries(loans, cards, PROJECTION_MONTHS, today),
      upcoming: upcomingPayments(loans, cards, expenses, today, UPCOMING_LIMIT),
    };
  }, [incomes, expenses, totalFixed, loans, cards]);
};
