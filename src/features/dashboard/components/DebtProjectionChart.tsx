import { Card } from '../../../libs/antd';
import { Area, AreaChart, CartesianGrid, ChartTooltip, ResponsiveContainer, XAxis, YAxis } from '../../../libs/recharts';
import EmptyState from '../../../components/EmptyState';
import SensitiveAmount from '../../../components/SensitiveAmount';
import type { DebtProjectionPoint } from '../../../engine';
import { usePrivacyMode } from '../../../hooks/usePrivacyMode';
import { palette } from '../../../theme/tokens';
import { formatCOP } from '../../../utils/formatters';

type DebtProjectionChartProps = { series: DebtProjectionPoint[] };

const MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const HIDDEN = '••••';
const GRADIENT_ID = 'debt-projection-fill';

/** 'YYYY-MM' → 'ene 27'. */
const formatMonth = (key: string): string => {
  const [year, month] = key.split('-');
  return `${MONTH_LABELS[Number(month) - 1] ?? month} ${year.slice(2)}`;
};

const formatAxisAmount = (value: number): string =>
  value >= 1_000_000 ? `$${Math.round(value / 1_000_000)}M` : value >= 1_000 ? `$${Math.round(value / 1_000)}k` : `$${value}`;

const DebtProjectionChart = ({ series }: DebtProjectionChartProps) => {
  const { hideBalances } = usePrivacyMode();
  const start = series[0]?.total ?? 0;
  const end = series[series.length - 1]?.total ?? 0;
  const months = Math.max(0, series.length - 1);
  const reduction = start > 0 ? Math.round((1 - end / start) * 100) : 0;

  return (
    <Card variant="borderless" className="dashboard-card">
      <div className="dashboard-card-head">
        <div>
          <h2 className="dashboard-card-title">Proyección de tu deuda</h2>
          <p className="dashboard-card-subtitle">Pagando solo cuotas y mínimos actuales, sin compras nuevas</p>
        </div>
        {start > 0 && (
          <div className="debt-projection-summary">
            <span>En {months} meses</span>
            <strong><SensitiveAmount value={end} /></strong>
            <em style={{ color: reduction >= 0 ? palette.positive : palette.accent }}>
              {reduction >= 0 ? `−${reduction}%` : `+${Math.abs(reduction)}%`} vs. hoy
            </em>
          </div>
        )}
      </div>

      {start === 0
        ? <EmptyState message="No tienes deudas registradas para proyectar." />
        : (
          <div className="debt-projection-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.primary} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={palette.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f0ecf2" />
                <XAxis dataKey="month" tickFormatter={formatMonth} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} tick={{ fontSize: 12, fill: '#706570' }} />
                <YAxis
                  tickFormatter={(value: number) => hideBalances ? HIDDEN : formatAxisAmount(value)}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fontSize: 12, fill: '#706570' }}
                />
                <ChartTooltip
                  formatter={(value) => [hideBalances ? HIDDEN : formatCOP(Number(value)), 'Deuda total']}
                  labelFormatter={(label) => formatMonth(String(label))}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 8px 24px rgba(32, 0, 32, .12)' }}
                />
                <Area type="monotone" dataKey="total" stroke={palette.primary} strokeWidth={2.5} fill={`url(#${GRADIENT_ID})`} dot={false} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
    </Card>
  );
};

export default DebtProjectionChart;
