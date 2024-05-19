import { useCallback } from 'react'

export const useDocumentTitle = () => {
  const updateTitle = useCallback((title: string) => {
    document.title = title
  }, [])

  return { updateTitle }
}
