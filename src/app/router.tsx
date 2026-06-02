import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from '../auth/LoginPage'
import { RequireAuth } from '../auth/RequireAuth'
import AdminLayout from '../layout/AdminLayout'
import { DashboardPage } from '../admin/dashboard/DashboardPage'
import { ProductsList } from '../admin/inventory/ProductsList'
import { SettingsPage } from '../admin/settings/SettingsPage'
import { RegisterPage } from '../auth/RegisterPage'
import { NotFoundPage } from '../common/NotFoundPage'
import { IdleTimerWrapper } from '../shared/components/IdleTimerWrapper'
import { AUTH_ROUTES, ADMIN_ROUTE_PATHS } from '../shared/routes/app.routes'

export const router = createBrowserRouter([
  {
    path: AUTH_ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: AUTH_ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <IdleTimerWrapper>
          <AdminLayout />
        </IdleTimerWrapper>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ADMIN_ROUTE_PATHS.PRODUCTS, element: <ProductsList /> },
      { path: ADMIN_ROUTE_PATHS.INVENTORY, element: <ProductsList /> },
      { path: ADMIN_ROUTE_PATHS.SETTINGS, element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])