import { useContext } from 'react'
import { NotificationContext } from 'src/lib/contexts/NotificationProvider'

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
