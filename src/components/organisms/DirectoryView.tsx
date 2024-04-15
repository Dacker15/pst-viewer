import { type FC } from 'react'
import type { Directory } from 'src/lib/pst/types'
import DirectoryNode from 'src/components/molecules/DirectoryNode'
import GroupView from 'src/components/organisms/GroupView'

type DirectoryViewProps = {
  directory: Directory
  onDirectoryChange: (directory: Directory) => void
}

const DirectoryView: FC<DirectoryViewProps> = (props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <GroupView
        name="Directories"
        items={props.directory.children}
        render={(child, index, array) => (
          <DirectoryNode
            key={child.name}
            name={child.name}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => props.onDirectoryChange(child)}
          />
        )}
      />
      <GroupView
        name="Messages"
        items={props.directory.messages}
        render={(message, index, array) => (
          <DirectoryNode
            key={message.subject}
            name={message.subject}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => {}}
          />
        )}
      />
      <GroupView
        name="Appointments"
        items={props.directory.appointments}
        render={(appointment, index, array) => (
          <DirectoryNode
            key={appointment.name}
            name={appointment.name}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => {}}
          />
        )}
      />
      <GroupView
        name="Unscheduled appointments"
        items={props.directory.unscheduledAppointments}
        render={(appointment, index, array) => (
          <DirectoryNode
            key={appointment.name}
            name={appointment.name}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => {}}
          />
        )}
      />
      <GroupView
        name="Contacts"
        items={props.directory.contacts}
        render={(contact, index, array) => (
          <DirectoryNode
            key={contact.displayName}
            name={contact.displayName}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => {}}
          />
        )}
      />
      <GroupView
        name="Tasks"
        items={props.directory.tasks}
        render={(task, index, array) => (
          <DirectoryNode
            key={task.name}
            name={task.name}
            isFirst={index === 0}
            isLast={index === array.length - 1}
            onClick={() => {}}
          />
        )}
      />
    </div>
  )
}

export default DirectoryView
