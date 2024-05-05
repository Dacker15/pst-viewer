import { type FC } from 'react'
import { type Task, type TaskRecurrenceOptions, TaskStatus } from 'src/lib/pst/types.ts'
import ModalContainer, { type ModalProps } from 'src/components/atoms/ModalContainer.tsx'
import FieldRender from 'src/components/atoms/FieldRender.tsx'
import { WEEKDAYS } from 'src/lib/constants.ts'
import Attachments from 'src/components/molecules/Attachments.tsx'

type TasksModalProps = ModalProps & {
  task: Task | null
}

const statusValueParser = (value: TaskStatus) => {
  switch (value) {
    case TaskStatus.Open:
      return 'Not Started'
    case TaskStatus.InProgress:
      return 'In Progress'
    case TaskStatus.Completed:
      return 'Completed'
    case TaskStatus.WaitingOnSomeoneElse:
      return 'Waiting on Someone Else'
    case TaskStatus.Deferred:
      return 'Deferred'
    default:
      return 'Unknown Status'
  }
}

const recurrenceValueParser = (value: TaskRecurrenceOptions | undefined) => {
  const checks: string[] = []
  if (!value) return ''
  if (value.frequency === 'daily') {
    checks.push('Daily')
    checks.push(`from ${value.startAt.toTimeString()} to ${value.endAt.toTimeString()}`)
  } else if (value.frequency === 'weekly') {
    const days = (value.byWeek || [])
      .reduce<string[]>((day, value, index) => {
        if (value) {
          day.push(WEEKDAYS[index])
        }
        return day
      }, [])
      .join(', ')
    checks.push(`from ${value.startAt.toTimeString()} to ${value.endAt.toTimeString()}`)
    checks.push(`every ${days}`)
  } else if (value.frequency === 'monthly') {
    const nth = value.byMonth?.occurrences
    const days = (value.byMonth?.weeks || [])
      .reduce<string[]>((day, value, index) => {
        if (value) {
          day.push(WEEKDAYS[index])
        }
        return day
      }, [])
      .join(', ')
    checks.push(`from ${value.startAt.toTimeString()} to ${value.endAt.toTimeString()}`)
    checks.push(`every ${nth} weeks on ${days}`)
  }
  if (value.endAfterAt) {
    checks.push(`until ${value.endAfterAt.toDateString()}`)
  } else if (value.endAfterOccurrences) {
    checks.push(`after ${value.endAfterOccurrences} occurrences`)
  }
  return checks.join(' ')
}

const TasksModal: FC<TasksModalProps> = ({ task, open, onClose }) => {
  return (
    <ModalContainer open={open} onClose={onClose}>
      {task && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{task.name}</h1>
          {task.description && <p className="mb-2">{task.description}</p>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <FieldRender title="Starts At" value={task.startAt?.toLocaleString()} isHidden={!task.startAt} />
            <FieldRender title="Due At" value={task.dueAt?.toLocaleString()} isHidden={!task.dueAt} />
            <FieldRender title="Completed At" value={task.completedAt?.toLocaleString()} isHidden={!task.completedAt} />
            <FieldRender title="Created By" value={task.createdBy} isHidden={!task.createdBy} />
            <FieldRender title="Assigned To" value={task.assignedTo} isHidden={!task.assignedTo} />
            <FieldRender title="Status" value={task.status} valueParser={statusValueParser} />
            <FieldRender
              title="Recurrence"
              value={task.recurrence}
              valueParser={recurrenceValueParser}
              isHidden={!task.recurrence}
            />
          </div>
          {task.attachments.length > 0 && <Attachments attachments={task.attachments} />}
        </div>
      )}
    </ModalContainer>
  )
}

export default TasksModal
