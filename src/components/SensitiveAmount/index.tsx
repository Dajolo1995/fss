import { usePrivacyMode } from '../../hooks/usePrivacyMode';
import { formatCOP } from '../../utils/formatters';

type SensitiveAmountProps = { value: number };

const SensitiveAmount = ({ value }: SensitiveAmountProps) => {
  const { hideBalances } = usePrivacyMode();
  return <span className="sensitive-amount">{hideBalances ? '••••••••' : formatCOP(value)}</span>;
};

export default SensitiveAmount;
