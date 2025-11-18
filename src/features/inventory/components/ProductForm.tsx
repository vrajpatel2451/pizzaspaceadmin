import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Select, type SelectOption } from "@/components/base/Select";
import Container from "@/components/compound/Container";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { productApiService } from "@/infrastructure/ProductApiService";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type {
  CategoryResponse,
  SubCategoryResponse,
} from "@/types/category.types";
import type { FileResponse } from "@/types/file.types";
import type {
  ProductAddEditData,
  ProductResponse,
  SpiceLevel,
} from "@/types/product.types";
import type { VariantPricingResponse } from "@/types/variantPricing.types";
import type {
  VariantGroupResponse,
  VariantResponse,
} from "@/types/variants.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, RefreshCcw, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import z from "zod";
import CategoryDropdown from "../CategoryDropdown";
import SubCategoryDropdown from "../SubCategoryDropdown";
import {
  useVariantTransformHook,
  type VariantTransformHookProps,
} from "../variants/useVariantTransformHook";
import VariantDialog from "../variants/VariantDialog";
import type {
  VariantFormData,
  VariantPricingData,
} from "../variants/VariantStepperForm";
import { VariantUtils } from "../variants/VariantUtils";
import AddonDialog from "../addons/AddonDialog";
import type {
  AddonFormData,
  AddonPricingData,
} from "../addons/AddonStepperForm";
import {
  useAddonTransformHook,
  type AddonTransformHookProps,
} from "../addons/useAddonTransformHook";
import { AddonUtils } from "../addons/AddonUtils";

const IngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  count: z.number().min(0, "Count must be positive"),
});

export const ProductSchema = z.object({
  // Basic Info
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["veg", "non_veg", "vegan"]),
  photoList: z.array(z.string()).min(1, "At least one photo is required"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),

  // Serving Info
  noOfPeople: z.number().min(1, "Number of people must be at least 1"),
  dishSize: z.object({
    count: z.number().min(0.1, "Count must be greater than 0"),
    unit: z.enum([
      // Piece based
      "piece",
      "pieces",
      "slice",
      "slices",
      "pack",
      "bucket",
      "platter",
      // Weight based
      "gram",
      "kilograms",
      "mg",
      "pound",
      "ounce",
      // Volume based
      "ml",
      "liter",
      "cup",
      "pint",
      "quart",
      "gallon",
      // Count based
      "dozen",
      "half_dozen",
    ]),
  }),

  // Pricing
  basePrice: z.number().min(0, "Base price must be positive"),
  packagingCharges: z.number().min(0, "Packaging charges must be positive"),

  // Variants (will be created separately)
  variantGroups: z.array(z.string()).optional(),

  // Additional Info
  tags: z.array(z.string()).optional(),
  spiceLevel: z.array(z.enum(["0_chilli", "1_chilli", "2_chilli"])).optional(),
  frosting: z.string().optional(),

  // Nutritional Info
  weight: z.number().min(0, "Weight must be positive"),
  protein: z.number().min(0, "Protein must be positive"),
  carbs: z.number().min(0, "Carbs must be positive"),
  fats: z.number().min(0, "Fats must be positive"),
  fiber: z.number().min(0, "Fiber must be positive"),

  // Allergen Info
  allergicInfo: z.array(z.string()).optional(),
  ingredientList: z.array(IngredientSchema).optional(),
});

export type ProductFormFields = z.infer<typeof ProductSchema>;

export type ProductAction = "edit" | "create";

export type ProductFormProps = {
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  allAddonGroups: AddonGroupResponse[];
  allAddons: AddonResponse[];
  pricing: VariantPricingResponse[];
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
  defaultValue: ProductFormFields;
  action: ProductAction;
  id?: string;
  onSubmitSuccess: (product: ProductResponse) => void;
  selectedCategory?: CategoryResponse;
  selectedSubCategory?: SubCategoryResponse;
};

