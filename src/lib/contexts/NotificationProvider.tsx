import { createContext, type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import ErrorComponent from 'src/components/atoms/Error'
import { useTimeout } from 'src/lib/hooks/useTimeout'

type NotificationContext = {
  open: (message: string) => void
}
type NotificationProviderProps = {
  children: ReactNode
}

export const NotificationContext = createContext<NotificationContext | undefined>(undefined)
NotificationContext.displayName = 'NotificationContext'

const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    setOpen(false)
    setTimeout(() => setMessage(null), 700)
  }, [])

  const { reset } = useTimeout(handleClose, 5000)

  const handleOpen = useCallback(
    (message: string) => {
      setMessage(message)
      setOpen(true)
      reset()
    },
    [reset]
  )

  const providerValue = useMemo<NotificationContext>(() => ({ open: handleOpen }), [handleOpen])

  return (
    <NotificationContext.Provider value={providerValue}>
      {children}
      <ErrorComponent message={message} open={open} />
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
