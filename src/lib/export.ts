import { BlobWriter, ZipWriter } from '@zip.js/zip.js'
import type { Appointment, Contact, Directory, Message, Task, UnscheduledAppointment } from 'src/lib/pst/types'

export type FileData = {
  name: string
  data: unknown[][]
}

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

export const appendOrCreate = (data: Record<string, unknown>, key: string, value: unknown, fillIndex: number) => {
  if (data[key]) {
    const array = data[key] as unknown[]
    array.push(value)
  } else if (fillIndex === 0) {
    data[key] = [value]
  } else {
    const array = new Array<unknown>(fillIndex - 1).fill(undefined)
    array.push(value)
    data[key] = array
  }
}

export const mapObject = (data: Record<string, unknown>, initialKey: string | null = null, fillIndex: number = 0) => {
  const mappedData: Record<string, unknown> = {}
  Object.entries(data).forEach(([key, value]) => {
    const keyName = initialKey ? `${initialKey}.${key}` : key
    if (Array.isArray(value)) {
      appendOrCreate(mappedData, keyName, value.join(', '), fillIndex)
    } else if (value === null) {
      appendOrCreate(mappedData, keyName, undefined, fillIndex)
    } else if (value instanceof Date) {
      appendOrCreate(mappedData, keyName, value.toISOString(), fillIndex)
    } else if (typeof value === 'object') {
      const nestedData = mapObject(value as Record<string, unknown>, keyName)
      Object.entries(nestedData).forEach(([nestedKey, nestedValue]) => {
        const [nestedEffectiveValue] = nestedValue as unknown[]
        appendOrCreate(mappedData, nestedKey, nestedEffectiveValue, fillIndex)
      })
      if (mappedData[keyName]) {
        delete mappedData[keyName]
      }
    } else if (typeof value === 'string') {
      appendOrCreate(mappedData, keyName, escapeStringData(value), fillIndex)
    } else {
      appendOrCreate(mappedData, keyName, value, fillIndex)
    }
  })
  return mappedData
}

export const mapData = (data: Record<string, unknown>[], initialKey: string | null = null) => {
  const mappedData: Record<string, unknown[]> = {}
  data.forEach((singleData, index) => {
    const { attachments, id: _id, ...remainingData } = singleData
    const mappedSingleData = mapObject(remainingData, initialKey, 0)
    Object.entries(mappedSingleData).forEach(([key, value]) => {
      const [effectiveValue] = value as unknown[]
      appendOrCreate(mappedData, key, effectiveValue, index)
    })
    if (attachments && Array.isArray(attachments)) {
      appendOrCreate(mappedData, `attachments_count`, attachments.length, index)
    }
  })
  return mappedData
}

export const formatAllData = (directory: Directory) => {
  const { messages, tasks, contacts, appointments, unscheduledAppointments } = findElements(directory)
  const mappedMessages = mapData(messages)
  const mappedTasks = mapData(tasks)
  const mappedContacts = mapData(contacts)
  const mappedAppointments = mapData(appointments)
  const mappedUnscheduledAppointments = mapData(unscheduledAppointments)
  return {
    messages: { data: mappedMessages, total: messages.length },
    tasks: { data: mappedTasks, total: tasks.length },
    contacts: { data: mappedContacts, total: contacts.length },
    appointments: { data: mappedAppointments, total: appointments.length },
    unscheduledAppointments: { data: mappedUnscheduledAppointments, total: unscheduledAppointments.length }
  }
}

export const createSingleCsvData = (data: Record<string, unknown[]>, dataLength: number): unknown[][] => {
  const csvData = []
  const keys = Object.keys(data)
  csvData.push([...keys])
  for (let i = 0; i < dataLength; i++) {
    const values = keys.map((key) => data[key][i])
    csvData.push([...values])
  }
  return csvData
}

export const createCsvData = (directory: Directory) => {
  const fileData: FileData[] = []
  const formattedData = formatAllData(directory)
  if (formattedData.messages.total > 0) {
    const messagesData = createSingleCsvData(formattedData.messages.data, formattedData.messages.total)
    fileData.push({ name: 'messages.csv', data: messagesData })
  }
  if (formattedData.tasks.total > 0) {
    const tasksData = createSingleCsvData(formattedData.tasks.data, formattedData.tasks.total)
    fileData.push({ name: 'tasks.csv', data: tasksData })
  }
  if (formattedData.contacts.total > 0) {
    const contactsData = createSingleCsvData(formattedData.contacts.data, formattedData.contacts.total)
    fileData.push({ name: 'contacts.csv', data: contactsData })
  }
  if (formattedData.appointments.total > 0) {
    const appointmentsData = createSingleCsvData(formattedData.appointments.data, formattedData.appointments.total)
    fileData.push({ name: 'appointments.csv', data: appointmentsData })
  }
  if (formattedData.unscheduledAppointments.total > 0) {
    const unscheduledAppointmentsData = createSingleCsvData(
      formattedData.unscheduledAppointments.data,
      formattedData.unscheduledAppointments.total
    )
    fileData.push({ name: 'unscheduled_appointments.csv', data: unscheduledAppointmentsData })
  }
  return fileData
}

export const createCsvZip = async (fileData: FileData[]) => {
  const zipWriterData = new BlobWriter()
  const zipWriter = new ZipWriter(zipWriterData)
  for (const { name, data } of fileData) {
    const csvData = data.map((row) => row.join(',')).join('\n')
    await zipWriter.add(name, new Blob([csvData], { type: 'text/csv' }).stream())
  }
  return zipWriter.close()
}

export const downloadCsvZip = async (directory: Directory) => {
  const fileData = createCsvData(directory)
  const zipBlob = await createCsvZip(fileData)
  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.zip'
  a.click()
  URL.revokeObjectURL(url)
}
