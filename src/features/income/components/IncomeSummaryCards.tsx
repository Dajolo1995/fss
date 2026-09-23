import { Card, Progress, Statistic } from '../../../libs/antd';
import type { IncomeSummary } from '../types';
import { formatCOP } from '../../../utils/formatters';

interface IncomeSummaryCardsProps { summary: IncomeSummary; }

const IncomeSummaryCards = ({ summary }: IncomeSummaryCardsProps) => (
  <div className="income-kpi-grid">
    <Card className="income-kpi-card"><Statistic title="Total Proyectado Mensual" value={formatCOP(summary.projectedMonthly)} /><span className="kpi-caption">{summary.activeSources} fuentes vigentes</span></Card>
    <Card className="income-kpi-card"><Statistic title="Ingreso Recibido Este Mes" value={formatCOP(summary.receivedThisMonth)} /><Progress percent={summary.receivedPercent} strokeColor="#33B2C1" size="small" /><span className="kpi-caption">Por percibir: {formatCOP(summary.pendingThisMonth)}</span></Card>
    <Card className="income-kpi-card"><Statistic title="Estructura Fijo vs Variable" value={formatCOP(summary.projectedMonthly)} /><div className="split-bar"><span className="split-fixed" style={{ width: `${summary.fixedPercent}%` }} /><span className="split-variable" style={{ width: `${summary.variablePercent}%` }} /></div><div className="split-legend"><span>Fijo {summary.fixedPercent}%</span><span>Variable {summary.variablePercent}%</span></div></Card>
  </div>
);

export default IncomeSummaryCards;
