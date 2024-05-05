import { type FC } from 'react'
import ModalContainer, { type ModalProps } from 'src/components/atoms/ModalContainer'
import FieldRender from 'src/components/atoms/FieldRender'
import Attachments from 'src/components/molecules/Attachments'
import type {
  Contact,
  ContactAddress,
  ContactBusinessAddress,
  ContactCompanyAddress,
  ContactMailAddress
} from 'src/lib/pst/types'
import { hasAnyKeysPopulated } from 'src/lib/general'

type ContactModalProps = ModalProps & {
  contact: Contact | null
}

const addressParser = (address: ContactAddress) => {
  const data = [
    address.address,
    address.street,
    address.city,
    address.stateOrProvince,
    address.country,
    address.postalCode,
    address.postOfficeBox,
    address.faxNumber,
    address.phoneNumber,
    address.secondaryPhoneNumber
  ]
  return data.filter((value) => !!value).join(', ')
}
const companyAddressParser = (address: ContactCompanyAddress) => {
  return `${address.name}, ${address.phoneNumber}`
}

const businessAddressParser = (address: ContactBusinessAddress) => {
  const data = [
    address.address,
    address.street,
    address.city,
    address.stateOrProvince,
    address.country,
    address.postalCode,
    address.postOfficeBox,
    address.faxNumber,
    address.phoneNumber,
    address.secondaryPhoneNumber,
    address.homepage
  ]
  return data.filter((value) => !!value).join(', ')
}

const emailParser = (email: ContactMailAddress) => {
  return `${email.name} <${email.email}>`
}

const ContactModal: FC<ContactModalProps> = ({ contact, open, onClose }) => {
  return (
    <ModalContainer open={open} onClose={onClose}>
      {contact && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{contact.displayName}</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <FieldRender title="Given Name" value={contact.givenName} isHidden={!contact.givenName} />
            <FieldRender title="Middle Name" value={contact.middleName} isHidden={!contact.middleName} />
            <FieldRender title="Surname" value={contact.surname} isHidden={!contact.surname} />
            <FieldRender title="Nickname" value={contact.nickname} isHidden={!contact.nickname} />
            <FieldRender title="Account" value={contact.account} isHidden={!contact.account} />
            <FieldRender title="Initials" value={contact.initials} isHidden={!contact.initials} />
            <FieldRender title="Generation" value={contact.generation} isHidden={!contact.generation} />
            <FieldRender
              title="Anniversary"
              value={contact.anniversary?.toLocaleDateString()}
              isHidden={!contact.anniversary}
            />
            <FieldRender title="Spouse Name" value={contact.spouseName} isHidden={!contact.spouseName} />
            <FieldRender
              title="Birthdate"
              value={contact.birthdate?.toLocaleDateString()}
              isHidden={!contact.birthdate}
            />
            <FieldRender
              title="Primary Phone Number"
              value={contact.primaryTelephoneNumber}
              isHidden={!contact.primaryTelephoneNumber}
            />
            <FieldRender
              title="Primary Fax Number"
              value={contact.primaryFaxNumber}
              isHidden={!contact.primaryFaxNumber}
            />
            <FieldRender
              title="First Email Addresses"
              value={contact.emailAddresses[0]}
              valueParser={emailParser}
              isHidden={!hasAnyKeysPopulated(contact.emailAddresses[0])}
            />
            <FieldRender
              title="Second Email Addresses"
              value={contact.emailAddresses[1]}
              valueParser={emailParser}
              isHidden={!hasAnyKeysPopulated(contact.emailAddresses[1])}
            />
            <FieldRender
              title="Third Email Addresses"
              value={contact.emailAddresses[2]}
              valueParser={emailParser}
              isHidden={!hasAnyKeysPopulated(contact.emailAddresses[2])}
            />
            <FieldRender
              title="Address"
              value={contact.address}
              valueParser={addressParser}
              isHidden={!hasAnyKeysPopulated(contact.address)}
            />
            <FieldRender
              title="Business Address"
              value={contact.businessAddress}
              valueParser={businessAddressParser}
              isHidden={!hasAnyKeysPopulated(contact.businessAddress)}
            />
            <FieldRender
              title="Company Address"
              value={contact.companyAddress}
              valueParser={companyAddressParser}
              isHidden={!hasAnyKeysPopulated(contact.companyAddress)}
            />
            <FieldRender
              title="Work Address"
              value={contact.workAddress}
              valueParser={addressParser}
              isHidden={!hasAnyKeysPopulated(contact.workAddress)}
            />
            <FieldRender
              title="Other Address"
              value={contact.otherAddress}
              valueParser={addressParser}
              isHidden={!hasAnyKeysPopulated(contact.otherAddress)}
            />
          </div>
          {contact.attachments.length > 0 && <Attachments attachments={contact.attachments} />}
        </div>
      )}
    </ModalContainer>
  )
}

export default ContactModal
