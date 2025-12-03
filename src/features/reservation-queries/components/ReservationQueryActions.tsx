import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { Popover } from "@/components/compound/Popover";
import { useToggle } from "@/hooks/useToggle";
import { reservationQueryApiService } from "@/infrastructure/ReservationQueryApiService";
import type { ReservationQueryResponse } from "@/types/reservationQuery.types";
import {
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

type ReservationQueryActionsProps = {
  reservation: ReservationQueryResponse;
  onReservationUpdate: (reservation: ReservationQueryResponse) => void;
  onReservationDelete: () => void;
};

const ReservationQueryActions: FC<ReservationQueryActionsProps> = ({
  reservation,
  onReservationUpdate,
  onReservationDelete,
}) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const {
    isOpen: isDeleteOpen,
    open: openDelete,
    close: closeDelete,
  } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const handleCallCustomer = useCallback(() => {
    if (reservation.phone) {
      window.open(`tel:${reservation.phone}`, "_self");
    } else {
      toast.error("Customer phone number not available");
    }
  }, [reservation.phone]);

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
    (updatedReservation: ReservationQueryResponse) => {
      onReservationUpdate(updatedReservation);
    },
    [onReservationUpdate]
  );

  const handleSaveMessage = useCallback(
    (updatedReservation: ReservationQueryResponse) => {
      onReservationUpdate(updatedReservation);
    },
    [onReservationUpdate]
  );

  const handleDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await reservationQueryApiService.deleteReservationQuery(
      reservation._id
    );
    if (success) {
      closeDelete();
      onReservationDelete();
      toast.success("Reservation deleted successfully");
    } else {
      toast.error("Error deleting reservation");
    }
    stopDeleteProgress();
  }, [
    reservation._id,
    closeDelete,
    onReservationDelete,
    startDeleteProgress,
    stopDeleteProgress,
  ]);

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleCallCustomer}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Phone size={16} />
        <span>Call Customer</span>
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
        reservation={reservation}
        isOpen={isStatusDialogOpen}
        onClose={handleCloseStatusDialog}
        onSave={handleSaveStatus}
      />

      <ClosingMessageDialog
        reservation={reservation}
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
          title="Delete Reservation!"
          name={reservation.name}
        />
      )}
    </>
  );
};

export default ReservationQueryActions;
