import StatCard from '../../../components/StatCard';
import SensitiveAmount from '../../../components/SensitiveAmount';
import { palette } from '../../../theme/tokens';
import type { DashboardKpis } from '../types';

type KpiRowProps = { kpis: DashboardKpis };

const KpiRow = ({ kpis }: KpiRowProps) => (
  <div className="dashboard-kpi-grid">
    <StatCard
      label="Ingreso Mensual Promedio"
      value={<SensitiveAmount value={kpis.averageIncome} />}
      valueColor={palette.positive}
      caption="Promedio de los próximos 12 meses"
    />
    <StatCard label="Gastos Fijos Mensuales" value={<SensitiveAmount value={kpis.fixedExpenses} />} />
    <StatCard
      label="Deuda Total"
      value={<SensitiveAmount value={kpis.totalDebt} />}
      valueColor={palette.accent}
      caption="Préstamos + saldos de tarjetas"
    />
    <StatCard
      label="Compromiso Mensual Total"
      value={<SensitiveAmount value={kpis.totalCommitment} />}
      tone="dark"
      caption={kpis.averageIncome > 0 ? `${kpis.commitmentPercent.toFixed(1)}% del ingreso` : 'Sin ingresos registrados'}
    />
  </div>
);

export default KpiRow;
