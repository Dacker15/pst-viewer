import { fileTypeFromBuffer } from 'file-type'

export const isPstFileValid = async (file: File): Promise<boolean> => {
  const buffer = await file.arrayBuffer()
  const fileType = await fileTypeFromBuffer(buffer)
  if (!fileType) {
    return false
  }
  const isMimeTypeValid = fileType.mime === 'application/vnd.ms-outlook'
  const isExtensionValid = fileType.ext === 'pst'
  return isMimeTypeValid && isExtensionValid
}
