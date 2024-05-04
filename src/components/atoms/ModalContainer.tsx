import { type FC, type ReactNode, type TransitionEvent, useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useBreakpoint } from 'src/lib/hooks/useBreakpoint'
import { getBreakpoints } from 'src/lib/breakpoints'

export type ModalProps = {
  open: boolean
  onClose: () => void
}

type ModalContainerProps = ModalProps & {
  children: ReactNode
}

const TRANSITION_DURATION = 300
const CSS_TRANSITION_DURATION = `${TRANSITION_DURATION}ms`

const ModalContainer: FC<ModalContainerProps> = ({ children, open, onClose }) => {
  const [containerOpen, setContainerOpen] = useState<boolean>(false)
  const [contentOpen, setContentOpen] = useState<boolean>(false)
  const activeBreakpoints = useBreakpoint(getBreakpoints())

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
      'flex flex-col md:flex-row': containerOpen
    })
  }, [containerOpen])

  const contentClassName = useMemo(() => {
    const isMobile = !activeBreakpoints.includes('md')
    return clsx('bg-white p-4 h-screen flex-[3] transition-transform transform', {
      'translate-y-full': !contentOpen && isMobile,
      'translate-x-full': !contentOpen && !isMobile
    })
  }, [activeBreakpoints, contentOpen])

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      const isMobile = !activeBreakpoints.includes('md')
      const targetToken = isMobile ? 'translate-y-full' : 'translate-x-full'
      const classList = event.currentTarget.classList
      if (classList.contains(targetToken)) {
        setContainerOpen(false)
      }
    },
    [activeBreakpoints]
  )

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
