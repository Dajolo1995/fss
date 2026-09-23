import type { ReactNode } from 'react';

interface PageHeaderProps { title: string; subtitle: string; badge?: ReactNode; actions?: ReactNode; }

const PageHeader = ({ title, subtitle, badge, actions }: PageHeaderProps) => (
  <header className="page-header"><div><div className="page-title-row"><h1>{title}</h1>{badge}</div><p className="page-lead">{subtitle}</p></div><div className="page-header-actions">{actions}</div></header>
);

export default PageHeader;
