export const formatCOP = (value: number): string => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value).replace(/\u00a0/g, '');

export const formatDate = (value: Date | string): string =>
  new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value));
