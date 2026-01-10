import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import { toast } from "@/components/compound/Sonner";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { policyApiService } from "@/infrastructure/PolicyApiService";
import { routeConstants } from "@/routes/routeConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { RefreshCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";
import { useFetchPolicyById } from "./hooks";

const PolicySchema = z.object({
  name: z.string().min(2, "Name is required (min 2 chars)"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  content: z.string().min(10, "Content is required (min 10 chars)"),
  showOnFooter: z.boolean().optional(),
});

type PolicyFormFields = z.infer<typeof PolicySchema>;

const PolicyEditScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const { data: policy, isFetching } = useFetchPolicyById(id || "");

  const defaultValues = useMemo<PolicyFormFields>(
    () => ({
      name: "",
      slug: "",
      content: "",
      showOnFooter: false,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PolicyFormFields>({
    resolver: zodResolver(PolicySchema),
    defaultValues,
  });

  // Populate form when policy data is loaded
  useEffect(() => {
    if (policy) {
      reset({
        name: policy.name,
        slug: policy.slug,
        content: policy.content,
        showOnFooter: policy.showOnFooter,
      });
    }
  }, [policy, reset]);

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const handleReset = useCallback(() => {
    if (policy) {
      reset({
        name: policy.name,
        slug: policy.slug,
        content: policy.content,
        showOnFooter: policy.showOnFooter,
      });
    } else {
      reset(defaultValues);
    }
  }, [policy, reset, defaultValues]);

  // Auto-generate slug from name
  const name = watch("name");
  useEffect(() => {
    if (!isEditMode && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [name, isEditMode, setValue]);

  const onSubmit = useCallback<SubmitHandler<PolicyFormFields>>(
    async (formData) => {
      startSaving();
      const apiCall = isEditMode
        ? policyApiService.updatePolicy(id!, formData)
        : policyApiService.createPolicy(formData);
      const { success, errorMessage } = await apiCall;
      if (success) {
        toast.success(
          `Policy ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate(routeConstants.policies);
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      stopSaving();
    },
    [isEditMode, id, navigate, startSaving, stopSaving]
  );

  if (isFetching) {
    return (
      <ScreenContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Basic Info Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-800">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Input
                label="Policy Name"
                placeholder="e.g., Privacy Policy"
                required
                fullWidth
                {...register("name")}
                error={errors.name?.message}
              />
              <p className="mt-1 text-xs text-slate-500">
                The display name for this policy
              </p>
            </div>
            <div>
              <Input
                label="URL Slug"
                placeholder="e.g., privacy-policy"
                required
                fullWidth
                {...register("slug")}
                error={errors.slug?.message}
              />
              <p className="mt-1 text-xs text-slate-500">
                Used in the URL: /policy/your-slug
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <span className="text-sm font-medium text-slate-800">Show in Footer</span>
              <p className="text-xs text-slate-500">Display this policy link in the website footer</p>
            </div>
            <Controller
              name="showOnFooter"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value || false}
                  setChecked={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-800">Policy Content</h3>
          <p className="mb-4 text-sm text-slate-500">
            Write your policy content using Markdown formatting
          </p>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div data-color-mode="light">
                <MDEditor
                  value={field.value}
                  onChange={(val) => field.onChange(val || "")}
                  height={400}
                  preview="edit"
                />
              </div>
            )}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            startIcon={<RefreshCcw size={18} />}
            variant="ghost"
            onClick={handleReset}
            type="button"
          >
            Reset
          </Button>
          <Button
            startIcon={<Save size={18} />}
            type="submit"
            isLoading={isSubmitting || isSaving}
          >
            {isEditMode ? "Update Policy" : "Create Policy"}
          </Button>
        </div>
      </form>
    </ScreenContainer>
  );
};

export default PolicyEditScreen;
