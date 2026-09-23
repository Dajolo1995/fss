import { Form, Input, InputNumber, Radio, Select } from '../../../libs/antd';
import FormDrawer from '../../../components/FormDrawer';
import type { Income, IncomeFormValues } from '../types';
import { formatCOP } from '../../../utils/formatters';

interface IncomeFormProps { open: boolean; income?: Income; loading: boolean; onSubmit: (values: IncomeFormValues) => void; onClose: () => void; }
const categories = [{ value: 'Salary', label: 'Salario' }, { value: 'Investment', label: 'Inversión' }, { value: 'Consulting', label: 'Consultoría' }, { value: 'Rental', label: 'Arriendo' }, { value: 'Other', label: 'Otro' }];
const days = Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: `Día ${index + 1}` }));
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((label, index) => ({ value: index + 1, label }));

const IncomeForm = ({ open, income, loading, onSubmit, onClose }: IncomeFormProps) => {
  const initialValues: IncomeFormValues | undefined = income ? { name: income.name, type: income.type, amount: income.amount, deductions: income.deductions, recurrence: income.recurrence, period: income.period, paymentDays: income.paymentDays, month: income.month } : { name: '', recurrence: 'monthly', period: 'monthly', paymentDays: [30], type: 'Salary', amount: 0 };
  return <FormDrawer title={income ? 'Editar fuente de ingreso' : 'Agregar fuente de ingreso'} open={open} initialValues={initialValues} loading={loading} onSubmit={onSubmit} onClose={onClose}>
    <Form.Item name="name" label="Nombre de la fuente" rules={[{ required: true, message: 'Escribe un nombre' }]}><Input placeholder="Ej. Salario Empresa X" /></Form.Item>
    <Form.Item name="type" label="Categoría" rules={[{ required: true, message: 'Selecciona una categoría' }]}><Select options={categories} /></Form.Item>
    <Form.Item name="amount" label="Monto bruto" rules={[{ required: true, message: 'Ingresa el monto' }, { type: 'number', min: 1, message: 'Debe ser mayor a cero' }]}><InputNumber min={0} style={{ width: '100%' }} formatter={(value) => value ? formatCOP(Number(value)) : ''} /></Form.Item>
    <Form.Item name="deductions" label="Deducciones"><InputNumber min={0} style={{ width: '100%' }} formatter={(value) => value ? formatCOP(Number(value)) : ''} /></Form.Item>
    <Form.Item name="recurrence" label="Tipo de ingreso"><Radio.Group optionType="button" options={[{ label: 'Fijo mensual', value: 'monthly' }, { label: 'Único / variable', value: 'unique' }]} /></Form.Item>
    <Form.Item name="period" label="Periodo"><Radio.Group optionType="button" options={[{ label: 'Mensual', value: 'monthly' }, { label: 'Mes específico', value: 'specific' }]} /></Form.Item>
    <Form.Item name="paymentDays" label="Días de pago" rules={[{ required: true, message: 'Selecciona al menos un día' }]}><Select mode="multiple" options={days} maxTagCount="responsive" /></Form.Item>
    <Form.Item noStyle shouldUpdate={(previous, current) => previous.period !== current.period}>{({ getFieldValue }) => getFieldValue('period') === 'specific' ? <Form.Item name="month" label="Mes"><Select options={months} /></Form.Item> : null}</Form.Item>
  </FormDrawer>;
};

export default IncomeForm;
