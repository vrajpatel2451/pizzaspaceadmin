import { Button } from "@/components/base/Button";
import RadioGroup from "@/components/compound/RadioGroup";
import { ticketApiService } from "@/infrastructure/TicketApiService";
import { useToggle } from "@/hooks/useToggle";
import type { OrderTicketResponse, OrderTicketStatus } from "@/types/ticket.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const statusOptions = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

const ChangeStatusSchema = z.object({
  status: z.enum(["open", "closed"]),
});

type ChangeStatusFormFields = z.infer<typeof ChangeStatusSchema>;

type Props = {
  ticket: OrderTicketResponse;
  onSubmitSuccess: (ticket: OrderTicketResponse) => void;
};

const ChangeStatusForm: FC<Props> = (props) => {
  const { ticket, onSubmitSuccess } = props;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangeStatusFormFields>({
    resolver: zodResolver(ChangeStatusSchema),
    defaultValues: {
      status: ticket.status,
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
        await ticketApiService.changeTicketStatus(ticket._id, {
          status: formData.status as OrderTicketStatus,
        });

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Ticket status updated successfully");
      } else {
        toast.error(errorMessage || "Failed to update ticket status");
      }
      stopSaving();
    },
    [ticket._id, onSubmitSuccess, startSaving, stopSaving],
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
