import { type FC } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryNode from 'src/components/molecules/DirectoryNode.tsx'

type DirectoryViewProps = {
  directory: Directory
  onDirectoryChange: (directory: Directory) => void
}

const DirectoryView: FC<DirectoryViewProps> = (props) => {
  return (
    <div className="flex flex-col gap-y-1">
      {props.directory.children.map((child) => (
        <DirectoryNode name={child.name} key={child.name} onClick={() => props.onDirectoryChange(child)} />
      ))}
    </div>
  )
}

export default DirectoryView
