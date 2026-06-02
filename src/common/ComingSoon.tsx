import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ADMIN_ROUTES } from '../../src/shared/routes/app.routes'

export function ComingSoon() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Result
      status="info"
      title={t('comingSoon.title')}
      subTitle={t('comingSoon.message')}
      extra={
        <Button type="primary" onClick={() => navigate(ADMIN_ROUTES.DASHBOARD, { replace: true })}>
          {t('comingSoon.backDashboard')}
        </Button>
      }
    />
  )
}