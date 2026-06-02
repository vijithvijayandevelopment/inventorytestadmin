export const AUTH_ENDPOINTS = {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
} as const

export const DASHBOARD_ENDPOINTS = {
    OVERVIEW: '/api/v1/inventory/dashboard/summary',
}

export const SETTINGS_ENDPOINTS = {
    GET_ALL: '/api/v1/inventory/settings/default-threshold/get',
    UPDATE: '/api/v1/inventory/settings/default-threshold',
} as const

export const PRODUCT_ENDPOINTS = {
    CREATE: '/api/v1/inventory/products/create',
    LIST: '/api/v1/inventory/products/list',
    GET_BY_ID: '/api/v1/inventory/products/get-by-id',
    GET_BY_SKU: '/api/v1/inventory/products/get-by-sku',
    UPDATE: '/api/v1/inventory/products/update',
    DELETE: '/api/v1/inventory/products/delete',
    ADJUST_STOCK: '/api/v1/inventory/products/adjust-stock',
    LOW_STOCK: '/api/v1/inventory/products/low-stock',
} as const

