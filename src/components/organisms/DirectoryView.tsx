import { type FC, useMemo } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryNode from 'src/components/molecules/DirectoryNode'
import { getFirstNotUndefinedOnPosition } from 'src/lib/general'

type DirectoryViewProps = {
  directory: Directory
  onDirectoryChange: (directory: Directory) => void
}

const DirectoryView: FC<DirectoryViewProps> = (props) => {
  const isEmpty = useMemo(() => {
    return (
      props.directory.children.length === 0 &&
      props.directory.messages.length === 0 &&
      props.directory.appointments.length === 0 &&
      props.directory.unscheduledAppointments.length === 0 &&
      props.directory.contacts.length === 0 &&
      props.directory.tasks.length === 0
    )
  }, [props.directory])
  const firstElement = useMemo(() => {
    return getFirstNotUndefinedOnPosition(
      0,
      props.directory.children,
      props.directory.messages,
      props.directory.appointments,
      props.directory.unscheduledAppointments,
      props.directory.contacts,
      props.directory.tasks
    )
  }, [props.directory])
  const lastElement = useMemo(() => {
    return getFirstNotUndefinedOnPosition(
      -1,
      props.directory.tasks,
      props.directory.contacts,
      props.directory.unscheduledAppointments,
      props.directory.appointments,
      props.directory.messages,
      props.directory.children
    )
  }, [props.directory])
  return (
    <div className="flex flex-col">
      {isEmpty && (
        <div className="p-4 text-center bg-grey-400 rounded-2xl">
          <p>This directory is empty</p>
        </div>
      )}
      {props.directory.children.map((child) => (
        <DirectoryNode
          key={child.id}
          name={child.name}
          isFirst={child === firstElement}
          isLast={child === lastElement}
          onClick={() => props.onDirectoryChange(child)}
        />
      ))}
      {props.directory.messages.map((message) => (
        <DirectoryNode
          key={message.id}
          name={message.subject}
          isFirst={message === firstElement}
          isLast={message === lastElement}
          onClick={() => {}}
        />
      ))}
      {props.directory.appointments.map((appointment) => (
        <DirectoryNode
          key={appointment.id}
          name={appointment.name}
          isFirst={appointment === firstElement}
          isLast={appointment === lastElement}
          onClick={() => {}}
        />
      ))}
      {props.directory.unscheduledAppointments.map((appointment) => (
        <DirectoryNode
          key={appointment.id}
          name={appointment.name}
          isFirst={appointment === firstElement}
          isLast={appointment === lastElement}
          onClick={() => {}}
        />
      ))}
      {props.directory.contacts.map((contact) => (
        <DirectoryNode
          key={contact.id}
          name={contact.displayName}
          isFirst={contact === firstElement}
          isLast={contact === lastElement}
          onClick={() => {}}
        />
      ))}
      {props.directory.tasks.map((task) => (
        <DirectoryNode
          key={task.id}
          name={task.name}
          isFirst={task === firstElement}
          isLast={task === lastElement}
          onClick={() => {}}
        />
      ))}
    </div>
  )
}

export default DirectoryView
