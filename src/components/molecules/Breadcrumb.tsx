import { type FC, Fragment, useMemo } from 'react'
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
        <Fragment key={item.id}>
          <BreadcrumbItem text={item.name} onClick={() => props.onNavigate(item)} bold={index === array.length - 1} />
          {index < array.length - 1 && <BreadcrumbSeparator />}
        </Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
