import { Button, Popconfirm, Progress, Tag, Tooltip } from '../../../libs/antd';
import { Banknote, Car, GraduationCap } from '../../../libs/icons';
import type { LucideIcon } from '../../../libs/icons';
import type { Loan, LoanKind } from '../../../engine';
import { amortizedPercent, estimatedRemainingBalance, remainingQuotes, totalMonthlyPayment } from '../../../engine';
import { formatCOP } from '../../../utils/formatters';
import { formatMonths, formatPercent, loanAccentColor, loanKindLabels, rateLevelColor } from '../../../utils/loan';

interface LoanCardProps { loan: Loan; isPriority: boolean; onSimulate: (loan: Loan) => void; onEdit: (loan: Loan) => void; onDelete: (loan: Loan) => void; }

const kindIcons: Record<LoanKind, LucideIcon> = { vehicle: Car, freeInvestment: Banknote, educational: GraduationCap };

const LoanCard = ({ loan, isPriority, onSimulate, onEdit, onDelete }: LoanCardProps) => {
  const accent = loanAccentColor(loan.eAInterestRate, isPriority);
  const balance = estimatedRemainingBalance(loan);
  const pending = remainingQuotes(loan);
  const monthly = totalMonthlyPayment(loan);
  const insurances = loan.secureLife + loan.secureQuote + (loan.secureCar ?? 0);
  const KindIcon = kindIcons[loan.kind];

  return (
    <article className="loan-card" style={{ borderLeftColor: accent }}>
      <header className="loan-card-head">
        <span className="loan-card-icon" style={{ background: `${accent}14`, color: accent }}><KindIcon size={22} /></span>
        <div className="loan-card-title">
          <h3>{loan.name}</h3>
          <span className="loan-card-kind">{loanKindLabels[loan.kind]}</span>
        </div>
        {isPriority && <Tag color={accent} className="loan-priority-tag">Prioridad #1 Prepago</Tag>}
      </header>

      <div className="loan-metrics">
        <div className="loan-metric">
          <span className="loan-metric-label">Tasa E.A.</span>
          <strong style={{ color: rateLevelColor(loan.eAInterestRate) }}>{formatPercent(loan.eAInterestRate)}</strong>
          <span className="loan-metric-hint">Mora {formatPercent(loan.eAMoraInterestRate)}</span>
        </div>
        <div className="loan-metric">
          <span className="loan-metric-label">Saldo Capital <Tooltip title="Estimado por amortización francesa. El saldo exigible es el del extracto."><em>estimado</em></Tooltip></span>
          <strong>{formatCOP(balance)}</strong>
          <span className="loan-metric-hint">De {formatCOP(loan.originalAmount)} original</span>
        </div>
        <div className="loan-metric">
          <span className="loan-metric-label">Cuota Mensual</span>
          <strong>{formatCOP(monthly)}</strong>
          <span className="loan-metric-hint">{formatCOP(loan.quote)} capital+interés · {formatCOP(insurances)} seguros{loan.otherConcepts > 0 ? ` · ${formatCOP(loan.otherConcepts)} otros` : ''}</span>
        </div>
        <div className="loan-metric">
          <span className="loan-metric-label">Crédito</span>
          <strong>{loan.numberCredit}</strong>
          <span className="loan-metric-hint">Se paga el {loan.paymentDay} de cada mes</span>
        </div>
      </div>

      <div className="loan-progress">
        <div className="loan-progress-head">
          <span>{loan.numberQuote} de {loan.term} cuotas canceladas · Restan {formatMonths(pending)}</span>
          <strong>{Math.round(amortizedPercent(loan))}% amortizado</strong>
        </div>
        <Progress percent={amortizedPercent(loan)} strokeColor={accent} showInfo={false} />
      </div>

      <footer className="loan-card-actions">
        <Button type="primary" ghost onClick={() => onSimulate(loan)}>Simular Abono Extra</Button>
        <Button type="link" onClick={() => onEdit(loan)}>Editar</Button>
        <Popconfirm title="¿Eliminar este préstamo?" okText="Eliminar" cancelText="Cancelar" onConfirm={() => onDelete(loan)}>
          <Button type="link" danger>Eliminar</Button>
        </Popconfirm>
      </footer>
    </article>
  );
};

export default LoanCard;
