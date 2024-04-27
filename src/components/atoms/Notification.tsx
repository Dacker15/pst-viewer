import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import Triangle from 'src/assets/icons/triangle.svg?react'
import clsx from 'clsx'
import { getBreakpoints } from 'src/lib/breakpoints'
import { useBreakpoint } from 'src/lib/hooks/useBreakpoint'
import { useTimeout } from 'src/lib/hooks/useTimeout'

type NotificationProps = {
  message: string
  timeout: number
  onClose: () => void
}

const TRANSITION_DURATION = 700
const CSS_TRANSITION_DURATION = `${TRANSITION_DURATION}ms`

const Notification: FC<NotificationProps> = ({ message, timeout, onClose }) => {
  const [open, setOpen] = useState<boolean>(false)
  const activeBreakpoints = useBreakpoint(getBreakpoints())

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])
  const handleClose = useCallback(() => {
    setOpen(false)
    setTimeout(onClose, TRANSITION_DURATION)
  }, [onClose])

  useTimeout(handleClose, timeout)

  useEffect(() => {
    handleOpen()
  }, [handleOpen])

  const className = useMemo(() => {
    return clsx('fixed flex gap-x-2 items-center bg-red text-white p-4 rounded-full transition-opacity', {
      'opacity-0': !open,
      'opacity-100': open,
      'bottom-4 left-4 right-4 mx-auto max-w-full': !activeBreakpoints.includes('md'),
      'top-4 right-4': activeBreakpoints.includes('md')
    })
  }, [open, activeBreakpoints])

  return (
    <div className={className} style={{ transitionDuration: CSS_TRANSITION_DURATION }}>
      <Triangle className="stroke-white" />
      {message}
    </div>
  )
}

Notification.displayName = 'Notification'
export default Notification
