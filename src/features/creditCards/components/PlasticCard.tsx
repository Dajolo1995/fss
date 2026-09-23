import type { CreditCard } from '../../../engine';
import { eAToMV } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { mixHex } from '../../../utils/color';
import { franchiseLabels, maskedNumber } from '../../../utils/creditCard';

interface PlasticCardProps { card: CreditCard; }

const PlasticCard = ({ card }: PlasticCardProps) => {
  // El degradado se deriva del color elegido: del tono base hacia el oscuro del theme.
  const background = `linear-gradient(135deg, ${card.color} 0%, ${mixHex(card.color, palette.dark, 0.55)} 100%)`;
  return (
    <div className="plastic-card" style={{ background }}>
      <header className="plastic-card-top">
        <div>
          <span className="plastic-card-bank">{card.bank}</span>
          <span className="plastic-card-name">{card.name}</span>
        </div>
        <span className="plastic-card-franchise">{franchiseLabels[card.franchise]}</span>
      </header>
      <span className="plastic-card-chip" aria-hidden="true" />
      <footer className="plastic-card-bottom">
        <span className="plastic-card-number">{maskedNumber(card.lastDigits)}</span>
        <span className="plastic-card-rate">{eAToMV(card.eAInterestRate).toFixed(2)}% M.V.</span>
      </footer>
    </div>
  );
};

export default PlasticCard;
