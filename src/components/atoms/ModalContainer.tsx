import { type FC, type ReactNode, type TransitionEvent, useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

type ModalContainerProps = {
  children: ReactNode
  open: boolean
  onClose: () => void
}

const TRANSITION_DURATION = 300
const CSS_TRANSITION_DURATION = `${TRANSITION_DURATION}ms`

const ModalContainer: FC<ModalContainerProps> = ({ children, open, onClose }) => {
  const [containerOpen, setContainerOpen] = useState<boolean>(false)
  const [contentOpen, setContentOpen] = useState<boolean>(false)

  useEffect(() => {
    if (open) {
      setContainerOpen(true)
    } else {
      setContentOpen(false)
    }
  }, [open])

  useEffect(() => {
    if (containerOpen) {
      setTimeout(() => setContentOpen(true), 50)
    }
  }, [containerOpen])

  const containerClassName = useMemo(() => {
    return clsx('fixed inset-0 bg-black bg-opacity-50 justify-end', {
      hidden: !containerOpen,
      flex: containerOpen
    })
  }, [containerOpen])

  const contentClassName = useMemo(() => {
    return clsx('bg-white p-4 h-screen flex-[3] transition-transform transform', {
      'translate-x-full': !contentOpen
    })
  }, [contentOpen])

  const handleTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    const classList = event.currentTarget.classList
    if (classList.contains('translate-x-full')) {
      setContainerOpen(false)
    }
  }, [])

  return (
    <div className={containerClassName}>
      <div className="flex-1" onClick={onClose} />
      <div
        className={contentClassName}
        style={{ transitionDuration: CSS_TRANSITION_DURATION }}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    </div>
  )
}

export default ModalContainer
