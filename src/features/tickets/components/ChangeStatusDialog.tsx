import Dialog from "@/components/compound/Dialog";
import type { OrderTicketResponse } from "@/types/ticket.types";
import { useCallback, type FC } from "react";
import ChangeStatusForm from "./ChangeStatusForm";

type Props = {
  ticket: OrderTicketResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: OrderTicketResponse) => void;
};

const ChangeStatusDialog: FC<Props> = (props) => {
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
      title="Change Ticket Status"
      size="md"
      subTitle="Select the new status for this ticket"
    >
      <ChangeStatusForm ticket={ticket} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ChangeStatusDialog;
