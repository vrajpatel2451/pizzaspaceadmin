import Dialog from "@/components/compound/Dialog";
import type { ProductResponse } from "@/types/product.types";
import { useCallback, type FC } from "react";
import AssignStoreToProductForm from "./AssignStoreToProductForm";
import type { StoreResponse } from "@/features/company-management/types/StoreTypes";

type Props = {
  product: ProductResponse;
  initialStores?: StoreResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductResponse) => void;
};

const AssignStoreToProductDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, product, initialStores } = props;

  const onSubmit = useCallback(
    (updatedProduct: ProductResponse) => {
      onSave(updatedProduct);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Assign Stores to Product"
      size="md"
      subTitle="Select stores where this product will be available"
    >
      <AssignStoreToProductForm
        product={product}
        initialStores={initialStores}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default AssignStoreToProductDialog;
