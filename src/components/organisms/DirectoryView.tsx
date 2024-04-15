import { type FC } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryNode from 'src/components/molecules/DirectoryNode'

type DirectoryViewProps = {
  directory: Directory
  onDirectoryChange: (directory: Directory) => void
}

const DirectoryView: FC<DirectoryViewProps> = (props) => {
  return (
    <div className="flex flex-col w-full">
      {props.directory.children.map((child, index, array) => (
        <DirectoryNode
          key={child.name}
          name={child.name}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          onClick={() => props.onDirectoryChange(child)}
        />
      ))}
    </div>
  )
}

export default DirectoryView
