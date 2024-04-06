import { type FC } from 'react'
import Triangle from 'src/assets/icons/triangle.svg?react'
import { useTimeout } from 'src/lib/hooks/useTimeout'

type ErrorProps = {
  message: string
  onClose: () => void
}

const Error: FC<ErrorProps> = ({ message, onClose }) => {
  useTimeout(onClose, 8000)

  return (
    <div className="flex gap-x-2 items-center bg-red text-white p-4 rounded-full">
      <Triangle className="stroke-white" />
      {message}
    </div>
  )
}

Error.displayName = 'Error'
export default Error
