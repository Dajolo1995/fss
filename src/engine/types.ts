export type IncomePeriod = 'biweekly' | 'monthly' | 'specific';
export type IncomeRecurrence = 'once' | 'annual';

export interface Income {
  id: string;
  name: string;
  amount: number;
  period: IncomePeriod;
  recurrence: IncomeRecurrence;
  paymentDays: number[];
  month?: number;
}

export type ExpenseKind = 'fixed' | 'variable';

export interface Expense {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  period: 'monthly' | 'unique';
  kind: ExpenseKind;
  category: string;
  amount: number;
  paymentDays: number[];
}

export interface Loan {
  id: string;
  name: string;
  originalAmount: number;
  remainingBalance: number;
  eAInterestRate: number;
  quote: number;
  term: number;
  numberQuote: number;
  paymentDay: number;
  secureLive: boolean;
  otherConcepts: number;
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  lastDigits: string;
  creditLimit: number;
  balance: number;
  interestRate?: number;
  quote: number;
  paymentDueDay: number;
}

export interface DebtState {
  id: string;
  name: string;
  source: 'loan' | 'creditCard';
  remainingBalance: number;
  monthlyRate: number;
  minQuote: number;
  paymentDay: number;
  half: 1 | 2;
  isPaid: boolean;
}

export interface SimulationConfig {
  savingsRate: number;
  extraPayment: number;
  startDate?: string;
  maxMonths?: number;
}

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  savingsRate: 0.20,
  extraPayment: 0,
};

export interface MonthlyRow {
  month: string;
  debtId: string;
  payment: number;
  interest: number;
  remainingBalance: number;
}

export interface SimulationResult {
  freedomDate: string;
  acceleratedDate: string;
  monthsSaved: number;
  interestSaved: number;
  monthlyRows: MonthlyRow[];
}
