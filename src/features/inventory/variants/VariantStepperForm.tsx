import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import {
  Select,
  findOptionByValue,
  type SelectOption,
} from "@/components/base/Select";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import type { AddonGroupResponse, AddonResponse } from "@/types/addon.types";
import type { VariantAddonSelectionType } from "@/types/variants.types";
import { Check, ChevronRight, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useState, type FC } from "react";
import { v4 as uuidv4 } from "uuid";

const MAX_ITEM_TYPE_OPTIONS: SelectOption<VariantAddonSelectionType>[] = [
  { value: "none", label: "None" },
  { value: "overall", label: "Overall" },
  { value: "perGroup", label: "Per Group" },
];

export interface VariantData {
  _id: string;
  label: string;
  price?: number;
  groupId?: string;
  isPrimary: boolean;
  itemId?: string;
  storeIds?: string[];
  isNew: boolean;
  maxItems?: number;
  maxItemTypes?: VariantAddonSelectionType;
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

export type VariantPricingType = "addonGroup" | "addon" | "variant";

export interface VariantPricingData {
  _id: string;
  type: VariantPricingType;
  variantId: string;
  variantGroupId: string;
  subVariantId?: string;
  addonGroupId?: string;
  addonId?: string;
  productId?: string;
  isVisible: boolean;
  price: number;
  isNew: boolean;
}

type VariantStepperFormProps = {
  defaultValue?: VariantFormData;
  itemId?: string;
  addonGroups?: AddonGroupResponse[];
  pricing?: VariantPricingData[];
  addons?: AddonResponse[];
  onSaveDraft?: (data: VariantFormData) => void;
  onSave?: (
    variantData: VariantFormData,
    pricingData: VariantPricingData[],
    deletedVariantIds: string[],
    deletedVariantGroupIds: string[],
  ) => void;
};

const VariantStepperForm: FC<VariantStepperFormProps> = (props) => {
  const {
    defaultValue,
    itemId,
    pricing,
    addonGroups: _addonGroups = [],
    addons: _addons = [],
    onSaveDraft,
    onSave,
  } = props;
  const [currentStep, setCurrentStep] = useState(1);
  const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
  const [deletedVariantGroupIds, setDeletedVariantGroupIds] = useState<
    string[]
  >([]);

  // Form state
  const [formData, setFormData] = useState<VariantFormData>(
    defaultValue || {
      variantGroups: [
        {
          _id: uuidv4(),
          label: "",
          description: "",
          isPrimary: true,
          itemId,
          isNew: true,
          variants: [
            {
              _id: uuidv4(),
              label: "",
              price: 0,
              isPrimary: true,
              itemId,
              isNew: true,
              maxItems: 0,
              maxItemTypes: "none",
            },
          ],
        },
      ],
    },
  );

  // Pricing state for step 2
  const [pricingData, setPricingData] = useState<VariantPricingData[]>([]);

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
              maxItems: variant.maxItems ?? 0,
              maxItemTypes: variant.maxItemTypes ?? "none",
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
              maxItems: undefined as number | undefined,
              maxItemTypes: undefined as VariantAddonSelectionType | undefined,
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
    if (!group.isNew) {
      setDeletedVariantGroupIds((prev) => [...prev, group._id]);
      group?.variants?.forEach((variant) => {
        if (!variant.isNew) {
          setDeletedVariantIds((prev) => [...prev, variant._id]);
        }
      });
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
      maxItems: group.isPrimary ? 0 : undefined,
      maxItemTypes: group.isPrimary ? "none" : undefined,
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
    if (!group.isNew) {
      group?.variants?.forEach((variant, idx) => {
        if (!variant.isNew && idx === variantIndex) {
          setDeletedVariantIds((prev) => [...prev, variant._id]);
        }
      });
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

  const generatePricingData = (): VariantPricingData[] => {
    const newPricing: VariantPricingData[] = [];

    // Get primary variants (base variants)
    const primaryVariants = formData.variantGroups
      .filter((group) => group.isPrimary)
      .flatMap((group) =>
        group.variants.filter((variant) => variant.isPrimary),
      );

    if (primaryVariants.length === 0) {
      toast.error("Base variants are required!");
      return [];
    }

    // Check if all variant groups have variants
    for (const vGroup of formData.variantGroups) {
      if (vGroup.variants.length === 0) {
        toast.error("Variants are required!");
        return [];
      }
    }

    // Get non-primary variants (sub variants)
    const subVariants = formData.variantGroups.flatMap((group) =>
      group.variants.filter((variant) => !variant.isPrimary),
    );

    // Generate pricing for each primary variant
    for (const pVariant of primaryVariants) {
      const primaryGroup = formData.variantGroups.find((g) =>
        g.variants.some((v) => v._id === pVariant._id),
      );

      if (!primaryGroup) continue;

      // Create pricing for each sub variant combination with primary variant
      for (const sVariant of subVariants) {
        const existingPricing = pricing.find(
          (price) =>
            price.type === "variant" &&
            price.variantId === pVariant._id &&
            price.variantGroupId === primaryGroup._id &&
            price.subVariantId === sVariant._id,
        );

        if (existingPricing) {
          newPricing.push(existingPricing);
        } else {
          newPricing.push({
            _id: uuidv4(),
            isVisible: true,
            subVariantId: sVariant._id,
            variantGroupId: primaryGroup._id,
            variantId: pVariant._id,
            isNew: true,
            type: "variant",
            productId: itemId,
            price: 0,
          });
        }
      }
    }

    return newPricing;
  };

  const updatePricingField = (
    pricingId: string,
    field: keyof VariantPricingData,
    value: any,
  ) => {
    setPricingData((prev) =>
      prev.map((pricing) =>
        pricing._id === pricingId ? { ...pricing, [field]: value } : pricing,
      ),
    );
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
    setPricingData([]);
  };

  const handleSubmit = async () => {
    startSaving();

    if (!validateForm()) {
      stopSaving();
      return;
    }

    try {
      // Generate pricing data and move to step 2
      const pricing = generatePricingData();
      if (pricing.length === 0) {
        stopSaving();
        return;
      }
      setPricingData(pricing);
      setCurrentStep(2);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing variants");
    }

    stopSaving();
  };

  const handleFinalSubmit = async () => {
    if (!onSave) {
      toast.error("Save handler not provided");
      return;
    }

    startSaving();
    try {
      await onSave(
        formData,
        pricingData,
        deletedVariantIds,
        deletedVariantGroupIds,
      );
      toast.success("Variants and pricing saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving");
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
                            <>
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
                              <div className="flex items-end gap-1">
                                <Input
                                  label={variantIndex === 0 ? "Max Items" : ""}
                                  type="number"
                                  min={0}
                                  placeholder="0"
                                  value={variant.maxItems ?? 0}
                                  onChange={(e) =>
                                    updateVariantField(
                                      groupIndex,
                                      variantIndex,
                                      "maxItems",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-20"
                                />
                                <Select
                                  options={MAX_ITEM_TYPE_OPTIONS}
                                  value={findOptionByValue(
                                    MAX_ITEM_TYPE_OPTIONS,
                                    variant.maxItemTypes ?? "none",
                                  )}
                                  onChange={(option) =>
                                    updateVariantField(
                                      groupIndex,
                                      variantIndex,
                                      "maxItemTypes",
                                      (option as SelectOption<VariantAddonSelectionType>)
                                        ?.value ?? "none",
                                    )
                                  }
                                  isSearchable={false}
                                  width={110}
                                />
                              </div>
                            </>
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

      {/* Step 2 - Pricing Configuration */}
      {currentStep === 2 && (
        <div className="flex w-full flex-col gap-6">
          <div className="max-h-[60vh] overflow-auto">
            <Container
              title="Pricing Configuration"
              subtitle="Set up pricing for variant and addon combinations"
            >
              <div className="space-y-6">
                {formData.variantGroups
                  .filter((group) => group.isPrimary)
                  .flatMap((group) =>
                    group.variants.filter((variant) => variant.isPrimary),
                  )
                  .map((primaryVariant) => {
                    const primaryGroup = formData.variantGroups.find((g) =>
                      g.variants.some((v) => v._id === primaryVariant._id),
                    );

                    if (!primaryGroup) return null;

                    const variantPricing = pricingData.filter(
                      (p) => p.variantId === primaryVariant._id,
                    );
                    const subVariantPricing = variantPricing.filter(
                      (p) => p.type === "variant",
                    );

                    return (
                      <div
                        key={primaryVariant._id}
                        className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 rounded-xl border bg-white p-6"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {primaryVariant.label} - Base Price: ₹
                            {primaryVariant.price}
                          </h3>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Primary Variant
                          </span>
                        </div>

                        {subVariantPricing.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-nl-800 dark:text-nd-200 mb-4 font-medium">
                              Variant Pricing
                            </h4>

                            {formData.variantGroups
                              .filter((group) => !group.isPrimary)
                              .map((variantGroup) => {
                                const groupSubVariants =
                                  subVariantPricing.filter((p) => {
                                    const subVariant = formData.variantGroups
                                      .flatMap((g) => g.variants)
                                      .find((v) => v._id === p.subVariantId);
                                    return (
                                      subVariant &&
                                      variantGroup.variants.some(
                                        (v) => v._id === subVariant._id,
                                      )
                                    );
                                  });

                                if (groupSubVariants.length === 0) return null;

                                return (
                                  <div
                                    key={variantGroup._id}
                                    className="bg-nl-50 dark:bg-nd-800 mb-4 rounded-lg p-4"
                                  >
                                    <h5 className="text-nl-700 dark:text-nd-300 mb-3 font-medium">
                                      {variantGroup.label}
                                    </h5>
                                    <div className="space-y-2">
                                      {groupSubVariants.map((pricing) => {
                                        const subVariant =
                                          formData.variantGroups
                                            .flatMap((g) => g.variants)
                                            .find(
                                              (v) =>
                                                v._id === pricing.subVariantId,
                                            );

                                        if (!subVariant) return null;

                                        return (
                                          <div
                                            key={pricing._id}
                                            className="flex items-center justify-between"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="bg-nl-300 dark:bg-nd-500 h-4 w-4 rounded-full"></div>
                                              <span className="text-nl-700 dark:text-nd-300 text-sm">
                                                {subVariant.label}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-nl-500 text-sm">
                                                +₹
                                              </span>
                                              <Input
                                                type="number"
                                                step="0.01"
                                                value={pricing.price}
                                                onChange={(e) =>
                                                  updatePricingField(
                                                    pricing._id,
                                                    "price",
                                                    parseFloat(
                                                      e.target.value,
                                                    ) || 0,
                                                  )
                                                }
                                                className="w-20 text-right"
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </Container>
          </div>

          <div className="border-nl-200 dark:border-nd-600 flex w-full items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              type="button"
            >
              Back to Variants
            </Button>

            <div className="flex gap-2">
              {onSaveDraft && (
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  type="button"
                >
                  Save Draft
                </Button>
              )}

              <Button onClick={handleFinalSubmit} isLoading={isSaving}>
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantStepperForm;
