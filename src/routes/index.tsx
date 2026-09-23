import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from '../libs/reactRouter';
import EmptyState from '../components/EmptyState';
import AppLayout from '../layouts/AppLayout';

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const IncomePage = lazy(() => import('../features/income/IncomePage'));
const ExpensesPage = lazy(() => import('../features/expenses/ExpensesPage'));
const CreditCardsPage = lazy(() => import('../features/creditCards/CreditCardsPage'));
const LoansPage = lazy(() => import('../features/loans/LoansPage'));
const SimulationPage = lazy(() => import('../features/simulation/SimulationPage'));

const LoadingState = () => <EmptyState message="Cargando tu espacio financiero..." />;

const RoutesApp = () => (
  <Suspense fallback={<LoadingState />}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/credit-cards" element={<CreditCardsPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  </Suspense>
);

export default RoutesApp;
