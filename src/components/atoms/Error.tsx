import { type FC } from 'react'
import Triangle from 'src/assets/icons/triangle.svg?react'
import clsx from 'clsx'
import { getBreakpoints } from 'src/lib/breakpoints'
import { useBreakpoint } from 'src/lib/hooks/useBreakpoint'

type ErrorProps = {
  message: string | null
  open: boolean
}

const Error: FC<ErrorProps> = ({ message, open }) => {
  const activeBreakpoints = useBreakpoint(getBreakpoints())

  const className = clsx(
    'fixed flex gap-x-2 items-center bg-red text-white p-4 rounded-full transition-opacity duration-700',
    {
      'opacity-0': !open,
      'opacity-100': open,
      'bottom-4 left-4 right-4 mx-auto max-w-full': !activeBreakpoints.includes('md'),
      'top-4 right-4': activeBreakpoints.includes('md')
    }
  )

  return (
    <div className={className}>
      <Triangle className="stroke-white" />
      {message}
    </div>
  )
}

Error.displayName = 'Error'
export default Error
