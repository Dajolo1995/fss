import type { ReactNode } from 'react';
import { Button, Table, Tag } from '../../libs/antd';
import type { TableProps } from '../../libs/antd';

export interface EntityTableAction<T> { label: string; onClick: (item: T) => void; danger?: boolean; confirm?: string; }
export interface EntityTableProps<T extends object> extends Omit<TableProps<T>, 'dataSource'> { data: T[]; filters?: ReactNode; actions?: EntityTableAction<T>[]; }

const EntityTable = <T extends object>({ data, filters, actions, ...props }: EntityTableProps<T>) => (
  <section className="entity-table"><div className="entity-table-filters">{filters}</div><Table<T> {...props} dataSource={data} rowKey="id" summary={props.summary} />{actions && <span className="entity-table-action-config" aria-hidden="true"><Tag>{actions.length} acciones</Tag><Button style={{ display: 'none' }} /></span>}</section>
);

export default EntityTable;
