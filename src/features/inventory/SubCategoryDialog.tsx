import Dialog from "@/components/compound/Dialog";
import type { SubCategoryResponse } from "@/types/category.types";
import { useCallback, useEffect, useMemo, type FC } from "react";
import type { SubCategoryFormFields } from "./SubCategoryForm";
import SubCategoryForm from "./SubCategoryForm";
import { useFetchCategoryDetails } from "./hooks";

type Props = {
  subCategory?: SubCategoryResponse;
  onSave: (subCategory: SubCategoryResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const SubCategoryDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, subCategory } = props;
  const { _id, categoryId } = subCategory || {};
  const {
    isFetching,
    data: selectedCategory,
    refetch: fetchCategories,
    setData,
  } = useFetchCategoryDetails(categoryId, true);

  useEffect(() => {
    if (categoryId) {
      fetchCategories();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [categoryId, fetchCategories, setData]);

  const initData = useMemo<SubCategoryFormFields>(() => {
    if (subCategory) {
      return {
        imageUrl: subCategory.imageUrl,
        name: subCategory.name,
        categoryId: subCategory.categoryId,
      };
    }
    return {
      imageUrl: "",
      name: "",
      categoryId: "",
    };
  }, [subCategory]);

  const onSubmit = useCallback(
    (cat: SubCategoryResponse) => {
      onSave(cat);
      onClose();
    },
    [onClose, onSave],
  );
  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="SubCategory Details"
      size="md"
      subTitle="Enter details of subCategory and save form to see results"
    >
      {!isFetching && (
        <SubCategoryForm
          action={_id ? "edit" : "create"}
          defaultValue={initData}
          id={_id}
          selectedCategory={selectedCategory}
          onSubmitSuccess={onSubmit}
        />
      )}
    </Dialog>
  );
};

export default SubCategoryDialog;
