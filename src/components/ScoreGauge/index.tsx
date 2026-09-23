import { palette } from '../../theme/tokens';

type ScoreGaugeProps = { score: number };

const MAX_SCORE = 1000;

// Zonas del score: magenta por debajo de 500, morado hasta 850 y teal por encima.
const ZONES = [
  { from: 0, to: 500, color: palette.accent },
  { from: 500, to: 850, color: palette.primary },
  { from: 850, to: 1000, color: palette.positive },
] as const;

const CENTER_X = 110;
const CENTER_Y = 110;
const RADIUS = 90;
const STROKE = 16;

/** Punto sobre el semicírculo: 0 es el extremo izquierdo y 1 el derecho. */
const pointAt = (fraction: number): [number, number] => {
  const angle = Math.PI * (1 - fraction);
  return [CENTER_X + RADIUS * Math.cos(angle), CENTER_Y - RADIUS * Math.sin(angle)];
};

const arcPath = (fromFraction: number, toFraction: number): string => {
  const [x0, y0] = pointAt(fromFraction);
  const [x1, y1] = pointAt(toFraction);
  return `M ${x0} ${y0} A ${RADIUS} ${RADIUS} 0 0 1 ${x1} ${y1}`;
};

const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  const clamped = Math.max(0, Math.min(MAX_SCORE, score));
  const fraction = clamped / MAX_SCORE;
  const color = clamped < 500 ? palette.accent : clamped <= 850 ? palette.primary : palette.positive;
  const [markerX, markerY] = pointAt(fraction);
  return (
    <svg className="score-gauge" viewBox="0 0 220 128" role="img" aria-label={`Score financiero: ${score} de ${MAX_SCORE}`}>
      {ZONES.map((zone) => (
        <path key={zone.from} d={arcPath(zone.from / MAX_SCORE, zone.to / MAX_SCORE)} stroke={zone.color} strokeOpacity={0.18} strokeWidth={STROKE} fill="none" />
      ))}
      {fraction > 0 && <path d={arcPath(0, fraction)} stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />}
      <circle cx={markerX} cy={markerY} r={STROKE / 2 + 3} fill="#fff" stroke={color} strokeWidth={4} />
      <text x={CENTER_X} y={CENTER_Y - 14} textAnchor="middle" className="score-gauge-value" fill={palette.dark}>{score}</text>
      <text x={CENTER_X} y={CENTER_Y + 8} textAnchor="middle" className="score-gauge-max">de {MAX_SCORE}</text>
    </svg>
  );
};

export default ScoreGauge;
