import type { ReactNode } from 'react';
import { Card, Statistic, Tag } from '../../libs/antd';
import { palette } from '../../theme/tokens';

type StatCardProps = { label: string; value: string | number; delta?: number; caption?: string; footer?: ReactNode };

const StatCard = ({ label, value, delta, caption, footer }: StatCardProps) => (
  <Card variant="borderless" className="stat-card">
    <Statistic title={label} value={value} />
    {footer}
    {caption && <span className="kpi-caption">{caption}</span>}
    {delta !== undefined && <Tag color={delta >= 0 ? palette.positive : palette.accent}>{delta >= 0 ? '+' : ''}{delta}%</Tag>}
  </Card>
);

export default StatCard;
