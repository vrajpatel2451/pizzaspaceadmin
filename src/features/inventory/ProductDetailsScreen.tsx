import { Button } from "@/components/base/Button";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import { toast } from "@/components/compound/Sonner";
import Spinner from "@/components/compound/spinner/Spinner";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { productApiService } from "@/infrastructure/ProductApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { ProductAddEditData } from "@/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AddonUtils } from "./addons/AddonUtils";
import {
  useFetchAddonList,
  useFetchCategoryDetails,
  useFetchSubCategoryDetails,
} from "./hooks";
import { useFetchProductDetails } from "./hooks/uaeFetchProductDetails";
import { VariantUtils } from "./variants/VariantUtils";
import {
  useAddonTransformHook,
  type AddonTransformHookProps,
} from "./addons/useAddonTransformHook";
import {
  useVariantTransformHook,
  type VariantTransformHookProps,
} from "./variants/useVariantTransformHook";
import {
  ProductWizardProvider,
  useProductWizard,
} from "./components/ProductWizardContext";
import ProductWizardStepper from "./components/ProductWizardStepper";
import {
  BasicInfoStep,
  ServingInfoStep,
  PricingStep,
  VariantsStep,
  AddonsStep,
  AdditionalDetailsStep,
  NutritionalInfoStep,
} from "./components/steps";
import {
  ProductSchema,
  type ProductFormFields,
  type ProductAction,
} from "./components/ProductForm";

type Params = {
  action: string;
  productId: string;
};

const ProductDetailsScreen = () => {
  const { productId, action } = useParams<Params>();
  const [searchParams] = useSearchParams();

  // Get category/subcategory from URL params (for create mode)
  const categoryIdParam = searchParams.get("categoryId") || "";
  const subCategoryIdParam = searchParams.get("subCategoryId") || "";

  const productAction = (action === "edit" ? "edit" : "create") as ProductAction;
  const isEditMode =
    productAction === "edit" && productId && productId !== "new";

  // Fetch product details (edit mode only)
  const { data, isFetching, refetch, setData } = useFetchProductDetails(
    productId,
    true // disableAutoFetch
  );

  const {
    product,
    addonGroupList,
    addonList,
    pricing,
    variantGroupList,
    variantList,
  } = data || {};

  // Fetch all addons - memoize params to prevent infinite re-fetch loop
  const addonListParams = useMemo(() => ({}), []);
  const { data: allAddonResponse, isFetching: isAddonFetching } =
    useFetchAddonList(addonListParams);
  const { addonGroups: allAddonGroups, addons: allAddons } =
    allAddonResponse || {};

  // Fetch category details
  const categoryId = product?.category || categoryIdParam;
  const subCategoryId = product?.subCategory || subCategoryIdParam;

  const { data: categoryDetails, isFetching: isCategoryFetching } =
    useFetchCategoryDetails(categoryId);
  const { data: subCategoryDetails, isFetching: isSubCategoryFetching } =
    useFetchSubCategoryDetails(subCategoryId);

  // Fetch on edit mode
  useEffect(() => {
    if (isEditMode) {
      refetch();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [isEditMode, refetch, setData]);

  // Transform props for hooks
  const vtProps = useMemo<VariantTransformHookProps>(
    () => ({
      pricing: pricing || [],
      variantGroups: variantGroupList || [],
      variants: variantList || [],
      productId: productId,
    }),
    [pricing, variantGroupList, variantList, productId]
  );

  const atProps = useMemo<AddonTransformHookProps>(
    () => ({
      addonGroups: allAddonGroups || [],
      addons: allAddons || [],
      pricing: pricing || [],
      productId: productId,
      productAddonGroupIds: addonGroupList?.map((e) => e._id) || [],
      productAddonIds: addonList?.map((e) => e._id) || [],
    }),
    [
      addonGroupList,
      addonList,
      allAddonGroups,
      allAddons,
      pricing,
      productId,
    ]
  );

  // Get transformed data
  const { defaultVariantFormData, pricingFormData: defaultPricingData } =
    useVariantTransformHook(vtProps);
  const {
    defaultAddonFormData,
    addonPricingFormData: defaultAddonPricingData,
  } = useAddonTransformHook(atProps);

  // Default form values
  const defaultValue = useMemo<ProductFormFields>(
    () =>
      product && isEditMode
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
          }
        : {
            basePrice: 0,
            carbs: 0,
            category: categoryIdParam,
            description: "",
            dishSize: {
              count: 1,
              unit: "piece",
            },
            fats: 0,
            fiber: 0,
            name: "",
            noOfPeople: 1,
            packagingCharges: 0,
            photoList: [],
            protein: 0,
            type: "veg",
            weight: 0,
            allergicInfo: [],
            frosting: "",
            ingredientList: [],
            spiceLevel: [],
            subCategory: subCategoryIdParam,
            tags: [],
            variantGroups: [],
          },
    [product, isEditMode, categoryIdParam, subCategoryIdParam]
  );

  // Initialize form
  const form = useForm<ProductFormFields>({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultValue,
  });

  // Reset form when default values change
  useEffect(() => {
    form.reset(defaultValue);
  }, [defaultValue, form]);

  // Loading state
  const isLoading =
    isFetching || isAddonFetching || isCategoryFetching || isSubCategoryFetching;

  // Breadcrumbs
  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => [
      {
        label: "Dashboard",
        to: routeConstants.dashboard,
      },
      {
        label: "Menu & Products",
        to: routeConstants.menuAndProducts,
      },
      {
        label: isEditMode ? (product?.name || "Edit Product") : "Create Product",
        to: routeConstants.productDetails
          .replace(":action", productAction)
          .replace(":productId", productId || "new"),
      },
    ],
    [isEditMode, product?.name, productAction, productId]
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ProductWizardProvider
      form={form}
      action={productAction}
      productId={productId}
      allAddonGroups={allAddonGroups || []}
      allAddons={allAddons || []}
      productAddonGroups={addonGroupList || []}
      productAddons={addonList || []}
      variantGroups={variantGroupList || []}
      variants={variantList || []}
      pricing={pricing || []}
      selectedCategory={categoryDetails}
      selectedSubCategory={subCategoryDetails}
      initialVariantFormData={defaultVariantFormData}
      initialPricingFormData={defaultPricingData}
      initialAddonFormData={defaultAddonFormData}
      initialAddonPricingFormData={defaultAddonPricingData}
    >
      <ProductWizardContent
        productId={productId}
        productAction={productAction}
        breadcrumbs={breadcrumbs}
      />
    </ProductWizardProvider>
  );
};

