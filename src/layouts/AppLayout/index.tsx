import { Layout, Menu } from '../../libs/antd';
import { Outlet, useLocation, useNavigate } from '../../libs/reactRouter';
import { palette } from '../../theme/tokens';
import './styles.css';

const items = [
  { key: '/dashboard', label: 'Dashboard' },
  { key: '/income', label: 'Ingresos' },
  { key: '/expenses', label: 'Gastos' },
  { key: '/credit-cards', label: 'Tarjetas de Crédito' },
  { key: '/loans', label: 'Préstamos' },
  { key: '/simulation', label: 'Simulación' },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Layout className="app-layout">
      <Layout.Sider breakpoint="lg" collapsedWidth="0">
        <div className="brand">FFS <span>2.0</span></div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} onClick={({ key }) => navigate(key)} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="app-header"><span>Financial Freedom Simulator</span><span style={{ color: palette.positive }}>Tu libertad, en números</span></Layout.Header>
        <Layout.Content className="app-content"><Outlet /></Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
