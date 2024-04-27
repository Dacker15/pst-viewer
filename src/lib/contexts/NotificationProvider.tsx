import { createContext, type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import Notification from 'src/components/atoms/Notification'
import { useBreakpoint } from 'src/lib/hooks/useBreakpoint'
import { getBreakpoints } from 'src/lib/breakpoints'

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
  const activeBreakpoints = useBreakpoint(getBreakpoints())
  const containerClassName = useMemo(() => {
    return clsx('fixed flex gap-y-4', {
      'bottom-4 left-4 right-4 mx-auto max-w-full flex-col-reverse': !activeBreakpoints.includes('md'),
      'top-4 right-4 flex-col': activeBreakpoints.includes('md')
    })
  }, [activeBreakpoints])

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
      <div className={containerClassName}>
        {messages.map((message) => (
          <Notification key={message.id} {...message} onClose={() => handleClose(message.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
