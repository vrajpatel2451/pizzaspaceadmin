import Dialog from "@/components/compound/Dialog";
import type { CategoryResponse } from "@/types/category.types";
import { useCallback, type FC } from "react";
import AssignStoreToCategoryForm from "./AssignStoreToCategoryForm";
import type { StoreResponse } from "@/features/company-management/types/StoreTypes";

type Props = {
  category: CategoryResponse;
  initialStores?: StoreResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryResponse) => void;
};

const AssignStoreToCategoryDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, category, initialStores } = props;

  const onSubmit = useCallback(
    (updatedCategory: CategoryResponse) => {
      onSave(updatedCategory);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Assign Stores to Category"
      size="md"
      subTitle="Select stores where this category will be available"
    >
      <AssignStoreToCategoryForm
        category={category}
        initialStores={initialStores}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default AssignStoreToCategoryDialog;
