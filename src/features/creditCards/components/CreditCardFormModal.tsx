import { useEffect } from 'react';
import { AutoComplete, ColorPicker, Form, Input, InputNumber, Modal, Select } from '../../../libs/antd';
import type { CardFranchise, CreditCard } from '../../../engine';
import { mvToEA } from '../../../engine';
import { cardColorPresets, franchiseLabels, LAST_DIGITS_PATTERN } from '../../../utils/creditCard';
import { eAToMV } from '../../../engine';
import type { CreditCardFormValues } from '../types';

interface CreditCardFormModalProps { open: boolean; card?: CreditCard; loading: boolean; onSubmit: (values: CreditCardFormValues) => void; onClose: () => void; }

type ColorPickerValue = string | { toHexString: () => string };
const toHexString = (color: ColorPickerValue): string => typeof color === 'string' ? color : color.toHexString();

const bankOptions = ['Nu', 'Bancolombia', 'Davivienda', 'Banco de Bogotá', 'BBVA', 'Rappi'].map((bank) => ({ value: bank }));
const franchiseOptions = (Object.keys(franchiseLabels) as CardFranchise[]).map((franchise) => ({ value: franchise, label: franchiseLabels[franchise] }));
const colorPresets = [{ label: 'Sugeridos', colors: cardColorPresets }];
const groupThousands = (value: string): string => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const currencyProps = {
  min: 0,
  step: 50000,
  style: { width: '100%' },
  formatter: (value: number | undefined | null) => value === undefined || value === null ? '' : `$ ${groupThousands(`${value}`)}`,
  parser: (displayValue: string | undefined) => Number((displayValue ?? '').replace(/\D/g, '')),
} as const;

const emptyValues: CreditCardFormValues = {
  bank: '', franchise: 'visa', name: '', lastDigits: '', creditLimit: 0, balance: 0,
  minPayment: 0, mvInterestRate: 1.9, cutOffDay: 1, paymentDay: 1, color: cardColorPresets[0],
};

const CreditCardFormModal = ({ open, card, loading, onSubmit, onClose }: CreditCardFormModalProps) => {
  const [form] = Form.useForm<CreditCardFormValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(card ? {
      bank: card.bank, franchise: card.franchise, name: card.name, lastDigits: card.lastDigits,
      creditLimit: card.creditLimit, balance: card.balance, minPayment: card.minPayment,
      mvInterestRate: Number(eAToMV(card.eAInterestRate).toFixed(2)),
      cutOffDay: card.cutOffDay, paymentDay: card.paymentDay, color: card.color,
    } : emptyValues);
  }, [open, card, form]);

  return (
    <Modal
      title={card ? 'Editar tarjeta' : 'Agregar tarjeta'}
      open={open}
      onCancel={onClose}
      onOk={() => { void form.submit(); }}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={loading}
      width={720}
      forceRender
    >
      <Form<CreditCardFormValues> form={form} layout="vertical" initialValues={emptyValues} onFinish={onSubmit} className="credit-card-form">
        <p className="kpi-caption credit-card-form-notice">Por seguridad solo se guardan los últimos dígitos. Nunca pedimos el número completo, la fecha de vencimiento ni el CVV.</p>
        <div className="credit-card-form-grid">
          <Form.Item name="bank" label="Banco" rules={[{ required: true, message: 'Escribe o elige el banco' }]}>
            <AutoComplete options={bankOptions} placeholder="Ej. Bancolombia" filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
          <Form.Item name="franchise" label="Franquicia" rules={[{ required: true, message: 'Selecciona la franquicia' }]}>
            <Select options={franchiseOptions} />
          </Form.Item>
          <Form.Item name="name" label="Nombre de la tarjeta" rules={[{ required: true, message: 'Escribe el nombre de la tarjeta' }]}>
            <Input placeholder="Ej. Platinum" />
          </Form.Item>
          <Form.Item
            name="lastDigits"
            label="Últimos dígitos"
            extra="Solo los últimos 4 o 5 dígitos del plástico."
            rules={[{ required: true, message: 'Ingresa solo los últimos 4 o 5 dígitos' }, { pattern: LAST_DIGITS_PATTERN, message: 'Ingresa solo los últimos 4 o 5 dígitos' }]}
          >
            <Input placeholder="3456" maxLength={5} inputMode="numeric" autoComplete="off" />
          </Form.Item>
          <Form.Item name="creditLimit" label="Cupo total" rules={[{ required: true, message: 'Ingresa el cupo' }, { type: 'number', min: 1, message: 'El cupo debe ser mayor a cero' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item
            name="balance"
            label="Saldo actual"
            dependencies={['creditLimit']}
            rules={[
              { required: true, message: 'Ingresa el saldo actual' },
              { type: 'number', min: 0, message: 'El saldo no puede ser negativo' },
              ({ getFieldValue }) => ({
                validator: (_rule, value: number) => value === undefined || value === null || value <= getFieldValue('creditLimit')
                  ? Promise.resolve()
                  : Promise.reject(new Error('El saldo no puede superar el cupo')),
              }),
            ]}
          >
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item name="minPayment" label="Pago mínimo" rules={[{ required: true, message: 'Ingresa el pago mínimo' }, { type: 'number', min: 0, message: 'No puede ser negativo' }]}>
            <InputNumber<number> {...currencyProps} />
          </Form.Item>
          <Form.Item
            name="mvInterestRate"
            label="Tasa de interés M.V. (%)"
            extra="Como aparece en tu extracto."
            rules={[{ required: true, message: 'Ingresa la tasa mes vencido' }, { type: 'number', min: 0, max: 10, message: 'La tasa M.V. debe estar entre 0 y 10' }]}
          >
            <InputNumber<number> min={0} max={10} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(previous, current) => previous.mvInterestRate !== current.mvInterestRate}>
            {({ getFieldValue }) => {
              const mv = Number(getFieldValue('mvInterestRate') ?? 0);
              return <span className="field-hint" data-testid="ea-preview">Equivale a {mvToEA(mv).toFixed(2)}% E.A.</span>;
            }}
          </Form.Item>
          <Form.Item name="cutOffDay" label="Día de corte" rules={[{ required: true, message: 'Ingresa el día de corte' }, { type: 'number', min: 1, max: 31, message: 'El día debe estar entre 1 y 31' }]}>
            <InputNumber<number> min={1} max={31} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="paymentDay" label="Día límite de pago" rules={[{ required: true, message: 'Ingresa el día límite de pago' }, { type: 'number', min: 1, max: 31, message: 'El día debe estar entre 1 y 31' }]}>
            <InputNumber<number> min={1} max={31} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="color" label="Color de la tarjeta" getValueFromEvent={(color: ColorPickerValue) => toHexString(color)} rules={[{ required: true, message: 'Elige un color' }]}>
            <ColorPicker presets={colorPresets} showText disabledAlpha format="hex" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreditCardFormModal;
