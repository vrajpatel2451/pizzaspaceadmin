import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
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

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      to: routeConstants.dashboard,
    },
    {
      label: "Policies",
      to: routeConstants.policies,
    },
    {
      label: isEditMode ? "Edit Policy" : "Create Policy",
      to: isEditMode
        ? routeConstants.policyEdit.replace(":id", id!)
        : routeConstants.policyCreate,
    },
  ];

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <form
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Name"
            placeholder="e.g., Privacy Policy"
            required
            fullWidth
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Slug"
            placeholder="e.g., privacy-policy"
            required
            fullWidth
            {...register("slug")}
            error={errors.slug?.message}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Show on Footer</span>
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

        <Container title="Content (Markdown)">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div data-color-mode="light" className="dark:hidden">
                <MDEditor
                  value={field.value}
                  onChange={(val) => field.onChange(val || "")}
                  height={400}
                  preview="edit"
                />
              </div>
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div data-color-mode="dark" className="hidden dark:block">
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
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.content.message}
            </p>
          )}
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
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PolicyEditScreen;
