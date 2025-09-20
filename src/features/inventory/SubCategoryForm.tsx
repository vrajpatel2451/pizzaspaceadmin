import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Container from "@/components/compound/Container";
import ImageComponent from "@/components/compound/ImageComponent";
import MediaPicker from "@/components/compound/media-picker/MediaPicker";
import { toast } from "@/components/compound/Sonner";
import UploadImagePlaceholder from "@/components/compound/UploadImagePlaceHolder";
import { useToggle } from "@/hooks/useToggle";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import type {
  CategoryResponse,
  SubCategoryResponse,
} from "@/types/category.types";
import type { FileResponse } from "@/types/file.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, type FC } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import CategoryDropdown from "./CategoryDropdown";

export const SubCategoryUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Parent Category is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

export type SubCategoryFormFields = z.infer<typeof SubCategoryUpdateSchema>;

export type SubCategoryAction = "edit" | "create";

type Props = {
  defaultValue: SubCategoryFormFields;
  action: SubCategoryAction;
  id: string;
  onSubmitSuccess: (subCategory: SubCategoryResponse) => void;
  selectedCategory?: CategoryResponse;
};

const SubCategoryForm: FC<Props> = (props) => {
  const { defaultValue, action, id, onSubmitSuccess, selectedCategory } = props;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubCategoryFormFields>({
    resolver: zodResolver(SubCategoryUpdateSchema),
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
  const onSubmit = useCallback<SubmitHandler<SubCategoryFormFields>>(
    async (props) => {
      startSaving();
      const apiCall =
        action === "edit"
          ? subCategoryApiService.updateSubCategory(props, id)
          : subCategoryApiService.createSubCategory(props);
      const { success, errorMessage, data } = await apiCall;
      if (success) {
        onSubmitSuccess(data);
        toast.success("Details saved successfully");
      } else {
        toast.error(errorMessage);
      }
      stopSaving();
    },
    [action, id, onSubmitSuccess, startSaving, stopSaving],
  );

  const { close, isOpen, open } = useToggle();

  const handleRemovePhoto = () => {
    setValue("imageUrl", "", { shouldValidate: true });
  };

  const handleMediaSelect = (media: FileResponse | FileResponse[]) => {
    const selectedUrl = Array.isArray(media) ? media[0].path : media.path;
    setValue("imageUrl", selectedUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    close();
  };

  return (
    <>
      {isOpen && (
        <MediaPicker
          isOpen
          close={close}
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
        id="subCategory-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Name"
          placeholder="Enter subCategory name"
          required
          fullWidth
          {...register("name")}
          error={errors.name?.message}
        />

        <Container title="Photo">
          <div>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => {
                return (
                  <div className="cursor-pointer">
                    {field.value ? (
                      <ImageComponent
                        src={field.value}
                        alt="SubCategory photo"
                        wrapperClassName="size-32"
                        className="border-nl-200 dark:border-nd-600 size-32 rounded-lg border-2"
                        onRemove={handleRemovePhoto}
                      />
                    ) : (
                      <UploadImagePlaceholder onClick={open} />
                    )}

                    <input type="hidden" {...field} />
                  </div>
                );
              }}
            />

            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
        </Container>

        <Controller
          name={`categoryId`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <CategoryDropdown
                categoryId={value}
                onChange={onChange}
                error={errors?.categoryId?.message}
                intCategory={selectedCategory}
                label="Category"
              />
            );
          }}
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
    </>
  );
};

export default SubCategoryForm;
