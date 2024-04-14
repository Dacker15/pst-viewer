import { type FC } from 'react'

type DirectoryNodeProps = {
  name: string
  onClick: () => void
}

const DirectoryNode: FC<DirectoryNodeProps> = (props) => {
  return (
    <button className="p-4 rounded-2xl bg-grey-300 border border-grey-450 text-left" onClick={props.onClick}>
      {props.name}
    </button>
  )
}

export default DirectoryNode
