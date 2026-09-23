export type IncomePeriod = 'biweekly' | 'monthly' | 'specific';
export type IncomeRecurrence = 'once' | 'annual';

export type Income = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  /** Ej: 'Nómina 1', 'Prima', 'Freelance'. */
  name: string;
  /** COP que entran en cada evento de pago. */
  amount: number;
  period: IncomePeriod;
  /** Solo aplica cuando period === 'specific'. */
  recurrence?: IncomeRecurrence;
  /** Días del mes en que entra el dinero: biweekly ej [15, 30]; monthly ej [30]. */
  paymentDays: number[];
  /** Mes 1-12. Solo aplica cuando period === 'specific'. */
  month?: number;
};

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

export type LoanKind = 'vehicle' | 'freeInvestment' | 'educational';

export interface Loan {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  /** Fecha de desembolso del crédito. */
  disbursementDate: Date;
  /** Número de pagaré o crédito asignado por la entidad. */
  numberCredit: string;
  name: string;
  kind: LoanKind;
  originalAmount: number;
  /** Tasa efectiva anual, en porcentaje (13.89 = 13.89% E.A.). */
  eAInterestRate: number;
  /** Tasa de mora efectiva anual, en porcentaje. */
  eAMoraInterestRate: number;
  /** Seguro de vida mensual. */
  secureLife: number;
  /** Seguro del vehículo. Solo aplica cuando kind === 'vehicle'. */
  secureCar?: number;
  /** Seguro cobrado dentro de la cuota. */
  secureQuote: number;
  /** Cuota mensual de capital + interés, sin seguros ni otros conceptos. */
  quote: number;
  /** Plazo total pactado, en meses. */
  term: number;
  /** Cuotas ya canceladas. */
  numberQuote: number;
  paymentDay: number;
  otherConcepts: number;
}

export type CardFranchise = 'visa' | 'mastercard' | 'amex' | 'other';

export interface CreditCard {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  bank: string;
  franchise: CardFranchise;
  name: string;
  /**
   * Últimos 4 o 5 dígitos del plástico. Por seguridad el modelo NO guarda el
   * número completo, la fecha de vencimiento ni el CVV, y tampoco debe hacerlo.
   */
  lastDigits: string;
  creditLimit: number;
  balance: number;
  minPayment: number;
  /** Tasa efectiva anual en porcentaje. El formulario la captura en M.V. y la convierte. */
  eAInterestRate: number;
  cutOffDay: number;
  paymentDay: number;
  /** Color hex elegido por la persona para identificar el plástico. */
  color: string;
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
