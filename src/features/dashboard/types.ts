import type { BorrowingCapacityReport, DebtProjectionPoint, ScoreResult, UpcomingPayment } from '../../engine';

export type DashboardPeriod = 'month' | 'year';

export interface DashboardKpis {
  averageIncome: number;
  fixedExpenses: number;
  totalDebt: number;
  /** Cuotas de préstamos + mínimos de TC + gastos fijos. */
  totalCommitment: number;
  /** Compromiso total sobre el ingreso promedio, en porcentaje. */
  commitmentPercent: number;
}

export interface DashboardData {
  /** Sin ingresos, gastos, préstamos ni tarjetas: se muestra el onboarding. */
  isEmpty: boolean;
  score: ScoreResult;
  capacity: BorrowingCapacityReport;
  kpis: DashboardKpis;
  projection: DebtProjectionPoint[];
  upcoming: UpcomingPayment[];
}
