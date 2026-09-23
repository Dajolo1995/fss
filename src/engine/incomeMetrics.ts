import type { Income } from './types';

/**
 * Año en que cae un ingreso `specific` de recurrencia `once`. El modelo no guarda
 * el año, así que se toma la primera ocurrencia de `month` desde el mes en que se
 * registró el ingreso: una prima única de junio creada en septiembre cae el junio
 * del año siguiente.
 */
const onceIncomeYear = (income: Income): number => {
  const created = income.createdAt;
  return (income.month ?? 0) >= created.getMonth() + 1 ? created.getFullYear() : created.getFullYear() + 1;
};

/**
 * Lo que entra en un mes calendario (`month` va de 1 a 12), en COP.
 *
 * - `biweekly`: `amount` por cada día de `paymentDays` (dos quincenas = 2 × amount).
 * - `monthly`: `amount` una vez al mes, en su día de pago.
 * - `specific`: solo el mes indicado en `month`, con `amount` por cada día de pago
 *   (mínimo uno). Si es `annual` se repite cada año; si es `once` solo cuenta en el
 *   año de su primera ocurrencia (ver `onceIncomeYear`).
 */
export const monthlyIncomeFor = (incomes: Income[], year: number, month: number): number =>
  incomes.reduce((total, income) => {
    switch (income.period) {
      case 'biweekly':
        return total + income.amount * income.paymentDays.length;
      case 'monthly':
        return total + income.amount;
      case 'specific': {
        if (income.month !== month) return total;
        if (income.recurrence !== 'annual' && onceIncomeYear(income) !== year) return total;
        return total + income.amount * Math.max(1, income.paymentDays.length);
      }
      default:
        return total;
    }
  }, 0);

/**
 * Ingreso mensual promedio de los próximos 12 meses, contando el mes de
 * `referenceDate`. Reparte primas e ingresos puntuales a lo largo del año, que es
 * lo que se necesita para medir capacidad de pago mes a mes.
 */
export const averageMonthlyIncome = (incomes: Income[], referenceDate: Date = new Date()): number => {
  let total = 0;
  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + offset, 1);
    total += monthlyIncomeFor(incomes, date.getFullYear(), date.getMonth() + 1);
  }
  return total / 12;
};
