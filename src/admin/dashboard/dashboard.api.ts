import { api } from '../../shared/axios'
import { DASHBOARD_ENDPOINTS } from '../../shared/endpoints'

export type DashboardSummary = {
  totalProducts: number
  totalStock: number
  lowStockCount: number
}

export type LowStockProduct = {
  id: string
  name: string
  sku: string
  quantityOnHand: number
  lowStockThreshold: number
}

export type DashboardResponse = {
  summary: DashboardSummary
  lowStockProducts: LowStockProduct[]
}

export async function fetchDashboardSummary(): Promise<DashboardResponse> {
  const { data } = await api.post(
    DASHBOARD_ENDPOINTS.OVERVIEW,
    {}
  )

  return data.data[0]
}