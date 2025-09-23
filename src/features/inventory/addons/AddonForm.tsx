import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { addonApiService } from "@/infrastructure/AddonApiService";
import type {
  AddAddonBulkGetParams,
  AddonWriteApiResponse,
  EditAddonBulkGetParams,
} from "@/types/addon.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { useCallback, useState, type FC } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { v4 } from "uuid";
import z from "zod";

const AddonSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(100, "Label must be less than 100 characters"),
  price: z.number().min(1, "Price is required"),
  _id: z.string().optional(),
  groupId: z.string().optional(),
  uiKey: z.string().optional(),
  storeIds: z.array(z.string()).optional(),
});

export const AddonGroupSchema = z
  .object({
    storeIds: z.array(z.string()).optional(),
    label: z
      .string()
      .trim()
      .min(1, "Label is required")
      .max(100, "Label must be less than 100 characters"),
    description: z
      .string()
      .trim()
      .max(500, "Description must be less than 500 characters"),
    allowMulti: z.boolean(),
    min: z.number().int().min(0, "Min must be 0 or greater"),
    max: z.number().int().min(1, "Max must be 1 or greater"),

    // Addons
    addons: z.array(AddonSchema).min(1, "At least one addon is required"),
  })
  .refine(
    (data) => {
      // Cross-field validation
      if (!data.allowMulti) {
        if (data.max > 1) return false;
        if (data.min > 1) return false;
      }
      if (data.min > data.max) return false;
      return true;
    },
    {
      message:
        "Invalid min/max configuration. When allowMulti is false, max must be 1 and min must be 0 or 1. Min cannot be greater than max.",
      path: ["min"], // This will show the error on the min field
    },
  );

export type AddonFormFields = z.infer<typeof AddonGroupSchema>;

export type AddonAction = "edit" | "create";

type Props = {
  defaultValue: AddonFormFields;
  action: AddonAction;
  id?: string;
  onSubmitSuccess: (response: AddonWriteApiResponse) => void;
};

