import { type FC, type ReactNode, useMemo } from 'react'
import clsx from 'clsx'

type DirectoryNodeProps = {
  name: string
  icon: ReactNode
  isFirst: boolean
  isLast: boolean
  onClick: () => void
}

const DirectoryNode: FC<DirectoryNodeProps> = (props) => {
  const className = useMemo(() => {
    return clsx(
      'flex items-center gap-x-2 p-4 text-left bg-white text-grey-500 border-grey-400 border-l border-t border-r cursor-pointer',
      {
        'rounded-t-2xl': props.isFirst,
        'border-b rounded-b-2xl': props.isLast
      }
    )
  }, [props.isFirst, props.isLast])

  return (
    <button className={className} onClick={props.onClick}>
      {props.icon}
      <span>{props.name}</span>
    </button>
  )
}

export default DirectoryNode
