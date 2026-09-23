import { Button } from '../../libs/antd';
import PageHeader from '../../components/PageHeader';
import IncomeForm from './components/IncomeForm';
import IncomeSummaryCards from './components/IncomeSummaryCards';
import IncomeTable from './components/IncomeTable';
import useIncomeView from './hooks/useIncomeView';

const IncomeView = () => {
  const view = useIncomeView();
  return <main className="income-view"><PageHeader title="Gestión de Ingresos" subtitle="Conoce cuánto entra, cuándo lo recibes y cómo crece tu libertad financiera." actions={<><Button onClick={view.onExport}>Exportar CSV</Button><Button type="primary" onClick={view.openCreate}>+ Agregar Fuente de Ingreso</Button></>} /><IncomeSummaryCards summary={view.summary} /><IncomeTable data={view.incomes} totals={view.tableTotals} filters={view.filters} onFiltersChange={view.onFiltersChange} onEdit={view.openEdit} onDuplicate={view.onDuplicate} onDelete={view.onDelete} /><IncomeForm open={view.drawerOpen} income={view.editingIncome} loading={view.loading} onSubmit={view.onSubmit} onClose={view.closeDrawer} /></main>;
};

export default IncomeView;
