import { type FC, useEffect } from 'react'
import Triangle from 'src/assets/icons/triangle.svg?react'
import { useTimeout } from 'src/lib/hooks/useTimeout'
import clsx from 'clsx'
import { getBreakpoints } from 'src/lib/breakpoints'
import { useBreakpoint } from 'src/lib/hooks/useBreakpoint'

type ErrorProps = {
  message: string | null
  open: boolean
  onClose: () => void
}

const Error: FC<ErrorProps> = ({ message, open, onClose }) => {
  const activeBreakpoints = useBreakpoint(getBreakpoints())
  const { reset } = useTimeout(onClose, 5000)

  const className = clsx(
    'fixed flex gap-x-2 items-center bg-red text-white p-4 rounded-full transition-opacity duration-700',
    {
      'opacity-0': !message && !open,
      'opacity-100': message && open,
      'bottom-4 left-4 right-4 mx-auto max-w-full': !activeBreakpoints.includes('md'),
      'top-4 right-4': activeBreakpoints.includes('md')
    }
  )

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [message, open, reset])

  return (
    <div className={className}>
      <Triangle className="stroke-white" />
      {message}
    </div>
  )
}

Error.displayName = 'Error'
export default Error