const ProductForm: FC<ProductFormProps> = (props) => {
  const {
    defaultValue,
    action,
    id,
    onSubmitSuccess,
    selectedCategory,
    selectedSubCategory,
    addonGroups,
    addons,
    allAddonGroups,
    allAddons,
    pricing,
    variantGroups,
    variants,
  } = props;

  //   const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormFields>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      type: "veg",
      photoList: [],
      category: "",
      subCategory: "",
      noOfPeople: 1,
      dishSize: { count: 1, unit: "piece" },
      basePrice: 0,
      packagingCharges: 0,
      tags: [],
      spiceLevel: [],
      allergicInfo: [],
      ingredientList: [],
      variantGroups: [],
      ...defaultValue,
    },
  });

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredientList",
  });

  const vtProps = useMemo<VariantTransformHookProps>(
    () => ({
      pricing: pricing,
      variantGroups: variantGroups,
      variants: variants,
      productId: id,
    }),
    [id, pricing, variantGroups, variants],
  );
  const atProps = useMemo<AddonTransformHookProps>(
    () => ({
      addonGroups: allAddonGroups,
      addons: allAddons,
      pricing: pricing,
      // variantFormData: variantFormData,
      productId: id,
      productAddonGroupIds: addonGroups?.map((e) => e._id) || [],
      productAddonIds: addons?.map((e) => e._id) || [],
    }),
    [addonGroups, addons, allAddonGroups, allAddons, id, pricing],
  );
  const [variantFormData, setVariantFormData] = useState<VariantFormData>(null);
  const [pricingFormData, setPricingFormData] = useState<VariantPricingData[]>(
    [],
  );
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
  const [deletedVariantGroupIds, setDeletedVariantGroupIds] = useState<
    string[]
  >([]);
  const { defaultVariantFormData, pricingFormData: defaultPricingData } =
    useVariantTransformHook(vtProps);

  // Addon state
  const [addonFormData, setAddonFormData] = useState<AddonFormData>(null);
  const [addonPricingFormData, setAddonPricingFormData] = useState<
    AddonPricingData[]
  >([]);
  const {
    defaultAddonFormData,
    addonPricingFormData: defaultAddonPricingData,
  } = useAddonTransformHook(atProps);
  const {
    close: closeVariantForm,
    isOpen: isVariantFormOpen,
    open: openVariantForm,
  } = useToggle();
  const {
    close: closeAddonForm,
    isOpen: isAddonFormOpen,
    open: openAddonForm,
  } = useToggle();

  const onSubmitVariant = useCallback(
    (
      variantData: VariantFormData,
      pricingData: VariantPricingData[],
      deletedVariantIds: string[],
      deletedVariantGroupIds: string[],
    ) => {
      setVariantFormData(variantData);
      setPricingFormData(pricingData);
      setDeletedVariantGroupIds(deletedVariantGroupIds);
      setDeletedVariantIds(deletedVariantIds);
    },
    [],
  );

  const onSubmitAddon = useCallback(
    (addonData: AddonFormData, pricingData: AddonPricingData[]) => {
      setAddonFormData(addonData);
      setAddonPricingFormData(pricingData);
    },
    [],
  );
  const { mAddonGroups, mAddons } = useMemo(() => {
    const vals = getValues();
    console.log(addonGroups, addons, vals);
    return {
      mAddons: allAddons,
      mAddonGroups: allAddonGroups,
    };
  }, [addonGroups, addons, allAddonGroups, allAddons, getValues]);
  useEffect(() => {
    setVariantFormData(defaultVariantFormData);
    setPricingFormData(defaultPricingData);
  }, [defaultPricingData, defaultVariantFormData]);

  useEffect(() => {
    setAddonFormData(defaultAddonFormData);
    setAddonPricingFormData(defaultAddonPricingData);
  }, [defaultAddonFormData, defaultAddonPricingData]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();
  const {
    close: closeMediaPicker,
    isOpen: isMediaPickerOpen,
    open: openMediaPicker,
  } = useToggle();

  const watchedPhotos = watch("photoList");
  const watchedTags = watch("tags");
  const watchedAllergens = watch("allergicInfo");

  const productTypeOptions = [
    { value: "veg", label: "Vegetarian", color: "text-green-600" },
    { value: "non_veg", label: "Non Vegetarian", color: "text-red-600" },
    { value: "vegan", label: "Vegan", color: "text-blue-600" },
  ];

  const dishSizeUnitOptions: SelectOption[] = [
    // Piece based
    { value: "piece", label: "Piece" },
    { value: "pieces", label: "Pieces" },
    { value: "slice", label: "Slice" },
    { value: "slices", label: "Slices" },
    { value: "pack", label: "Pack" },
    { value: "bucket", label: "Bucket" },
    { value: "platter", label: "Platter" },
    // Weight based
    { value: "gram", label: "Gram" },
    { value: "kilograms", label: "Kilograms" },
    { value: "mg", label: "Milligram" },
    { value: "pound", label: "Pound" },
    { value: "ounce", label: "Ounce" },
    // Volume based
    { value: "ml", label: "Milliliter" },
    { value: "liter", label: "Liter" },
    { value: "cup", label: "Cup" },
    { value: "pint", label: "Pint" },
    { value: "quart", label: "Quart" },
    { value: "gallon", label: "Gallon" },
    // Count based
    { value: "dozen", label: "Dozen" },
    { value: "half_dozen", label: "Half Dozen" },
  ];

  const spiceLevelOptions = [
    { value: "0_chilli", label: "No Spice" },
    { value: "1_chilli", label: "Mild Spice" },
    { value: "2_chilli", label: "Hot Spice" },
  ];

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<ProductFormFields>>(
    async (formData) => {
      startSaving();
      try {
        // Get variant data
        const modifiedVariantResponse =
          VariantUtils.getModifiedDataFromFormData(
            variantFormData,
            pricingFormData,
            deletedVariantIds,
            deletedVariantGroupIds,
            id,
          );

        // Get addon pricing data
        const modifiedAddonResponse = AddonUtils.getModifiedDataFromFormData(
          addonFormData,
          addonPricingFormData,
          id,
        );

        // Merge variant pricing (non-addon types) with addon pricing
        const variantOnlyPricing = modifiedVariantResponse.pricing.filter(
          (p) => p.type === "variant",
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
          action === "edit"
            ? productApiService.updateProduct(addEditData, id)
            : productApiService.createProduct(addEditData);

        const { success, errorMessage, data } = await apiCall;

        if (success) {
          onSubmitSuccess(data);
          toast.success("Product saved successfully");
        } else {
          toast.error(errorMessage);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while saving the product");
      }
      stopSaving();
    },
    [
      action,
      addonFormData,
      addonPricingFormData,
      deletedVariantGroupIds,
      deletedVariantIds,
      id,
      onSubmitSuccess,
      pricingFormData,
      startSaving,
      stopSaving,
      variantFormData,
    ],
  );

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrls = Array.isArray(media)
      ? media.map((m) => m.path)
      : [media.path];
    const currentPhotos = watchedPhotos || [];
    setValue("photoList", [...currentPhotos, ...selectedUrls], {
      shouldValidate: true,
      shouldDirty: true,
    });
    closeMediaPicker();
  };

  const handleRemovePhoto = (index: number) => {
    const currentPhotos = watchedPhotos || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    setValue("photoList", newPhotos, { shouldValidate: true });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !watchedTags?.includes(newTag.trim())) {
      setValue("tags", [...(watchedTags || []), newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", watchedTags?.filter((tag) => tag !== tagToRemove) || []);
  };

  const handleAddAllergen = () => {
    if (newAllergen.trim() && !watchedAllergens?.includes(newAllergen.trim())) {
      setValue("allergicInfo", [
        ...(watchedAllergens || []),
        newAllergen.trim(),
      ]);
      setNewAllergen("");
    }
  };

  const handleRemoveAllergen = (allergenToRemove: string) => {
    setValue(
      "allergicInfo",
      watchedAllergens?.filter((allergen) => allergen !== allergenToRemove) ||
        [],
    );
  };

  console.log(errors, getValues(), "Errors here");

  return (
    <>
      {isVariantFormOpen && (
        <VariantDialog
          addonGroups={mAddonGroups}
          addons={mAddons}
          formData={variantFormData}
          isOpen
          onClose={closeVariantForm}
          onSave={onSubmitVariant}
          pricing={pricingFormData}
          productId={id}
        />
      )}
      {isAddonFormOpen && (
        <AddonDialog
          addonGroups={mAddonGroups}
          addons={mAddons}
          formData={addonFormData}
          isOpen
          onClose={closeAddonForm}
          onSave={onSubmitAddon}
          pricing={addonPricingFormData}
          productId={id}
          variantFormData={variantFormData}
        />
      )}
      {isMediaPickerOpen && (
        <MediaPicker
          isOpen
          close={closeMediaPicker}
          multiple={true}
          acceptedFormats={["image/*"]}
          onMediaSelect={handleMediaSelect}
          onError={(error) => {
            console.error("Media picker error:", error);
          }}
        />
      )}

      <form
        className="flex w-full flex-col gap-6"
        id="product-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex max-h-[60vh] w-full flex-col gap-6 overflow-auto">
          {/* Basic Details */}
          <Container title="Basic Details">
            <div className="space-y-4">
              <Input
                label="Item Name"
                placeholder="Enter product name"
                required
                fullWidth
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Item Description"
                placeholder="Enter product description"
                required
                fullWidth
                {...register("description")}
                error={errors.description?.message}
              />

              <div>
                <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
                  Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {productTypeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`rounded-lg border px-4 py-2 transition-all ${
                            field.value === option.value
                              ? "border-pl-500 bg-pl-50 text-pl-700 dark:bg-pd-900 dark:border-pd-400"
                              : "border-nl-200 hover:bg-nl-50 dark:border-nd-500 dark:bg-nd-700 bg-white"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </Container>

          {/* Category Selection */}
          <Container title="Category">
            <div className="space-y-4">
              <Controller
                name="category"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CategoryDropdown
                    categoryId={value}
                    onChange={onChange}
                    error={errors?.category?.message}
                    label="Category"
                    intCategory={selectedCategory}
                  />
                )}
              />

              <Controller
                name="subCategory"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SubCategoryDropdown
                    categoryId={value || ""}
                    onChange={onChange}
                    error={errors?.subCategory?.message}
                    label="Subcategory"
                    intCategory={selectedSubCategory}
                  />
                )}
              />
            </div>
          </Container>

          {/* Item Photos */}
          <Container title="Item Photos">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                {watchedPhotos?.map((photo, index) => (
                  <div key={index} className="relative">
                    <ImageComponent
                      src={photo}
                      alt={`Product photo ${index + 1}`}
                      wrapperClassName="size-24"
                      className="border-nl-200 dark:border-nd-600 size-24 rounded-lg border-2"
                      onRemove={() => handleRemovePhoto(index)}
                    />
                  </div>
                ))}
                <div
                  className="border-nl-300 hover:border-pl-400 flex size-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                  onClick={openMediaPicker}
                >
                  <Plus className="text-nl-400" size={20} />
                </div>
              </div>
              {errors.photoList && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.photoList.message}
                </p>
              )}
            </div>
          </Container>

          {/* Basic Details - Serving Info */}
          <Container
            title="Basic Details"
            subtitle="Set up serving user experience"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="No of people"
                type="number"
                placeholder="1"
                {...register("noOfPeople", { valueAsNumber: true })}
                error={errors.noOfPeople?.message}
              />

              <div>
                <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
                  Dish Size
                </label>
                <Controller
                  name="dishSize"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="1"
                        value={field.value.count}
                        onChange={(e) =>
                          field.onChange({
                            ...field.value,
                            count: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <Select
                        options={dishSizeUnitOptions}
                        value={dishSizeUnitOptions.find(
                          (option) => option.value === field.value.unit,
                        )}
                        onChange={(val) =>
                          field.onChange({
                            ...field.value,
                            unit: (val as SelectOption).value,
                          })
                        }
                        placeholder="Select unit"
                      />
                    </div>
                  )}
                />
                {errors.dishSize && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.dishSize.count?.message ||
                      errors.dishSize.unit?.message}
                  </p>
                )}
              </div>
            </div>
          </Container>

          {/* Item Pricing */}
          <Container
            title="Item Pricing"
            subtitle="Please make sure your online and offline price match"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Selling Price"
                type="number"
                step="0.01"
                placeholder="₹30"
                {...register("basePrice", { valueAsNumber: true })}
                error={errors.basePrice?.message}
              />

              <Input
                label="Packaging Cost"
                type="number"
                step="0.01"
                placeholder="₹5"
                {...register("packagingCharges", { valueAsNumber: true })}
                error={errors.packagingCharges?.message}
              />
            </div>
          </Container>

          {/* Variants */}
          <Container title="Variants">
            <div className="space-y-4">
              <Button onClick={openVariantForm}>Map Variants</Button>

              {/* Variants Summary */}
              {variantFormData?.variantGroups &&
                variantFormData.variantGroups.length > 0 && (
                  <div className="border-nl-200 dark:border-nd-600 rounded-lg border bg-blue-50 p-4 dark:bg-blue-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="font-medium text-blue-800 dark:text-blue-300">
                        {variantFormData.variantGroups.length} Variant Group
                        {variantFormData.variantGroups.length !== 1
                          ? "s"
                          : ""}{" "}
                        Configured
                      </span>
                    </div>

                    <div className="space-y-2">
                      {variantFormData.variantGroups.map((group) => (
                        <div
                          key={group._id}
                          className="dark:bg-nd-800 border-nl-200 dark:border-nd-600 rounded-md border bg-white p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-nl-800 dark:text-nd-100 font-medium">
                              {group.label}
                            </span>
                            {group.isPrimary && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.variants.map((variant) => (
                              <div
                                key={variant._id}
                                className="bg-nl-50 dark:bg-nd-700 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                              >
                                <span className="text-nl-700 dark:text-nd-200 text-xs">
                                  {variant.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </Container>

          {/* Add-ons */}
          <Container title="Add-ons">
            <div className="space-y-4">
              <Button onClick={openAddonForm}>Map Add-ons</Button>

              {/* Add-ons Summary */}
              {addonFormData &&
                addonFormData.some((group) =>
                  group.addons.some((addon) => addon.isSelected),
                ) && (
                  <div className="border-nl-200 dark:border-nd-600 rounded-lg border bg-green-50 p-4 dark:bg-green-900/10">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-green-600 dark:text-green-400"
                      />
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {addonFormData.reduce(
                          (count, group) =>
                            count +
                            group.addons.filter((a) => a.isSelected).length,
                          0,
                        )}{" "}
                        Add-on
                        {addonFormData.reduce(
                          (count, group) =>
                            count +
                            group.addons.filter((a) => a.isSelected).length,
                          0,
                        ) !== 1
                          ? "s"
                          : ""}{" "}
                        Selected
                      </span>
                    </div>

                    <div className="space-y-2">
                      {addonFormData
                        .filter((group) =>
                          group.addons.some((addon) => addon.isSelected),
                        )
                        .map((group) => {
                          const selectedAddons = group.addons.filter(
                            (a) => a.isSelected,
                          );
                          return (
                            <div
                              key={group._id}
                              className="dark:bg-nd-800 border-nl-200 dark:border-nd-600 rounded-md border bg-white p-3"
                            >
                              <div className="mb-2">
                                <span className="text-nl-800 dark:text-nd-100 font-medium">
                                  {group.label}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {selectedAddons.map((addon) => (
                                  <div
                                    key={addon._id}
                                    className="bg-nl-50 dark:bg-nd-700 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                                  >
                                    <span className="text-nl-700 dark:text-nd-200 text-xs">
                                      {addon.label}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
            </div>
          </Container>

          {/* Additional Details */}
          <Container
            title="Additional Details"
            subtitle="Help admins to add better and more info to item"
          >
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
                  Tags
                </label>
                <div className="mb-2 flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchedTags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-pl-100 text-pl-700 dark:bg-pd-900 dark:text-pd-300 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-pl-900 dark:hover:text-pd-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div>
                <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
                  Spice Level
                </label>
                <Controller
                  name="spiceLevel"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {spiceLevelOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            const current = field.value || [];
                            const isSelected = current.includes(
                              option.value as SpiceLevel,
                            );
                            if (isSelected) {
                              field.onChange(
                                current.filter(
                                  (level) => level !== option.value,
                                ),
                              );
                            } else {
                              field.onChange([...current, option.value]);
                            }
                          }}
                          className={`rounded-lg border px-4 py-2 transition-all ${
                            field.value?.includes(option.value as SpiceLevel)
                              ? "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-300"
                              : "border-nl-200 hover:bg-nl-50 dark:border-nd-500 dark:bg-nd-700 bg-white"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Frosting */}
              <Input
                label="Frosting"
                placeholder="Special frosting details"
                {...register("frosting")}
                error={errors.frosting?.message}
              />
            </div>
          </Container>

          {/* Nutritional Info */}
          <Container
            title="Nutritional Info"
            subtitle="Highly demanded from food towards health"
          >
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Weight per serving"
                type="number"
                step="0.1"
                placeholder="100g"
                {...register("weight", { valueAsNumber: true })}
                error={errors.weight?.message}
              />

              <Input
                label="Protein"
                type="number"
                step="0.1"
                placeholder="10g"
                {...register("protein", { valueAsNumber: true })}
                error={errors.protein?.message}
              />

              <Input
                label="Carbs"
                type="number"
                step="0.1"
                placeholder="50g"
                {...register("carbs", { valueAsNumber: true })}
                error={errors.carbs?.message}
              />

              <Input
                label="Fats"
                type="number"
                step="0.1"
                placeholder="5g"
                {...register("fats", { valueAsNumber: true })}
                error={errors.fats?.message}
              />

              <Input
                label="Fiber"
                type="number"
                step="0.1"
                placeholder="2g"
                {...register("fiber", { valueAsNumber: true })}
                error={errors.fiber?.message}
              />
            </div>
          </Container>

          {/* Ingredients */}
          <Container title="Ingredient List">
            <div className="space-y-4">
              {ingredientFields.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-end gap-2">
                  <Input
                    label={index === 0 ? "Ingredient Name" : ""}
                    placeholder="e.g., Flour"
                    {...register(`ingredientList.${index}.name`)}
                    error={errors.ingredientList?.[index]?.name?.message}
                  />
                  <Input
                    label={index === 0 ? "Count (grams)" : ""}
                    type="number"
                    placeholder="100"
                    {...register(`ingredientList.${index}.count`, {
                      valueAsNumber: true,
                    })}
                    error={errors.ingredientList?.[index]?.count?.message}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addIngredient({ name: "", count: 0 })}
                startIcon={<Plus size={16} />}
              >
                Add Ingredient
              </Button>
            </div>
          </Container>

          {/* Allergen Info */}
          <Container
            title="Allergen Info"
            subtitle="Does this item contain any of the?"
          >
            <div>
              <div className="mb-2 flex gap-2">
                <Input
                  placeholder="Add allergen"
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddAllergen())
                  }
                />
                <Button type="button" onClick={handleAddAllergen} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedAllergens?.map((allergen, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  >
                    {allergen}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergen(allergen)}
                      className="hover:text-red-900 dark:hover:text-red-100"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Form Actions */}
        <div className="border-nl-200 dark:border-nd-600 flex w-full items-center justify-end gap-4 border-t pt-4">
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="filled"
            color="neutral"
            onClick={handleReset}
            type="button"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save className="text-white" size={20} />}
            type="submit"
            isLoading={isSubmitting || isSaving}
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;
