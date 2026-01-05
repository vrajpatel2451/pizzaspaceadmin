import Dialog from "@/components/compound/Dialog";
import Spinner from "@/components/compound/spinner/Spinner";
import type { ProductResponse } from "@/types/product.types";
import { useEffect, useMemo, type FC } from "react";
import {
  useFetchAddonList,
  useFetchCategoryDetails,
  useFetchSubCategoryDetails,
} from "../hooks";
import { useFetchProductDetails } from "../hooks/uaeFetchProductDetails";
import type {
  ProductAction,
  ProductFormFields,
  ProductFormProps,
} from "./ProductForm";
import ProductForm from "./ProductForm";

type Props = {
  productId?: string;
  action: ProductAction;
  isOpen: boolean;
  categoryId: string;
  subCategoryId: string;
  onClose: () => void;
  onSave: (productResponse: ProductResponse) => void;
};

const prps = {};
const ProductDialog: FC<Props> = (props) => {
  const {
    action,
    isOpen,
    onClose,
    onSave,
    productId,
    categoryId,
    subCategoryId,
  } = props;
  const { data, isFetching, refetch, setData } = useFetchProductDetails(
    productId,
    true,
  );
  const { data: alladdonResponse, isFetching: isAddonFetching } =
    useFetchAddonList(prps);
  const { addonGroups: allAddonGroups, addons: allAddons } =
    alladdonResponse || {};
  const {
    product,
    addonGroupList,
    addonList,
    pricing,
    variantGroupList,
    variantList,
  } = data || {};
  useEffect(() => {
    if (action === "edit" && productId) {
      refetch();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [action, productId, refetch, setData]);

  const defaultValue = useMemo<ProductFormFields>(
    () =>
      product
        ? {
            basePrice: product.basePrice,
            carbs: product.carbs,
            category: product.category,
            description: product.description,
            dishSize: product.dishSize,
            fats: product.fats,
            fiber: product.fiber,
            name: product.name,
            noOfPeople: product.noOfPeople,
            packagingCharges: product.packagingCharges,
            photoList: product.photoList,
            protein: product.protein,
            type: product.type,
            weight: product.weight,
            allergicInfo: product.allergicInfo,
            frosting: product.frosting,
            ingredientList: product.ingredientList,
            spiceLevel: product.spiceLevel,
            subCategory: product.subCategory,
            tags: product.tags,
            variantGroups: product.variantGroups,
            isCombo: product.isCombo || false,
            availableDeliveryTypes: product.availableDeliveryTypes || [
              "dineIn",
              "pickup",
              "delivery",
            ],
          }
        : {
            basePrice: 0,
            carbs: 0,
            category: categoryId,
            description: "",
            isCombo: false,
            dishSize: {
              count: 0,
              unit: "bucket",
            },
            fats: 0,
            fiber: 0,
            name: "",
            noOfPeople: 0,
            packagingCharges: 0,
            photoList: [],
            protein: 0,
            type: "veg",
            weight: 0,
            allergicInfo: [],
            frosting: "",
            ingredientList: [],
            spiceLevel: [],
            subCategory: subCategoryId,
            tags: [],
            variantGroups: [],
            availableDeliveryTypes: ["dineIn", "pickup", "delivery"],
          },
    [categoryId, product, subCategoryId],
  );

  const { data: categoryDetails, isFetching: isCategoryFetching } =
    useFetchCategoryDetails(categoryId);
  const { data: subCategoryDetails, isFetching: isSubCategoryFetching } =
    useFetchSubCategoryDetails(subCategoryId);

  const isLoading =
    isFetching ||
    isAddonFetching ||
    isCategoryFetching ||
    isSubCategoryFetching;

  const formProps = useMemo<ProductFormProps>(
    () => ({
      action: action,
      defaultValue: defaultValue,
      id: productId,
      onSubmitSuccess: onSave,
      addonGroups: addonGroupList || [],
      addons: addonList || [],
      allAddonGroups: allAddonGroups || [],
      allAddons: allAddons || [],
      pricing: pricing || [],
      variantGroups: variantGroupList || [],
      variants: variantList || [],
      selectedCategory: categoryDetails,
      selectedSubCategory: subCategoryDetails,
    }),
    [
      action,
      addonGroupList,
      addonList,
      allAddonGroups,
      allAddons,
      categoryDetails,
      defaultValue,
      onSave,
      pricing,
      productId,
      subCategoryDetails,
      variantGroupList,
      variantList,
    ],
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Item Details"
      size="lg"
      subTitle="Enter details of item and save form to see results"
    >
      {isLoading && <Spinner />}
      {!isLoading && <ProductForm {...formProps} />}
    </Dialog>
  );
};

export default ProductDialog;
