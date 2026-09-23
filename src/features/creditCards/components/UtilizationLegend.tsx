import { utilizationLevelColors, utilizationLevelLabels } from '../../../utils/creditCard';

const rules = [
  { level: 'safe', range: 'Menos del 30%', detail: 'Uso sano: no castiga tu score y deja cupo para imprevistos.' },
  { level: 'warning', range: 'Entre 30% y 70%', detail: 'Zona de alerta: el score empieza a resentirse, conviene bajar el saldo.' },
  { level: 'risk', range: 'Más del 70%', detail: 'Riesgo: señal de sobreendeudamiento para las centrales de riesgo.' },
] as const;

const UtilizationLegend = () => (
  <section className="utilization-legend" aria-label="Regla de sanidad crediticia">
    <h2>Regla de sanidad crediticia</h2>
    <div className="utilization-legend-rules">
      {rules.map((rule) => (
        <div key={rule.level} className="utilization-legend-rule">
          <span className="utilization-dot" style={{ background: utilizationLevelColors[rule.level] }} />
          <div>
            <strong>{rule.range} · {utilizationLevelLabels[rule.level]}</strong>
            <span className="kpi-caption">{rule.detail}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default UtilizationLegend;
