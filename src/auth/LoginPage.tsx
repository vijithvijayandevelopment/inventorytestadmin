import { Button, Card, Form, Input, message } from 'antd'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { login } from './auth.api'
import logo from '../assets/logo.png'
import './LoginPage.css'
import { ADMIN_ROUTES, AUTH_ROUTES } from '../shared/routes/app.routes'

type LoginForm = {
  email: string
  password: string
}

export function LoginPage() {
  const token = localStorage.getItem('access_token')
  if (token) {
    return <Navigate to="/" replace />
  }

  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [enableAutoFill, setEnableAutoFill] = useState(false)

  const onFinish = async (values: LoginForm) => {
    setLoading(true)
    try {
      const payload = {
        email: values.email,
        password: values.password
      }

      const res = await login(payload)

      if (res.success && res.data && res.data[0]) {
        const tokens = res.data[0].tokens
        const user = res.data[0].user
        const organization = res.data[0].organization

        localStorage.setItem('access_token', tokens.accessToken)
        localStorage.setItem('refresh_token', tokens.refreshToken)

        localStorage.setItem('user_id', user.id)
        localStorage.setItem('user_email', user.email)
        localStorage.setItem('user_roles', JSON.stringify(user.roles))

        localStorage.setItem('organization_id', user.organizationId)
        localStorage.setItem('organization_name', organization.name)
        localStorage.setItem('default_low_stock_threshold', String(organization.defaultLowStockThreshold))

        message.success(t('login.success'))
        navigate(ADMIN_ROUTES.DASHBOARD, { replace: true })
      } else {
        message.error(res.message || t('login.invalidCredentials'))
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t('login.invalidCredentials')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Link to={ADMIN_ROUTES.DASHBOARD} className="login-logo-link">
            <img src={logo} alt="Logo" className="login-logo" />
          </Link>
          <div className="login-title">{t('login.title')}</div>
        </div>

        <Form layout="vertical" autoComplete="off" onFinish={onFinish}>
          <Form.Item
            label={t('login.emailLabel')}
            name="email"
            rules={[
              {
                required: true,
                message: t('login.validation.emailRequired'),
              },
              {
                type: 'email',
                message: t('login.validation.invalidEmail'),
              },
            ]}
          >
            <Input
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder="demo@example.com"
            />
          </Form.Item>

          <Form.Item
            label={t('login.passwordLabel')}
            name="password"
            rules={[
              {
                required: true,
                message: t('login.validation.passwordRequired'),
              },
            ]}
          >
            <Input.Password
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder="Enter password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            {t('login.submit')}
          </Button>

          <div className="login-footer">
            <span className="login-footer-text">
              {t('login.noAccount')}
            </span>
            <Link to={AUTH_ROUTES.REGISTER} className="login-register-link">
              {t('login.signup')}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}