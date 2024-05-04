import { type FC, useCallback, useMemo, useState } from 'react'
import type { Directory, Task } from 'src/lib/pst/types'
import Button from 'src/components/atoms/Button'
import Breadcrumb from 'src/components/molecules/Breadcrumb'
import TasksModal from 'src/components/molecules/TasksModal'
import DirectoryView from 'src/components/organisms/DirectoryView'
import Back from 'src/assets/icons/back.svg?react'

type TreeViewProps = {
  data: Directory
}

const TreeView: FC<TreeViewProps> = (props) => {
  const [directory, setDirectory] = useState<Directory>(props.data)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const isBackDisabled = useMemo(() => directory.root === null, [directory])

  const handleBack = useCallback(() => {
    if (directory.root) {
      setDirectory(directory.root)
    }
  }, [directory])

  const handleNavigate = useCallback((directory: Directory) => {
    setDirectory(directory)
  }, [])

  const handleTaskModalClose = useCallback(() => {
    setSelectedTask(null)
  }, [])

  return (
    <div className="flex flex-col gap-y-4 w-screen">
      <div className="border-b border-grey-400">
        <div className="container mx-auto p-4 flex items-center gap-x-4">
          <Button disabled={isBackDisabled} onClick={handleBack}>
            <Back className="w-6 h-6 stroke-grey-500" />
          </Button>
          <Breadcrumb directory={directory} onNavigate={handleNavigate} />
        </div>
      </div>
      <div className="container mx-auto p-4">
        <DirectoryView directory={directory} onDirectoryChange={setDirectory} onTaskSelect={setSelectedTask} />
      </div>
      <TasksModal open={!!selectedTask} onClose={handleTaskModalClose} task={selectedTask} />
    </div>
  )
}

export default TreeView
