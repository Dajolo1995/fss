import { useCallback, useMemo, useState } from 'react';
import type { CreditCard } from '../../../engine';
import { globalUtilization, mvToEA, nearestPaymentDay, totalAvailable, totalBalance, totalLimit, totalMinPayment } from '../../../engine';
import { creditCardSeed } from '../data/creditCardSeed';
import type { CreditCardFormValues, CreditCardTotals } from '../types';
import { useFinance } from '../../../providers/financeContext';

export interface UseCreditCardsReturn {
  cards: CreditCard[];
  totals: CreditCardTotals;
  nearestPayment?: CreditCard;
  loading: boolean;
  addCard: (values: CreditCardFormValues) => void;
  updateCard: (id: string, values: CreditCardFormValues) => void;
  removeCard: (id: string) => void;
}

type CreditCardDraft = Omit<CreditCard, 'id' | 'createdAt' | 'updatedAt'>;

const toDraft = (values: CreditCardFormValues): CreditCardDraft => ({
  bank: values.bank.trim(),
  franchise: values.franchise,
  name: values.name.trim(),
  lastDigits: values.lastDigits.trim(),
  creditLimit: values.creditLimit,
  balance: values.balance,
  minPayment: values.minPayment,
  eAInterestRate: mvToEA(values.mvInterestRate),
  cutOffDay: values.cutOffDay,
  paymentDay: values.paymentDay,
  color: values.color,
});

/** Estado y operaciones. Solo lo instancia `FinanceProvider`; las pantallas usan `useCreditCards`. */
export const useCreditCardsStore = (): UseCreditCardsReturn => {
  const [cards, setCards] = useState<CreditCard[]>(creditCardSeed);
  const [loading] = useState(false);

  const addCard = useCallback((values: CreditCardFormValues): void => {
    const now = new Date();
    setCards((current) => [{ ...toDraft(values), id: `card-${now.getTime()}`, createdAt: now, updatedAt: now }, ...current]);
  }, []);

  const updateCard = useCallback((id: string, values: CreditCardFormValues): void => {
    setCards((current) => current.map((card) => card.id === id ? { ...card, ...toDraft(values), updatedAt: new Date() } : card));
  }, []);

  const removeCard = useCallback((id: string): void => {
    setCards((current) => current.filter((card) => card.id !== id));
  }, []);

  const totals = useMemo<CreditCardTotals>(() => ({
    totalLimit: totalLimit(cards),
    totalBalance: totalBalance(cards),
    totalAvailable: totalAvailable(cards),
    totalMinPayment: totalMinPayment(cards),
    globalUtilization: globalUtilization(cards),
  }), [cards]);

  const nearestPayment = useMemo(() => nearestPaymentDay(cards, new Date()), [cards]);

  return { cards, totals, nearestPayment, loading, addCard, updateCard, removeCard };
};

/** Lee el estado compartido desde `FinanceProvider`. */
export const useCreditCards = (): UseCreditCardsReturn => useFinance().creditCard;
