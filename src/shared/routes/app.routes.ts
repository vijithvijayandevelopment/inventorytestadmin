export const AUTH_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
} as const

export const ADMIN_ROUTES = {
    DASHBOARD: '/',
    PRODUCTS: '/products',
    INVENTORY: '/inventory',
    SETTINGS: '/settings',
} as const

export const ADMIN_ROUTE_PATHS = {
    PRODUCTS: 'products',
    INVENTORY: 'inventory',
    SETTINGS: 'settings',
} as const