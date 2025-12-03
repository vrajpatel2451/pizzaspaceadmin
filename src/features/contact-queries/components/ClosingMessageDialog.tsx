import Dialog from "@/components/compound/Dialog";
import type { ContactQueryResponse } from "@/types/contactQuery.types";
import { useCallback, type FC } from "react";
import ClosingMessageForm from "./ClosingMessageForm";

type Props = {
  query: ContactQueryResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (query: ContactQueryResponse) => void;
};

const ClosingMessageDialog: FC<Props> = (props) => {
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
      title="Update Closing Message"
      size="md"
      subTitle="Add or update the closing message for this query"
    >
      <ClosingMessageForm query={query} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ClosingMessageDialog;
