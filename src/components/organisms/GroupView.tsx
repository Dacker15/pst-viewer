import { type ReactNode } from 'react'

type GroupViewProps<T> = {
  name: string
  items: T[]
  render: (item: T, index: number, array: T[]) => ReactNode
}

const GroupView = <T,>(props: GroupViewProps<T>) => {
  if (props.items.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col p-2 bg-grey-400 rounded-2xl">
      <p className="pl-4 pt-2 pb-1 font-medium">{props.name}</p>
      {props.items.map(props.render)}
    </div>
  )
}

export default GroupView
