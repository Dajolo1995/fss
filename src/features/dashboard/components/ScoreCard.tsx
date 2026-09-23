import { Card, Progress, Tag } from '../../../libs/antd';
import { Info } from '../../../libs/icons';
import ScoreGauge from '../../../components/ScoreGauge';
import type { ScoreFactor, ScoreFactorKey, ScoreLevel, ScoreResult } from '../../../engine';
import { palette } from '../../../theme/tokens';

type ScoreCardProps = { result: ScoreResult };

const levelLabels: Record<ScoreLevel, string> = { bajo: 'Bajo', medio: 'Medio', bueno: 'Bueno', excelente: 'Excelente' };

const levelColors: Record<ScoreLevel, string> = {
  bajo: palette.accent,
  medio: palette.primary,
  bueno: palette.primary,
  excelente: palette.positive,
};

const factorLabels: Record<ScoreFactorKey, string> = {
  utilization: 'Utilización de tarjetas',
  dti: 'Deuda / ingreso mensual',
  debtLoad: 'Carga de deuda',
  diversity: 'Mix crediticio',
};

const describeMetric = (factor: ScoreFactor): string => {
  if (!Number.isFinite(factor.metric)) return 'Sin ingresos registrados';
  switch (factor.key) {
    case 'utilization':
      return `${factor.metric.toFixed(1)}% del cupo usado`;
    case 'dti':
      return `${factor.metric.toFixed(1)}% del ingreso en cuotas`;
    case 'debtLoad':
      return `${factor.metric.toFixed(2)}x el ingreso anual`;
    case 'diversity':
      return `${factor.metric} de 2 tipos de crédito`;
  }
};

const factorColor = (value: number): string => value >= 0.7 ? palette.positive : value >= 0.4 ? palette.primary : palette.accent;

const ScoreCard = ({ result }: ScoreCardProps) => (
  <Card variant="borderless" className="dashboard-card score-card">
    <h2 className="dashboard-card-title">Score financiero</h2>
    <div className="score-card-gauge">
      <ScoreGauge score={result.score} />
      <Tag color={levelColors[result.level]} className="score-level-tag">Nivel {levelLabels[result.level]}</Tag>
    </div>
    <ul className="score-factors">
      {result.factors.map((factor) => (
        <li key={factor.key} className="score-factor">
          <div className="score-factor-head">
            <span>{factorLabels[factor.key]} <em>· peso {Math.round(factor.weight * 100)}%</em></span>
            <strong>{Math.round(factor.points)} pts</strong>
          </div>
          <Progress percent={Math.round(factor.value * 100)} strokeColor={factorColor(factor.value)} showInfo={false} size="small" />
          <span className="score-factor-metric">{describeMetric(factor)}</span>
        </li>
      ))}
    </ul>
    <p className="dashboard-disclaimer">
      <Info size={14} />
      Score simulado con fines educativos — no es tu score de centrales de riesgo.
    </p>
  </Card>
);

export default ScoreCard;
