import { useRef, useState } from 'react';
import { Button, Segmented, Tag, message } from '../../libs/antd';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';
import type { Loan } from '../../engine';
import { usePageTitle } from '../../hooks/usePageTitle';
import { palette } from '../../theme/tokens';
import { loanOrderLabels } from '../../utils/loan';
import ExtraPaymentPanel from './components/ExtraPaymentPanel';
import LoanCard from './components/LoanCard';
import LoanFormModal from './components/LoanFormModal';
import LoanKpiGrid from './components/LoanKpiGrid';
import { useLoans } from './hooks/useLoans';
import type { LoanFormValues, LoanOrderMode } from './types';

const LoansPage = () => {
  usePageTitle('Préstamos');
  const view = useLoans();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan>();
  const [extraPaymentLoanId, setExtraPaymentLoanId] = useState<string>();
  const panelRef = useRef<HTMLDivElement>(null);

  const openCreate = (): void => { setEditingLoan(undefined); setModalOpen(true); };
  const openEdit = (loan: Loan): void => { setEditingLoan(loan); setModalOpen(true); };
  const closeModal = (): void => { setEditingLoan(undefined); setModalOpen(false); };

  const handleSubmit = (values: LoanFormValues): void => {
    if (editingLoan) {
      view.updateLoan(editingLoan.id, values);
      void message.success('Préstamo actualizado');
    } else {
      view.addLoan(values);
      void message.success('Préstamo registrado');
    }
    closeModal();
  };

  const handleDelete = (loan: Loan): void => {
    view.removeLoan(loan.id);
    if (extraPaymentLoanId === loan.id) setExtraPaymentLoanId(undefined);
    void message.success('Préstamo eliminado');
  };

  const handleSimulate = (loan: Loan): void => {
    setExtraPaymentLoanId(loan.id);
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="loans-view">
      <PageHeader
        title="Créditos & Préstamos"
        subtitle="Prioriza qué deuda atacar primero y mide cuánto te ahorra cada abono a capital."
        badge={<Tag color={palette.primary} className="page-title-badge">{view.loans.length} obligaciones vivas</Tag>}
        actions={
          <>
            <Segmented<LoanOrderMode>
              value={view.orderMode}
              onChange={view.setOrderMode}
              options={[
                { value: 'avalanche', label: loanOrderLabels.avalanche },
                { value: 'snowball', label: loanOrderLabels.snowball },
              ]}
            />
            <Button type="primary" onClick={openCreate}>+ Registrar Nuevo Préstamo</Button>
          </>
        }
      />

      <LoanKpiGrid loans={view.loans} totals={view} />

      <div className="loans-layout">
        <section className="loan-stack">
          {view.sortedLoans.length === 0
            ? <EmptyState message="Todavía no has registrado préstamos." actionLabel="Registrar préstamo" onAction={openCreate} />
            : view.sortedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                isPriority={loan.id === view.priorityLoanId}
                onSimulate={handleSimulate}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
        </section>
        <div className="loan-side" ref={panelRef}>
          <ExtraPaymentPanel loans={view.sortedLoans} selectedLoanId={extraPaymentLoanId} onSelectLoan={setExtraPaymentLoanId} />
        </div>
      </div>

      <LoanFormModal open={modalOpen} loan={editingLoan} loading={view.loading} onSubmit={handleSubmit} onClose={closeModal} />
    </main>
  );
};

export default LoansPage;
