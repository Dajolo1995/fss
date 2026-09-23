import type { ReactNode } from 'react';
import { Card, Statistic, Tag } from '../../libs/antd';
import { palette } from '../../theme/tokens';

type StatCardProps = {
  label: string;
  value: ReactNode;
  delta?: number;
  caption?: ReactNode;
  footer?: ReactNode;
  valueColor?: string;
  tone?: 'default' | 'dark';
};

const StatCard = ({ label, value, delta, caption, footer, valueColor, tone = 'default' }: StatCardProps) => {
  const isPrimitive = typeof value === 'string' || typeof value === 'number';
  return (
    <Card variant="borderless" className={tone === 'dark' ? 'stat-card stat-card-dark' : 'stat-card'}>
      <Statistic
        title={label}
        value={isPrimitive ? value : 0}
        formatter={isPrimitive ? undefined : () => value}
        styles={valueColor ? { content: { color: valueColor } } : undefined}
      />
      {footer}
      {caption !== undefined && <span className="kpi-caption">{caption}</span>}
      {delta !== undefined && <Tag color={delta >= 0 ? palette.positive : palette.accent}>{delta >= 0 ? '+' : ''}{delta}%</Tag>}
    </Card>
  );
};

export default StatCard;
