import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { Popover } from "@/components/compound/Popover";
import { useToggle } from "@/hooks/useToggle";
import { contactQueryApiService } from "@/infrastructure/ContactQueryApiService";
import type { ContactQueryResponse } from "@/types/contactQuery.types";
import {
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  RefreshCw,
  Trash,
} from "lucide-react";
import { useCallback, useState, type FC } from "react";
import { toast } from "sonner";
import ChangeStatusDialog from "./ChangeStatusDialog";
import ClosingMessageDialog from "./ClosingMessageDialog";

type ContactQueryActionsProps = {
  query: ContactQueryResponse;
  onQueryUpdate: (query: ContactQueryResponse) => void;
  onQueryDelete: () => void;
};

const ContactQueryActions: FC<ContactQueryActionsProps> = ({
  query,
  onQueryUpdate,
  onQueryDelete,
}) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const handleCallCustomer = useCallback(() => {
    if (query.phone) {
      window.open(`tel:${query.phone}`, "_self");
    } else {
      toast.error("Customer phone number not available");
    }
  }, [query.phone]);

  const handleEmailCustomer = useCallback(() => {
    if (query.email) {
      window.open(`mailto:${query.email}`, "_blank");
    } else {
      toast.error("Customer email not available");
    }
  }, [query.email]);

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
    (updatedQuery: ContactQueryResponse) => {
      onQueryUpdate(updatedQuery);
    },
    [onQueryUpdate]
  );

  const handleSaveMessage = useCallback(
    (updatedQuery: ContactQueryResponse) => {
      onQueryUpdate(updatedQuery);
    },
    [onQueryUpdate]
  );

  const handleDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await contactQueryApiService.deleteContactQuery(query._id);
    if (success) {
      closeDelete();
      onQueryDelete();
      toast.success("Query deleted successfully");
    } else {
      toast.error("Error deleting query");
    }
    stopDeleteProgress();
  }, [query._id, closeDelete, onQueryDelete, startDeleteProgress, stopDeleteProgress]);

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleCallCustomer}
        disabled={!query.phone}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
      >
        <Phone size={16} />
        <span>Call Customer</span>
      </button>
      <button
        onClick={handleEmailCustomer}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
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
      <button
        onClick={openDelete}
        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Trash size={16} />
        <span>Delete</span>
      </button>
    </div>
  );

  return (
    <>
      <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
        {actionsMenu}
      </Popover>

      <ChangeStatusDialog
        query={query}
        isOpen={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        onSave={handleSaveStatus}
      />

      <ClosingMessageDialog
        query={query}
        isOpen={isMessageDialogOpen}
        onClose={handleCloseMessageDialog}
        onSave={handleSaveMessage}
      />

      {isDeleteOpen && (
        <DeleteDialog
          close={closeDelete}
          isOpen
          onDelete={handleDelete}
          isDeleting={isDeleteInProgress}
          title="Delete Query!"
          name={query.name}
        />
      )}
    </>
  );
};

export default ContactQueryActions;
