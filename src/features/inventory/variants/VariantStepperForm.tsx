import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { Check, ChevronRight, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useState, type FC } from "react";
import { v4 as uuidv4 } from "uuid";

export interface VariantData {
  _id: string;
  label: string;
  price?: number;
  groupId?: string;
  isPrimary: boolean;
  itemId?: string;
  storeIds?: string[];
  isNew: boolean;
}

export interface VariantGroupData {
  _id: string;
  label: string;
  description: string;
  isPrimary: boolean;
  itemId?: string;
  storeIds?: string[];
  variants: VariantData[];
  isNew: boolean;
}

export interface VariantFormData {
  variantGroups: VariantGroupData[];
}

type VariantStepperFormProps = {
  defaultValue?: VariantFormData;
  itemId?: string;
  onNext: (data: VariantFormData) => void;
  onSaveDraft?: (data: VariantFormData) => void;
};

const VariantStepperForm: FC<VariantStepperFormProps> = (props) => {
  const { defaultValue, itemId, onNext, onSaveDraft } = props;
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState<VariantFormData>(defaultValue);

  // Errors state
  const [errors, setErrors] = useState<{
    variantGroups?: Array<{
      label?: string;
      description?: string;
      variants?: Array<{
        label?: string;
        price?: string;
      }>;
    }>;
    general?: string;
  }>({});

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = { variantGroups: [] };
    let isValid = true;

    // Check if exactly one primary group exists
    const primaryGroups = formData.variantGroups.filter(
      (group) => group.isPrimary,
    );
    if (primaryGroups.length !== 1) {
      newErrors.general = "Exactly one variant group must be marked as primary";
      isValid = false;
    }

    // Validate each group
    formData.variantGroups.forEach((group, groupIndex) => {
      const groupErrors: NonNullable<typeof errors.variantGroups>[0] = {
        variants: [],
      };

      // Validate group fields
      if (!group.label.trim()) {
        groupErrors.label = "Group name is required";
        isValid = false;
      } else if (group.label.length > 100) {
        groupErrors.label = "Group name must be less than 100 characters";
        isValid = false;
      }

      if (!group.description.trim()) {
        groupErrors.description = "Description is required";
        isValid = false;
      } else if (group.description.length > 500) {
        groupErrors.description =
          "Description must be less than 500 characters";
        isValid = false;
      }

      // Validate variants
      if (group.variants.length === 0) {
        groupErrors.variants = [{ label: "At least one variant is required" }];
        isValid = false;
      } else {
        group.variants.forEach((variant, variantIndex) => {
          const variantErrors: NonNullable<
            NonNullable<typeof groupErrors.variants>
          >[0] = {};

          if (!variant.label.trim()) {
            variantErrors.label = "Variant name is required";
            isValid = false;
          } else if (variant.label.length > 100) {
            variantErrors.label =
              "Variant name must be less than 100 characters";
            isValid = false;
          }

          // Price validation for primary variants
          if (group.isPrimary) {
            if (variant.price === undefined || variant.price === null) {
              variantErrors.price = "Price is required for primary variants";
              isValid = false;
            } else if (variant.price < 0) {
              variantErrors.price = "Price must be 0 or greater";
              isValid = false;
            }
          }

          if (!groupErrors.variants) groupErrors.variants = [];
          groupErrors.variants[variantIndex] = variantErrors;
        });
      }

      if (!newErrors.variantGroups) newErrors.variantGroups = [];
      newErrors.variantGroups[groupIndex] = groupErrors;
    });

    setErrors(newErrors);
    return isValid;
  };

  const updateGroupField = (
    groupIndex: number,
    field: keyof VariantGroupData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((group, index) =>
        index === groupIndex ? { ...group, [field]: value } : group,
      ),
    }));
  };

  const updateVariantField = (
    groupIndex: number,
    variantIndex: number,
    field: keyof VariantData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((group, gIndex) =>
        gIndex === groupIndex
          ? {
              ...group,
              variants: group.variants.map((variant, vIndex) =>
                vIndex === variantIndex
                  ? { ...variant, [field]: value }
                  : variant,
              ),
            }
          : group,
      ),
    }));
  };

  const handlePrimaryGroupChange = (groupIndex: number, isPrimary: boolean) => {
    if (!isPrimary) return;

    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((group, index) => {
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
      }),
    }));
  };

  const addGroup = () => {
    setFormData((prev) => ({
      ...prev,
      variantGroups: [
        ...prev.variantGroups,
        {
          label: "",
          description: "",
          isPrimary: false,
          itemId,
          _id: uuidv4(),
          isNew: true,
          variants: [
            {
              label: "",
              price: undefined,
              isPrimary: false,
              itemId,
              _id: uuidv4(),
              isNew: true,
            },
          ],
        },
      ],
    }));
  };

  const removeGroup = (groupIndex: number) => {
    const group = formData.variantGroups[groupIndex];
    if (group?.isPrimary) {
      toast.error("Cannot remove the primary variant group");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.filter(
        (_, index) => index !== groupIndex,
      ),
    }));
  };

  const addVariant = (groupIndex: number) => {
    const group = formData.variantGroups[groupIndex];
    const newVariant: VariantData = {
      label: "",
      price: group.isPrimary ? 0 : undefined,
      isPrimary: group.isPrimary,
      itemId,
      _id: uuidv4(),
      isNew: true,
    };

    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g, index) =>
        index === groupIndex
          ? { ...g, variants: [...g.variants, newVariant] }
          : g,
      ),
    }));
  };

  const removeVariant = (groupIndex: number, variantIndex: number) => {
    const group = formData.variantGroups[groupIndex];
    if (group.variants.length <= 1) {
      toast.error("Each variant group must have at least one variant");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      variantGroups: prev.variantGroups.map((g, gIndex) =>
        gIndex === groupIndex
          ? {
              ...g,
              variants: g.variants.filter(
                (_, vIndex) => vIndex !== variantIndex,
              ),
            }
          : g,
      ),
    }));
  };

  const handleReset = () => {
    setFormData({
      variantGroups: [
        {
          label: "",
          description: "",
          isPrimary: true,
          itemId,
          _id: uuidv4(),
          isNew: true,
          variants: [
            {
              label: "",
              price: 0,
              isPrimary: true,
              itemId,
              _id: uuidv4(),
              isNew: true,
            },
          ],
        },
      ],
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    startSaving();

    if (!validateForm()) {
      stopSaving();
      return;
    }

    try {
      onNext(formData);
      setCurrentStep(2);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing variants");
    }

    stopSaving();
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
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
        <div className="flex w-full flex-col gap-6">
          <div className="max-h-[60vh] overflow-auto">
            <Container
              title="Variant Groups"
              subtitle="Configure different types of variants for your product"
            >
              <div className="space-y-6">
                {formData.variantGroups.map((group, groupIndex) => (
                  <div
                    key={group._id}
                    className={`rounded-xl border-2 p-6 ${
                      group.isPrimary
                        ? "border-pl-300 bg-pl-50/50 dark:border-pd-400 dark:bg-pd-900/20"
                        : "border-nl-200 dark:border-nd-500 dark:bg-nd-700 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="text-nl-800 dark:text-nd-200 font-semibold">
                          Variant Group {groupIndex + 1}
                        </h4>
                        {group.isPrimary && (
                          <span className="bg-pl-100 text-pl-700 dark:bg-pd-800 dark:text-pd-200 rounded-full px-2 py-1 text-xs font-medium">
                            Primary
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            checked={group.isPrimary}
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

                        {formData.variantGroups.length > 1 &&
                          !group.isPrimary && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGroup(groupIndex)}
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
                        value={group.label}
                        onChange={(e) =>
                          updateGroupField(groupIndex, "label", e.target.value)
                        }
                        error={errors.variantGroups?.[groupIndex]?.label}
                      />
                      <Input
                        label="Group Description"
                        placeholder="Describe this variant group"
                        value={group.description}
                        onChange={(e) =>
                          updateGroupField(
                            groupIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        error={errors.variantGroups?.[groupIndex]?.description}
                      />
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-nl-700 dark:text-nd-300 font-medium">
                        Variant Options
                      </h5>
                      {group.variants.map((variant, variantIndex) => (
                        <div
                          key={variant._id}
                          className="bg-nl-50 dark:bg-nd-800 flex items-end gap-3 rounded-lg p-3"
                        >
                          <Input
                            label={variantIndex === 0 ? "Option Name" : ""}
                            placeholder="e.g., Small, Red, Cotton"
                            value={variant.label}
                            onChange={(e) =>
                              updateVariantField(
                                groupIndex,
                                variantIndex,
                                "label",
                                e.target.value,
                              )
                            }
                            error={
                              errors.variantGroups?.[groupIndex]?.variants?.[
                                variantIndex
                              ]?.label
                            }
                          />

                          {group.isPrimary && (
                            <Input
                              label={variantIndex === 0 ? "Price" : ""}
                              type="number"
                              step="0.01"
                              placeholder="₹100"
                              value={variant.price || 0}
                              onChange={(e) =>
                                updateVariantField(
                                  groupIndex,
                                  variantIndex,
                                  "price",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              error={
                                errors.variantGroups?.[groupIndex]?.variants?.[
                                  variantIndex
                                ]?.price
                              }
                            />
                          )}

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeVariant(groupIndex, variantIndex)
                            }
                            disabled={group.variants.length <= 1}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariant(groupIndex)}
                        startIcon={<Plus size={16} />}
                      >
                        Add Variant Option
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addGroup}
                  startIcon={<Plus size={16} />}
                >
                  Add Variant Group
                </Button>

                {errors.general && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general}
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
              onClick={handleSubmit}
              isLoading={isSaving}
              endIcon={<ChevronRight size={20} />}
            >
              Continue to Pricing
            </Button>
          </div>
        </div>
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
