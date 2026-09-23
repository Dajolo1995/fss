import { useMemo, useState } from 'react';
import { Button, message } from '../../libs/antd';
import PageHeader from '../../components/PageHeader';
import type { Expense } from '../../engine';
import { usePageTitle } from '../../hooks/usePageTitle';
import ExpenseFilters from './components/ExpenseFilters';
import ExpenseFormModal from './components/ExpenseFormModal';
import ExpenseSummaryCards from './components/ExpenseSummaryCards';
import ExpenseTable from './components/ExpenseTable';
import { useExpenses } from './hooks/useExpenses';
import type { ExpenseFormValues, ExpenseKindCounts, ExpenseKindFilter } from './types';

const ExpensesPage = () => {
  usePageTitle('Gastos');
  const view = useExpenses();
  const [kind, setKind] = useState<ExpenseKindFilter>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense>();

  const counts = useMemo<ExpenseKindCounts>(() => ({
    all: view.expenses.length,
    fixed: view.expenses.filter((expense) => expense.kind === 'fixed').length,
    variable: view.expenses.filter((expense) => expense.kind === 'variable').length,
  }), [view.expenses]);

  const visibleExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return view.expenses.filter((expense) => {
      const matchesKind = kind === 'all' || expense.kind === kind;
      const matchesSearch = !query || expense.name.toLowerCase().includes(query) || expense.category.toLowerCase().includes(query);
      return matchesKind && matchesSearch;
    });
  }, [view.expenses, kind, search]);

  const categories = useMemo(() => [...new Set(view.expenses.map((expense) => expense.category))].sort((first, second) => first.localeCompare(second, 'es')), [view.expenses]);
  const monthlyCount = useMemo(() => view.expenses.filter((expense) => expense.period === 'monthly').length, [view.expenses]);

  const openCreate = (): void => { setEditingExpense(undefined); setModalOpen(true); };
  const openEdit = (expense: Expense): void => { setEditingExpense(expense); setModalOpen(true); };
  const closeModal = (): void => { setEditingExpense(undefined); setModalOpen(false); };

  const handleSubmit = (values: ExpenseFormValues): void => {
    if (editingExpense) {
      view.updateExpense(editingExpense.id, values);
      void message.success('Gasto actualizado');
    } else {
      view.addExpense(values);
      void message.success('Gasto creado');
    }
    closeModal();
  };

  const handleDelete = (expense: Expense): void => {
    view.removeExpense(expense.id);
    void message.success('Gasto eliminado');
  };

  return (
    <main className="expenses-view">
      <PageHeader
        title="Gastos"
        subtitle="Ordena tus gastos fijos y variables para saber cuánto te queda libre cada mes."
        actions={<Button type="primary" onClick={openCreate}>+ Nuevo Gasto</Button>}
      />
      <ExpenseSummaryCards totals={view} monthlyCount={monthlyCount} uniqueCount={view.expenses.length - monthlyCount} />
      <ExpenseFilters kind={kind} search={search} counts={counts} onKindChange={setKind} onSearchChange={setSearch} />
      <ExpenseTable data={visibleExpenses} loading={view.loading} onEdit={openEdit} onDelete={handleDelete} />
      <ExpenseFormModal open={modalOpen} expense={editingExpense} categories={categories} loading={view.loading} onSubmit={handleSubmit} onClose={closeModal} />
    </main>
  );
};

export default ExpensesPage;
