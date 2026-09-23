import { useCallback, useMemo, useState } from 'react';
import type { Expense } from '../../../engine';
import { expenseSeed } from '../data/expenseSeed';
import type { ExpenseFormValues, ExpenseTotals } from '../types';

export interface UseExpensesReturn extends ExpenseTotals {
  expenses: Expense[];
  loading: boolean;
  addExpense: (values: ExpenseFormValues) => void;
  updateExpense: (id: string, values: ExpenseFormValues) => void;
  removeExpense: (id: string) => void;
}

type ExpenseDraft = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

const toDraft = (values: ExpenseFormValues): ExpenseDraft => ({
  name: values.name.trim(),
  period: values.period,
  kind: values.kind,
  category: values.category.trim(),
  amount: values.amount,
  paymentDays: values.period === 'monthly' ? [...(values.paymentDays ?? [])].sort((first, second) => first - second) : [],
});

const sumAmount = (expenses: Expense[]): number => expenses.reduce((total, expense) => total + expense.amount, 0);

const percentOf = (part: number, total: number): number => total > 0 ? Math.round(part / total * 100) : 0;

export const useExpenses = (): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>(expenseSeed);
  const [loading] = useState(false);

  const addExpense = useCallback((values: ExpenseFormValues): void => {
    const now = new Date();
    setExpenses((current) => [{ ...toDraft(values), id: `expense-${now.getTime()}`, createdAt: now, updatedAt: now }, ...current]);
  }, []);

  const updateExpense = useCallback((id: string, values: ExpenseFormValues): void => {
    setExpenses((current) => current.map((expense) => expense.id === id ? { ...expense, ...toDraft(values), updatedAt: new Date() } : expense));
  }, []);

  const removeExpense = useCallback((id: string): void => {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }, []);

  const totals = useMemo<ExpenseTotals>(() => {
    const monthly = expenses.filter((expense) => expense.period === 'monthly');
    const totalMonthly = sumAmount(monthly);
    const totalFixed = sumAmount(monthly.filter((expense) => expense.kind === 'fixed'));
    const totalVariable = totalMonthly - totalFixed;
    const fixedPercent = percentOf(totalFixed, totalMonthly);
    return { totalMonthly, totalFixed, totalVariable, fixedPercent, variablePercent: totalMonthly > 0 ? 100 - fixedPercent : 0 };
  }, [expenses]);

  return { expenses, loading, addExpense, updateExpense, removeExpense, ...totals };
};
