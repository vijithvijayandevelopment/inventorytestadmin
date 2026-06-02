import { Menu } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { ADMIN_ROUTES } from '../../../src/shared/routes/app.routes'

type SidebarMenuProps = {
  collapsed?: boolean
}

export function SidebarMenu({ collapsed = false }: SidebarMenuProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = location.pathname.startsWith('/products')
    ? 'products'
    : location.pathname.startsWith('/inventory')
      ? 'inventory'
      : location.pathname.startsWith('/settings')
        ? 'settings'
        : 'dashboard'

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      inlineCollapsed={collapsed}
      items={[
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: collapsed ? '' : 'Dashboard',
          onClick: () => navigate(ADMIN_ROUTES.DASHBOARD),
          title: '',
        },
        {
          key: 'inventory',
          icon: <ShoppingOutlined />,
          label: collapsed ? '' : 'Inventory',
          title: '',
          children: [
            {
              key: 'products',
              icon: <ProfileOutlined />,
              label: 'Products',
              title: '',
              onClick: () => navigate(ADMIN_ROUTES.PRODUCTS),
            },
          ],
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: collapsed ? '' : 'Settings',
          onClick: () => navigate(ADMIN_ROUTES.SETTINGS),
          title: '',
        },
      ]}
    />
  )
}