import { useIdleTimer } from '../hooks/useIdleTimer'

export const IdleTimerWrapper = ({ children }: { children: React.ReactNode }) => {
  useIdleTimer(parseInt(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES || '15'))
  return <>{children}</>
}