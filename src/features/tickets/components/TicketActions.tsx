import { IconButton } from "@/components/base/IconButton";
import { Popover } from "@/components/compound/Popover";
import type { OrderTicketResponse } from "@/types/ticket.types";
import { MoreVertical, Phone, Mail, RefreshCw, MessageSquare } from "lucide-react";
import { useCallback, useState, type FC } from "react";
import { toast } from "sonner";
import ChangeStatusDialog from "./ChangeStatusDialog";
import ClosingMessageDialog from "./ClosingMessageDialog";

type TicketActionsProps = {
  ticket: OrderTicketResponse;
  customerPhone?: string;
  customerEmail?: string;
  onTicketUpdate: (ticket: OrderTicketResponse) => void;
};

const TicketActions: FC<TicketActionsProps> = ({
  ticket,
  customerPhone,
  customerEmail,
  onTicketUpdate,
}) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const handleCallCustomer = useCallback(() => {
    if (customerPhone) {
      window.open(`tel:${customerPhone}`, "_self");
    } else {
      toast.error("Customer phone number not available");
    }
  }, [customerPhone]);

  const handleEmailCustomer = useCallback(() => {
    if (customerEmail) {
      window.open(`mailto:${customerEmail}`, "_blank");
    } else {
      toast.error("Customer email not available");
    }
  }, [customerEmail]);

  const handleOpenStatusDialog = useCallback(() => {
    setIsStatusDialogOpen(true);
  }, []);

  const handleCloseStatusDialog = useCallback(() => {
    setIsStatusDialogOpen(false);
  }, []);

  const handleOpenMessageDialog = useCallback(() => {
    setIsMessageDialogOpen(true);
  }, []);

  const handleCloseMessageDialog = useCallback(() => {
    setIsMessageDialogOpen(false);
  }, []);

  const handleSaveStatus = useCallback(
    (updatedTicket: OrderTicketResponse) => {
      onTicketUpdate(updatedTicket);
    },
    [onTicketUpdate],
  );

  const handleSaveMessage = useCallback(
    (updatedTicket: OrderTicketResponse) => {
      onTicketUpdate(updatedTicket);
    },
    [onTicketUpdate],
  );

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleCallCustomer}
        disabled={!customerPhone}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
      >
        <Phone size={16} />
        <span>Call Customer</span>
      </button>
      <button
        onClick={handleEmailCustomer}
        disabled={!customerEmail}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
      >
        <Mail size={16} />
        <span>Email Customer</span>
      </button>
      <button
        onClick={handleOpenStatusDialog}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <RefreshCw size={16} />
        <span>Update Status</span>
      </button>
      <button
        onClick={handleOpenMessageDialog}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <MessageSquare size={16} />
        <span>Update Closing Message</span>
      </button>
    </div>
  );

  return (
    <>
      <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
        {actionsMenu}
      </Popover>

      <ChangeStatusDialog
        ticket={ticket}
        isOpen={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        onSave={handleSaveStatus}
      />

      <ClosingMessageDialog
        ticket={ticket}
        isOpen={isMessageDialogOpen}
        onClose={handleCloseMessageDialog}
        onSave={handleSaveMessage}
      />
    </>
  );
};

export default TicketActions;
