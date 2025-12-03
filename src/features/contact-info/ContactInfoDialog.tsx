import Dialog from "@/components/compound/Dialog";
import type { ContactInfoResponse } from "@/types/contactInfo.types";
import { useCallback, useMemo, type FC } from "react";
import ContactInfoForm, { type ContactInfoFormFields } from "./ContactInfoForm";

type Props = {
  contactInfo?: ContactInfoResponse;
  onSave: (contactInfo: ContactInfoResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const ContactInfoDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, contactInfo } = props;
  const { _id } = contactInfo || {};

  const initData = useMemo<ContactInfoFormFields>(() => {
    if (contactInfo) {
      return {
        addressLine1: contactInfo.addressLine1,
        addressLine2: contactInfo.addressLine2 || "",
        area: contactInfo.area,
        city: contactInfo.city,
        county: contactInfo.county || "",
        zip: contactInfo.zip,
        phone: contactInfo.phone,
        email: contactInfo.email,
        lat: contactInfo.lat || null,
        lng: contactInfo.lng || null,
        immediatePhoneNo: contactInfo.immediatePhoneNo || "",
        immediateEmail: contactInfo.immediateEmail || "",
        isPublished: contactInfo.isPublished,
      };
    }
    return {
      addressLine1: "",
      addressLine2: "",
      area: "",
      city: "",
      county: "",
      zip: "",
      phone: "",
      email: "",
      lat: null,
      lng: null,
      immediatePhoneNo: "",
      immediateEmail: "",
      isPublished: false,
    };
  }, [contactInfo]);

  const onSubmit = useCallback(
    (data: ContactInfoResponse) => {
      onSave(data);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Contact Information"
      size="lg"
      subTitle="Enter contact details and save to update"
    >
      <ContactInfoForm
        action={contactInfo ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default ContactInfoDialog;
