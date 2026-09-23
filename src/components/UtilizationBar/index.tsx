import { Progress } from '../../libs/antd';
import { utilizationLevel } from '../../engine';
import { utilizationLevelColors } from '../../utils/creditCard';

type UtilizationBarProps = { percent: number; showInfo?: boolean };

const UtilizationBar = ({ percent, showInfo = true }: UtilizationBarProps) => (
  <Progress percent={percent} strokeColor={utilizationLevelColors[utilizationLevel(percent)]} showInfo={showInfo} />
);

export default UtilizationBar;
