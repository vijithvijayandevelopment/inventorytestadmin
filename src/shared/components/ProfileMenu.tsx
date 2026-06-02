import type { MenuProps } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

type ProfileMenuProps = {
  username: string
  onLogout: () => void
}

export function ProfileMenu({ username, onLogout }: ProfileMenuProps): MenuProps {
  return {
    items: [
      {
        key: 'welcome',
        label: <span>Welcome, {username}</span>,
        disabled: true,
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: onLogout,
      },
    ],
  }
}
