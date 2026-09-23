import { useMemo, useState } from 'react';
import { Card, Divider, InputNumber, Radio, Select, Slider } from '../../../libs/antd';
import type { ExtraPaymentMode, Loan } from '../../../engine';
import { estimatedRemainingBalance, simulateExtraPayment } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { formatCOP } from '../../../utils/formatters';
import { formatMonths, formatPercent, loanKindLabels } from '../../../utils/loan';

interface ExtraPaymentPanelProps { loans: Loan[]; selectedLoanId?: string; onSelectLoan: (id: string) => void; }

const MIN_EXTRA_PAYMENT = 100000;
const DEFAULT_EXTRA_PAYMENT = 500000;

const ExtraPaymentPanel = ({ loans, selectedLoanId, onSelectLoan }: ExtraPaymentPanelProps) => {
  const [mode, setMode] = useState<ExtraPaymentMode>('term');
  const [amount, setAmount] = useState(DEFAULT_EXTRA_PAYMENT);

  const selectedLoan = loans.find((loan) => loan.id === selectedLoanId) ?? loans[0];
  const maxAmount = useMemo(() => selectedLoan ? Math.max(MIN_EXTRA_PAYMENT, Math.round(estimatedRemainingBalance(selectedLoan))) : MIN_EXTRA_PAYMENT, [selectedLoan]);
  // El monto se recorta al saldo del préstamo activo en cada render: al cambiar de
  // crédito el abono se ajusta solo, sin sincronizar estado en un efecto.
  const effectiveAmount = Math.min(Math.max(amount, MIN_EXTRA_PAYMENT), maxAmount);

  if (!selectedLoan) {
    return (
      <Card className="extra-payment-panel" title="Abono Inteligente a Capital">
        <p className="kpi-caption">Registra un préstamo para simular abonos a capital.</p>
      </Card>
    );
  }

  const result = simulateExtraPayment(selectedLoan, effectiveAmount, mode);
  const monthsSaved = result.baselineRemainingMonths - result.newRemainingMonths;
  const quoteDrop = result.baselineQuote - result.newQuote;

  return (
    <Card className="extra-payment-panel" title="Abono Inteligente a Capital">
      <label className="field-label" htmlFor="extra-payment-loan">Préstamo destino</label>
      <Select
        id="extra-payment-loan"
        value={selectedLoan.id}
        onChange={onSelectLoan}
        style={{ width: '100%' }}
        options={loans.map((loan) => ({ value: loan.id, label: `${loanKindLabels[loan.kind]} • ${loan.name} (${formatPercent(loan.eAInterestRate)} E.A.)` }))}
      />

      <label className="field-label" htmlFor="extra-payment-amount">Monto del abono</label>
      <InputNumber<number>
        id="extra-payment-amount"
        value={effectiveAmount}
        onChange={(value) => setAmount(Math.min(Math.max(value ?? MIN_EXTRA_PAYMENT, MIN_EXTRA_PAYMENT), maxAmount))}
        min={MIN_EXTRA_PAYMENT}
        max={maxAmount}
        step={50000}
        style={{ width: '100%' }}
        formatter={(value) => value === undefined || value === null ? '' : `$ ${`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
        parser={(displayValue) => Number((displayValue ?? '').replace(/\D/g, ''))}
      />
      <Slider
        value={effectiveAmount}
        onChange={setAmount}
        min={MIN_EXTRA_PAYMENT}
        max={maxAmount}
        step={50000}
        tooltip={{ formatter: (value) => formatCOP(value ?? 0) }}
      />
      <span className="kpi-caption">Máximo simulable: {formatCOP(maxAmount)} (saldo estimado)</span>

      <Divider />

      <label className="field-label">Modalidad</label>
      <Radio.Group value={mode} onChange={(event) => setMode(event.target.value as ExtraPaymentMode)} className="extra-payment-modes">
        <Radio value="term">
          <strong>Reducir Plazo</strong>
          <span className="kpi-caption">Mantienes la cuota y sales de la deuda antes. Ahorra más intereses.</span>
        </Radio>
        <Radio value="quote">
          <strong>Reducir Cuota</strong>
          <span className="kpi-caption">Conservas el plazo y liberas flujo de caja cada mes.</span>
        </Radio>
      </Radio.Group>

      <div className="extra-payment-result">
        <div className="extra-payment-result-row">
          <span>Ahorro en Intereses</span>
          <strong style={{ color: palette.accent }}>{formatCOP(result.interestSaved)}</strong>
        </div>
        {mode === 'term' ? (
          <div className="extra-payment-result-row">
            <span>Nuevo plazo restante</span>
            <strong>{formatMonths(result.newRemainingMonths)} <em style={{ color: palette.positive }}>({monthsSaved > 0 ? `-${monthsSaved}` : '0'})</em></strong>
          </div>
        ) : (
          <div className="extra-payment-result-row">
            <span>Nueva cuota estimada</span>
            <strong>{formatCOP(result.newQuote)} <em style={{ color: palette.positive }}>({quoteDrop > 0 ? `-${formatCOP(quoteDrop)}` : formatCOP(0)})</em></strong>
          </div>
        )}
        <span className="kpi-caption">Escenario base: {formatMonths(result.baselineRemainingMonths)} restantes con cuota de {formatCOP(result.baselineQuote)}.</span>
      </div>
    </Card>
  );
};

export default ExtraPaymentPanel;
