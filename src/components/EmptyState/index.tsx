import { Button, Empty } from '../../libs/antd';

type EmptyStateProps = { message?: string; actionLabel?: string; onAction?: () => void };

const EmptyState = ({ message = 'Aún no hay información para mostrar.', actionLabel, onAction }: EmptyStateProps) => (
  <Empty description={message} image={Empty.PRESENTED_IMAGE_SIMPLE}>
    {actionLabel && <Button type="primary" onClick={onAction}>{actionLabel}</Button>}
  </Empty>
);

export default EmptyState;
