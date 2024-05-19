import { type FC, useCallback, useState } from 'react'
import Upload from 'src/pages/Upload'
import TreeView from 'src/pages/TreeView'
import NotificationProvider from 'src/lib/contexts/NotificationProvider'
import { parseFile } from 'src/lib/pst/parser'
import type { Directory } from 'src/lib/pst/types'

const App: FC = () => {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [directory, setDirectory] = useState<Directory | null>(null)

  const handleUploadDone = useCallback(async (file: File) => {
    setUploadLoading(true)
    const buffer = Buffer.from(await file.arrayBuffer())
    const directory = parseFile(buffer)
    setDirectory(directory)
    setUploadLoading(false)
  }, [])

  return (
    <NotificationProvider>
      {directory ? <TreeView data={directory} /> : <Upload loading={uploadLoading} onUploadDone={handleUploadDone} />}
    </NotificationProvider>
  )
}

export default App
