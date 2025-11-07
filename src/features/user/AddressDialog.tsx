import Dialog from "@/components/compound/Dialog";
import type { AddressResponse } from "@/types/user.types";
import { useCallback, useMemo, type FC } from "react";
import type { AddressFormFields } from "./AddressForm";
import AddressForm from "./AddressForm";

type Props = {
  userId: string;
  onSave: (address: AddressResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const AddressDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, userId } = props;

  const initData = useMemo<AddressFormFields>(
    () => ({
      name: "",
      phone: "",
      line1: "",
      line2: "",
      area: "",
      county: "",
      country: "",
      zip: "",
      lat: 0,
      long: 0,
      type: "home",
      otherAddressLabel: "",
      isDefault: false,
    }),
    [],
  );

  const onSubmit = useCallback(
    (address: AddressResponse) => {
      onSave(address);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Create New Address"
      size="lg"
      subTitle="Enter address details for the selected user"
    >
      <AddressForm
        defaultValue={initData}
        userId={userId}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default AddressDialog;
