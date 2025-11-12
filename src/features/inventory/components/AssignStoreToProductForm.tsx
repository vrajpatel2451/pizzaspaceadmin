import { Button } from "@/components/base/Button";
import StoreMultiSelectDropdown from "@/features/company-management/components/StoreMultiSelectDropdown";
import { productApiService } from "@/infrastructure/ProductApiService";
import { useToggle } from "@/hooks/useToggle";
import type { ProductResponse } from "@/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { StoreResponse } from "@/features/company-management/types/StoreTypes";

// Zod Schema
const AssignStoreSchema = z.object({
  storeIds: z.array(z.string()).min(1, "Please select at least one store"),
});

type AssignStoreFormFields = z.infer<typeof AssignStoreSchema>;

type Props = {
  product: ProductResponse;
  initialStores?: StoreResponse[];
  onSubmitSuccess: (product: ProductResponse) => void;
};

const AssignStoreToProductForm: FC<Props> = (props) => {
  const { product, initialStores, onSubmitSuccess } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignStoreFormFields>({
    resolver: zodResolver(AssignStoreSchema),
    defaultValues: {
      storeIds: product.storeIds || [],
    },
  });

  const { isOpen: isSaving, open: startSaving, close: stopSaving } = useToggle();

  const onSubmit = useCallback<SubmitHandler<AssignStoreFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } =
        await productApiService.assignStoreToProduct(
          product._id,
          formData.storeIds,
        );

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Stores assigned successfully");
      } else {
        toast.error(errorMessage || "Failed to assign stores");
      }
      stopSaving();
    },
    [product._id, onSubmitSuccess, startSaving, stopSaving],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Controller
        name="storeIds"
        control={control}
        render={({ field }) => (
          <StoreMultiSelectDropdown
            storeIds={field.value}
            onChange={field.onChange}
            error={errors.storeIds?.message}
            label="Select Stores"
            initialStores={initialStores}
          />
        )}
      />

      <div className="flex w-full items-center justify-end gap-4">
        <Button type="submit" isLoading={isSubmitting || isSaving}>
          Assign Stores
        </Button>
      </div>
    </form>
  );
};

export default AssignStoreToProductForm;
