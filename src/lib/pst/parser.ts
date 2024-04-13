import { PSTFile, type PSTFolder, PSTMessage, PSTTask } from 'pst-extractor'
import type { Directory, TaskFrequencyType } from 'src/lib/pst/types.ts'
import { PSTAppointment } from 'pst-extractor/dist/PSTAppointment.class'
import { PSTContact } from 'pst-extractor/dist/PSTContact.class'
import { type MonthNthSpecific, PatternType, RecurFrequency } from 'pst-extractor/dist/RecurrencePattern.class'

const parseTaskFrequencyType = (type: RecurFrequency): TaskFrequencyType => {
  switch (type) {
    case RecurFrequency.Daily:
      return 'daily'
    case RecurFrequency.Weekly:
      return 'weekly'
    case RecurFrequency.Monthly:
      return 'monthly'
    case RecurFrequency.Yearly:
      return 'yearly'
  }
}

const parseFolder = (folder: PSTFolder): Directory => {
  const directory: Directory = {
    name: folder.displayName,
    tasks: [],
    appointments: [],
    unscheduledAppointments: [],
    children: []
  }

  if (folder.hasSubfolders) {
    for (const subFolder of folder.getSubFolders()) {
      directory.children.push(parseFolder(subFolder))
    }
  }

  if (folder.contentCount > 0) {
    let message = folder.getNextChild()
    while (message !== null) {
      if (message instanceof PSTTask) {
        console.log('Task:', message.subject)
        directory.tasks.push({
          name: message.subject,
          description: message.body,
          startAt: message.taskStartDate ?? undefined,
          dueAt: message.taskDueDate ?? undefined,
          completedAt: message.taskDateCompleted ?? undefined,
          status: message.taskStatus,
          recurrence:
            message.taskRecurrencePattern !== null
              ? {
                  startAt: message.taskRecurrencePattern.startDate,
                  endAt: message.taskRecurrencePattern.endDate,
                  frequency: parseTaskFrequencyType(message.taskRecurrencePattern.recurFrequency),
                  interval: message.taskRecurrencePattern.recurFrequency,
                  byWeek:
                    message.taskRecurrencePattern.patternType === PatternType.Week
                      ? (message.taskRecurrencePattern.patternTypeSpecific as boolean[])
                      : undefined,
                  byMonth:
                    message.taskRecurrencePattern.patternType === PatternType.Month
                      ? {
                          weeks: (message.taskRecurrencePattern.patternTypeSpecific as MonthNthSpecific).weekdays,
                          occurrences: (message.taskRecurrencePattern.patternTypeSpecific as MonthNthSpecific).nth
                        }
                      : undefined,
                  endAfterAt: message.taskRecurrencePattern.endDate,
                  endAfterOccurrences: message.taskRecurrencePattern.occurrenceCount
                }
              : undefined,
          createdBy: message.taskOwner,
          assignedTo: message.taskAssigner
        })
        // console.log(messages.numberOfAttachments)
        // console.log(messages.attachmentTable.getItems().forEach((attachment) => console.log(attachment.data)))
      } else if (message instanceof PSTAppointment) {
        console.log('Appointment:', message.subject)
        if (message.startTime !== null && message.endTime !== null) {
          directory.appointments.push({
            name: message.subject,
            description: message.body,
            startAt: message.startTime,
            endAt: message.endTime,
            duration: message.duration,
            isAllDay: message.subType,
            busyStatus: message.busyStatus,
            attendees: message.allAttendees?.split(';') ?? [],
            requiredAttendees: message.toAttendees?.split(';') ?? [],
            optionalAttendees: message.ccAttendees?.split(';') ?? [],
            recurrence: message.recurrenceType,
            location: message.location,
            organizer: message.netMeetingOrganizerAlias,
            hasOnlineMeeting: message.isOnlineMeeting
          })
        } else {
          directory.unscheduledAppointments.push({
            name: message.subject,
            description: message.body,
            startAt: message.startTime,
            endAt: message.endTime,
            duration: message.duration,
            isAllDay: message.subType,
            busyStatus: message.busyStatus,
            attendees: message.allAttendees?.split(';') ?? [],
            requiredAttendees: message.toAttendees?.split(';') ?? [],
            optionalAttendees: message.ccAttendees?.split(';') ?? [],
            recurrence: message.recurrenceType,
            location: message.location,
            organizer: message.netMeetingOrganizerAlias,
            hasOnlineMeeting: message.isOnlineMeeting
          })
        }
      } else if (message instanceof PSTContact) {
        console.log('Contact:', message.displayName)
      } else if (message instanceof PSTMessage) {
        console.log('Message:', message.subject)
      } else {
        console.log('Unknown:', message.displayName)
      }

      message = folder.getNextChild()
    }
  }

  return directory
}

export const parseFile = (data: Buffer): Directory => {
  const file = new PSTFile(data)
  const root = file.getRootFolder()

  return parseFolder(root)
}
