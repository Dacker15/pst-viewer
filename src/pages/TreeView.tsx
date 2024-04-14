import { type FC, useState } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryView from 'src/components/organisms/DirectoryView'

type TreeViewProps = {
  data: Directory
}

const TreeView: FC<TreeViewProps> = (props) => {
  const [directory, setDirectory] = useState<Directory>(props.data)

  return (
    <div className="container mx-auto py-8 flex flex-col gap-y-4">
      <h1 className="text-center">TreeView</h1>
      <DirectoryView directory={directory} onDirectoryChange={setDirectory} />
    </div>
  )
}

export default TreeView
