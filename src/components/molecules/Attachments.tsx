import { type FC, useMemo } from 'react'
import type { Attachment } from 'src/lib/pst/types'

type AttachmentsProps = {
  attachments: Attachment[]
}

const Attachments: FC<AttachmentsProps> = (props) => {
  const parsedAttachments = useMemo(() => {
    return props.attachments.map((attachment) => {
      return {
        ...attachment,
        content: URL.createObjectURL(new Blob([attachment.content]))
      }
    })
  }, [props.attachments])

  return (
    <div className="flex flex-col gap-y-2">
      <p className="font-medium">Attachments</p>
      {parsedAttachments.map((attachment, index) => (
        <a
          key={index}
          href={attachment.content}
          download={attachment.name}
          className="bg-white text-grey-500 border border-grey-400 hover:bg-grey-100 active:bg-grey-300 active:text-black px-4 py-1 rounded-full"
        >
          {attachment.name}
        </a>
      ))}
    </div>
  )
}

export default Attachments
