import type { Income, Expense, Loan, CreditCard } from './types';

/** Calculates the maximum sustainable borrowing capacity for the profile. */
export const calculateBorrowingCapacity = (
  _income: Income[],
  _expenses: Expense[],
  _loans: Loan[],
  _creditCards: CreditCard[],
): number => {
  void _income;
  void _expenses;
  void _loans;
  void _creditCards;
  throw new Error('Borrowing capacity calculation is not implemented yet.');
};
