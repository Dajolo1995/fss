import type { CardFranchise, UtilizationLevel } from '../engine';
import { palette } from '../theme/tokens';

export const franchiseLabels: Record<CardFranchise, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'Amex',
  other: 'Otra',
};

export const utilizationLevelLabels: Record<UtilizationLevel, string> = {
  safe: 'Seguro',
  warning: 'Alerta',
  risk: 'Riesgo',
};

export const utilizationLevelColors: Record<UtilizationLevel, string> = {
  safe: palette.positive,
  warning: palette.primary,
  risk: palette.accent,
};

/** Días de antelación a partir de los cuales el pago se marca como próximo a vencer. */
export const PAYMENT_ALERT_DAYS = 7;

/** Regla de dígitos permitidos: solo los últimos 4 o 5 del plástico. */
export const LAST_DIGITS_PATTERN = /^\d{4,5}$/;

export const maskedNumber = (lastDigits: string): string => `•••• ${lastDigits}`;

export const cardColorPresets = ['#820AD2', '#200020', '#DA0081', '#1E3A8A', '#33B2C1', '#C9A227'];
