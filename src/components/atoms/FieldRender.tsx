import { type ReactNode, useMemo, isValidElement as isValidReactElement } from 'react'

type IsHidden<T> = boolean | ((value: T) => boolean)
type FieldRenderProps<T> = {
  title: string
  value: T
  valueParser?: (value: T) => ReactNode
  isHidden?: IsHidden<T>
}

const getIsHiddenValue = <T,>(value: T, isHidden?: IsHidden<T>) => {
  if (isHidden === undefined) return false
  if (typeof isHidden === 'function') return isHidden(value)
  return isHidden
}

const isValidElement = (value: unknown): value is ReactNode => {
  if (isValidReactElement(value)) return true
  if (typeof value === 'string') return true
  if (typeof value === 'number') return true
  if (typeof value === 'boolean') return true
  if (value === null) return true
  if (value === undefined) return true
  return false
}

const FieldRender = <T,>({ title, value, valueParser, isHidden }: FieldRenderProps<T>) => {
  const isHiddenValue = useMemo(() => getIsHiddenValue(value, isHidden), [value, isHidden])
  const parsedValue = useMemo(() => {
    if (valueParser) {
      return valueParser(value)
    }
    if (isValidElement(value)) {
      return value
    }
    throw new Error(`FieldRender: valueParser is required for non-react elements. Title: ${title}, Value: ${value}`)
  }, [title, value, valueParser])

  if (isHiddenValue) return null
  return (
    <div>
      <p className="font-medium">{title}</p>
      <p>{parsedValue}</p>
    </div>
  )
}

export default FieldRender
