import type { ReactNode } from 'react';
import { Button, Empty } from '../../libs/antd';

type EmptyStateProps = { message?: ReactNode; actionLabel?: string; onAction?: () => void; children?: ReactNode };

const EmptyState = ({ message = 'Aún no hay información para mostrar.', actionLabel, onAction, children }: EmptyStateProps) => (
  <Empty description={message} image={Empty.PRESENTED_IMAGE_SIMPLE}>
    {actionLabel && <Button type="primary" onClick={onAction}>{actionLabel}</Button>}
    {children}
  </Empty>
);

export default EmptyState;
