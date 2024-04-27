import { createContext, type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import Notification from 'src/components/atoms/Notification'

type NotificationSettableData = {
  message: string
}
type NotificationData = NotificationSettableData & {
  id: number
  timeout: number
}
type NotificationContext = {
  open: (data: NotificationSettableData) => void
}
type NotificationProviderProps = {
  children: ReactNode
}

export const NotificationContext = createContext<NotificationContext | undefined>(undefined)
NotificationContext.displayName = 'NotificationContext'

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<NotificationData[]>([])

  const handleClose = useCallback((id: number) => {
    setMessages((prev) => prev.filter((message) => message.id !== id))
  }, [])

  const handleOpen = useCallback((data: NotificationSettableData) => {
    setMessages((prev) => [...prev, { ...data, id: Date.now(), timeout: 5000 }])
  }, [])

  const providerValue = useMemo<NotificationContext>(() => ({ open: handleOpen }), [handleOpen])

  return (
    <NotificationContext.Provider value={providerValue}>
      {children}
      {messages.map((message) => (
        <Notification key={message.id} {...message} onClose={() => handleClose(message.id)} />
      ))}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
