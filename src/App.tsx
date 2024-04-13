import { type FC, useCallback } from 'react'
import Upload from 'src/pages/Upload'
import NotificationProvider from 'src/lib/contexts/NotificationProvider'
import { parseFile } from 'src/lib/pst/parser'

const App: FC = () => {
  const handleUploadDone = useCallback(async (file: File) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const directory = parseFile(buffer)
    console.log(directory)
  }, [])

  return (
    <NotificationProvider>
      <Upload onUploadDone={handleUploadDone} />
    </NotificationProvider>
  )
}

export default App
