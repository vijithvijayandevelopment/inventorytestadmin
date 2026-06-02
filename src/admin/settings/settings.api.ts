import { api } from '../../shared/axios'
import { SETTINGS_ENDPOINTS } from '../../shared/endpoints'

export type ThresholdSetting = {
  defaultLowStockThreshold: number
  organizationId: string
  organizationName: string
}

export type GetThresholdResponse = {
  success: boolean
  message: string
  data: ThresholdSetting[]
  errorCode: number
  meta: { timestamp: string }
}

export type UpdateThresholdPayload = {
  defaultLowStockThreshold: number
}

export type UpdateThresholdResponse = {
  success: boolean
  message: string
  data: ThresholdSetting[]
  errorCode: number
  meta: { timestamp: string }
}

export async function getDefaultThresholdApi(): Promise<GetThresholdResponse> {
  const { data } = await api.post(SETTINGS_ENDPOINTS.GET_ALL, {})
  return data
}

export async function updateDefaultThresholdApi(payload: UpdateThresholdPayload): Promise<UpdateThresholdResponse> {
  const { data } = await api.post(SETTINGS_ENDPOINTS.UPDATE, payload)
  return data
}