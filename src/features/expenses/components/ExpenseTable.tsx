import { Button, Popconfirm, Space, Tag } from '../../../libs/antd';
import type { TableProps } from '../../../libs/antd';
import DataTable from '../../../components/DataTable';
import EmptyState from '../../../components/EmptyState';
import type { Expense } from '../../../engine';
import { palette } from '../../../theme/tokens';
import { expenseKindLabels, expensePeriodLabels, formatPaymentDays } from '../../../utils/expense';
import { formatCOP } from '../../../utils/formatters';

interface ExpenseTableProps { data: Expense[]; loading: boolean; onEdit: (expense: Expense) => void; onDelete: (expense: Expense) => void; }

const kindColor = (kind: Expense['kind']): string => kind === 'fixed' ? palette.primary : palette.accent;

const ExpenseTable = ({ data, loading, onEdit, onDelete }: ExpenseTableProps) => {
  const columns: TableProps<Expense>['columns'] = [
    {
      title: 'Concepto',
      dataIndex: 'name',
      render: (name: string, expense) => (
        <span className="expense-concept">
          <span className="expense-dot" style={{ background: kindColor(expense.kind) }} />
          <strong>{name}</strong>
        </span>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      render: (category: string) => <Tag className="expense-category-tag">{category}</Tag>,
    },
    {
      title: 'Tipo',
      dataIndex: 'kind',
      render: (kind: Expense['kind']) => <Tag color={kindColor(kind)}>{expenseKindLabels[kind]}</Tag>,
    },
    {
      title: 'Días de pago',
      dataIndex: 'paymentDays',
      render: (_days: number[], expense) => formatPaymentDays(expense),
    },
    {
      title: 'Frecuencia',
      dataIndex: 'period',
      render: (period: Expense['period']) => expensePeriodLabels[period],
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      align: 'right',
      render: (amount: number) => <strong>{formatCOP(amount)}</strong>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_value: unknown, expense) => (
        <Space>
          <Button type="link" onClick={() => onEdit(expense)}>Editar</Button>
          <Popconfirm title="¿Eliminar este gasto?" okText="Eliminar" cancelText="Cancelar" onConfirm={() => onDelete(expense)}>
            <Button type="link" danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <section className="expense-table-section">
      <DataTable<Expense>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: <EmptyState message="No encontramos gastos con estos filtros." /> }}
      />
    </section>
  );
};

export default ExpenseTable;
