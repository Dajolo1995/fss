import type { ReactNode } from 'react';

interface PageHeaderProps { title: string; subtitle: string; actions?: ReactNode; }

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <header className="page-header"><div><h1>{title}</h1><p className="page-lead">{subtitle}</p></div><div className="page-header-actions">{actions}</div></header>
);

export default PageHeader;
