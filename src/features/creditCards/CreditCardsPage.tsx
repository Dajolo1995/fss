import EmptyState from '../../components/EmptyState';
import { usePageTitle } from '../../hooks/usePageTitle';

const CreditCardsPage = () => { usePageTitle('Tarjetas de Crédito'); return <main><h1>Tarjetas de Crédito</h1><p className="page-lead">Controla el uso, saldo y fechas de tus tarjetas.</p><EmptyState message="Todavía no has registrado tarjetas de crédito." actionLabel="Agregar tarjeta" /></main>; };

export default CreditCardsPage;
