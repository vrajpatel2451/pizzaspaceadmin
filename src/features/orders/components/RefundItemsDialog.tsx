import Dialog from "@/components/compound/Dialog";
import type { AdminTransformedOrder } from "@/types/order.types";
import { useCallback, type FC } from "react";
import RefundItemsForm from "./RefundItemsForm";

type Props = {
  order: AdminTransformedOrder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: AdminTransformedOrder) => void;
};

const RefundItemsDialog: FC<Props> = (props) => {
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
      title="Refund Order Items"
      size="lg"
      subTitle="Select items to refund and enter refund details"
    >
      <RefundItemsForm order={order} onSubmitSuccess={onSubmit} />
    </Dialog>
  );
};

export default RefundItemsDialog;
