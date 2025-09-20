import Dialog from "@/components/compound/Dialog";
import type { ProductResponse } from "@/types/product.types";
import { useCallback, useEffect, type FC } from "react";
import { useFetchCategoryDetails, useFetchSubCategoryDetails } from "./hooks";

type Props = {
  product?: ProductResponse;
  onSave: (product: ProductResponse) => void;
  isOpen: boolean;
  onClose: () => void;
};

const ProductDialog: FC<Props> = (props) => {
  const { isOpen, onClose, onSave, product } = props;
  const { _id, category, subCategory, addonGroups,addons,allergicInfo,basePrice,carbs,createdAt,description,dishSize,fats,fiber,frosting,ingredientList,name,noOfPeople,packagingCharges,photoList,protein,spiceLevel,storeIds,tags,type,updatedAt,variantGroups,variants,weight } = product || {};

  const {
    isFetching,
    data: selectedCategory,
    refetch: fetchCategories,
    setData,
  } = useFetchCategoryDetails(category, true);

  useEffect(() => {
    if (category) {
      fetchCategories();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [category, fetchCategories, setData]);
  const {
    isFetching: isFetchingSubCategory,
    data: selectedSubCategory,
    refetch: fetchSubCategories,
    setData: setSubCategoryData,
  } = useFetchSubCategoryDetails(category, true);

  useEffect(() => {
    if (category) {
      fetchCategories();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [category, fetchCategories, setData]);
  useEffect(() => {
    if (subCategory) {
      fetchSubCategories();
    } else {
      setSubCategoryData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [fetchSubCategories, setSubCategoryData, subCategory]);

  const onSubmit = useCallback(
    (cat: ProductResponse) => {
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
      {!(isFetching || isFetchingSubCategory) && <></>}
    </Dialog>
  );
};

export default ProductDialog;
