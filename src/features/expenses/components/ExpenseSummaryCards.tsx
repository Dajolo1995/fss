import { Progress } from '../../../libs/antd';
import StatCard from '../../../components/StatCard';
import { palette } from '../../../theme/tokens';
import { formatCOP } from '../../../utils/formatters';
import type { ExpenseTotals } from '../types';

interface ExpenseSummaryCardsProps { totals: ExpenseTotals; monthlyCount: number; uniqueCount: number; }

const ExpenseSummaryCards = ({ totals, monthlyCount, uniqueCount }: ExpenseSummaryCardsProps) => (
  <div className="expense-kpi-grid">
    <StatCard
      label="Gasto Total Mensual"
      value={formatCOP(totals.totalMonthly)}
      caption={`${monthlyCount} gastos mensuales${uniqueCount > 0 ? ` · ${uniqueCount} de pago único` : ''}`}
    />
    <StatCard
      label="Fijos Obligatorios"
      value={formatCOP(totals.totalFixed)}
      footer={<Progress percent={totals.fixedPercent} strokeColor={palette.primary} size="small" />}
      caption={`${totals.fixedPercent}% de tu gasto mensual`}
    />
    <StatCard
      label="Variables / Estilo de Vida"
      value={formatCOP(totals.totalVariable)}
      footer={<Progress percent={totals.variablePercent} strokeColor={palette.accent} size="small" />}
      caption={`${totals.variablePercent}% de tu gasto mensual`}
    />
  </div>
);

export default ExpenseSummaryCards;
