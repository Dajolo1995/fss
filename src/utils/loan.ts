import type { LoanKind } from '../engine';
import { palette } from '../theme/tokens';

export const loanKindLabels: Record<LoanKind, string> = {
  vehicle: 'Vehicular',
  freeInvestment: 'Libre Inversión',
  educational: 'Educativo',
};

export const loanOrderLabels = {
  avalanche: 'Avalancha (Tasa E.A. ↓)',
  snowball: 'Bola de Nieve (Saldo ↑)',
} as const;

/** Umbral en el que una tasa E.A. deja de considerarse barata. */
export const LOW_RATE_THRESHOLD = 15;
const HIGH_RATE_THRESHOLD = 25;

export const rateLevelColor = (eAInterestRate: number): string =>
  eAInterestRate < LOW_RATE_THRESHOLD ? palette.positive : eAInterestRate < HIGH_RATE_THRESHOLD ? palette.primary : palette.accent;

/** Acento de la tarjeta: magenta si es la prioridad de prepago, teal si la tasa es baja. */
export const loanAccentColor = (eAInterestRate: number, isPriority: boolean): string =>
  isPriority ? palette.accent : eAInterestRate < LOW_RATE_THRESHOLD ? palette.positive : palette.primary;

export const formatPercent = (value: number, fractionDigits = 2): string =>
  `${value.toLocaleString('es-CO', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}%`;

export const formatMonths = (months: number): string => months === 1 ? '1 mes' : `${months} meses`;
