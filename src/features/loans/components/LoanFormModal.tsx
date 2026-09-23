import { useEffect } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Select } from '../../../libs/antd';
import { dayjs } from '../../../libs/dayjs';
import type { Loan, LoanKind } from '../../../engine';
import { loanKindLabels } from '../../../utils/loan';
import type { LoanFormValues } from '../types';

interface LoanFormModalProps { open: boolean; loan?: Loan; loading: boolean; onSubmit: (values: LoanFormValues) => void; onClose: () => void; }

const kindOptions = (Object.keys(loanKindLabels) as LoanKind[]).map((kind) => ({ value: kind, label: loanKindLabels[kind] }));
const groupThousands = (value: string): string => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const currencyProps = {
  min: 0,
  step: 10000,
  style: { width: '100%' },
  formatter: (value: number | undefined | null) => value === undefined || value === null ? '' : `$ ${groupThousands(`${value}`)}`,
  parser: (displayValue: string | undefined) => Number((displayValue ?? '').replace(/\D/g, '')),
} as const;

const emptyValues: LoanFormValues = {
  name: '', kind: 'freeInvestment', numberCredit: '', disbursementDate: dayjs(),
  originalAmount: 0, eAInterestRate: 0, eAMoraInterestRate: 0, quote: 0, term: 12,
  numberQuote: 0, paymentDay: 1, secureLife: 0, secureQuote: 0, secureCar: 0, otherConcepts: 0,
};

const LoanFormModal = ({ open, loan, loading, onSubmit, onClose }: LoanFormModalProps) => {
  const [form] = Form.useForm<LoanFormValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(loan ? {
      name: loan.name, kind: loan.kind, numberCredit: loan.numberCredit, disbursementDate: dayjs(loan.disbursementDate),
      originalAmount: loan.originalAmount, eAInterestRate: loan.eAInterestRate, eAMoraInterestRate: loan.eAMoraInterestRate,
      quote: loan.quote, term: loan.term, numberQuote: loan.numberQuote, paymentDay: loan.paymentDay,
      secureLife: loan.secureLife, secureQuote: loan.secureQuote, secureCar: loan.secureCar ?? 0, otherConcepts: loan.otherConcepts,
    } : emptyValues);
  }, [open, loan, form]);

  return (
    <Modal
      title={loan ? 'Editar préstamo' : 'Registrar nuevo préstamo'}
      open={open}
      onCancel={onClose}
      onOk={() => { void form.submit(); }}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={loading}
      width={760}
      forceRender
    >
      <Form<LoanFormValues> form={form} layout="vertical" initialValues={emptyValues} onFinish={onSubmit} className="loan-form">
        <div className="loan-form-grid">
          <Form.Item name="name" label="Nombre del préstamo" rules={[{ required: true, message: 'Escribe el nombre del préstamo' }]}>
            <Input placeholder="Ej. Préstamo Banco X" />
          </Form.Item>
          <Form.Item name="kind" label="Tipo de crédito" rules={[{ required: true, message: 'Selecciona el tipo de crédito' }]}>
            <Select options={kindOptions} />
          </Form.Item>
          <Form.Item name="numberCredit" label="Número de crédito" rules={[{ required: true, message: 'Escribe el número de pagaré o crédito' }]}>
            <Input placeholder="Ej. 123456789" />
          </Form.Item>
          <Form.Item name="disbursementDate" label="Fecha de desembolso" rules={[{ required: true, message: 'Selecciona la fecha de desembolso' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Selecciona una fecha" />
          </Form.Item>
          <Form.Item name="originalAmount" label="Monto original" rules={[{ required: true, message: 'Ingresa el monto desembolsado' }, { type: 'number', min: 1, message: 'El monto debe ser mayor a cero' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item name="quote" label="Cuota mensual (capital + interés)" rules={[{ required: true, message: 'Ingresa la cuota mensual' }, { type: 'number', min: 1, message: 'La cuota debe ser mayor a cero' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item name="eAInterestRate" label="Tasa E.A. (%)" rules={[{ required: true, message: 'Ingresa la tasa efectiva anual' }, { type: 'number', min: 0, max: 100, message: 'La tasa debe estar entre 0 y 100' }]}>
            <InputNumber<number> min={0} max={100} step={0.01} style={{ width: '100%' }} suffix="%" />
          </Form.Item>
          <Form.Item name="eAMoraInterestRate" label="Tasa de mora E.A. (%)" rules={[{ required: true, message: 'Ingresa la tasa de mora' }, { type: 'number', min: 0, max: 100, message: 'La tasa debe estar entre 0 y 100' }]}>
            <InputNumber<number> min={0} max={100} step={0.01} style={{ width: '100%' }} suffix="%" />
          </Form.Item>
          <Form.Item name="term" label="Plazo total (meses)" rules={[{ required: true, message: 'Ingresa el plazo en meses' }, { type: 'number', min: 1, max: 600, message: 'El plazo debe estar entre 1 y 600 meses' }]}>
            <InputNumber<number> min={1} max={600} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="numberQuote"
            label="Cuotas pagadas"
            dependencies={['term']}
            rules={[
              { required: true, message: 'Ingresa las cuotas ya pagadas' },
              { type: 'number', min: 0, message: 'No puede ser negativo' },
              ({ getFieldValue }) => ({
                validator: (_rule, value: number) => value === undefined || value === null || value <= getFieldValue('term')
                  ? Promise.resolve()
                  : Promise.reject(new Error('Las cuotas pagadas no pueden superar el plazo')),
              }),
            ]}
          >
            <InputNumber<number> min={0} max={600} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="paymentDay" label="Día de pago" rules={[{ required: true, message: 'Ingresa el día de pago' }, { type: 'number', min: 1, max: 31, message: 'El día debe estar entre 1 y 31' }]}>
            <InputNumber<number> min={1} max={31} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="secureLife" label="Seguro de vida mensual" rules={[{ required: true, message: 'Ingresa el seguro de vida' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item name="secureQuote" label="Seguro por cuota" rules={[{ required: true, message: 'Ingresa el seguro por cuota' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item name="otherConcepts" label="Otros conceptos" rules={[{ required: true, message: 'Ingresa otros conceptos (0 si no aplica)' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(previous, current) => previous.kind !== current.kind}>
            {({ getFieldValue }) => getFieldValue('kind') === 'vehicle' ? (
              <Form.Item name="secureCar" label="Seguro del vehículo" rules={[{ required: true, message: 'Ingresa el seguro del vehículo' }, { type: 'number', min: 1, message: 'Debe ser mayor a cero' }]}>
                <InputNumber<number> {...currencyProps} />
              </Form.Item>
            ) : null}
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default LoanFormModal;
