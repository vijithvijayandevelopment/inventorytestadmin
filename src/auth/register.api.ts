import { api } from '../shared/axios'
import { AUTH_ENDPOINTS } from '../shared/endpoints'

export type RegisterPayload = {
  email: string
  password: string
  organizationName: string
}

export type RegisterResponse = {
  success: boolean
  message: string
  data: Array<{
    id: string
    email: string
    organizationId: string
    organization: {
      id: string
      name: string
      defaultLowStockThreshold: number
    }
    status: string
    createdAt: string
    updatedAt: string
    roles: string[]
  }>
  errorCode: number
  meta: {
    timestamp: string
  }
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await api.post(AUTH_ENDPOINTS.REGISTER, payload)
  return data
}