import { useCallback, useMemo, useState } from 'react';
import type { Income } from '../../../engine';
import { averageMonthlyIncome, monthlyIncomeFor } from '../../../engine';
import { incomeSeed } from '../data/incomeSeed';
import { useFinance } from '../../../providers/financeContext';

export type IncomeDraft = Omit<Income, 'id' | 'createdAt' | 'updatedAt'>;

export interface UseIncomesReturn {
  incomes: Income[];
  /** Ingreso mensual promedio de los próximos 12 meses. */
  averageMonthly: number;
  /** Lo que entra en el mes en curso. */
  currentMonth: number;
  loading: boolean;
  addIncome: (draft: IncomeDraft) => void;
  updateIncome: (id: string, draft: IncomeDraft) => void;
  removeIncome: (id: string) => void;
}

// `recurrence` y `month` solo tienen sentido para ingresos puntuales.
const normalize = (draft: IncomeDraft): IncomeDraft => ({
  ...draft,
  name: draft.name.trim(),
  paymentDays: [...draft.paymentDays].sort((first, second) => first - second),
  recurrence: draft.period === 'specific' ? draft.recurrence ?? 'once' : undefined,
  month: draft.period === 'specific' ? draft.month : undefined,
});

/** Estado y operaciones. Solo lo instancia `FinanceProvider`; las pantallas usan `useIncomes`. */
export const useIncomesStore = (): UseIncomesReturn => {
  const [incomes, setIncomes] = useState<Income[]>(incomeSeed);
  const [loading] = useState(false);

  const addIncome = useCallback((draft: IncomeDraft): void => {
    const now = new Date();
    setIncomes((current) => [{ ...normalize(draft), id: `income-${now.getTime()}`, createdAt: now, updatedAt: now }, ...current]);
  }, []);

  const updateIncome = useCallback((id: string, draft: IncomeDraft): void => {
    setIncomes((current) => current.map((income) => income.id === id ? { ...income, ...normalize(draft), updatedAt: new Date() } : income));
  }, []);

  const removeIncome = useCallback((id: string): void => {
    setIncomes((current) => current.filter((income) => income.id !== id));
  }, []);

  const totals = useMemo(() => {
    const today = new Date();
    return {
      averageMonthly: averageMonthlyIncome(incomes, today),
      currentMonth: monthlyIncomeFor(incomes, today.getFullYear(), today.getMonth() + 1),
    };
  }, [incomes]);

  return { incomes, loading, addIncome, updateIncome, removeIncome, ...totals };
};

/** Lee el estado compartido desde `FinanceProvider`. */
export const useIncomes = (): UseIncomesReturn => useFinance().income;
