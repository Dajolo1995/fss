import { Button } from '../../libs/antd';
import { CreditCardIcon, Eye, EyeOff, Receipt, Wallet } from '../../libs/icons';
import { useNavigate } from '../../libs/reactRouter';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePrivacyMode } from '../../hooks/usePrivacyMode';
import BorrowingCapacityCard from './components/BorrowingCapacityCard';
import DebtProjectionChart from './components/DebtProjectionChart';
import KpiRow from './components/KpiRow';
import ScoreCard from './components/ScoreCard';
import UpcomingPaymentsList from './components/UpcomingPaymentsList';
import { useDashboard } from './hooks/useDashboard';

const DashboardPage = () => {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const { hideBalances, togglePrivacy } = usePrivacyMode();
  const dashboard = useDashboard();

  return (
    <main className="dashboard-view">
      <PageHeader
        title="Dashboard"
        subtitle="Una vista clara de tu camino hacia la libertad financiera."
        actions={
          <Button onClick={togglePrivacy} icon={hideBalances ? <Eye size={16} /> : <EyeOff size={16} />}>
            {hideBalances ? 'Mostrar Balances' : 'Ocultar Balances'}
          </Button>
        }
      />

      {dashboard.isEmpty
        ? (
          <section className="dashboard-card dashboard-onboarding">
            <EmptyState message={<><strong>Empieza tu diagnóstico financiero</strong><br />Registra tus ingresos, gastos y deudas para calcular tu score y tu capacidad de endeudamiento.</>}>
              <div className="dashboard-onboarding-actions">
                <Button type="primary" icon={<Wallet size={16} />} onClick={() => navigate('/income')}>Agregar Ingresos</Button>
                <Button icon={<Receipt size={16} />} onClick={() => navigate('/expenses')}>Agregar Gastos</Button>
                <Button icon={<CreditCardIcon size={16} />} onClick={() => navigate('/credit-cards')}>Agregar Tarjetas</Button>
              </div>
            </EmptyState>
          </section>
        )
        : (
          <>
            <div className="dashboard-hero">
              <ScoreCard result={dashboard.score} />
              <BorrowingCapacityCard report={dashboard.capacity} />
            </div>
            <KpiRow kpis={dashboard.kpis} />
            <div className="dashboard-bottom">
              <DebtProjectionChart series={dashboard.projection} />
              <UpcomingPaymentsList payments={dashboard.upcoming} />
            </div>
          </>
        )}
    </main>
  );
};

export default DashboardPage;
