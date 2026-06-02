import { Button, Card, Form, Input, message } from 'antd'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { register } from './register.api'
import logo from '../assets/logo.png'
import './RegisterPage.css'
import { ADMIN_ROUTES, AUTH_ROUTES } from '../shared/routes/app.routes'

type RegisterForm = {
  email: string
  password: string
  confirmPassword: string
  organizationName: string
}

export function RegisterPage() {
  const token = localStorage.getItem('access_token')
  if (token) {
    return <Navigate to="/" replace />
  }

  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [enableAutoFill, setEnableAutoFill] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values: RegisterForm) => {
    setLoading(true)
    try {
      const payload = {
        email: values.email,
        password: values.password,
        organizationName: values.organizationName
      }

      const res = await register(payload)

      if (res.success && res.data && res.data[0]) {
        message.success(t('register.success'))

        setTimeout(() => {
          navigate(AUTH_ROUTES.LOGIN, { replace: true })
        }, 1500)
      } else {
        message.error(res.message || t('register.failed'))
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t('register.failed')
      )
    } finally {
      setLoading(false)
    }
  }

  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue('password')
    if (!value || password === value) {
      return Promise.resolve()
    }
    return Promise.reject(new Error(t('register.validation.passwordsNotMatch')))
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <div className="register-header">
          <Link to={ADMIN_ROUTES.DASHBOARD} className="register-logo-link">
            <img src={logo} alt="Logo" className="register-logo" />
          </Link>
          <div className="register-title">{t('register.title')}</div>
          <div className="register-subtitle">{t('register.subtitle')}</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label={t('register.form.organizationName')}
            name="organizationName"
            rules={[
              {
                required: true,
                message: t('register.validation.organizationNameRequired'),
              },
              {
                min: 2,
                message: t('register.validation.organizationNameMin'),
              },
            ]}
          >
            <Input
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder={t('register.form.organizationNamePlaceholder')}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={t('register.form.email')}
            name="email"
            rules={[
              {
                required: true,
                message: t('register.validation.emailRequired'),
              },
              {
                type: 'email',
                message: t('register.validation.invalidEmail'),
              },
            ]}
          >
            <Input
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder="demo@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={t('register.form.password')}
            name="password"
            rules={[
              {
                required: true,
                message: t('register.validation.passwordRequired'),
              },
              {
                min: 8,
                message: t('register.validation.passwordMinLength'),
              },
              {
                pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: t('register.validation.passwordWeak'),
              },
            ]}
            tooltip={t('register.passwordTooltip')}
          >
            <Input.Password
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder={t('register.form.passwordPlaceholder')}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={t('register.form.confirmPassword')}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: t('register.validation.confirmPasswordRequired'),
              },
              {
                validator: validateConfirmPassword,
              },
            ]}
          >
            <Input.Password
              readOnly={!enableAutoFill}
              onFocus={() => setEnableAutoFill(true)}
              autoComplete="off"
              placeholder={t('register.form.confirmPasswordPlaceholder')}
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            {t('register.submit')}
          </Button>

          <div className="register-footer">
            <span className="register-footer-text">
              {t('register.haveAccount')}
            </span>
            <Link to={AUTH_ROUTES.LOGIN} className="register-login-link">
              {t('register.signIn')}
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}