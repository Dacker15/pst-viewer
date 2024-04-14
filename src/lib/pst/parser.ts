import { type PSTAttachment, PSTFile, type PSTFolder, PSTMessage, PSTTask } from 'pst-extractor'
import type { Attachment, Directory, TaskFrequencyType } from 'src/lib/pst/types'
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

const parseAttachment = (attachment: PSTAttachment): Attachment => {
  const output = new Buffer(attachment.fileInputStream?.length?.toNumber() || attachment.size)
  attachment.fileInputStream?.read(output)
  return {
    name: attachment.longFilename,
    size: attachment.size,
    mimeType: attachment.mimeTag,
    createdAt: attachment.creationTime,
    updatedAt: attachment.modificationTime,
    content: output
  }
}

const parseAttachments = (message: PSTMessage): Attachment[] => {
  const attachments: Attachment[] = []
  if (message.numberOfAttachments) {
    for (let i = 0; i < message.numberOfAttachments; i++) {
      attachments.push(parseAttachment(message.getAttachment(i)))
    }
  }
  return attachments
}

const parseFolder = (folder: PSTFolder, root: Directory | null): Directory => {
  const directory: Directory = {
    name: folder.displayName,
    tasks: [],
    appointments: [],
    unscheduledAppointments: [],
    contacts: [],
    messages: [],
    children: [],
    root
  }

  if (folder.hasSubfolders) {
    for (const subFolder of folder.getSubFolders()) {
      directory.children.push(parseFolder(subFolder, directory))
    }
  }

  if (folder.contentCount > 0) {
    let message = folder.getNextChild()
    while (message !== null) {
      const attachments = parseAttachments(message)

      if (message instanceof PSTTask) {
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
          assignedTo: message.taskAssigner,
          attachments
        })
      } else if (message instanceof PSTAppointment) {
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
            hasOnlineMeeting: message.isOnlineMeeting,
            attachments
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
            hasOnlineMeeting: message.isOnlineMeeting,
            attachments
          })
        }
      } else if (message instanceof PSTContact) {
        directory.contacts.push({
          displayName: message.displayName,
          givenName: message.givenName,
          middleName: message.middleName,
          surname: message.surname,
          nickname: message.nickname,
          account: message.account,
          initials: message.initials,
          generation: message.generation,
          anniversary: message.anniversary,
          spouseName: message.spouseName,
          birthdate: message.birthday,
          primaryTelephoneNumber: message.primaryTelephoneNumber,
          primaryFaxNumber: message.primaryFaxNumber,
          emailAddresses: [
            { email: message.email1EmailAddress, name: message.email1DisplayName },
            { email: message.email2EmailAddress, name: message.email2DisplayName },
            { email: message.email3EmailAddress, name: message.email3DisplayName }
          ],
          address: {
            address: message.homeAddress,
            street: message.homeAddressStreet,
            city: message.homeAddressCity,
            stateOrProvince: message.homeAddressStateOrProvince,
            country: message.homeAddressCountry,
            postalCode: message.homeAddressPostalCode,
            postOfficeBox: message.homeAddressPostOfficeBox,
            faxNumber: message.homeFaxNumber,
            phoneNumber: message.homeTelephoneNumber,
            secondaryPhoneNumber: message.home2TelephoneNumber
          },
          businessAddress: {
            street: message.businessAddressStreet,
            city: message.businessAddressCity,
            stateOrProvince: message.businessAddressStateOrProvince,
            country: message.businessAddressCountry,
            postalCode: message.businessPostalCode,
            postOfficeBox: message.businessPoBox,
            faxNumber: message.businessFaxNumber,
            phoneNumber: message.businessTelephoneNumber,
            secondaryPhoneNumber: message.business2TelephoneNumber,
            homepage: message.businessHomePage
          },
          companyAddress: {
            name: message.companyName,
            phoneNumber: message.companyMainPhoneNumber
          },
          workAddress: {
            address: message.workAddress,
            street: message.workAddressStreet,
            city: message.workAddressCity,
            country: message.workAddressCountry,
            postalCode: message.workAddressPostalCode,
            postOfficeBox: message.workAddressPostOfficeBox
          },
          otherAddress: {
            address: message.otherAddress,
            street: message.otherAddressStreet,
            city: message.otherAddressCity,
            stateOrProvince: message.otherAddressStateOrProvince,
            country: message.otherAddressCountry,
            postalCode: message.otherAddressPostalCode,
            postOfficeBox: message.otherAddressPostOfficeBox,
            phoneNumber: message.otherTelephoneNumber
          },
          attachments
        })
      } else if (message instanceof PSTMessage) {
        if (message.creationTime === null) {
          message = folder.getNextChild()
          continue
        }
        directory.messages.push({
          from: message.senderEmailAddress,
          fromName: message.senderName,
          to: message.displayTo,
          cc: message.displayCC.length > 0 ? message.displayCC.split(';') : [],
          bcc: message.displayBCC.length > 0 ? message.displayBCC.split(';') : [],
          subject: message.subject,
          body: message.body,
          bodyHtml: message.bodyHTML,
          createdAt: message.creationTime,
          importance: message.importance,
          priority: message.priority,
          isRead: message.isRead,
          isDraft: message.isUnsent,
          attachments
        })
      }

      message = folder.getNextChild()
    }
  }

  return directory
}

export const parseFile = (data: Buffer): Directory => {
  const file = new PSTFile(data)
  const root = file.getRootFolder()

  return parseFolder(root, null)
}
