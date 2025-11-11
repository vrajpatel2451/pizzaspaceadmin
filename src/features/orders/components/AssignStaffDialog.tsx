import Dialog from "@/components/compound/Dialog";
import type { AdminTransformedOrder } from "@/types/order.types";
import { useCallback, type FC } from "react";
import AssignStaffForm from "./AssignStaffForm";

type Props = {
  order: AdminTransformedOrder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: AdminTransformedOrder) => void;
};

const AssignStaffDialog: FC<Props> = (props) => {
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
      title="Assign Delivery Rider"
      size="md"
      subTitle="Select a delivery rider for this order"
    >
      <AssignStaffForm order={order} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default AssignStaffDialog;
