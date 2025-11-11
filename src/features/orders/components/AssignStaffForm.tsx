import { Button } from "@/components/base/Button";
import StaffDropdown from "@/features/company-management/components/StaffDropdown";
import { orderApiService } from "@/infrastructure/OrderApiService";
import { useToggle } from "@/hooks/useToggle";
import type { AdminTransformedOrder } from "@/types/order.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod Schema
const AssignStaffSchema = z.object({
  staffId: z.string().min(1, "Please select a rider"),
});

type AssignStaffFormFields = z.infer<typeof AssignStaffSchema>;

type Props = {
  order: AdminTransformedOrder;
  onSubmitSuccess: (order: AdminTransformedOrder) => void;
};

const AssignStaffForm: FC<Props> = (props) => {
  const { order, onSubmitSuccess } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssignStaffFormFields>({
    resolver: zodResolver(AssignStaffSchema),
    defaultValues: {
      staffId: order.staffId || "",
    },
  });

  const { isOpen: isSaving, open: startSaving, close: stopSaving } = useToggle();

  const onSubmit = useCallback<SubmitHandler<AssignStaffFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } = await orderApiService.assignStaff(
        order._id,
        formData.staffId,
      );

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Rider assigned successfully");
      } else {
        toast.error(errorMessage || "Failed to assign rider");
      }
      stopSaving();
    },
    [order._id, onSubmitSuccess, startSaving, stopSaving],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      <Controller
        name="staffId"
        control={control}
        render={({ field }) => (
          <StaffDropdown
            staffId={field.value}
            onChange={field.onChange}
            error={errors.staffId?.message}
            label="Select Delivery Rider"
          />
        )}
      />

      <div className="flex w-full items-center justify-end gap-4">
        <Button type="submit" isLoading={isSubmitting || isSaving}>
          Assign Rider
        </Button>
      </div>
    </form>
  );
};

export default AssignStaffForm;
