import { type FC } from 'react'
import Upload from 'src/pages/Upload'
import NotificationProvider from 'src/lib/contexts/NotificationProvider'

const App: FC = () => {
  return (
    <NotificationProvider>
      <Upload />
    </NotificationProvider>
  )
}

export default App
