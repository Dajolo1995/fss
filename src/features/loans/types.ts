import type { Dayjs } from '../../libs/dayjs';
import type { LoanKind } from '../../engine';

export type LoanFormMode = 'create' | 'edit';
export type LoanOrderMode = 'avalanche' | 'snowball';

export interface LoanFormValues {
  name: string;
  kind: LoanKind;
  numberCredit: string;
  disbursementDate: Dayjs;
  originalAmount: number;
  eAInterestRate: number;
  eAMoraInterestRate: number;
  quote: number;
  term: number;
  numberQuote: number;
  paymentDay: number;
  secureLife: number;
  secureQuote: number;
  secureCar?: number;
  otherConcepts: number;
}

export interface LoanTotals {
  totalRemainingBalance: number;
  totalOriginalAmount: number;
  totalMonthlyCommitment: number;
  weightedRate: number;
  projectedInterest: number;
  paidPercent: number;
}
