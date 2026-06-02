import { useState, useEffect, useRef } from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'

export const useIdleTimer = (timeoutMinutes: number = 15) => {
    const { t } = useTranslation()
    const [showWarning, setShowWarning] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const modalRef = useRef<any>(null)

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    const logout = () => {

        if (timerRef.current) clearTimeout(timerRef.current)
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current)

        if (modalRef.current) {
            modalRef.current.destroy()
            modalRef.current = null
        }

        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('username')
        window.location.href = '/login'
    }

    const resetTimer = () => {

        if (modalVisible) return

        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current)
            warningTimerRef.current = null
        }
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }

        warningTimerRef.current = setTimeout(() => {
            setShowWarning(true)
            setModalVisible(true)
        }, (timeoutMinutes - parseInt(import.meta.env.VITE_IDLE_WARNING_MINUTES || '1')) * 60 * 1000)

        timerRef.current = setTimeout(() => {
            logout()
        }, timeoutMinutes * 60 * 1000)
    }

    const handleStayLoggedIn = () => {
        setShowWarning(false)
        setModalVisible(false)

        if (modalRef.current) {
            modalRef.current.destroy()
            modalRef.current = null
        }

        resetTimer()
    }

    useEffect(() => {

        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        resetTimer()

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
            if (timerRef.current) clearTimeout(timerRef.current)
            if (modalRef.current) {
                modalRef.current.destroy()
                modalRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (showWarning && !modalRef.current) {
            modalRef.current = Modal.warning({
                title: t('auth.sessionExpiring'),
                content: t('auth.sessionExpiringMessage', { minutes: parseInt(import.meta.env.VITE_IDLE_WARNING_MINUTES || '1') }),
                okText: t('auth.stayLoggedIn'),
                onOk: handleStayLoggedIn,
                onCancel: logout,
                closable: false,
                mask: {
                    closable: false,
                },
            })
        }
    }, [showWarning])
}