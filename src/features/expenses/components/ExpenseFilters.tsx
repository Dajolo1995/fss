import { Input, Segmented } from '../../../libs/antd';
import type { ExpenseKindCounts, ExpenseKindFilter } from '../types';

interface ExpenseFiltersProps { kind: ExpenseKindFilter; search: string; counts: ExpenseKindCounts; onKindChange: (kind: ExpenseKindFilter) => void; onSearchChange: (search: string) => void; }

const ExpenseFilters = ({ kind, search, counts, onKindChange, onSearchChange }: ExpenseFiltersProps) => (
  <div className="expense-toolbar">
    <Segmented<ExpenseKindFilter>
      value={kind}
      onChange={onKindChange}
      options={[
        { value: 'all', label: `Todos (${counts.all})` },
        { value: 'fixed', label: `Fijos (${counts.fixed})` },
        { value: 'variable', label: `Variables (${counts.variable})` },
      ]}
    />
    <Input.Search
      placeholder="Buscar por concepto o categoría"
      allowClear
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  </div>
);

export default ExpenseFilters;
