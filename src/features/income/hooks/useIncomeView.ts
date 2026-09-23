import { useMemo, useState } from 'react';
import { message } from '../../../libs/antd';
import { useEntityCrud } from '../../../hooks/useEntityCrud';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { buildCsv, buildIncomeSummary, filterIncomes, withIncomeStatus } from '../logic';
import type { Income, IncomeFilters, IncomeFormValues, IncomeSummary, IncomeWithStatus } from '../types';
import { incomeSeed } from '../types';

export interface IncomeTableTotals { gross: number; deductions: number; net: number; }
export interface UseIncomeViewReturn { incomes: IncomeWithStatus[]; summary: IncomeSummary; tableTotals: IncomeTableTotals; filters: IncomeFilters; loading: boolean; drawerOpen: boolean; editingIncome?: Income; openCreate: () => void; openEdit: (income: IncomeWithStatus) => void; closeDrawer: () => void; onFiltersChange: (filters: IncomeFilters) => void; onSubmit: (values: IncomeFormValues) => void; onDuplicate: (income: IncomeWithStatus) => void; onDelete: (income: IncomeWithStatus) => void; onExport: () => void; }

const useIncomeView = (): UseIncomeViewReturn => {
  usePageTitle('Ingresos');
  const referenceDate = useMemo(() => new Date(), []);
  const crud = useEntityCrud<Income>(incomeSeed);
  const [filters, setFilters] = useState<IncomeFilters>({ search: '', kind: 'all', status: 'all' });
  const enriched = useMemo(() => crud.items.map((income) => withIncomeStatus(income, referenceDate)), [crud.items, referenceDate]);
  const incomes = useMemo(() => filterIncomes(enriched, filters), [enriched, filters]);
  const summary = useMemo(() => buildIncomeSummary(crud.items, referenceDate), [crud.items, referenceDate]);
  const onSubmit = (values: IncomeFormValues): void => { const now = new Date(); const income: Income = { ...values, id: crud.editingItem?.id ?? `income-${Date.now()}`, createdAt: crud.editingItem?.createdAt ?? now, updatedAt: now }; if (crud.editingItem) { crud.update(income); } else { crud.create(income); } void message.success(crud.editingItem ? 'Ingreso actualizado' : 'Ingreso creado'); };
  const onExport = (): void => { const blob = new Blob([buildCsv(incomes)], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'ingresos.csv'; link.click(); URL.revokeObjectURL(url); void message.success('CSV exportado'); };
  const tableTotals = useMemo(() => ({ gross: incomes.reduce((total, income) => total + income.amount, 0), deductions: incomes.reduce((total, income) => total + (income.deductions ?? 0), 0), net: incomes.reduce((total, income) => total + income.net, 0) }), [incomes]);
  return { incomes, summary, tableTotals, filters, loading: crud.loading, drawerOpen: crud.drawerOpen, editingIncome: crud.editingItem, openCreate: crud.openCreate, openEdit: crud.openEdit, closeDrawer: crud.closeDrawer, onFiltersChange: setFilters, onSubmit, onDuplicate: (income) => { crud.duplicate(income); void message.success('Ingreso duplicado'); }, onDelete: (income) => { crud.remove(income); void message.success('Ingreso eliminado'); }, onExport };
};

export default useIncomeView;
