import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import { Textarea } from "@/components/base/Textarea";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import { useToggle } from "@/hooks/useToggle";
import { generalRatingApiService } from "@/infrastructure/GeneralRatingApiService";
import type { FileResponse } from "@/types/file.types";
import type { GeneralRatingResponse } from "@/types/generalRating.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save, Star } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const GeneralRatingSchema = z.object({
  personName: z.string().min(2, "Name is required (min 2 chars)"),
  message: z.string().min(10, "Review message is required (min 10 chars)"),
  personImage: z.string().optional(),
  ratings: z.number().min(1, "Rating is required").max(5, "Rating must be 1-5"),
  personTagRole: z.string().optional(),
  personPhone: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export type GeneralRatingFormFields = z.infer<typeof GeneralRatingSchema>;

export type GeneralRatingAction = "edit" | "create";

type Props = {
  defaultValue: GeneralRatingFormFields;
  action: GeneralRatingAction;
  id?: string;
  onSubmitSuccess: (rating: GeneralRatingResponse) => void;
};

const GeneralRatingForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GeneralRatingFormFields>({
    resolver: zodResolver(GeneralRatingSchema),
    defaultValues: defaultValue,
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const {
    close: closeMediaPicker,
    isOpen: isMediaPickerOpen,
    open: openMediaPicker,
  } = useToggle();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<GeneralRatingFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall =
        action === "edit" && id
          ? generalRatingApiService.updateGeneralRating(id, formData)
          : generalRatingApiService.createGeneralRating(formData);
      const { success, errorMessage, data } = await apiCall;
      if (success && data) {
        onSubmitSuccess(data);
        toast.success(
          `Rating ${action === "edit" ? "updated" : "created"} successfully`
        );
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving]
  );

  const handleRemovePhoto = () => {
    setValue("personImage", "", { shouldValidate: true });
  };

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrl = Array.isArray(media) ? media[0].path : media.path;
    setValue("personImage", selectedUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    closeMediaPicker();
  };

  const currentRating = watch("ratings");

  const handleStarClick = (rating: number) => {
    setValue("ratings", rating, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <>
      {isMediaPickerOpen && (
        <MediaPicker
          isOpen
          close={closeMediaPicker}
          multiple={false}
          acceptedFormats={["image/*"]}
          onMediaSelect={handleMediaSelect}
          onError={(error) => {
            console.error("Media picker error:", error);
          }}
        />
      )}
      <form
        className="flex w-full flex-col gap-4"
        id="general-rating-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Person Name"
            placeholder="Enter customer name"
            required
            fullWidth
            {...register("personName")}
            error={errors.personName?.message}
          />
          <Input
            label="Role/Title"
            placeholder="e.g. Regular Customer, Food Critic"
            fullWidth
            {...register("personTagRole")}
            error={errors.personTagRole?.message}
          />
        </div>

        <Input
          label="Phone Number"
          placeholder="Enter phone number (optional)"
          fullWidth
          {...register("personPhone")}
          error={errors.personPhone?.message}
        />

        <Textarea
          label="Review Message"
          placeholder="Enter the customer review message..."
          required
          fullWidth
          rows={4}
          {...register("message")}
          error={errors.message?.message}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= (currentRating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  }
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-slate-600">
              {currentRating ? `${currentRating}/5` : "Select rating"}
            </span>
          </div>
          {errors.ratings && (
            <p className="mt-1 text-sm text-red-600">{errors.ratings.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Person Photo (Optional)
          </label>
          <Controller
            name="personImage"
            control={control}
            render={({ field }) => {
              return (
                <div className="cursor-pointer">
                  {field.value ? (
                    <ImageComponent
                      src={field.value}
                      alt="Person photo"
                      wrapperClassName="size-24"
                      className="border-nl-200 dark:border-nd-600 size-24 rounded-full border-2 object-cover"
                      onRemove={handleRemovePhoto}
                    />
                  ) : (
                    <UploadImagePlaceholder onClick={openMediaPicker} />
                  )}
                  <input type="hidden" {...field} />
                </div>
              );
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Published</span>
          <Controller
            name="isPublished"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value || false}
                setChecked={field.onChange}
              />
            )}
          />
        </div>

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
    </>
  );
};

export default GeneralRatingForm;
