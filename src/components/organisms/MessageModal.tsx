import { type FC } from 'react'
import { type Message, type MessageFrom, MessageImportance, MessagePriority } from 'src/lib/pst/types'
import ModalContainer, { type ModalProps } from 'src/components/atoms/ModalContainer'
import FieldRender from 'src/components/atoms/FieldRender'
import Attachments from 'src/components/molecules/Attachments'

type MessageModalProps = ModalProps & {
  message: Message | null
}

const fromParser = (value: MessageFrom) => {
  return [value.name, value.address ? `<${value.address}>` : ''].filter(Boolean).join(' ')
}
const contactsParser = (value: string[]) => value.join(', ')
const importanceParser = (value: MessageImportance) => {
  switch (value) {
    case MessageImportance.Low:
      return 'Low'
    case MessageImportance.Normal:
      return 'Normal'
    case MessageImportance.High:
      return 'High'
  }
}
const priorityParser = (value: MessagePriority) => {
  switch (value) {
    case MessagePriority.Low:
      return 'Low'
    case MessagePriority.Normal:
      return 'Normal'
    case MessagePriority.High:
      return 'High'
  }
}

const MessageModal: FC<MessageModalProps> = ({ message, open, onClose }) => {
  return (
    <ModalContainer open={open} onClose={onClose}>
      {message && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{message.subject}</h1>
          {message.bodyHtml && <p className="mb-2" dangerouslySetInnerHTML={{ __html: message.bodyHtml }} />}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <FieldRender title="From" value={message.from} valueParser={fromParser} />
            <FieldRender title="To" value={message.to} />
            <FieldRender title="CC" value={message.cc} valueParser={contactsParser} isHidden={!message.cc.length} />
            <FieldRender title="BCC" value={message.bcc} valueParser={contactsParser} isHidden={!message.bcc.length} />
            <FieldRender title="Importance" value={message.importance} valueParser={importanceParser} />
            <FieldRender title="Priority" value={message.priority} valueParser={priorityParser} />
            <FieldRender title="Was Read" value={message.isRead ? 'Yes' : 'No'} />
            <FieldRender title="Was Draft" value={message.isDraft ? 'Yes' : 'No'} />
            <FieldRender title="Created At" value={message.createdAt.toLocaleString()} />
          </div>
          {message.attachments.length > 0 && <Attachments attachments={message.attachments} />}
        </div>
      )}
    </ModalContainer>
  )
}

export default MessageModal
