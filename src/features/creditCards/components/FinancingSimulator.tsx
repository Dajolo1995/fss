import { useState } from 'react';
import { Card, InputNumber, Slider } from '../../../libs/antd';
import { financingCost } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { formatCOP } from '../../../utils/formatters';

const MIN_AMOUNT = 100000;
const MAX_AMOUNT = 20000000;
const MIN_INSTALLMENTS = 1;
const MAX_INSTALLMENTS = 36;
const MIN_RATE = 1;
const MAX_RATE = 2.4;

const FinancingSimulator = () => {
  const [amount, setAmount] = useState(1200000);
  const [installments, setInstallments] = useState(12);
  const [monthlyRate, setMonthlyRate] = useState(1.9);

  const upfront = financingCost(amount, monthlyRate, 1);
  const deferred = financingCost(amount, monthlyRate, installments);
  const overcostPercent = amount > 0 ? deferred.interestCost / amount * 100 : 0;

  return (
    <section className="financing-simulator">
      <h2>Efecto del diferido vs 1 cuota</h2>
      <p className="page-lead">Mira cuánto crece el precio real de una compra según en cuántas cuotas la difieras.</p>

      <div className="financing-controls">
        <div className="financing-control">
          <label className="field-label" htmlFor="financing-amount">Monto de la compra</label>
          <InputNumber<number>
            id="financing-amount"
            value={amount}
            onChange={(value) => setAmount(Math.min(Math.max(value ?? MIN_AMOUNT, MIN_AMOUNT), MAX_AMOUNT))}
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
            step={50000}
            style={{ width: '100%' }}
            formatter={(value) => value === undefined || value === null ? '' : `$ ${`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
            parser={(displayValue) => Number((displayValue ?? '').replace(/\D/g, ''))}
          />
          <Slider value={amount} onChange={setAmount} min={MIN_AMOUNT} max={MAX_AMOUNT} step={50000} tooltip={{ formatter: (value) => formatCOP(value ?? 0) }} />
        </div>
        <div className="financing-control">
          <label className="field-label" htmlFor="financing-installments">Número de cuotas</label>
          <InputNumber<number>
            id="financing-installments"
            value={installments}
            onChange={(value) => setInstallments(Math.min(Math.max(value ?? MIN_INSTALLMENTS, MIN_INSTALLMENTS), MAX_INSTALLMENTS))}
            min={MIN_INSTALLMENTS}
            max={MAX_INSTALLMENTS}
            style={{ width: '100%' }}
          />
          <Slider value={installments} onChange={setInstallments} min={MIN_INSTALLMENTS} max={MAX_INSTALLMENTS} />
        </div>
        <div className="financing-control">
          <label className="field-label" htmlFor="financing-rate">Tasa M.V. (%)</label>
          <InputNumber<number>
            id="financing-rate"
            value={monthlyRate}
            onChange={(value) => setMonthlyRate(Math.min(Math.max(value ?? MIN_RATE, MIN_RATE), MAX_RATE))}
            min={MIN_RATE}
            max={MAX_RATE}
            step={0.1}
            style={{ width: '100%' }}
          />
          <Slider value={monthlyRate} onChange={setMonthlyRate} min={MIN_RATE} max={MAX_RATE} step={0.1} />
        </div>
      </div>

      <div className="financing-results">
        <Card className="financing-result financing-result-upfront" title="1 Cuota">
          <span className="financing-result-value">{formatCOP(upfront.totalPaid)}</span>
          <span className="kpi-caption">Intereses: {formatCOP(0)}</span>
          <span className="kpi-caption">Pagas exactamente el precio de la compra.</span>
        </Card>
        <Card className="financing-result financing-result-deferred" title={`Diferido a ${installments} ${installments === 1 ? 'cuota' : 'cuotas'}`}>
          <span className="financing-result-value">{formatCOP(deferred.totalPaid)}</span>
          <span className="kpi-caption">Sobrecosto en intereses: <strong style={{ color: palette.accent }}>{formatCOP(deferred.interestCost)}</strong></span>
          <span className="kpi-caption">Cuota mensual: <strong>{formatCOP(deferred.monthlyQuote)}</strong></span>
        </Card>
        <Card className="financing-result financing-result-comparison" title="Comparación">
          <span className="financing-result-value" style={{ color: palette.accent }}>+{overcostPercent.toFixed(1)}%</span>
          <span className="kpi-caption">Es lo que crece el precio real de la compra por diferirla.</span>
          <span className="kpi-caption">Tasa usada: {monthlyRate.toFixed(1)}% M.V.</span>
        </Card>
      </div>
    </section>
  );
};

export default FinancingSimulator;
