import { PSTFile, type PSTFolder, PSTMessage, PSTTask } from 'pst-extractor'
import type { Directory } from 'src/lib/types'
import { PSTAppointment } from 'pst-extractor/dist/PSTAppointment.class'
import { PSTContact } from 'pst-extractor/dist/PSTContact.class'

const parseFolder = (folder: PSTFolder): Directory => {
  const directory: Directory = {
    name: folder.displayName,
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
      } else if (message instanceof PSTAppointment) {
        console.log('Appointment:', message.displayName)
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
