import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useCallback, useState, type FC } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const VariantSchema = z
  .object({
    _id: z.string().optional(),
    label: z
      .string()
      .min(1, "Variant label is required")
      .max(100, "Label must be less than 100 characters"),
    price: z.number().min(0, "Price must be 0 or greater").optional(),
    groupId: z.string().optional(),
    isPrimary: z.boolean().default(false),
    itemId: z.string().optional(),
    storeIds: z.array(z.string()).optional(),
    uiKey: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isPrimary && (data.price === undefined || data.price === null)) {
        return false;
      }
      return true;
    },
    {
      message: "Price is required for primary variants",
      path: ["price"],
    },
  );

const VariantGroupSchema = z.object({
  _id: z.string().optional(),
  label: z
    .string()
    .min(1, "Group label is required")
    .max(100, "Label must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  isPrimary: z.boolean().default(false),
  itemId: z.string().optional(),
  storeIds: z.array(z.string()).optional(),
  uiKey: z.string().optional(),
  variants: z.array(VariantSchema).min(1, "At least one variant is required"),
});

export const VariantStepperSchema = z
  .object({
    variantGroups: z
      .array(VariantGroupSchema)
      .min(1, "At least one variant group is required"),
  })
  .refine(
    (data) => {
      const primaryGroups = data.variantGroups.filter(
        (group) => group.isPrimary,
      );
      return primaryGroups.length === 1;
    },
    {
      message: "Exactly one variant group must be marked as primary",
      path: ["variantGroups"],
    },
  );

export type VariantStepperFormFields = z.infer<typeof VariantStepperSchema>;

type VariantStepperFormProps = {
  defaultValue?: Partial<VariantStepperFormFields>;
  itemId?: string;
  onNext: (data: VariantStepperFormFields) => void;
  onSaveDraft?: (data: VariantStepperFormFields) => void;
};

const VariantStepperForm: FC<VariantStepperFormProps> = (props) => {
  const { defaultValue, itemId, onNext, onSaveDraft } = props;
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VariantStepperFormFields>({
    resolver: zodResolver(VariantStepperSchema as any),
    defaultValues: {
      variantGroups: [
        {
          label: "",
          description: "",
          isPrimary: true,
          itemId,
          uiKey: `group-${Date.now()}`,
          variants: [
            {
              label: "",
              price: 0,
              isPrimary: true,
              itemId,
              uiKey: `variant-${Date.now()}`,
            },
          ],
        },
      ],
      ...defaultValue,
    },
  });

  const {
    fields: groupFields,
    append: addGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: "variantGroups",
  });

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const formValues = watch();

  const handlePrimaryGroupChange = (groupIndex: number, isPrimary: boolean) => {
    if (!isPrimary) return;

    // Update all groups at once
    const updatedGroups = formValues.variantGroups.map((group, index) => {
      if (index === groupIndex) {
        return {
          ...group,
          isPrimary: true,
          variants: group.variants.map((variant) => ({
            ...variant,
            isPrimary: true,
            price: variant.price !== undefined ? variant.price : 0,
          })),
        };
      } else {
        return {
          ...group,
          isPrimary: false,
          variants: group.variants.map((variant) => ({
            ...variant,
            isPrimary: false,
            price: 0,
          })),
        };
      }
    });

    setValue("variantGroups", updatedGroups);
  };

  const handleAddGroup = () => {
    addGroup({
      label: "",
      description: "",
      isPrimary: false,
      itemId,
      uiKey: `group-${Date.now()}-${Math.random()}`,
      variants: [
        {
          label: "",
          price: undefined,
          isPrimary: false,
          itemId,
          uiKey: `variant-${Date.now()}-${Math.random()}`,
        },
      ],
    });
  };

  const handleRemoveGroup = (groupIndex: number) => {
    const group = formValues.variantGroups[groupIndex];
    if (group?.isPrimary) {
      toast.error("Cannot remove the primary variant group");
      return;
    }
    removeGroup(groupIndex);
  };

  const addVariantToGroup = (groupIndex: number) => {
    const currentGroup = formValues.variantGroups[groupIndex];
    const isGroupPrimary = currentGroup?.isPrimary;

    const newVariant = {
      label: "",
      price: isGroupPrimary ? 0 : undefined,
      isPrimary: isGroupPrimary,
      itemId,
      uiKey: `variant-${Date.now()}-${Math.random()}`,
    };

    const updatedVariants = [...currentGroup.variants, newVariant];
    setValue(`variantGroups.${groupIndex}.variants`, updatedVariants);
  };

  const removeVariantFromGroup = (groupIndex: number, variantIndex: number) => {
    const currentVariants = formValues.variantGroups[groupIndex].variants;
    if (currentVariants.length <= 1) {
      toast.error("Each variant group must have at least one variant");
      return;
    }

    const updatedVariants = currentVariants.filter(
      (_, index) => index !== variantIndex,
    );
    setValue(`variantGroups.${groupIndex}.variants`, updatedVariants);
  };

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const onSubmit = useCallback<SubmitHandler<VariantStepperFormFields>>(
    async (formData) => {
      startSaving();
      try {
        const primaryGroups = formData.variantGroups.filter(
          (group) => group.isPrimary,
        );
        if (primaryGroups.length !== 1) {
          toast.error("Exactly one variant group must be marked as primary");
          stopSaving();
          return;
        }

        onNext(formData);
        setCurrentStep(2);
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while processing variants");
      }
      stopSaving();
    },
    [onNext, startSaving, stopSaving],
  );

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formValues);
      toast.success("Draft saved successfully");
    }
  };

  const steps = [
    { id: 1, name: "Variants", description: "Configure product variants" },
    { id: 2, name: "Pricing", description: "Set up pricing rules" },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Stepper Header */}
      <div className="bg-nl-50 dark:bg-nd-800 flex items-center justify-between rounded-lg p-4">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-pl-500 border-pl-500 text-white"
                    : "border-nl-300 text-nl-400 dark:border-nd-500 dark:text-nd-400"
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id
                      ? "text-nl-900 dark:text-nd-100"
                      : "text-nl-500 dark:text-nd-400"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-nl-500 dark:text-nd-400 text-xs">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight
                  className="text-nl-400 dark:text-nd-500 mx-4"
                  size={20}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 Content */}
      {currentStep === 1 && (
        <form
          className="flex w-full flex-col gap-6"
          id="variant-stepper-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="max-h-[60vh] overflow-auto">
            <Container
              title="Variant Groups"
              subtitle="Configure different types of variants for your product"
            >
              <div className="space-y-6">
                {groupFields.map((group, groupIndex) => {
                  const currentGroup = formValues.variantGroups[groupIndex];
                  return (
                    <div
                      key={group.uiKey}
                      className={`rounded-xl border-2 p-6 ${
                        currentGroup?.isPrimary
                          ? "border-pl-300 bg-pl-50/50 dark:border-pd-400 dark:bg-pd-900/20"
                          : "border-nl-200 dark:border-nd-500 dark:bg-nd-700 bg-white"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="text-nl-800 dark:text-nd-200 font-semibold">
                            Variant Group {groupIndex + 1}
                          </h4>
                          {currentGroup?.isPrimary && (
                            <span className="bg-pl-100 text-pl-700 dark:bg-pd-800 dark:text-pd-200 rounded-full px-2 py-1 text-xs font-medium">
                              Primary
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              checked={currentGroup?.isPrimary || false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handlePrimaryGroupChange(groupIndex, true);
                                }
                              }}
                              className="text-pl-500 border-nl-300 focus:ring-pl-500 h-4 w-4"
                            />
                            <span className="text-nl-700 dark:text-nd-300 text-sm">
                              Set as Primary
                            </span>
                          </label>

                          {groupFields.length > 1 &&
                            !currentGroup?.isPrimary && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveGroup(groupIndex)}
                                startIcon={<Trash2 size={16} />}
                              >
                                Remove Group
                              </Button>
                            )}
                        </div>
                      </div>

                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <Input
                          label="Group Name"
                          placeholder="e.g., Size, Color, Material"
                          {...register(`variantGroups.${groupIndex}.label`)}
                          error={
                            errors.variantGroups?.[groupIndex]?.label?.message
                          }
                        />
                        <Input
                          label="Group Description"
                          placeholder="e.g., Size, Color, Material"
                          {...register(
                            `variantGroups.${groupIndex}.description`,
                          )}
                          error={
                            errors.variantGroups?.[groupIndex]?.description
                              ?.message
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-nl-700 dark:text-nd-300 font-medium">
                          Variant Options
                        </h5>
                        {currentGroup?.variants?.map(
                          (variant, variantIndex) => (
                            <div
                              key={variant.uiKey}
                              className="bg-nl-50 dark:bg-nd-800 flex items-end gap-3 rounded-lg p-3"
                            >
                              <Input
                                label={variantIndex === 0 ? "Option Name" : ""}
                                placeholder="e.g., Small, Red, Cotton"
                                {...register(
                                  `variantGroups.${groupIndex}.variants.${variantIndex}.label`,
                                )}
                                error={
                                  errors.variantGroups?.[groupIndex]
                                    ?.variants?.[variantIndex]?.label?.message
                                }
                              />

                              {currentGroup?.isPrimary && (
                                <Input
                                  label={variantIndex === 0 ? "Price" : ""}
                                  type="number"
                                  step="0.01"
                                  placeholder="₹100"
                                  {...register(
                                    `variantGroups.${groupIndex}.variants.${variantIndex}.price`,
                                    { valueAsNumber: true },
                                  )}
                                  error={
                                    errors.variantGroups?.[groupIndex]
                                      ?.variants?.[variantIndex]?.price?.message
                                  }
                                />
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeVariantFromGroup(
                                    groupIndex,
                                    variantIndex,
                                  )
                                }
                                disabled={currentGroup?.variants?.length <= 1}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ),
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addVariantToGroup(groupIndex)}
                          startIcon={<Plus size={16} />}
                        >
                          Add Variant Option
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGroup}
                  startIcon={<Plus size={16} />}
                >
                  Add Variant Group
                </Button>

                {errors.variantGroups?.root && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.variantGroups.root.message}
                  </p>
                )}
              </div>
            </Container>
          </div>

          {/* Form Actions */}
          <div className="border-nl-200 dark:border-nd-600 flex w-full items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                startIcon={<RefreshCcw size={20} />}
                variant="filled"
                color="neutral"
                onClick={handleReset}
                type="button"
              >
                Reset
              </Button>
              {onSaveDraft && (
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  type="button"
                >
                  Save Draft
                </Button>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting || isSaving}
              endIcon={<ChevronRight size={20} />}
            >
              Continue to Pricing
            </Button>
          </div>
        </form>
      )}

      {/* Step 2 Placeholder */}
      {currentStep === 2 && (
        <Container title="Pricing Configuration">
          <div className="text-nl-500 dark:text-nd-400 border-nl-300 dark:border-nd-600 rounded-lg border border-dashed p-8 text-center">
            <p className="text-lg font-medium">Step 2: Pricing Configuration</p>
            <p className="mt-2">This step will be implemented next</p>
          </div>
        </Container>
      )}
    </div>
  );
};

export default VariantStepperForm;
