import { api } from '../shared/axios'
import { AUTH_ENDPOINTS } from '../shared/endpoints'

export type LoginPayload = {
  email?: string
  password: string
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post(AUTH_ENDPOINTS.LOGIN, payload)
  return data
}

export async function logoutApi() {
  await api.post(AUTH_ENDPOINTS.LOGOUT, {})
}