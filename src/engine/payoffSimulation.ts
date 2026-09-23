import type { DebtState, SimulationConfig, SimulationResult } from './types';

/**
 * Devuelve la quincena cuyo ingreso financia un pago vencido en `day`.
 * El sueldo entra el 15 (half 1) y el 30 (half 2). El pago se hace
 * con el ingreso más reciente que ya llegó:
 *   - Día 15-29  → financiado por el ingreso del 15 → half 1
 *   - Día 1-14 o 30-31 → financiado por el ingreso del 30 → half 2
 */
export const paymentDayToFundingHalf = (day: number): 1 | 2 =>
  day >= 15 && day < 30 ? 1 : 2;

/** Simulates debt payments and the accelerated payoff cascade. */
export const simulatePayoff = (
  _debts: DebtState[],
  _config: SimulationConfig,
): SimulationResult => {
  void _debts;
  void _config;
  throw new Error('Payoff simulation is not implemented yet.');
};
