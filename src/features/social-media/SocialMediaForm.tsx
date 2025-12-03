import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Container from "@/components/compound/Container";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import { useToggle } from "@/hooks/useToggle";
import { socialMediaApiService } from "@/infrastructure/SocialMediaApiService";
import type { FileResponse } from "@/types/file.types";
import type { SocialMediaResponse } from "@/types/socialMedia.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

export const SocialMediaSchema = z.object({
  name: z.string().min(2, "Name is required (min 2 chars)"),
  logo: z.string().min(1, "Logo is required"),
  link: z.string().url("Valid URL is required"),
});

export type SocialMediaFormFields = z.infer<typeof SocialMediaSchema>;

export type SocialMediaAction = "edit" | "create";

type Props = {
  defaultValue: SocialMediaFormFields;
  action: SocialMediaAction;
  id?: string;
  onSubmitSuccess: (socialMedia: SocialMediaResponse) => void;
};

const SocialMediaForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess } = props;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SocialMediaFormFields>({
    resolver: zodResolver(SocialMediaSchema),
    defaultValues: defaultValue,
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const { close: closeMediaPicker, isOpen: isMediaPickerOpen, open: openMediaPicker } = useToggle();

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<SocialMediaFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall =
        action === "edit" && id
          ? socialMediaApiService.updateSocialMedia(id, formData)
          : socialMediaApiService.createSocialMedia(formData);
      const { success, errorMessage, data } = await apiCall;
      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Social media saved successfully");
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving]
  );

  const handleRemovePhoto = () => {
    setValue("logo", "", { shouldValidate: true });
  };

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrl = Array.isArray(media) ? media[0].path : media.path;
    setValue("logo", selectedUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    closeMediaPicker();
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
        id="social-media-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Platform Name"
          placeholder="e.g., Facebook, Instagram"
          required
          fullWidth
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Profile Link"
          placeholder="https://..."
          required
          fullWidth
          type="url"
          {...register("link")}
          error={errors.link?.message}
        />

        <Container title="Logo">
          <div>
            <Controller
              name="logo"
              control={control}
              render={({ field }) => {
                return (
                  <div className="cursor-pointer">
                    {field.value ? (
                      <ImageComponent
                        src={field.value}
                        alt="Social media logo"
                        wrapperClassName="size-24"
                        className="border-nl-200 dark:border-nd-600 size-24 rounded-lg border-2"
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
            {errors.logo && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.logo.message}
              </p>
            )}
          </div>
        </Container>

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

export default SocialMediaForm;
