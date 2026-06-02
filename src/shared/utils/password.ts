export const generatePassword = (length = import.meta.env.VITE_PASSWORD_LENGTH || 8): string => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+[]{}<>?'

    const all = upper + lower + numbers + symbols

    let password = ''
    password += upper[Math.floor(Math.random() * upper.length)]
    password += lower[Math.floor(Math.random() * lower.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)]
    }

    return password
}

export type PasswordStrength = {
    score: number
    isStrong: boolean
}

export const checkPasswordStrength = (
    password: string,
    minLength = import.meta.env.VITE_PASSWORD_LENGTH || 8,
): PasswordStrength => {
    let score = 0

    if (password.length >= minLength) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    return {
        score,
        isStrong: score >= Number(import.meta.env.VITE_PASSWORD_MIN_SCORE ?? 4),
    }
}

export const getPasswordStrengthLabel = (score: number) => {
    switch (score) {
        case 0:
        case 1:
            return 'Very Weak'
        case 2:
            return 'Weak'
        case 3:
            return 'Medium'
        case 4:
            return 'Strong'
        case 5:
            return 'Very Strong'
        default:
            return ''
    }
}

