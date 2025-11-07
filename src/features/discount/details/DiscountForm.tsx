import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Select from "@/components/base/Select";
import { toast } from "@/components/compound/Sonner";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import type { StoreResponse } from "@/features/company-management/types/StoreTypes";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { discountApiService } from "@/infrastructure/DiscountApiService";
import { routeConstants } from "@/routes/routeConstants";

export const DiscountUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hideFromSuggestion: z.boolean().default(false),
  active: z.boolean().default(false),
  description: z.string().min(1, "Name is required"),
  couponCode: z.string().min(1, "Name is required"),
  discountAmount: z.number().min(0, "Discount Amount must be positive"),
  maximumAmount: z.number().min(0, "Max amount must be positive"),
  discountAmountType: z.enum(["fix", "percentage"]),
  conditionType: z.enum([
    "allProducts",
    "selectedCategories",
    "selectedProducts",
  ]),
  referenceIds: z.array(z.string().min(1, "Required")),
  storeId: z.string().min(1, "Store is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  customerType: z.enum(["allCustomers", "newCustomers"]),
  discountType: z.enum(["normal", "packaging", "deliveryCharges"]),
});

export type DiscountFormFields = z.infer<typeof DiscountUpdateSchema>;

type DiscountAction = "create" | "edit";

type FormProps = {
  defaultValue: DiscountFormFields;
  action: DiscountAction;
  id: string;
  selectedStoreInfo?: StoreResponse;
};

const discountAmountTypeOptions = [
  { label: "Fixed Amount", value: "fix" },
  { label: "Percentage", value: "percentage" },
];

const conditionTypeOptions = [
  { label: "All Products", value: "allProducts" },
  { label: "Selected Categories", value: "selectedCategories" },
  { label: "Selected Products", value: "selectedProducts" },
];

const customerTypeOptions = [
  { label: "All Customers", value: "allCustomers" },
  { label: "New Customers", value: "newCustomers" },
];

const discountTypeOptions = [
  { label: "Normal", value: "normal" },
  { label: "Packaging", value: "packaging" },
  { label: "Delivery Charges", value: "deliveryCharges" },
];

const DiscountForm: FC<FormProps> = (props) => {
  const { defaultValue, action, id, selectedStoreInfo } = props;
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DiscountFormFields>({
    resolver: zodResolver(DiscountUpdateSchema) as any,
    defaultValues: defaultValue,
  });

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();
  const canGoBack = useCanGoBack();
  const nav = useNavigate();

  const onSubmit = useCallback<SubmitHandler<DiscountFormFields>>(
    async (props) => {
      startSaving();
      const apiCall =
        action === "edit"
          ? discountApiService.updateDiscount(props as any, id)
          : discountApiService.createDiscount(props as any);
      const { success, errorMessage } = await apiCall;
      if (success) {
        if (canGoBack) {
          nav(-1);
        } else {
          nav(routeConstants.discounts);
        }
        toast.success("Discount saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [action, canGoBack, id, nav, startSaving, stopSaving],
  );

  const conditionType = watch("conditionType");

  return (
    <>
      <form
        id="discount-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* Basic Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Discount Information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Discount Name"
              placeholder="Enter discount name"
              required
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Coupon Code"
              placeholder="Enter coupon code (e.g., SAVE20)"
              required
              {...register("couponCode")}
              error={errors.couponCode?.message}
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                placeholder="Enter discount description"
                required
                {...register("description")}
                error={errors.description?.message}
              />
            </div>
            <Controller
              name="storeId"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <StoreDropdown
                    onChange={onChange}
                    storeId={value}
                    error={errors?.storeId?.message}
                    intStore={selectedStoreInfo}
                    label="Store"
                    allowAll
                    variant="default"
                  />
                );
              }}
            />
            <Controller
              name="discountType"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Discount Type"
                    options={discountTypeOptions}
                    value={discountTypeOptions.find((e) => e.value == value)}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder="Select discount type"
                    error={errors.discountType?.message}
                  />
                );
              }}
            />
          </div>
        </div>

        {/* Discount Amount Settings */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Discount Amount</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Controller
              name="discountAmountType"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Amount Type"
                    options={discountAmountTypeOptions}
                    value={discountAmountTypeOptions.find(
                      (e) => e.value == value,
                    )}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder="Select amount type"
                    error={errors.discountAmountType?.message}
                  />
                );
              }}
            />
            <Input
              label="Discount Amount"
              placeholder="Enter amount"
              type="number"
              step="0.01"
              required
              {...register("discountAmount", { valueAsNumber: true })}
              error={errors.discountAmount?.message}
            />
            <Input
              label="Maximum Amount"
              placeholder="Enter max amount"
              type="number"
              step="0.01"
              required
              {...register("maximumAmount", { valueAsNumber: true })}
              error={errors.maximumAmount?.message}
            />
          </div>
        </div>

        {/* Conditions */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Discount Conditions</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="conditionType"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Condition Type"
                    options={conditionTypeOptions}
                    value={conditionTypeOptions.find((e) => e.value == value)}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder="Select condition type"
                    error={errors.conditionType?.message}
                  />
                );
              }}
            />
            <Controller
              name="customerType"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Customer Type"
                    options={customerTypeOptions}
                    value={customerTypeOptions.find((e) => e.value == value)}
                    onChange={(val) => onChange((val as any).value)}
                    placeholder="Select customer type"
                    error={errors.customerType?.message}
                  />
                );
              }}
            />
          </div>
          {conditionType !== "allProducts" && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Note: Reference IDs should be configured based on the selected
                condition type (categories or products)
              </p>
            </div>
          )}
        </div>

        {/* Time Period */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Validity Period</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Start Time"
              placeholder="Select start time"
              type="datetime-local"
              required
              {...register("startTime")}
              error={errors.startTime?.message}
            />
            <Input
              label="End Time"
              placeholder="Select end time"
              type="datetime-local"
              required
              {...register("endTime")}
              error={errors.endTime?.message}
            />
          </div>
        </div>

        {/* Discount Settings */}
        <div className="md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                {...register("active")}
                className="h-4 w-4"
              />
              <label htmlFor="active" className="text-sm">
                Discount is active
              </label>
            </div>
            {errors.active && (
              <p className="mt-1 text-sm text-red-500">
                {errors.active.message}
              </p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hideFromSuggestion"
                {...register("hideFromSuggestion")}
                className="h-4 w-4"
              />
              <label htmlFor="hideFromSuggestion" className="text-sm">
                Hide from suggestions
              </label>
            </div>
            {errors.hideFromSuggestion && (
              <p className="mt-1 text-sm text-red-500">
                {errors.hideFromSuggestion.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-full flex w-full items-center justify-end gap-4">
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
            Save Discount
          </Button>
        </div>
      </form>
    </>
  );
};

export default DiscountForm;
