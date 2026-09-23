import { Card, Tag } from '../../../libs/antd';
import SensitiveAmount from '../../../components/SensitiveAmount';
import type { BorrowingCapacityReport } from '../../../engine';
import { MAX_DEBT_TO_INCOME, REFERENCE_EA_RATE, REFERENCE_TERM_MONTHS } from '../../../engine';
import { palette } from '../../../theme/tokens';

type BorrowingCapacityCardProps = { report: BorrowingCapacityReport };

type DtiLevel = { label: string; color: string };

const dtiLevel = (dti: number): DtiLevel =>
  dti < 35 ? { label: 'Sostenible', color: palette.positive }
    : dti <= 50 ? { label: 'Alerta', color: palette.primary }
      : { label: 'Crítico', color: palette.accent };

const BorrowingCapacityCard = ({ report }: BorrowingCapacityCardProps) => {
  const level = dtiLevel(report.dti);
  const committedWidth = Math.min(100, Math.max(0, report.dti));
  return (
    <Card variant="borderless" className="dashboard-card capacity-card">
      <h2 className="dashboard-card-title">¿Cuánto puedes pedir prestado hoy?</h2>
      <p className="dashboard-card-subtitle">
        Estimado con tasa {Math.round(REFERENCE_EA_RATE * 100)}% EA a {REFERENCE_TERM_MONTHS} meses
      </p>
      <div className="capacity-amount" style={{ color: palette.positive }}>
        <SensitiveAmount value={report.capacity} />
      </div>
      <div className="capacity-quota">
        Cuota máxima disponible: <strong><SensitiveAmount value={report.maxQuota} /></strong> / mes
      </div>
      {report.maxQuota === 0 && (
        <p className="capacity-warning">
          Tus cuotas actuales ya superan el {Math.round(MAX_DEBT_TO_INCOME * 100)}% de tu ingreso: no hay margen para un crédito nuevo.
        </p>
      )}

      <div className="capacity-dti">
        <div className="capacity-dti-head">
          <span>Deuda / ingreso (DTI)</span>
          <span>
            <strong>{report.dti.toFixed(1)}%</strong>
            <Tag color={level.color} className="capacity-dti-tag">{level.label}</Tag>
          </span>
        </div>
        <div className="split-bar capacity-dti-bar" role="img" aria-label={`${report.dti.toFixed(1)}% del ingreso comprometido en deuda`}>
          <span style={{ width: `${committedWidth}%`, background: palette.accent }} />
          <span style={{ width: `${100 - committedWidth}%`, background: palette.positive }} />
        </div>
        <div className="split-legend">
          <span>Comprometido: <SensitiveAmount value={report.committedMonthly} /></span>
          <span>Libre: <SensitiveAmount value={Math.max(0, report.avgIncome - report.committedMonthly)} /></span>
        </div>
      </div>
    </Card>
  );
};

export default BorrowingCapacityCard;