const AddonForm: FC<Props> = (props) => {
  const { defaultValue, action, id: groupId, onSubmitSuccess } = props;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddonFormFields>({
    resolver: zodResolver(AddonGroupSchema),
    defaultValues: defaultValue,
  });

  const {
    fields: addonFields,
    append: addAddon,
    remove: removeAddon,
  } = useFieldArray({
    control,
    name: "addons",
  });

  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const watchedAllowMulti = watch("allowMulti");
  const watchedMin = watch("min");
  const watchedMax = watch("max");

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<AddonFormFields>>(
    async (formData) => {
      startSaving();
      try {
        const editData: EditAddonBulkGetParams = {
          addonGroup: {
            _id: groupId,
            allowMulti: formData.allowMulti,
            description: formData.description,
            label: formData.label,
            max: formData.max,
            min: formData.min,
            storeIds: formData.storeIds,
          },
          addons: formData.addons.map((addon) => ({
            groupId,
            label: addon.label,
            price: addon.price,
            storeIds: addon.storeIds,
            _id: addon._id || undefined,
          })),
          deletedIds,
        };
        const createData: AddAddonBulkGetParams = {
          addonGroup: {
            allowMulti: formData.allowMulti,
            description: formData.description,
            label: formData.label,
            max: formData.max,
            min: formData.min,
          },
          addons: formData.addons.map((addon) => ({
            label: addon.label,
            price: addon.price,
          })),
        };
        const apiCall =
          action === "edit"
            ? addonApiService.editAddon(editData)
            : addonApiService.createAddon(createData);

        const { success, errorMessage, data } = await apiCall;

        if (success) {
          onSubmitSuccess(data);
          toast.success("Addon group saved successfully");
        } else {
          toast.error(errorMessage);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while saving the addon group");
      }
      stopSaving();
    },
    [action, deletedIds, groupId, onSubmitSuccess, startSaving, stopSaving],
  );

  const handleAddAddon = useCallback(() => {
    addAddon({
      label: "",
      price: 0,
      groupId,
      storeIds: defaultValue?.storeIds,
      uiKey: v4(),
    });
  }, [addAddon, defaultValue, groupId]);

  const handleRemoveAddon = useCallback(
    (index: number) => {
      if (addonFields.length > 1) {
        const id = addonFields[index]?._id;
        if (id) {
          setDeletedIds((prev) => [...prev, id]);
        }
        removeAddon(index);
      }
    },
    [addonFields, removeAddon],
  );

  // Handle allowMulti changes
  const handleAllowMultiChange = (allowMulti: boolean) => {
    setValue("allowMulti", allowMulti);
    if (!allowMulti) {
      // When single selection, max should be 1 and min should be 0 or 1
      if (watchedMax > 1) setValue("max", 1);
      if (watchedMin > 1) setValue("min", 1);
    }
  };

  return (
    <form
      className="flex max-h-[80vh] w-full flex-col gap-6 overflow-auto"
      id="addon-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Group Details */}
      <Container title="Group Details">
        <div className="space-y-4">
          <Input
            label="Group Label"
            placeholder="e.g., Extra Toppings, Beverages"
            required
            fullWidth
            {...register("label")}
            error={errors.label?.message}
          />
          <Input
            label="Group Description"
            placeholder="e.g., Extra Toppings, Beverages"
            required
            fullWidth
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
      </Container>

      {/* Selection Rules */}
      <Container
        title="Selection Rules"
        subtitle="Define how customers can select from this group"
      >
        <div className="space-y-4">
          <div>
            <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
              Selection Type
            </label>
            <Controller
              name="allowMulti"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(false);
                      handleAllowMultiChange(false);
                    }}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      field.value === false
                        ? "border-pl-500 bg-pl-50 text-pl-700 dark:bg-pd-900 dark:border-pd-400"
                        : "border-nl-200 hover:bg-nl-50 dark:border-nd-500 dark:bg-nd-700 bg-white"
                    }`}
                  >
                    Single Selection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(true);
                      handleAllowMultiChange(true);
                    }}
                    className={`rounded-lg border px-4 py-2 transition-all ${
                      field.value === true
                        ? "border-pl-500 bg-pl-50 text-pl-700 dark:bg-pd-900 dark:border-pd-400"
                        : "border-nl-200 hover:bg-nl-50 dark:border-nd-500 dark:bg-nd-700 bg-white"
                    }`}
                  >
                    Multiple Selection
                  </button>
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Minimum Required"
                type="number"
                min="0"
                max={watchedAllowMulti ? "10" : "1"}
                placeholder="0"
                {...register("min", { valueAsNumber: true })}
                error={errors.min?.message}
              />
              <p className="text-nl-500 dark:text-nd-400 mt-1 text-xs">
                {watchedAllowMulti
                  ? "Minimum items customer must select (0 means optional)"
                  : "0 = optional, 1 = required"}
              </p>
            </div>

            <div>
              <Input
                label="Maximum Allowed"
                type="number"
                min="1"
                max={watchedAllowMulti ? "10" : "1"}
                placeholder="1"
                {...register("max", { valueAsNumber: true })}
                error={errors.max?.message}
              />
              <p className="text-nl-500 dark:text-nd-400 mt-1 text-xs">
                {watchedAllowMulti
                  ? "Maximum items customer can select"
                  : "Must be 1 for single selection"}
              </p>
            </div>
          </div>

          {errors.root && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.root.message}
            </p>
          )}
        </div>
      </Container>

      {/* Addon Items */}
      <Container
        title="Addon Items"
        subtitle="Add individual items for this group"
      >
        <div className="space-y-4">
          {addonFields.map((addon, index) => (
            <div
              key={addon.uiKey}
              className="border-nl-200 dark:border-nd-500 rounded-lg border p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-nl-800 dark:text-nd-200 font-medium">
                  Addon Item {index + 1}
                </h4>
                {addonFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAddon(index)}
                    startIcon={<Trash2 size={16} />}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Item Label"
                  placeholder="e.g., Extra Cheese, Coke"
                  {...register(`addons.${index}.label`)}
                  error={errors.addons?.[index]?.label?.message}
                />

                <Input
                  label="Price"
                  placeholder="e.g., 25.00, 50"
                  {...register(`addons.${index}.price`)}
                  error={errors.addons?.[index]?.price?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddAddon}
            startIcon={<Plus size={16} />}
          >
            Add Addon Item
          </Button>

          {errors.addons && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.addons.message}
            </p>
          )}
        </div>
      </Container>

      {/* Preview Section */}
      <Container title="Preview" subtitle="How this will appear to customers">
        <div className="bg-nl-50 dark:bg-nd-600 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-nl-800 dark:text-nd-100 font-medium">
                  {watch("label") || "Group Label"}
                </h4>
                <p className="text-nl-600 dark:text-nd-300 text-sm">
                  {watch("description") || "Group description"}
                </p>
              </div>
              <span className="dark:bg-nd-700 rounded bg-white px-2 py-1 text-xs">
                {watchedAllowMulti ? "Multi-select" : "Single-select"}
              </span>
            </div>

            <div className="text-nl-500 dark:text-nd-400 text-xs">
              {watchedMin === 0 ? "Optional" : `Min: ${watchedMin}`}
              {watchedMax !== watchedMin && ` • Max: ${watchedMax}`}
            </div>

            <div className="mt-3 space-y-1">
              {addonFields.map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {watch(`addons.${index}.label`) ||
                      `Addon Item ${index + 1}`}
                  </span>
                  <span className="font-medium">
                    +₹{watch(`addons.${index}.price`) || "0"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

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
          Save Addon Group
        </Button>
      </div>
    </form>
  );
};

export default AddonForm;
