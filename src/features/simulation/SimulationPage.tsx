import EmptyState from '../../components/EmptyState';
import { usePageTitle } from '../../hooks/usePageTitle';

const SimulationPage = () => { usePageTitle('Simulación'); return <main><h1>Simulación</h1><p className="page-lead">Compara tu ruta actual con una estrategia acelerada.</p><EmptyState message="Necesitas registrar tus deudas para iniciar una simulación." actionLabel="Configurar simulación" /></main>; };

export default SimulationPage;
