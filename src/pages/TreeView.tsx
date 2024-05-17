import { type FC, useCallback, useMemo, useState } from 'react'
import type { Appointment, Contact, Directory, Message, Task, UnscheduledAppointment } from 'src/lib/pst/types'
import { downloadCsvZip } from 'src/lib/export'
import Button from 'src/components/atoms/Button'
import Breadcrumb from 'src/components/molecules/Breadcrumb'
import TasksModal from 'src/components/organisms/TasksModal'
import ContactsModal from 'src/components/organisms/ContactModal'
import AppointmentModal from 'src/components/organisms/AppointmentModal'
import MessageModal from 'src/components/organisms/MessageModal'
import DirectoryView from 'src/components/organisms/DirectoryView'
import Back from 'src/assets/icons/back.svg?react'

type TreeViewProps = {
  data: Directory
}

const TreeView: FC<TreeViewProps> = (props) => {
  const [directory, setDirectory] = useState<Directory>(props.data)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | UnscheduledAppointment | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const isBackDisabled = useMemo(() => directory.root === null, [directory])

  const handleBack = useCallback(() => {
    if (directory.root) {
      setDirectory(directory.root)
    }
  }, [directory])

  const handleNavigate = useCallback((directory: Directory) => {
    setDirectory(directory)
  }, [])

  const handleTaskModalClose = useCallback(() => {
    setSelectedTask(null)
  }, [])

  const handleContactModalClose = useCallback(() => {
    setSelectedContact(null)
  }, [])

  const handleAppointmentModalClose = useCallback(() => {
    setSelectedAppointment(null)
  }, [])

  const handleMessageModalClose = useCallback(() => {
    setSelectedMessage(null)
  }, [])

  const handleExport = useCallback(async () => {
    await downloadCsvZip(directory)
  }, [directory])

  return (
    <div className="flex flex-col gap-y-4 w-screen">
      <div className="border-b border-grey-400">
        <div className="container mx-auto p-4 flex items-center gap-x-4">
          <Button disabled={isBackDisabled} onClick={handleBack}>
            <Back className="w-6 h-6 stroke-grey-500" />
          </Button>
          <Breadcrumb directory={directory} onNavigate={handleNavigate} />
          <div className="flex-1" />
          <Button onClick={handleExport}>
            <Back className="w-6 h-6 stroke-grey-500" />
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-4">
        <DirectoryView
          directory={directory}
          onDirectoryChange={setDirectory}
          onTaskSelect={setSelectedTask}
          onContactSelect={setSelectedContact}
          onAppointmentSelect={setSelectedAppointment}
          onMessageSelect={setSelectedMessage}
        />
      </div>
      <AppointmentModal
        open={!!selectedAppointment}
        onClose={handleAppointmentModalClose}
        appointment={selectedAppointment}
      />
      <TasksModal open={!!selectedTask} onClose={handleTaskModalClose} task={selectedTask} />
      <ContactsModal open={!!selectedContact} onClose={handleContactModalClose} contact={selectedContact} />
      <MessageModal open={!!selectedMessage} onClose={handleMessageModalClose} message={selectedMessage} />
    </div>
  )
}

export default TreeView
