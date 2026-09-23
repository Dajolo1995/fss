import type { Income, IncomeFilters, IncomePaymentStatus, IncomeSummary, IncomeWithStatus } from '../types';

export const netAmount = (income: Income): number => Math.max(0, income.amount - (income.deductions ?? 0));

export const incomeAppliesToMonth = (income: Income, referenceDate: Date): boolean => income.period === 'monthly' || income.month === referenceDate.getMonth() + 1;

export const derivePaymentStatus = (income: Income, referenceDate: Date): IncomePaymentStatus => {
  if (!incomeAppliesToMonth(income, referenceDate)) return 'pending';
  const receivedCount = income.paymentDays.filter((day) => day <= referenceDate.getDate()).length;
  if (receivedCount === 0) return 'pending';
  if (receivedCount === income.paymentDays.length) return 'received';
  return 'partial';
};

export const withIncomeStatus = (income: Income, referenceDate: Date): IncomeWithStatus => ({
  ...income,
  net: netAmount(income),
  status: derivePaymentStatus(income, referenceDate),
  appliesToMonth: incomeAppliesToMonth(income, referenceDate),
});

export const buildIncomeSummary = (incomes: Income[], referenceDate: Date): IncomeSummary => {
  const current = incomes.filter((income) => incomeAppliesToMonth(income, referenceDate));
  const projectedMonthly = current.reduce((total, income) => total + netAmount(income), 0);
  const receivedThisMonth = current.reduce((total, income) => {
    const status = derivePaymentStatus(income, referenceDate);
    if (status === 'received') return total + netAmount(income);
    if (status === 'partial') return total + netAmount(income) * income.paymentDays.filter((day) => day <= referenceDate.getDate()).length / income.paymentDays.length;
    return total;
  }, 0);
  const fixedAmount = current.filter((income) => income.recurrence === 'monthly').reduce((total, income) => total + netAmount(income), 0);
  const variableAmount = projectedMonthly - fixedAmount;
  const grossTotal = current.reduce((total, income) => total + income.amount, 0);
  const deductionsTotal = current.reduce((total, income) => total + (income.deductions ?? 0), 0);
  const netTotal = current.reduce((total, income) => total + netAmount(income), 0);
  return {
    projectedMonthly,
    activeSources: current.length,
    receivedThisMonth,
    pendingThisMonth: Math.max(0, projectedMonthly - receivedThisMonth),
    receivedPercent: projectedMonthly ? Math.round(receivedThisMonth / projectedMonthly * 100) : 0,
    fixedAmount,
    variableAmount,
    fixedPercent: projectedMonthly ? Math.round(fixedAmount / projectedMonthly * 100) : 0,
    variablePercent: projectedMonthly ? Math.round(variableAmount / projectedMonthly * 100) : 0,
    grossTotal,
    deductionsTotal,
    netTotal,
  };
};

export const filterIncomes = (incomes: IncomeWithStatus[], filters: IncomeFilters): IncomeWithStatus[] => incomes.filter((income) => {
  const query = filters.search.trim().toLowerCase();
  const matchesSearch = !query || income.name.toLowerCase().includes(query) || income.type.toLowerCase().includes(query);
  const matchesKind = filters.kind === 'all' || (filters.kind === 'fixed' ? income.recurrence === 'monthly' : income.recurrence === 'unique');
  const matchesStatus = filters.status === 'all' || income.status === filters.status;
  return matchesSearch && matchesKind && matchesStatus;
});

export const buildCsv = (incomes: IncomeWithStatus[]): string => {
  const header = ['Fuente', 'Categoría', 'Tipo', 'Bruto', 'Deducciones', 'Neto', 'Días de pago', 'Estado'];
  const rows = incomes.map((income) => [income.name, income.type, income.recurrence === 'monthly' ? 'Fijo' : 'Variable', income.amount, income.deductions ?? 0, income.net, income.paymentDays.join(' / '), income.status]);
  return [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
};
