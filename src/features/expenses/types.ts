import type { Expense, ExpenseKind } from '../../engine';

export type ExpenseFormMode = 'create' | 'edit';
export type ExpenseKindFilter = 'all' | ExpenseKind;

export interface ExpenseFormValues {
  name: string;
  amount: number;
  kind: ExpenseKind;
  category: string;
  period: Expense['period'];
  paymentDays?: number[];
}

export interface ExpenseTotals {
  totalMonthly: number;
  totalFixed: number;
  totalVariable: number;
  fixedPercent: number;
  variablePercent: number;
}

export type ExpenseKindCounts = Record<ExpenseKindFilter, number>;
