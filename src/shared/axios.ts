import axios from 'axios'
import { message } from 'antd'
import { StatusCodes } from 'http-status-codes'
import { AUTH_ROUTES } from '../../src/shared/routes/app.routes'

let lastActivity = Date.now()

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export function clearAuth() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('username')
}

api.interceptors.request.use((config) => {

  lastActivity = Date.now()

  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      clearAuth()
      window.location.href = AUTH_ROUTES.LOGIN
    }

    if (error.response?.status === StatusCodes.FORBIDDEN) {
      message.error('Account suspended')
      clearAuth()
      window.location.href = AUTH_ROUTES.LOGIN
    }

    return Promise.reject(error)
  }
)

export const getLastActivity = () => lastActivity
