import { message } from 'antd'
import type { ApiResponse } from '../types/api-response'
import type { TFunction } from 'i18next'

export function assertApiSuccess<T>(
    res: ApiResponse<T>,
    t: TFunction,
    fallbackKey = 'common.fallbackMessage',
): T {
    if (!res || res.success !== true) {
        let messages: string[] = []

        const validationErrors =
            res?.data &&
                typeof res.data === 'object' &&
                Array.isArray((res.data as any)?.errors)
                ? (res.data as any).errors
                : []

        if (validationErrors.length > 0) {
            messages = validationErrors.flatMap((err: any) =>
                err?.constraints ? Object.values(err.constraints) : [],
            )
        }

        if (messages.length === 0 && res?.message) {
            messages.push(res.message)
        }

        if (messages.length === 0) {
            messages.push(t(fallbackKey))
        }

        messages.forEach(msg => message.error(msg))

        throw new Error(messages.join(' | '))
    }

    return res.data as T
}
