import { type FC, useMemo } from 'react'
import type { Directory } from 'src/lib/pst/types'
import BreadcrumbItem from 'src/components/atoms/BreadcrumbItem'
import BreadcrumbSeparator from 'src/components/atoms/BreadcrumbSeparator'

type BreadcrumbProps = {
  directory: Directory
  onNavigate: (directory: Directory) => void
}

const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const items = useMemo(() => {
    const items = []
    let current = props.directory
    items.push(current)
    while (current.root) {
      items.push(current.root)
      current = current.root
    }
    return items.reverse()
  }, [props.directory])

  return (
    <div className="flex items-center gap-x-2">
      {items.map((item, index, array) => (
        <>
          <BreadcrumbItem
            key={item.id}
            text={item.name}
            onClick={() => props.onNavigate(item)}
            bold={index === array.length - 1}
          />
          {index < array.length - 1 && <BreadcrumbSeparator />}
        </>
      ))}
    </div>
  )
}

export default Breadcrumb
