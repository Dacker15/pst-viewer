import { type FC, useMemo } from 'react'
import ModalContainer, { type ModalProps } from 'src/components/atoms/ModalContainer'
import { type Appointment, AppointmentBusyStatus, type UnscheduledAppointment } from 'src/lib/pst/types'
import Description from 'src/components/atoms/Description'
import FieldRender from 'src/components/atoms/FieldRender'
import Attachments from 'src/components/molecules/Attachments'

type AppointmentModalProps = ModalProps & {
  appointment: UnscheduledAppointment | Appointment | null
}

const busyStatusValueParser = (value: AppointmentBusyStatus) => {
  switch (value) {
    case AppointmentBusyStatus.Free:
      return 'Free'
    case AppointmentBusyStatus.Tentative:
      return 'Tentative'
    case AppointmentBusyStatus.Busy:
      return 'Busy'
    case AppointmentBusyStatus.OutOfOffice:
      return 'Out of Office'
    default:
      return 'Unknown Status'
  }
}

const AppointmentModal: FC<AppointmentModalProps> = ({ appointment, open, onClose }) => {
  const attendees = useMemo(() => appointment?.attendees.filter(Boolean).join(', ') ?? [], [appointment])
  const requiredAttendees = useMemo(
    () => appointment?.requiredAttendees.filter(Boolean).join(', ') ?? [],
    [appointment]
  )
  const optionalAttendees = useMemo(
    () => appointment?.optionalAttendees.filter(Boolean).join(', ') ?? [],
    [appointment]
  )
  return (
    <ModalContainer open={open} onClose={onClose}>
      {appointment && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{appointment.name}</h1>
          {appointment.description && <Description text={appointment.description} className="mb-2" />}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <FieldRender
              title="Starts At"
              value={appointment.startAt?.toLocaleString()}
              isHidden={!appointment.startAt}
            />
            <FieldRender title="Ends At" value={appointment.endAt?.toLocaleString()} isHidden={!appointment.endAt} />
            <FieldRender title="All Day" value={appointment.isAllDay ? 'Yes' : 'No'} />
            <FieldRender title="Location" value={appointment.location} isHidden={!appointment.location} />
            <FieldRender title="Online Meeting" value={appointment.hasOnlineMeeting ? 'Yes' : 'No'} />
            <FieldRender title="Attendees" value={attendees} isHidden={!attendees.length} />
            <FieldRender title="Organizer" value={appointment.organizer} isHidden={!appointment.organizer} />
            <FieldRender title="Required Attendees" value={requiredAttendees} isHidden={!requiredAttendees.length} />
            <FieldRender title="Optional Attendees" value={optionalAttendees} isHidden={!optionalAttendees.length} />
            <FieldRender title="Recurrence" value={appointment.recurrence} isHidden={!appointment.recurrence} />
            <FieldRender title="Busy Status" value={appointment.busyStatus} valueParser={busyStatusValueParser} />
          </div>
          {appointment.attachments.length > 0 && <Attachments attachments={appointment.attachments} />}
        </div>
      )}
    </ModalContainer>
  )
}

export default AppointmentModal
