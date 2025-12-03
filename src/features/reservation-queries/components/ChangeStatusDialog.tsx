import Dialog from "@/components/compound/Dialog";
import type { ReservationQueryResponse } from "@/types/reservationQuery.types";
import { useCallback, type FC } from "react";
import ChangeStatusForm from "./ChangeStatusForm";

type Props = {
  reservation: ReservationQueryResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: ReservationQueryResponse) => void;
};

const ChangeStatusDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, reservation } = props;

  const onSubmit = useCallback(
    (updatedReservation: ReservationQueryResponse) => {
      onSave(updatedReservation);
      onClose();
    },
    [onClose, onSave]
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Change Reservation Status"
      size="md"
      subTitle="Select the new status for this reservation"
    >
      <ChangeStatusForm reservation={reservation} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ChangeStatusDialog;
