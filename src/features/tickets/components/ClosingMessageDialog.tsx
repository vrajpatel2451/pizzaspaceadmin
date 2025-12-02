import Dialog from "@/components/compound/Dialog";
import type { OrderTicketResponse } from "@/types/ticket.types";
import { useCallback, type FC } from "react";
import ClosingMessageForm from "./ClosingMessageForm";

type Props = {
  ticket: OrderTicketResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: OrderTicketResponse) => void;
};

const ClosingMessageDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, ticket } = props;

  const onSubmit = useCallback(
    (updatedTicket: OrderTicketResponse) => {
      onSave(updatedTicket);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Update Closing Message"
      size="md"
      subTitle="Add or update the closing message for this ticket"
    >
      <ClosingMessageForm ticket={ticket} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ClosingMessageDialog;
