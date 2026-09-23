import EmptyState from '../../components/EmptyState';
import { usePageTitle } from '../../hooks/usePageTitle';

const LoansPage = () => { usePageTitle('Préstamos'); return <main><h1>Préstamos</h1><p className="page-lead">Visualiza el saldo y las cuotas de tus préstamos.</p><EmptyState message="Todavía no has registrado préstamos." actionLabel="Agregar préstamo" /></main>; };

export default LoansPage;
