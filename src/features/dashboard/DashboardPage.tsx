import EmptyState from '../../components/EmptyState';
import ScoreGauge from '../../components/ScoreGauge';
import StatCard from '../../components/StatCard';
import { formatCOP } from '../../utils/formatters';
import { usePageTitle } from '../../hooks/usePageTitle';

const DashboardPage = () => {
  usePageTitle('Dashboard');
  return <main><h1>Dashboard</h1><p className="page-lead">Una vista clara de tu camino hacia la libertad financiera.</p><div className="stat-grid"><StatCard label="Patrimonio disponible" value={formatCOP(0)} /><StatCard label="Deuda total" value={formatCOP(0)} delta={0} /><StatCard label="Score financiero" value="0 / 1000" /></div><section className="dashboard-grid"><ScoreGauge score={0} /><EmptyState message="Agrega tus ingresos y obligaciones para ver tu diagnóstico." actionLabel="Comenzar" /></section></main>;
};

export default DashboardPage;
