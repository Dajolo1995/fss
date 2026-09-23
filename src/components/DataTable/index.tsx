import { Table } from '../../libs/antd';
import type { TableProps } from '../../libs/antd';

type DataTableProps<RecordType extends object> = TableProps<RecordType>;

const DataTable = <RecordType extends object>({ pagination = { pageSize: 8 }, loading = false, ...props }: DataTableProps<RecordType>) => (
  <Table<RecordType> pagination={pagination} loading={loading} {...props} />
);

export default DataTable;
