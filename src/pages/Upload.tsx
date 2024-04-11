import { type DragEvent, type FC, useCallback, useEffect, useState } from 'react'
import Button from 'src/components/atoms/Button'
import { useNotification } from 'src/lib/hooks/useNotification'

type UploadProps = {
  onUploadDone: (file: File) => void
}

const Upload: FC<UploadProps> = (props) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { open } = useNotification()

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const hasItemsOneFile = event.dataTransfer.items.length === 1
    const hasFilesOneFile = event.dataTransfer.files.length === 1
    if (!hasItemsOneFile && !hasFilesOneFile) {
      setError('Please drop only one file')
      return
    }
    if (hasItemsOneFile) {
      const item = event.dataTransfer.items[0]
      if (item.kind !== 'file') {
        setError('Please drop a file')
        return
      }
      setFile(item.getAsFile())
    } else if (hasFilesOneFile) {
      setFile(event.dataTransfer.files[0])
    } else {
      setError('Unexpected error occurred. Please re-upload it')
    }
  }, [])

  useEffect(() => {
    if (file) {
      props.onUploadDone(file)
    }
  }, [props, file])

  useEffect(() => {
    if (error) {
      open(error)
      setError(null)
    }
  }, [error, open])

  return (
    <div className="flex flex-col items-center gap-4 py-8 h-screen" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="text-center pb-8">
        <h1 className="font-bold text-5xl leading-13 text-grey-500">PST Viewer</h1>
        <p className="text-2xl text-grey-450">Update and export your PST file contents</p>
      </div>
      <Button variant="filled" size="lg">
        Upload
      </Button>
      <p className="text-base text-grey-450">or drop your file here</p>
    </div>
  )
}

export default Upload
