import { api } from '../../shared/axios'
import { PRODUCT_ENDPOINTS } from '../../shared/endpoints'

export type Product = {
  id: string
  organizationId: string
  name: string
  sku: string
  description?: string
  quantityOnHand: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number
  isLowStock: boolean
  createdAt: string
  updatedAt: string
}

export type CreateProductPayload = {
  name: string
  sku: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number
}

export type UpdateProductPayload = {
  id: string
  name?: string
  sku?: string
  description?: string
  quantityOnHand?: number
  costPrice?: number
  sellingPrice?: number
  lowStockThreshold?: number
}

export type AdjustStockPayload = {
  productId: string
  adjustment: number
  note?: string
}

export type FetchProductsPayload = {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function createProductApi(payload: CreateProductPayload) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.CREATE, payload)
  return data
}

export async function fetchProductsApi(payload: FetchProductsPayload) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.LIST, payload)
  return data
}

export async function fetchProductByIdApi(id: string) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.GET_BY_ID, { id })
  return data
}

export async function fetchProductBySkuApi(sku: string) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.GET_BY_SKU, { sku })
  return data
}

export async function updateProductApi(payload: UpdateProductPayload) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.UPDATE, payload)
  return data
}

export async function deleteProductApi(id: string) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.DELETE, { id })
  return data
}

export async function adjustStockApi(payload: AdjustStockPayload) {
  const { data } = await api.post(PRODUCT_ENDPOINTS.ADJUST_STOCK, payload)
  return data
}

export async function fetchLowStockProductsApi() {
  const { data } = await api.post(PRODUCT_ENDPOINTS.LOW_STOCK, {})
  return data
}