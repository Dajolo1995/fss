import { useCallback, useMemo, useState } from 'react';
import type { Loan } from '../../../engine';
import { estimatedRemainingBalance, projectedRemainingInterest, totalMonthlyPayment, weightedEARate } from '../../../engine';
import { loanSeed } from '../data/loanSeed';
import type { LoanFormValues, LoanOrderMode, LoanTotals } from '../types';
import { useFinance } from '../../../providers/financeContext';

export interface UseLoansReturn extends LoanTotals {
  loans: Loan[];
  sortedLoans: Loan[];
  orderMode: LoanOrderMode;
  setOrderMode: (mode: LoanOrderMode) => void;
  priorityLoanId?: string;
  loading: boolean;
  addLoan: (values: LoanFormValues) => void;
  updateLoan: (id: string, values: LoanFormValues) => void;
  removeLoan: (id: string) => void;
}

type LoanDraft = Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>;

const toDraft = (values: LoanFormValues): LoanDraft => ({
  name: values.name.trim(),
  kind: values.kind,
  numberCredit: values.numberCredit.trim(),
  disbursementDate: values.disbursementDate.toDate(),
  originalAmount: values.originalAmount,
  eAInterestRate: values.eAInterestRate,
  eAMoraInterestRate: values.eAMoraInterestRate,
  quote: values.quote,
  term: values.term,
  numberQuote: Math.min(values.numberQuote, values.term),
  paymentDay: values.paymentDay,
  secureLife: values.secureLife,
  secureQuote: values.secureQuote,
  secureCar: values.kind === 'vehicle' ? values.secureCar ?? 0 : undefined,
  otherConcepts: values.otherConcepts,
});

/** Estado y operaciones. Solo lo instancia `FinanceProvider`; las pantallas usan `useLoans`. */
export const useLoansStore = (): UseLoansReturn => {
  const [loans, setLoans] = useState<Loan[]>(loanSeed);
  const [orderMode, setOrderMode] = useState<LoanOrderMode>('avalanche');
  const [loading] = useState(false);

  const addLoan = useCallback((values: LoanFormValues): void => {
    const now = new Date();
    setLoans((current) => [{ ...toDraft(values), id: `loans-${now.getTime()}`, createdAt: now, updatedAt: now }, ...current]);
  }, []);

  const updateLoan = useCallback((id: string, values: LoanFormValues): void => {
    setLoans((current) => current.map((loan) => loan.id === id ? { ...loan, ...toDraft(values), updatedAt: new Date() } : loan));
  }, []);

  const removeLoan = useCallback((id: string): void => {
    setLoans((current) => current.filter((loan) => loan.id !== id));
  }, []);

  const sortedLoans = useMemo(() => [...loans].sort((first, second) => orderMode === 'avalanche'
    ? second.eAInterestRate - first.eAInterestRate
    : estimatedRemainingBalance(first) - estimatedRemainingBalance(second)), [loans, orderMode]);

  const totals = useMemo<LoanTotals>(() => {
    const totalRemainingBalance = loans.reduce((total, loan) => total + estimatedRemainingBalance(loan), 0);
    const totalOriginalAmount = loans.reduce((total, loan) => total + loan.originalAmount, 0);
    return {
      totalRemainingBalance,
      totalOriginalAmount,
      totalMonthlyCommitment: loans.reduce((total, loan) => total + totalMonthlyPayment(loan), 0),
      weightedRate: weightedEARate(loans),
      projectedInterest: projectedRemainingInterest(loans),
      paidPercent: totalOriginalAmount > 0 ? Math.round((1 - totalRemainingBalance / totalOriginalAmount) * 100) : 0,
    };
  }, [loans]);

  return { loans, sortedLoans, orderMode, setOrderMode, priorityLoanId: sortedLoans[0]?.id, loading, addLoan, updateLoan, removeLoan, ...totals };
};

/** Lee el estado compartido desde `FinanceProvider`. */
export const useLoans = (): UseLoansReturn => useFinance().loan;
