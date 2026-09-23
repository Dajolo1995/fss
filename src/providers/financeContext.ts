import { createContext, useContext } from 'react';
import type { UseCreditCardsReturn } from '../features/creditCards/hooks/useCreditCards';
import type { UseExpensesReturn } from '../features/expenses/hooks/useExpenses';
import type { UseIncomesReturn } from '../features/income/hooks/useIncomes';
import type { UseLoansReturn } from '../features/loans/hooks/useLoans';

/**
 * Estado financiero compartido por toda la app. Cada rebanada conserva la firma
 * pública del hook de su feature (datos + CRUD + derivados).
 */
export interface FinanceContextValue {
  income: UseIncomesReturn;
  expense: UseExpensesReturn;
  loan: UseLoansReturn;
  creditCard: UseCreditCardsReturn;
}

export const FinanceContext = createContext<FinanceContextValue | null>(null);

export const useFinance = (): FinanceContextValue => {
  const value = useContext(FinanceContext);
  if (!value) throw new Error('useFinance debe usarse dentro de <FinanceProvider>.');
  return value;
};
