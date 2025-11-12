import Dialog from "@/components/compound/Dialog";
import type { SubCategoryResponse } from "@/types/category.types";
import { useCallback, type FC } from "react";
import AssignStoreToSubCategoryForm from "./AssignStoreToSubCategoryForm";
import type { StoreResponse } from "@/features/company-management/types/StoreTypes";

type Props = {
  subCategory: SubCategoryResponse;
  initialStores?: StoreResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (subCategory: SubCategoryResponse) => void;
};

const AssignStoreToSubCategoryDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, subCategory, initialStores } = props;

  const onSubmit = useCallback(
    (updatedSubCategory: SubCategoryResponse) => {
      onSave(updatedSubCategory);
      onClose();
    },
    [onClose, onSave],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Assign Stores to Sub Category"
      size="md"
      subTitle="Select stores where this sub category will be available"
    >
      <AssignStoreToSubCategoryForm
        subCategory={subCategory}
        initialStores={initialStores}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default AssignStoreToSubCategoryDialog;
