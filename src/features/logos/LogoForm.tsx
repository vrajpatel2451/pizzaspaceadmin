import { Button } from "@/components/base/Button";
import { Select, type SelectOption } from "@/components/base/Select";
import Switch from "@/components/base/Switch";
import Container from "@/components/compound/Container";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import { useToggle } from "@/hooks/useToggle";
import { logoApiService } from "@/infrastructure/LogoApiService";
import type { FileResponse } from "@/types/file.types";
import type { LogoResponse, LogoTheme, LogoType } from "@/types/logo.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const logoTypeOptions: SelectOption<LogoType>[] = [
  { label: "Header", value: "header" },
  { label: "Favicon", value: "favicon" },
  { label: "Footer", value: "footer" },
];

const logoThemeOptions: SelectOption<LogoTheme>[] = [
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
];

export const LogoSchema = z.object({
  logoImage: z.string().min(1, "Logo image is required"),
  type: z.enum(["header", "favicon", "footer"], {
    message: "Type is required",
  }),
  theme: z.enum(["dark", "light"], { message: "Theme is required" }),
  isPublished: z.boolean().optional(),
});

export type LogoFormFields = z.infer<typeof LogoSchema>;

export type LogoAction = "edit" | "create";

type Props = {
  defaultValue: LogoFormFields;
  action: LogoAction;
  id?: string;
  onSubmitSuccess: (logo: LogoResponse) => void;
};

const LogoForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess } = props;
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LogoFormFields>({
    resolver: zodResolver(LogoSchema),
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

  const onSubmit = useCallback<SubmitHandler<LogoFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall =
        action === "edit" && id
          ? logoApiService.updateLogo(id, formData)
          : logoApiService.createLogo(formData);
      const { success, errorMessage, data } = await apiCall;
      if (success && data) {
        onSubmitSuccess(data);
        toast.success("Logo saved successfully");
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving]
  );

  const handleRemovePhoto = () => {
    setValue("logoImage", "", { shouldValidate: true });
  };

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrl = Array.isArray(media) ? media[0].path : media.path;
    setValue("logoImage", selectedUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    closeMediaPicker();
  };

  const currentType = watch("type");
  const currentTheme = watch("theme");

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
        id="logo-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Type"
                required
                options={logoTypeOptions}
                value={logoTypeOptions.find((opt) => opt.value === field.value)}
                onChange={(option) => {
                  if (option && "value" in option) {
                    field.onChange(option.value);
                  }
                }}
                error={errors.type?.message}
                width={200}
              />
            )}
          />
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <Select
                label="Theme"
                required
                options={logoThemeOptions}
                value={logoThemeOptions.find((opt) => opt.value === field.value)}
                onChange={(option) => {
                  if (option && "value" in option) {
                    field.onChange(option.value);
                  }
                }}
                error={errors.theme?.message}
                width={200}
              />
            )}
          />
        </div>

        <Container title="Logo Image">
          <div>
            <Controller
              name="logoImage"
              control={control}
              render={({ field }) => {
                return (
                  <div className="cursor-pointer">
                    {field.value ? (
                      <ImageComponent
                        src={field.value}
                        alt={`${currentType} ${currentTheme} logo`}
                        wrapperClassName="size-32"
                        className="border-nl-200 dark:border-nd-600 size-32 rounded-lg border-2 object-contain"
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
            {errors.logoImage && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.logoImage.message}
              </p>
            )}
          </div>
        </Container>

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

export default LogoForm;
