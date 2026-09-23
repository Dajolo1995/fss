import { Progress } from '../../libs/antd';
import { palette } from '../../theme/tokens';

type UtilizationBarProps = { percent: number };

const UtilizationBar = ({ percent }: UtilizationBarProps) => {
  const color = percent < 30 ? palette.positive : percent < 70 ? palette.primary : palette.accent;
  return <Progress percent={percent} strokeColor={color} />;
};

export default UtilizationBar;
