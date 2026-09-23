import { Card, Tag } from '../../../libs/antd';
import { AlarmClock } from '../../../libs/icons';
import EmptyState from '../../../components/EmptyState';
import SensitiveAmount from '../../../components/SensitiveAmount';
import type { UpcomingPayment, UpcomingPaymentSource } from '../../../engine';
import { palette } from '../../../theme/tokens';

type UpcomingPaymentsListProps = { payments: UpcomingPayment[] };

/** Pagos a este número de días o menos se resaltan como urgentes. */
const URGENT_DAYS = 3;

const sourceTags: Record<UpcomingPaymentSource, { label: string; color: string }> = {
  loan: { label: 'Préstamo', color: palette.primary },
  creditCard: { label: 'Tarjeta', color: palette.dark },
  expense: { label: 'Gasto fijo', color: palette.positive },
};

const formatDaysUntil = (days: number): string => days === 0 ? 'Hoy' : days === 1 ? 'Mañana' : `En ${days} días`;

const UpcomingPaymentsList = ({ payments }: UpcomingPaymentsListProps) => (
  <Card variant="borderless" className="dashboard-card">
    <h2 className="dashboard-card-title">Próximos pagos</h2>
    {payments.length === 0
      ? <EmptyState message="No hay pagos programados." />
      : (
        <ul className="upcoming-list">
          {payments.map((payment) => {
            const urgent = payment.daysUntil <= URGENT_DAYS;
            const tag = sourceTags[payment.source];
            return (
              <li key={payment.id} className={urgent ? 'upcoming-item upcoming-item-urgent' : 'upcoming-item'}>
                <div className="upcoming-item-main">
                  <strong>{payment.name}</strong>
                  <span className="upcoming-item-meta">
                    <Tag color={tag.color} className="upcoming-item-tag">{tag.label}</Tag>
                    Día {payment.paymentDay}
                  </span>
                </div>
                <div className="upcoming-item-side">
                  <strong><SensitiveAmount value={payment.amount} /></strong>
                  <span className="upcoming-item-when" style={urgent ? { color: palette.accent } : undefined}>
                    {urgent && <AlarmClock size={13} />}
                    {formatDaysUntil(payment.daysUntil)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
  </Card>
);

export default UpcomingPaymentsList;
