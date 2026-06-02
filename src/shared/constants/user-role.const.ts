export const UserRole = {
    OWNER: 'OWNER',
    ADMIN: 'ADMIN',
    VIEWER: 'VIEWER',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]