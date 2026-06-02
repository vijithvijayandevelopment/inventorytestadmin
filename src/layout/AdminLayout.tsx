import { Layout, Dropdown, Button, message } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useEffect, useState, useRef } from 'react'
import logo from '../assets/logo.png'
import logoMini from '../assets/logo.png'
import { logoutApi } from '../auth/auth.api'
import { HeaderAvatar } from '../shared/components/HeaderAvatar'
import { ProfileMenu } from '../shared/components/ProfileMenu'
import { SidebarMenu } from '../shared/components/SidebarMenu'

const { Header, Sider, Content, Footer } = Layout

export default function AdminLayout() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    const handleFocus = () => {
      fetchedRef.current = false
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const logout = async () => {
    try {
      await logoutApi()
    } catch { }
    finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('username')
      navigate('/login', { replace: true })
      message.success(t('logout.success'))
    }
  }

  const username = localStorage.getItem('username') || 'User'
  const year = new Date().getFullYear()

  const sidebarWidth = 260
  const collapsedWidth = 80

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={sidebarWidth}
        collapsedWidth={collapsedWidth}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#124a73',
          display: 'flex',
          flexDirection: 'column',
        }}
        trigger={null}
      >
        <div className="sidebar-logo">
          {collapsed ? (
            <img src={logoMini} alt="S" style={{ width: 40, height: 40 }} />
          ) : (
            <img src={logo} alt="Sahaya" />
          )}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '43px',
          height: 'calc(100vh - 120px)',
        }}>
          <SidebarMenu collapsed={collapsed} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 43,
            background: '#0b4f81',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ?
            <MenuUnfoldOutlined style={{ color: '#fff', fontSize: 18 }} /> :
            <MenuFoldOutlined style={{ color: '#fff', fontSize: 18 }} />
          }
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? collapsedWidth : sidebarWidth,
          minHeight: '100vh',
        }}
      >
        <Header
          className="admin-header"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 1500,
            background: '#0b4f81',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            width: `calc(100% - ${collapsed ? collapsedWidth : sidebarWidth}px)`,
            marginLeft: collapsed ? collapsedWidth : sidebarWidth,
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: '#fff' }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            <Dropdown
              menu={ProfileMenu({ username, onLogout: logout })}
              placement="bottomRight"
              getPopupContainer={() => document.body}
            >
              <div className="profile-trigger">
                <HeaderAvatar />
              </div>
            </Dropdown>

          </div>

        </Header>

        <Content
          style={{
            marginTop: 64,
            marginRight: 16,
            marginBottom: 16,
            padding: 16,
            overflow: 'auto',
            minHeight: 'calc(100vh - 64px - 40px)',
            backgroundColor: 'rgb(233, 233, 233)',
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            background: 'rgb(235, 235, 235)',
            color: '#1f2937',
            borderTop: '1px solid #b6c2c7',
            padding: '12px 16px',
            fontSize: 13,
          }}
        >
          © {year} Test. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  )
}
