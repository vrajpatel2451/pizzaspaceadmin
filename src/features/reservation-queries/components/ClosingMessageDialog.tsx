import Dialog from "@/components/compound/Dialog";
import type { ReservationQueryResponse } from "@/types/reservationQuery.types";
import { useCallback, type FC } from "react";
import ClosingMessageForm from "./ClosingMessageForm";

type Props = {
  reservation: ReservationQueryResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reservation: ReservationQueryResponse) => void;
};

const ClosingMessageDialog: FC<Props> = (props) => {
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
      title="Update Closing Message"
      size="md"
      subTitle="Add or update the closing message for this reservation"
    >
      <ClosingMessageForm
        reservation={reservation}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default ClosingMessageDialog;
