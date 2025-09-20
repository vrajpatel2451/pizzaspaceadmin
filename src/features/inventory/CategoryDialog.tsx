import Dialog from "@/components/compound/Dialog";
import type { CategoryResponse } from "@/types/category.types";
import { useCallback, useMemo, type FC } from "react";
import type { CategoryFormFields } from "./CategoryForm";
import CategoryForm from "./CategoryForm";

type Props = {
  category?: CategoryResponse;
  onSave: (category: CategoryResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const CategoryDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, category } = props;
  const { _id } = category || {};
  const initData = useMemo<CategoryFormFields>(() => {
    if (category) {
      return {
        imageUrl: category.imageUrl,
        name: category.name,
      };
    }
    return {
      imageUrl: "",
      name: "",
    };
  }, [category]);

  const onSubmit = useCallback(
    (cat: CategoryResponse) => {
      onSave(cat);
      onClose();
    },
    [onClose, onSave],
  );
  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Category Details"
      size="md"
      subTitle="Enter details of category and save form to see results"
    >
      <CategoryForm
        action={category ? "edit" : "create"}
        defaultValue={initData}
        id={_id}
        onSubmitSuccess={onSubmit}
      />
    </Dialog>
  );
};

export default CategoryDialog;