interface ProductWizardContentProps {
  productId?: string;
  productAction: ProductAction;
  breadcrumbs: BreadcrumbItem[];
}

const ProductWizardContent = ({
  productId,
  productAction,
  breadcrumbs,
}: ProductWizardContentProps) => {
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();
  const {
    form,
    currentStep,
    variantFormData,
    pricingFormData,
    addonFormData,
    addonPricingFormData,
    deletedVariantIds,
    deletedVariantGroupIds,
    isSaving,
    setIsSaving,
  } = useProductWizard();

  const handleSave = useCallback(async () => {
    // Validate form
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);

    try {
      const formData = form.getValues();

      // Get variant data
      const modifiedVariantResponse = VariantUtils.getModifiedDataFromFormData(
        variantFormData,
        pricingFormData,
        deletedVariantIds,
        deletedVariantGroupIds,
        productId
      );

      // Get addon pricing data
      const modifiedAddonResponse = AddonUtils.getModifiedDataFromFormData(
        addonFormData,
        addonPricingFormData,
        productId
      );

      // Merge variant pricing (non-addon types) with addon pricing
      const variantOnlyPricing = modifiedVariantResponse.pricing.filter(
        (p) => p.type === "variant"
      );
      const mergedPricing = [
        ...variantOnlyPricing,
        ...modifiedAddonResponse.pricing,
      ];

      const modifiedProductData = {
        ...formData,
        addons: modifiedAddonResponse.addonIds,
        addonGroups: modifiedAddonResponse.addonGroupIds,
      };

      const addEditData: ProductAddEditData = {
        pricing: mergedPricing,
        product: modifiedProductData as any,
        variantGroups: modifiedVariantResponse.variantGroups,
        variants: modifiedVariantResponse.variants,
        deletedGroupIds: modifiedVariantResponse.deletedVariantGroupIds,
        deletedIds: modifiedVariantResponse.deletedVariantIds,
      };

      const apiCall =
        productAction === "edit"
          ? productApiService.updateProduct(addEditData, productId!)
          : productApiService.createProduct(addEditData);

      const { success, errorMessage } = await apiCall;

      if (success) {
        toast.success(
          productAction === "edit"
            ? "Product updated successfully"
            : "Product created successfully"
        );
        if (canGoBack) {
          navigate(-1);
        } else {
          navigate(routeConstants.menuAndProducts);
        }
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the product");
    }

    setIsSaving(false);
  }, [
    form,
    variantFormData,
    pricingFormData,
    addonFormData,
    addonPricingFormData,
    deletedVariantIds,
    deletedVariantGroupIds,
    productId,
    productAction,
    canGoBack,
    navigate,
    setIsSaving,
  ]);

  const handleReset = useCallback(() => {
    form.reset();
  }, [form]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <ServingInfoStep />;
      case 3:
        return <PricingStep />;
      case 4:
        return <VariantsStep />;
      case 5:
        return <AddonsStep />;
      case 6:
        return <AdditionalDetailsStep />;
      case 7:
        return <NutritionalInfoStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  const { formState: { isSubmitting } } = form;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header with Breadcrumbs and Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="flex items-center gap-3">
          <Button
            startIcon={<RefreshCcw size={16} />}
            variant="outline"
            color="neutral"
            onClick={handleReset}
            type="button"
            size="sm"
          >
            Discard
          </Button>
          <Button
            startIcon={<Save size={16} className="text-white" />}
            type="button"
            onClick={handleSave}
            isLoading={isSubmitting || isSaving}
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Stepper */}
        <ProductWizardStepper />

        {/* Right Content - Step Form */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-800">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsScreen;
