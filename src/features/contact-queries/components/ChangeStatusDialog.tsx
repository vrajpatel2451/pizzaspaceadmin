import Dialog from "@/components/compound/Dialog";
import type { ContactQueryResponse } from "@/types/contactQuery.types";
import { useCallback, type FC } from "react";
import ChangeStatusForm from "./ChangeStatusForm";

type Props = {
  query: ContactQueryResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (query: ContactQueryResponse) => void;
};

const ChangeStatusDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, query } = props;

  const onSubmit = useCallback(
    (updatedQuery: ContactQueryResponse) => {
      onSave(updatedQuery);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Change Query Status"
      size="md"
      subTitle="Select the new status for this query"
    >
      <ChangeStatusForm query={query} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ChangeStatusDialog;
