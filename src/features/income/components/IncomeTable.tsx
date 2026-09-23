import { Avatar, Button, Input, Popconfirm, Select, Space, Table, Tag } from '../../../libs/antd';
import type { TableProps } from '../../../libs/antd';
import type { IncomeFilters, IncomeKindFilter, IncomePaymentStatus, IncomeStatusFilter, IncomeWithStatus } from '../types';
import type { IncomeTableTotals } from '../hooks/useIncomeView';
import { formatCOP } from '../../../utils/formatters';

interface IncomeTableProps { data: IncomeWithStatus[]; filters: IncomeFilters; onFiltersChange: (filters: IncomeFilters) => void; onEdit: (income: IncomeWithStatus) => void; onDuplicate: (income: IncomeWithStatus) => void; onDelete: (income: IncomeWithStatus) => void; totals: IncomeTableTotals; }
const statusLabels: Record<IncomePaymentStatus, string> = { received: 'Recibido', pending: 'Pendiente', partial: 'Parcial' };
const statusColors: Record<IncomePaymentStatus, string> = { received: '#33B2C1', pending: 'default', partial: '#DA0081' };

const IncomeTable = ({ data, filters, onFiltersChange, onEdit, onDuplicate, onDelete, totals }: IncomeTableProps) => {
  const columns: TableProps<IncomeWithStatus>['columns'] = [
    { title: 'Fuente', dataIndex: 'name', render: (name: string, income) => <Space><Avatar style={{ backgroundColor: '#820AD2' }}>{name.charAt(0)}</Avatar><span><strong>{name}</strong><br /><small>{income.type}</small></span></Space> },
    { title: 'Tipo', dataIndex: 'recurrence', render: (recurrence: IncomeWithStatus['recurrence']) => <Tag color={recurrence === 'monthly' ? '#820AD2' : '#DA0081'}>{recurrence === 'monthly' ? 'Fijo' : 'Variable'}</Tag> },
    { title: 'Días de pago', dataIndex: 'paymentDays', render: (days: number[]) => days.join(' / ') },
    { title: 'Monto Bruto', dataIndex: 'amount', align: 'right', render: (amount: number) => formatCOP(amount) },
    { title: 'Deducciones', dataIndex: 'deductions', align: 'right', render: (value: number | undefined) => formatCOP(value ?? 0) },
    { title: 'Monto Neto', dataIndex: 'net', align: 'right', render: (value: number) => <strong>{formatCOP(value)}</strong> },
    { title: 'Estado', dataIndex: 'status', render: (status: IncomePaymentStatus) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag> },
    { title: 'Acciones', key: 'actions', render: (_value: unknown, income) => <Space><Button type="link" onClick={() => onEdit(income)}>Editar</Button><Button type="link" onClick={() => onDuplicate(income)}>Duplicar</Button><Popconfirm title="¿Eliminar esta fuente?" onConfirm={() => onDelete(income)}><Button type="link" danger>Eliminar</Button></Popconfirm></Space> },
  ];
  const summary: TableProps<IncomeWithStatus>['summary'] = () => <Table.Summary><Table.Summary.Row><Table.Summary.Cell index={0}><strong>Totales</strong></Table.Summary.Cell><Table.Summary.Cell index={1} /><Table.Summary.Cell index={2} /><Table.Summary.Cell index={3} align="right">{formatCOP(totals.gross)}</Table.Summary.Cell><Table.Summary.Cell index={4} align="right">{formatCOP(totals.deductions)}</Table.Summary.Cell><Table.Summary.Cell index={5} align="right">{formatCOP(totals.net)}</Table.Summary.Cell><Table.Summary.Cell index={6} /><Table.Summary.Cell index={7} /></Table.Summary.Row></Table.Summary>;
  return <section className="income-table-section"><div className="income-filters"><Input.Search placeholder="Buscar fuente o categoría" allowClear value={filters.search} onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })} /><Select value={filters.kind} onChange={(value: IncomeKindFilter) => onFiltersChange({ ...filters, kind: value })} options={[{ value: 'all', label: 'Todos los tipos' }, { value: 'fixed', label: 'Fijo' }, { value: 'variable', label: 'Variable' }]} /><Select value={filters.status} onChange={(value: IncomeStatusFilter) => onFiltersChange({ ...filters, status: value })} options={[{ value: 'all', label: 'Todos los estados' }, { value: 'received', label: 'Recibido' }, { value: 'pending', label: 'Pendiente' }, { value: 'partial', label: 'Parcial' }]} /></div><Table<IncomeWithStatus> columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 8 }} summary={summary} /></section>;
};

export default IncomeTable;
