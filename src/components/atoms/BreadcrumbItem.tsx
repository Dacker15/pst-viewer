import { type FC, useMemo } from 'react'
import clsx from 'clsx'

type BreadcrumbItemProps = {
  text: string
  bold?: boolean
  onClick: () => void
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = (props) => {
  const classNames = useMemo(() => {
    return clsx('text-grey-500', { 'font-semibold': props.bold })
  }, [props.bold])

  return (
    <button className={classNames} onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export default BreadcrumbItem
