import StatCard from '../../../components/StatCard';
import type { Loan } from '../../../engine';
import { nextPaymentDate } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { formatCOP, formatDate } from '../../../utils/formatters';
import { formatPercent } from '../../../utils/loan';
import type { LoanTotals } from '../types';

interface LoanKpiGridProps { loans: Loan[]; totals: LoanTotals; }

const LoanKpiGrid = ({ loans, totals }: LoanKpiGridProps) => {
  const nextPayment = nextPaymentDate(loans, new Date());
  return (
    <div className="loan-kpi-grid">
      <StatCard
        label="Saldo Total Activo"
        value={formatCOP(totals.totalRemainingBalance)}
        footer={<span className="kpi-caption">De {formatCOP(totals.totalOriginalAmount)} desembolsados</span>}
        caption={<strong style={{ color: palette.positive }}>{totals.paidPercent}% ya pagado</strong>}
      />
      <StatCard
        label="Cuota Mensual Comprometida"
        value={formatCOP(totals.totalMonthlyCommitment)}
        caption={nextPayment ? `Próximo pago: ${formatDate(nextPayment)}` : 'Sin pagos programados'}
      />
      <StatCard
        label="Tasa E.A. Ponderada"
        value={formatPercent(totals.weightedRate)}
        caption="Ponderada por saldo restante"
      />
      <StatCard
        label="Intereses Proyectados Restantes"
        value={formatCOP(totals.projectedInterest)}
        valueColor={palette.accent}
        caption="Estimado sobre el plazo pactado"
      />
    </div>
  );
};

export default LoanKpiGrid;
