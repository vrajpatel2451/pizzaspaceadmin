import { Button } from "@/components/base/Button";
import RadioGroup from "@/components/compound/RadioGroup";
import { useToggle } from "@/hooks/useToggle";
import { reservationQueryApiService } from "@/infrastructure/ReservationQueryApiService";
import type {
  ReservationQueryResponse,
  ReservationStatus,
} from "@/types/reservationQuery.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "Reserved", value: "reserved" },
  { label: "Cancelled", value: "cancelled" },
];

const ChangeStatusSchema = z.object({
  status: z.enum(["open", "cancelled", "reserved"]),
});

type ChangeStatusFormFields = z.infer<typeof ChangeStatusSchema>;

type Props = {
  reservation: ReservationQueryResponse;
  onSubmitSuccess: (reservation: ReservationQueryResponse) => void;
};

const ChangeStatusForm: FC<Props> = (props) => {
  const { reservation, onSubmitSuccess } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeStatusFormFields>({
    resolver: zodResolver(ChangeStatusSchema),
    defaultValues: {
      status: reservation.status,
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
        await reservationQueryApiService.updateReservationQuery(
          reservation._id,
          {
            status: formData.status as ReservationStatus,
          }
        );

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Reservation status updated successfully");
      } else {
        toast.error(errorMessage || "Failed to update reservation status");
      }
      stopSaving();
    },
    [reservation._id, onSubmitSuccess, startSaving, stopSaving]
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
