import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { openingHoursApiService } from "@/infrastructure/OpeningHoursApiService";
import type { OpeningHoursResponse } from "@/types/openingHours.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const OpeningHoursSchema = z.object({
  day: z.string().min(2, "Day is required (min 2 chars)"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  sortOrder: z.number().min(1, "Sort order must be at least 1"),
});

export type OpeningHoursFormFields = z.infer<typeof OpeningHoursSchema>;

export type OpeningHoursAction = "edit" | "create";

type Props = {
  defaultValue: OpeningHoursFormFields;
  action: OpeningHoursAction;
  id?: string;
  onSubmitSuccess: (openingHours: OpeningHoursResponse) => void;
};

const OpeningHoursForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpeningHoursFormFields>({
    resolver: zodResolver(OpeningHoursSchema),
    defaultValues: defaultValue,
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<OpeningHoursFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall =
        action === "edit" && id
          ? openingHoursApiService.updateOpeningHours(id, formData)
          : openingHoursApiService.createOpeningHours(formData);
      const { success, errorMessage, data } = await apiCall;
      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Opening hours saved successfully");
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving]
  );

  return (
    <form
      className="flex w-full flex-col gap-4"
      id="opening-hours-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Day"
        placeholder="e.g., Monday"
        required
        fullWidth
        {...register("day")}
        error={errors.day?.message}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Start Time"
          placeholder="e.g., 09:00"
          required
          fullWidth
          type="time"
          {...register("startTime")}
          error={errors.startTime?.message}
        />
        <Input
          label="End Time"
          placeholder="e.g., 22:00"
          required
          fullWidth
          type="time"
          {...register("endTime")}
          error={errors.endTime?.message}
        />
      </div>

      <Input
        label="Sort Order"
        placeholder="e.g., 1"
        required
        fullWidth
        type="number"
        {...register("sortOrder", { valueAsNumber: true })}
        error={errors.sortOrder?.message}
      />

      <div className="flex w-full items-center justify-end gap-4">
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
  );
};

export default OpeningHoursForm;
