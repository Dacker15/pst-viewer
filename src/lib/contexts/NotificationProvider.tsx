import { createContext, type FC, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import ErrorComponent from 'src/components/atoms/Error'

type NotificationContext = {
  open: (message: string) => void
}
type NotificationProviderProps = {
  children: ReactNode
}

const NotificationContext = createContext<NotificationContext | undefined>(undefined)
NotificationContext.displayName = 'NotificationContext'

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleOpen = useCallback((message: string) => {
    setMessage(message)
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setTimeout(() => setMessage(null), 700)
  }, [])

  const providerValue = useMemo<NotificationContext>(() => ({ open: handleOpen }), [handleOpen])

  return (
    <NotificationContext.Provider value={providerValue}>
      {children}
      <ErrorComponent message={message} open={open} onClose={handleClose} />
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
