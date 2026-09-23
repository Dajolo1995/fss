import { Button, Popconfirm, Tag } from '../../../libs/antd';
import { AlarmClock } from '../../../libs/icons';
import SensitiveAmount from '../../../components/SensitiveAmount';
import UtilizationBar from '../../../components/UtilizationBar';
import type { CreditCard } from '../../../engine';
import { availableCredit, daysUntilPaymentDay, utilization, utilizationLevel } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { PAYMENT_ALERT_DAYS, utilizationLevelColors, utilizationLevelLabels } from '../../../utils/creditCard';
import PlasticCard from './PlasticCard';

interface CreditCardItemProps { card: CreditCard; today: Date; onEdit: (card: CreditCard) => void; onDelete: (card: CreditCard) => void; }

const CreditCardItem = ({ card, today, onEdit, onDelete }: CreditCardItemProps) => {
  const percent = utilization(card);
  const level = utilizationLevel(percent);
  const daysLeft = daysUntilPaymentDay(card.paymentDay, today);
  const isPaymentClose = daysLeft <= PAYMENT_ALERT_DAYS;

  return (
    <article className="credit-card-item">
      <PlasticCard card={card} />

      <div className="credit-card-usage">
        <div className="credit-card-usage-head">
          <span>Uso del Cupo</span>
          <span>
            <strong>{percent.toFixed(1)}%</strong>
            <Tag color={utilizationLevelColors[level]} className="utilization-tag">{utilizationLevelLabels[level]}</Tag>
          </span>
        </div>
        <UtilizationBar percent={Math.round(percent)} showInfo={false} />
      </div>

      <div className="credit-card-metrics">
        <div className="credit-card-metric">
          <span className="credit-card-metric-label">Cupo Total</span>
          <SensitiveAmount value={card.creditLimit} />
        </div>
        <div className="credit-card-metric">
          <span className="credit-card-metric-label">Saldo Deudor</span>
          <span style={{ color: palette.accent }}><SensitiveAmount value={card.balance} /></span>
        </div>
        <div className="credit-card-metric">
          <span className="credit-card-metric-label">Disponible</span>
          <span style={{ color: palette.positive }}><SensitiveAmount value={availableCredit(card)} /></span>
        </div>
      </div>

      <div className="credit-card-payments">
        <div className="credit-card-payment-row">
          <span>Pago total sin intereses</span>
          <strong><SensitiveAmount value={card.balance} /></strong>
        </div>
        <div className="credit-card-payment-row">
          <span>Pago mínimo</span>
          <strong><SensitiveAmount value={card.minPayment} /></strong>
        </div>
        <div className="credit-card-dates" style={isPaymentClose ? { color: palette.accent } : undefined}>
          {isPaymentClose && <AlarmClock size={14} aria-hidden="true" />}
          <span>Corte: día {card.cutOffDay} · Pago: día {card.paymentDay}</span>
          {isPaymentClose && <span className="credit-card-days-left">{daysLeft === 0 ? 'vence hoy' : `en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`}</span>}
        </div>
      </div>

      <footer className="credit-card-actions">
        <Button type="link" onClick={() => onEdit(card)}>Editar</Button>
        <Popconfirm title="¿Eliminar esta tarjeta?" okText="Eliminar" cancelText="Cancelar" onConfirm={() => onDelete(card)}>
          <Button type="link" danger>Eliminar</Button>
        </Popconfirm>
      </footer>
    </article>
  );
};

export default CreditCardItem;
