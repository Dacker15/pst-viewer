export type Directory = {
  name: string
  tasks: Task[]
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

export type Task = {
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
