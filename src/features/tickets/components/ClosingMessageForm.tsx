import { Button } from "@/components/base/Button";
import { ticketApiService } from "@/infrastructure/TicketApiService";
import { useToggle } from "@/hooks/useToggle";
import type { OrderTicketResponse } from "@/types/ticket.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ClosingMessageSchema = z.object({
  closingMessage: z
    .string()
    .min(1, "Closing message is required")
    .max(2000, "Closing message must be less than 2000 characters"),
});

type ClosingMessageFormFields = z.infer<typeof ClosingMessageSchema>;

type Props = {
  ticket: OrderTicketResponse;
  onSubmitSuccess: (ticket: OrderTicketResponse) => void;
};

const ClosingMessageForm: FC<Props> = (props) => {
  const { ticket, onSubmitSuccess } = props;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClosingMessageFormFields>({
    resolver: zodResolver(ClosingMessageSchema),
    defaultValues: {
      closingMessage: ticket.closingMessage || "",
    },
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const onSubmit = useCallback<SubmitHandler<ClosingMessageFormFields>>(
    async (formData) => {
      startSaving();
      const { success, errorMessage, data } =
        await ticketApiService.updateClosingMessage(ticket._id, {
          closingMessage: formData.closingMessage,
        });

      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Closing message updated successfully");
      } else {
        toast.error(errorMessage || "Failed to update closing message");
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
      <div className="flex flex-col gap-2">
        <label
          htmlFor="closingMessage"
          className="text-nl-700 dark:text-nd-200 text-sm font-medium"
        >
          Closing Message
        </label>
        <textarea
          id="closingMessage"
          {...register("closingMessage")}
          rows={5}
          className="border-nl-200 bg-nl-50 text-nl-700 placeholder:text-nl-400 focus:border-primary-500 focus:ring-primary-500 dark:border-nd-600 dark:bg-nd-700 dark:text-nd-200 dark:placeholder:text-nd-400 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1"
          placeholder="Enter the closing message for this ticket..."
        />
        {errors.closingMessage?.message && (
          <p className="text-sm text-red-500">{errors.closingMessage.message}</p>
        )}
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <Button type="submit" isLoading={isSubmitting || isSaving}>
          Update Message
        </Button>
      </div>
    </form>
  );
};

export default ClosingMessageForm;
