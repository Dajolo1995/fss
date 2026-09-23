import { Tag } from '../../../libs/antd';
import StatCard from '../../../components/StatCard';
import SensitiveAmount from '../../../components/SensitiveAmount';
import UtilizationBar from '../../../components/UtilizationBar';
import type { CreditCard } from '../../../engine';
import { utilizationLevel } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { utilizationLevelColors, utilizationLevelLabels } from '../../../utils/creditCard';
import type { CreditCardTotals } from '../types';

interface CardKpiGridProps { totals: CreditCardTotals; nearestPayment?: CreditCard; }

const CardKpiGrid = ({ totals, nearestPayment }: CardKpiGridProps) => {
  const level = utilizationLevel(totals.globalUtilization);
  return (
    <div className="card-kpi-grid">
      <StatCard label="Cupo Total Otorgado" value={<SensitiveAmount value={totals.totalLimit} />} />
      <StatCard label="Deuda Actual Total" value={<SensitiveAmount value={totals.totalBalance} />} valueColor={palette.accent} />
      <StatCard label="Cupo Disponible Global" value={<SensitiveAmount value={totals.totalAvailable} />} valueColor={palette.positive} />
      <StatCard
        label="Utilización General"
        value={`${totals.globalUtilization.toFixed(1)}%`}
        footer={
          <>
            <Tag color={utilizationLevelColors[level]} className="utilization-tag">{utilizationLevelLabels[level]}</Tag>
            <UtilizationBar percent={Math.round(totals.globalUtilization)} showInfo={false} />
          </>
        }
      />
      <StatCard
        label="Mínimo Consolidado"
        value={<SensitiveAmount value={totals.totalMinPayment} />}
        tone="dark"
        caption={nearestPayment ? `Próximo límite: día ${nearestPayment.paymentDay} · ${nearestPayment.bank}` : 'Sin pagos programados'}
      />
    </div>
  );
};

export default CardKpiGrid;
