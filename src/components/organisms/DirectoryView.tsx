import { type FC, useMemo } from 'react'
import type { Appointment, Contact, Directory, Message, Task, UnscheduledAppointment } from 'src/lib/pst/types'
import DirectoryNode from 'src/components/molecules/DirectoryNode'
import { getFirstNotUndefinedOnPosition } from 'src/lib/general'
import DirectoryIcon from 'src/assets/icons/directory.svg?react'
import MailIcon from 'src/assets/icons/mail.svg?react'
import AppointmentIcon from 'src/assets/icons/appointment.svg?react'
import ContactIcon from 'src/assets/icons/contacts.svg?react'
import TaskIcon from 'src/assets/icons/tasks.svg?react'

type DirectoryViewProps = {
  directory: Directory
  onDirectoryChange: (directory: Directory) => void
  onAppointmentSelect: (appointment: Appointment | UnscheduledAppointment) => void
  onTaskSelect: (task: Task) => void
  onContactSelect: (contact: Contact) => void
  onMessageSelect: (message: Message) => void
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
          icon={<DirectoryIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={child === firstElement}
          isLast={child === lastElement}
          onClick={() => props.onDirectoryChange(child)}
        />
      ))}
      {props.directory.messages.map((message) => (
        <DirectoryNode
          key={message.id}
          name={message.subject}
          icon={<MailIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={message === firstElement}
          isLast={message === lastElement}
          onClick={() => props.onMessageSelect(message)}
        />
      ))}
      {props.directory.appointments.map((appointment) => (
        <DirectoryNode
          key={appointment.id}
          name={appointment.name}
          icon={<AppointmentIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={appointment === firstElement}
          isLast={appointment === lastElement}
          onClick={() => props.onAppointmentSelect(appointment)}
        />
      ))}
      {props.directory.unscheduledAppointments.map((appointment) => (
        <DirectoryNode
          key={appointment.id}
          name={appointment.name}
          icon={<AppointmentIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={appointment === firstElement}
          isLast={appointment === lastElement}
          onClick={() => props.onAppointmentSelect(appointment)}
        />
      ))}
      {props.directory.contacts.map((contact) => (
        <DirectoryNode
          key={contact.id}
          name={contact.displayName}
          icon={<ContactIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={contact === firstElement}
          isLast={contact === lastElement}
          onClick={() => props.onContactSelect(contact)}
        />
      ))}
      {props.directory.tasks.map((task) => (
        <DirectoryNode
          key={task.id}
          name={task.name}
          icon={<TaskIcon className="w-6 h-6 stroke-grey-500" />}
          isFirst={task === firstElement}
          isLast={task === lastElement}
          onClick={() => props.onTaskSelect(task)}
        />
      ))}
    </div>
  )
}

export default DirectoryView
