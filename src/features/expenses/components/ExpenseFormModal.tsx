import { useEffect } from 'react';
import { AutoComplete, Form, Input, InputNumber, Modal, Radio, Select } from '../../../libs/antd';
import type { Expense } from '../../../engine';
import type { ExpenseFormValues } from '../types';

interface ExpenseFormModalProps { open: boolean; expense?: Expense; categories: string[]; loading: boolean; onSubmit: (values: ExpenseFormValues) => void; onClose: () => void; }

const dayOptions = Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: `Día ${index + 1}` }));
const emptyValues: ExpenseFormValues = { name: '', amount: 0, kind: 'fixed', category: '', period: 'monthly', paymentDays: [] };
const groupThousands = (value: string): string => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const ExpenseFormModal = ({ open, expense, categories, loading, onSubmit, onClose }: ExpenseFormModalProps) => {
  const [form] = Form.useForm<ExpenseFormValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(expense
      ? { name: expense.name, amount: expense.amount, kind: expense.kind, category: expense.category, period: expense.period, paymentDays: expense.paymentDays }
      : emptyValues);
  }, [open, expense, form]);

  return (
    <Modal
      title={expense ? 'Editar gasto' : 'Nuevo gasto'}
      open={open}
      onCancel={onClose}
      onOk={() => { void form.submit(); }}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={loading}
      forceRender
    >
      <Form<ExpenseFormValues> form={form} layout="vertical" initialValues={emptyValues} onFinish={onSubmit} className="expense-form">
        <Form.Item name="name" label="Concepto" rules={[{ required: true, message: 'Escribe el nombre del gasto' }]}>
          <Input placeholder="Ej. Renta" />
        </Form.Item>
        <Form.Item name="amount" label="Monto" rules={[{ required: true, message: 'Ingresa el monto' }, { type: 'number', min: 1, message: 'El monto debe ser mayor a cero' }]}>
          <InputNumber<number>
            min={0}
            step={1000}
            style={{ width: '100%' }}
            formatter={(value) => value === undefined || value === null ? '' : `$ ${groupThousands(`${value}`)}`}
            parser={(displayValue) => Number((displayValue ?? '').replace(/\D/g, ''))}
          />
        </Form.Item>
        <Form.Item name="kind" label="Tipo de gasto" rules={[{ required: true, message: 'Selecciona el tipo' }]}>
          <Radio.Group optionType="button" options={[{ label: 'Fijo', value: 'fixed' }, { label: 'Variable', value: 'variable' }]} />
        </Form.Item>
        <Form.Item name="category" label="Categoría" rules={[{ required: true, message: 'Selecciona o escribe una categoría' }]}>
          <AutoComplete
            placeholder="Ej. Vivienda"
            options={categories.map((category) => ({ value: category }))}
            filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
        <Form.Item name="period" label="Frecuencia" rules={[{ required: true, message: 'Selecciona la frecuencia' }]}>
          <Radio.Group optionType="button" options={[{ label: 'Mensual', value: 'monthly' }, { label: 'Pago único', value: 'unique' }]} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(previous, current) => previous.period !== current.period}>
          {({ getFieldValue }) => getFieldValue('period') === 'monthly' ? (
            <Form.Item name="paymentDays" label="Días de pago" rules={[{ required: true, message: 'Selecciona al menos un día de pago' }]}>
              <Select mode="multiple" options={dayOptions} maxTagCount="responsive" placeholder="Ej. día 5 y día 30" />
            </Form.Item>
          ) : null}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseFormModal;
