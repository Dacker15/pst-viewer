export type Directory = {
  name: string
  tasks: Task[]
  appointments: Appointment[]
  unscheduledAppointments: UnscheduledAppointment[]
  contacts: Contact[]
  messages: Message[]
  children: Directory[]
}

export enum TaskStatus {
  Open = 0,
  InProgress = 1,
  Completed = 2,
  WaitingOnSomeoneElse = 3,
  Deferred = 4
}

export type TaskFrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly'

export type TaskRecurrenceOptions = {
  startAt: Date
  endAt: Date
  frequency: TaskFrequencyType
  interval: number
  byWeek?: boolean[]
  byMonth?: { weeks: boolean[]; occurrences: number }
  endAfterAt?: Date
  endAfterOccurrences?: number
}

export type Task = BaseEntity & {
  name: string
  description?: string
  startAt?: Date
  dueAt?: Date
  completedAt?: Date
  status: TaskStatus
  recurrence?: TaskRecurrenceOptions
  createdBy: string
  assignedTo: string
}

export enum AppointmentBusyStatus {
  Free = 0,
  Tentative = 1,
  Busy = 2,
  OutOfOffice = 3
}

export enum AppointmentFrequencyType {
  None = 0,
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Yearly = 4
}

export type UnscheduledAppointment = BaseEntity & {
  name: string
  description?: string
  startAt: Date | null
  endAt: Date | null
  duration: number // in minutes
  isAllDay: boolean
  location: string
  attendees: string[]
  organizer: string
  busyStatus: AppointmentBusyStatus
  recurrence: AppointmentFrequencyType
  requiredAttendees: string[] // separated by semicolon, contains only display names
  optionalAttendees: string[] // separated by semicolon, contains only display names
  hasOnlineMeeting: boolean
}

export type Appointment = UnscheduledAppointment & {
  startAt: Date
  endAt: Date
}

export type ContactMailAddress = {
  email: string
  name: string
}

export type ContactAddress = {
  address?: string
  street: string
  city: string
  stateOrProvince?: string
  country: string
  postalCode: string
  postOfficeBox: string
  faxNumber?: string
  phoneNumber?: string
  secondaryPhoneNumber?: string
}

export type ContactBusinessAddress = ContactAddress & {
  homepage: string
}

export type ContactCompanyAddress = {
  name: string
  phoneNumber: string
}

export type Contact = BaseEntity & {
  displayName: string
  emailAddresses: ContactMailAddress[]
  address: ContactAddress
  otherAddress: ContactAddress
  workAddress: ContactAddress
  account?: string
  anniversary: Date | null
  birthdate: Date | null
  businessAddress: ContactBusinessAddress
  companyAddress: ContactCompanyAddress
  givenName: string
  middleName: string
  nickname: string
  surname: string
  generation: string
  initials: string
  spouseName: string

  primaryTelephoneNumber: string
  primaryFaxNumber: string
}

export enum MessageImportance {
  Low = 0,
  Normal = 1,
  High = 2
}

export enum MessagePriority {
  Low = 0,
  Normal = 1,
  High = 2
}

export type Message = BaseEntity & {
  from: string
  fromName: string
  to: string
  cc: string[]
  bcc: string[]
  subject: string
  body: string
  bodyHtml: string
  importance: MessageImportance
  priority: MessagePriority
  isRead: boolean
  isDraft: boolean
  createdAt: Date
}

export type Attachment = {
  name: string
  content: Buffer
  size: number
  mimeType: string
  createdAt: Date | null
  updatedAt: Date | null
}

export type BaseEntity = {
  attachments: Attachment[]
}
