import { type FC, useCallback, useMemo, useState } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryView from 'src/components/organisms/DirectoryView'
import Button from 'src/components/atoms/Button'
import Back from 'src/assets/icons/back.svg?react'

type TreeViewProps = {
  data: Directory
}

const TreeView: FC<TreeViewProps> = (props) => {
  const [directory, setDirectory] = useState<Directory>(props.data)
  const isBackDisabled = useMemo(() => directory.root === null, [directory])

  const handleBack = useCallback(() => {
    if (directory.root) {
      setDirectory(directory.root)
    }
  }, [directory])

  return (
    <div className="flex flex-col gap-y-4 w-screen">
      <div className="border-b border-grey-400">
        <div className="container mx-auto p-4">
          <Button disabled={isBackDisabled} onClick={handleBack}>
            <Back className="w-6 h-6 stroke-grey-500" />
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <DirectoryView directory={directory} onDirectoryChange={setDirectory} />
      </div>
    </div>
  )
}

export default TreeView
