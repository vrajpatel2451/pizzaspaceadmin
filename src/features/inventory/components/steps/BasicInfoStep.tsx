import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import type { OrderDeliveryType } from "@/types/cart.types";
import type { FileResponse } from "@/types/file.types";
import { Plus } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller } from "react-hook-form";
import CategoryDropdown from "../../CategoryDropdown";
import SubCategoryDropdown from "../../SubCategoryDropdown";
import { useProductWizard } from "../ProductWizardContext";

const productTypeOptions = [
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-veg" },
  { value: "vegan", label: "Egg" },
];

const deliveryTypeOptions: { value: OrderDeliveryType; label: string }[] = [
  { value: "dineIn", label: "Dine In" },
  { value: "pickup", label: "Collection" },
  { value: "delivery", label: "Delivery" },
];

const BasicInfoStep: FC = () => {
  const {
    form,
    isMediaPickerOpen,
    openMediaPicker,
    closeMediaPicker,
    selectedCategory,
    selectedSubCategory,
  } = useProductWizard();

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchedPhotos = watch("photoList");

  const handleMediaSelect = useCallback(
    (media: FileResponse | FileResponse[]) => {
      const selectedUrls = Array.isArray(media)
        ? media.map((m) => m.path)
        : [media.path];
      const currentPhotos = watchedPhotos || [];
      setValue("photoList", [...currentPhotos, ...selectedUrls], {
        shouldValidate: true,
        shouldDirty: true,
      });
      closeMediaPicker();
    },
    [watchedPhotos, setValue, closeMediaPicker],
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      const currentPhotos = watchedPhotos || [];
      const newPhotos = currentPhotos.filter((_, i) => i !== index);
      setValue("photoList", newPhotos, { shouldValidate: true });
    },
    [watchedPhotos, setValue],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Basic Info
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add general details to describe your product clearly
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* Name */}
        <Input
          label="Name"
          placeholder="Enter product name"
          required
          fullWidth
          {...register("name")}
          error={errors.name?.message}
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Enter product description"
          required
          fullWidth
          {...register("description")}
          error={errors.description?.message}
        />

        {/* Food Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Food type
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
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                      field.value === option.value
                        ? "border-pl-500 bg-pl-50 text-pl-700 dark:bg-pd-900 dark:border-pd-400 dark:text-pd-300"
                        : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        option.value === "veg"
                          ? "bg-green-500"
                          : option.value === "non_veg"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Available Delivery Types */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Available Delivery Types <span className="text-red-500">*</span>
          </label>
          <Controller
            name="availableDeliveryTypes"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {deliveryTypeOptions.map((option) => {
                  const isSelected = field.value?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const current = field.value || [];
                        if (isSelected) {
                          field.onChange(
                            current.filter((type) => type !== option.value),
                          );
                        } else {
                          field.onChange([...current, option.value]);
                        }
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        isSelected
                          ? "border-pl-500 bg-pl-50 text-pl-700 dark:bg-pd-900 dark:border-pd-400 dark:text-pd-300"
                          : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.availableDeliveryTypes && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.availableDeliveryTypes.message}
            </p>
          )}
        </div>

        {/* Combo Product Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Combo Product
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enable to create a combo deal with multiple product selections
            </p>
          </div>
          <Controller
            name="isCombo"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value ?? false}
                setChecked={field.onChange}
              />
            )}
          />
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CategoryDropdown
                categoryId={value}
                onChange={onChange}
                error={errors?.category?.message}
                label="Parent Category"
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
                label="Child Category"
                intCategory={selectedSubCategory}
              />
            )}
          />
        </div>

        {/* Item Photos */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Menu
          </label>
          <div className="flex flex-wrap items-center gap-4">
            {watchedPhotos?.map((photo, index) => (
              <div key={index} className="relative">
                <ImageComponent
                  src={photo}
                  alt={`Product photo ${index + 1}`}
                  wrapperClassName="size-20"
                  className="size-20 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                  onRemove={() => handleRemovePhoto(index)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={openMediaPicker}
              className="hover:border-pl-400 dark:hover:border-pl-500 flex size-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors dark:border-gray-600"
            >
              <Plus className="text-gray-400" size={20} />
            </button>
          </div>
          {errors.photoList && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.photoList.message}
            </p>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
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
    </div>
  );
};

export default BasicInfoStep;
