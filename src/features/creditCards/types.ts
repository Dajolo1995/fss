import type { CardFranchise } from '../../engine';

export type CreditCardFormMode = 'create' | 'edit';

export interface CreditCardFormValues {
  bank: string;
  franchise: CardFranchise;
  name: string;
  lastDigits: string;
  creditLimit: number;
  balance: number;
  minPayment: number;
  /** El extracto publica la tasa en M.V.; se convierte a E.A. al guardar. */
  mvInterestRate: number;
  cutOffDay: number;
  paymentDay: number;
  color: string;
}

export interface CreditCardTotals {
  totalLimit: number;
  totalBalance: number;
  totalAvailable: number;
  totalMinPayment: number;
  globalUtilization: number;
}
