import Dialog from "@/components/compound/Dialog";
import type { UserResponse } from "@/types/user.types";
import { useCallback, useMemo, type FC } from "react";
import type { UserFormFields } from "./UserForm";
import UserForm from "./UserForm";

type Props = {
  onSave: (user: UserResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const UserDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave } = props;

  const initData = useMemo<UserFormFields>(
    () => ({
      name: "",
      email: "",
      phone: "",
    }),
    [],
  );

  const onSubmit = useCallback(
    (user: UserResponse) => {
      onSave(user);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Create New User"
      size="md"
      subTitle="Enter user details to create a new customer account"
    >
      <UserForm defaultValue={initData} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default UserDialog;
