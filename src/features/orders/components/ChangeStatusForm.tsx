import { Button } from "@/components/base/Button";
import RadioGroup from "@/components/compound/RadioGroup";
import { orderApiService } from "@/infrastructure/OrderApiService";
import { useToggle } from "@/hooks/useToggle";
import type { AdminTransformedOrder } from "@/types/order.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const statusOptions = [
  { label: "Initiated", value: "initiated" },
  { label: "Payment Confirmed", value: "payment_confirmed" },
  { label: "Payment Error", value: "payment_error" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready to Pickup", value: "ready_to_pickup" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
];

// Zod Schema
const ChangeStatusSchema = z.object({
  status: z.enum([
    "initiated",
    "payment_confirmed",
    "payment_error",
    "cancelled",
    "preparing",
    "ready_to_pickup",
    "on_the_way",
    "delivered",
  ]),
});

type ChangeStatusFormFields = z.infer<typeof ChangeStatusSchema>;

type Props = {
  order: AdminTransformedOrder;
  onSubmitSuccess: (order: AdminTransformedOrder) => void;
};

const ChangeStatusForm: FC<Props> = (props) => {
  const { order, onSubmitSuccess } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeStatusFormFields>({
    resolver: zodResolver(ChangeStatusSchema),
    defaultValues: {
      status: order.status,
    },
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const onSubmit = useCallback<SubmitHandler<ChangeStatusFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } =
        await orderApiService.updateOrderStatus(order._id, formData.status);

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Order status updated successfully");
      } else {
        toast.error(errorMessage || "Failed to update order status");
      }
      stopSaving();
    },
    [order._id, onSubmitSuccess, startSaving, stopSaving],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <RadioGroup
            options={statusOptions}
            value={field.value}
            onChange={field.onChange}
            size="md"
            orientation="vertical"
          />
        )}
      />
      {errors.status?.message && (
        <p className="text-sm text-red-500">{errors.status.message}</p>
      )}

      <div className="flex w-full items-center justify-end gap-4">
        <Button type="submit" isLoading={isSubmitting || isSaving}>
          Update Status
        </Button>
      </div>
    </form>
  );
};

export default ChangeStatusForm;
