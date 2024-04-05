import { type FC } from 'react'
import Button from 'src/components/atoms/Button.tsx'

const App: FC = () => {
  return (
    <div className="m-4">
      <p className="text-grey-500">Hello World!</p>
      <Button>Hello!</Button>
    </div>
  )
}

export default App
