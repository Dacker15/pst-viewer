import { type FC, useCallback } from 'react'
import Upload from 'src/pages/Upload'
import NotificationProvider from 'src/lib/contexts/NotificationProvider'

const App: FC = () => {
  const handleUploadDone = useCallback((file: File) => {
    console.log('Upload done')
    console.log(file)
  }, [])

  return (
    <NotificationProvider>
      <Upload onUploadDone={handleUploadDone} />
    </NotificationProvider>
  )
}

export default App
