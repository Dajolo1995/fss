import { Progress } from '../../libs/antd';
import { palette } from '../../theme/tokens';

type ScoreGaugeProps = { score: number };

const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  const color = score < 400 ? palette.accent : score < 700 ? palette.primary : palette.positive;
  return (
    <div aria-label={`Score financiero: ${score} de 1000`}>
      <Progress type="dashboard" percent={(score / 1000) * 100} strokeColor={color} format={() => `${score}`} />
    </div>
  );
};

export default ScoreGauge;
