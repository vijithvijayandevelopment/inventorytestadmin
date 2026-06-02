import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StatusCodes } from 'http-status-codes'
import { ADMIN_ROUTES } from '../../src/shared/routes/app.routes'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Result
      status={StatusCodes.NOT_FOUND}
      title={StatusCodes.NOT_FOUND}
      subTitle={t('notFound.message')}
      extra={
        <Button type="primary" onClick={() => navigate(ADMIN_ROUTES.DASHBOARD, { replace: true })}>
          {t('notFound.backDashboard')}
        </Button>
      }
    />
  )
}
