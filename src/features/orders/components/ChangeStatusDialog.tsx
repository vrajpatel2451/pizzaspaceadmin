import Dialog from "@/components/compound/Dialog";
import type { AdminTransformedOrder } from "@/types/order.types";
import { useCallback, type FC } from "react";
import ChangeStatusForm from "./ChangeStatusForm";

type Props = {
  order: AdminTransformedOrder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: AdminTransformedOrder) => void;
};

const ChangeStatusDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, order } = props;

  const onSubmit = useCallback(
    (updatedOrder: AdminTransformedOrder) => {
      onSave(updatedOrder);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Change Order Status"
      size="md"
      subTitle="Select the new status for this order"
    >
      <ChangeStatusForm order={order} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default ChangeStatusDialog;
