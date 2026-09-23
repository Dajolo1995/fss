import type { ReactNode } from 'react';
import { useCreditCardsStore } from '../features/creditCards/hooks/useCreditCards';
import { useExpensesStore } from '../features/expenses/hooks/useExpenses';
import { useIncomesStore } from '../features/income/hooks/useIncomes';
import { useLoansStore } from '../features/loans/hooks/useLoans';
import { FinanceContext } from './financeContext';
import type { FinanceContextValue } from './financeContext';

type FinanceProviderProps = { children: ReactNode };

/**
 * Dueño único de ingresos, gastos, préstamos y tarjetas. Vive por encima de las
 * rutas, así que lo que se edita en una pantalla se ve en todas (Dashboard incluido)
 * y no se pierde al navegar.
 */
const FinanceProvider = ({ children }: FinanceProviderProps) => {
  const income = useIncomesStore();
  const expense = useExpensesStore();
  const loan = useLoansStore();
  const creditCard = useCreditCardsStore();
  // Cada store devuelve un objeto nuevo por render, así que memorizar el valor no ahorraría nada.
  const value: FinanceContextValue = { income, expense, loan, creditCard };
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export default FinanceProvider;
