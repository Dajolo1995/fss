import { useMemo, useState } from 'react';
import { Button, Tag, message } from '../../libs/antd';
import { Eye, EyeOff } from '../../libs/icons';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import type { CreditCard } from '../../engine';
import { usePageTitle } from '../../hooks/usePageTitle';
import { usePrivacyMode } from '../../hooks/usePrivacyMode';
import { palette } from '../../theme/tokens';
import CardKpiGrid from './components/CardKpiGrid';
import CreditCardFormModal from './components/CreditCardFormModal';
import CreditCardItem from './components/CreditCardItem';
import FinancingSimulator from './components/FinancingSimulator';
import UtilizationLegend from './components/UtilizationLegend';
import { useCreditCards } from './hooks/useCreditCards';
import type { CreditCardFormValues } from './types';

const CreditCardsPage = () => {
  usePageTitle('Tarjetas de Crédito');
  const view = useCreditCards();
  const { hideBalances, togglePrivacy } = usePrivacyMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard>();
  const today = useMemo(() => new Date(), []);

  const openCreate = (): void => { setEditingCard(undefined); setModalOpen(true); };
  const openEdit = (card: CreditCard): void => { setEditingCard(card); setModalOpen(true); };
  const closeModal = (): void => { setEditingCard(undefined); setModalOpen(false); };

  const handleSubmit = (values: CreditCardFormValues): void => {
    if (editingCard) {
      view.updateCard(editingCard.id, values);
      void message.success('Tarjeta actualizada');
    } else {
      view.addCard(values);
      void message.success('Tarjeta agregada');
    }
    closeModal();
  };

  const handleDelete = (card: CreditCard): void => {
    view.removeCard(card.id);
    void message.success('Tarjeta eliminada');
  };

  return (
    <main className="credit-cards-view">
      <PageHeader
        title="Tarjetas & Capacidad Revolvente"
        subtitle="Vigila cuánto cupo estás usando y cuánto te cuesta de verdad diferir una compra."
        badge={<Tag color={palette.primary} className="page-title-badge">{view.cards.length} {view.cards.length === 1 ? 'Plástico' : 'Plásticos'}</Tag>}
        actions={
          <>
            <Button onClick={togglePrivacy} icon={hideBalances ? <Eye size={16} /> : <EyeOff size={16} />}>
              {hideBalances ? 'Mostrar Balances' : 'Ocultar Balances'}
            </Button>
            <Button type="primary" onClick={openCreate}>+ Agregar Tarjeta</Button>
          </>
        }
      />

      <CardKpiGrid totals={view.totals} nearestPayment={view.nearestPayment} />
      <UtilizationLegend />

      {view.cards.length === 0
        ? <EmptyState message="Todavía no has registrado tarjetas de crédito." actionLabel="+ Agregar Tarjeta" onAction={openCreate} />
        : (
          <div className="credit-card-grid">
            {view.cards.map((card) => (
              <CreditCardItem key={card.id} card={card} today={today} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

      <FinancingSimulator />

      <CreditCardFormModal open={modalOpen} card={editingCard} loading={view.loading} onSubmit={handleSubmit} onClose={closeModal} />
    </main>
  );
};

export default CreditCardsPage;
