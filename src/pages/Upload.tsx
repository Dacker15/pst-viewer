import { type ChangeEvent, type DragEvent, type FC, useCallback, useEffect, useRef, useState } from 'react'
import Button from 'src/components/atoms/Button'
import Loader from 'src/components/atoms/Loader'
import { useDocumentTitle } from 'src/lib/hooks/useDocumentTitle'
import { useNotification } from 'src/lib/hooks/useNotification'
import { isPstFileValid } from 'src/lib/pst/validition'

type UploadProps = {
  loading: boolean
  onUploadDone: (file: File) => void
}

const Upload: FC<UploadProps> = (props) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const { open } = useNotification()
  const { updateTitle } = useDocumentTitle()

  const handleClick = useCallback(() => {
    input.current?.click()
  }, [])

  const handleInputChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setError('Please select a file')
      return
    }
    if (event.target.files.length !== 1) {
      setError('Please select only one file')
      return
    }
    const selectedFile = event.target.files.item(0) as File
    const isFileValid = await isPstFileValid(selectedFile)
    if (!isFileValid) {
      setError('Please select a valid PST file')
      return
    }
    setFile(selectedFile)
  }, [])

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback(async (event: DragEvent<HTMLDivElement>) => {
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
      const selectedFile = item.getAsFile() as File
      const isFileValid = await isPstFileValid(selectedFile)
      if (!isFileValid) {
        setError('Please drop a valid PST file')
        return
      }
      setFile(selectedFile)
    } else if (hasFilesOneFile) {
      const selectedFile = event.dataTransfer.files.item(0) as File
      const isFileValid = await isPstFileValid(selectedFile)
      if (!isFileValid) {
        setError('Please drop a valid PST file')
        return
      }
      setFile(selectedFile)
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
      open({ message: error })
      setError(null)
    }
  }, [error, open])

  useEffect(() => {
    updateTitle('PST Viewer')
  }, [updateTitle])

  return (
    <div className="flex flex-col items-center gap-4 py-8 h-screen" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="text-center pb-8">
        <h1 className="font-bold text-5xl leading-13 text-grey-500">PST Viewer</h1>
        <p className="text-2xl text-grey-450">Update and export your PST file contents</p>
      </div>
      <input ref={input} type="file" accept=".pst" className="hidden" onChange={handleInputChange} />
      <Button
        variant="filled"
        size="lg"
        onClick={handleClick}
        disabled={props.loading}
        icon={props.loading ? <Loader size={24} /> : undefined}
      >
        {props.loading ? 'Uploading' : 'Upload'}
      </Button>
      <p className="text-base text-grey-450">or drop your file here</p>
    </div>
  )
}

export default Upload
