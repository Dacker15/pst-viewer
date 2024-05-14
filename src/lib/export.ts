import type { Appointment, Contact, Directory, Message, Task, UnscheduledAppointment } from 'src/lib/pst/types.ts'

export const findElements = (directory: Directory) => {
  const messages: Message[] = []
  const tasks: Task[] = []
  const contacts: Contact[] = []
  const appointments: Appointment[] = []
  const unscheduledAppointments: UnscheduledAppointment[] = []

  messages.push(...directory.messages)
  tasks.push(...directory.tasks)
  contacts.push(...directory.contacts)
  appointments.push(...directory.appointments)
  unscheduledAppointments.push(...directory.unscheduledAppointments)

  for (const subdirectory of directory.children) {
    const {
      messages: subMessages,
      tasks: subTasks,
      contacts: subContacts,
      appointments: subAppointments,
      unscheduledAppointments: subUnscheduledAppointments
    } = findElements(subdirectory)
    messages.push(...subMessages)
    tasks.push(...subTasks)
    contacts.push(...subContacts)
    appointments.push(...subAppointments)
    unscheduledAppointments.push(...subUnscheduledAppointments)
  }
  return { messages, tasks, contacts, appointments, unscheduledAppointments }
}

export const escapeStringData = (data: string) => `"${data.replaceAll(/"/g, '""')}"`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appendOrCreate = (data: any, key: string, value: any, fillIndex: number) => {
  if (data[key]) {
    data[key].push(value)
  } else if (fillIndex === 0) {
    data[key] = [value]
  } else {
    data[key] = new Array(fillIndex - 1).fill(undefined)
    data[key].push(value)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapData = (data: any[], initialKey: string | null = null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mappedData: any = {}
  data.forEach((singleData) => {
    const entries = Object.entries(singleData)
    entries.forEach(([key, value], index) => {
      const keyName = initialKey ? `${initialKey}.${key}` : key
      if (typeof value === 'object') {
        const nestedData = mapData([value], keyName)
        Object.entries(nestedData).forEach(([nestedKey, nestedValue]) => {
          appendOrCreate(mappedData, nestedKey, nestedValue, index)
        })
        if (mappedData[keyName]) {
          delete mappedData[keyName]
        }
      } else if (value instanceof Date) {
        appendOrCreate(mappedData, keyName, value.toISOString(), index)
      } else if (Array.isArray(value)) {
        appendOrCreate(mappedData, keyName, value.join(', '), index)
      } else if (typeof value === 'string') {
        appendOrCreate(mappedData, keyName, escapeStringData(value), index)
      } else {
        appendOrCreate(mappedData, keyName, value, index)
      }
    })
  })
  return mappedData
}

export const formatAllData = (directory: Directory) => {
  const { messages, tasks, contacts, appointments, unscheduledAppointments } = findElements(directory)
  const mappedMessages = mapData(messages)
  console.log(messages)
  const mappedTasks = mapData(tasks)
  console.log(tasks)
  const mappedContacts = mapData(contacts)
  console.log(contacts)
  const mappedAppointments = mapData(appointments)
  console.log(appointments)
  const mappedUnscheduledAppointments = mapData(unscheduledAppointments)
  console.log(unscheduledAppointments)
  console.log(mappedMessages)
  console.log(mappedTasks)
  console.log(mappedContacts)
  console.log(mappedAppointments)
  console.log(mappedUnscheduledAppointments)
}
