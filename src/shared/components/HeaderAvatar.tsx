import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export function HeaderAvatar() {
  return (
    <Avatar
      size="large"
      icon={<UserOutlined />}
    />
  )
}