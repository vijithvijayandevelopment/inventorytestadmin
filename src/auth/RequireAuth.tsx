import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AUTH_ROUTES } from '../../src/shared/routes/app.routes'

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />
  }
  return <>{children}</>
}
