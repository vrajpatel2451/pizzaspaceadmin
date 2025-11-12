import { Button } from "@/components/base/Button";
import { Checkbox } from "@/components/base/Checkbox";
import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import Container from "@/components/compound/Container";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import type {
  AddonGroupResponse,
  AddonResponse,
} from "@/types/addon.types";
import { Check, ChevronDown, ChevronRight, RefreshCcw } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import type { VariantFormData } from "../variants/VariantStepperForm";
import { AddonUtils } from "./AddonUtils";

export interface AddonData {
  _id: string;
  label: string;
  price: number;
  groupId: string;
  isSelected: boolean;
}

export interface AddonGroupData {
  _id: string;
  label: string;
  allowMulti: boolean;
  min: number;
  max: number;
  description: string;
  isSelected: boolean;
  addons: AddonData[];
}

export type AddonFormData = AddonGroupData[] | null;

export interface AddonPricingData {
  _id: string;
  type: "addonGroup" | "addon";
  variantId?: string;
  variantGroupId?: string;
  addonGroupId?: string;
  addonId?: string;
  productId?: string;
  isVisible: boolean;
  price: number;
  isNew: boolean;
}

type AddonStepperFormProps = {
  defaultValue?: AddonFormData;
  itemId?: string;
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
  pricing?: AddonPricingData[];
  variantFormData: VariantFormData | null;
  onSave?: (
    addonData: AddonFormData,
    pricingData: AddonPricingData[],
  ) => void;
};

const AddonStepperForm: FC<AddonStepperFormProps> = (props) => {
  const {
    defaultValue,
    itemId,
    pricing = [],
    addonGroups,
    addons,
    variantFormData,
    onSave,
  } = props;

  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState<AddonFormData>(
    defaultValue ||
      addonGroups.map((group) => ({
        _id: group._id,
        label: group.label,
        allowMulti: group.allowMulti,
        min: group.min,
        max: group.max,
        description: group.description,
        isSelected: false,
        addons:
          addons
            ?.filter((a) => a.groupId === group._id)
            .map((addon) => ({
              _id: addon._id,
              label: addon.label,
              price: addon.price,
              groupId: addon.groupId,
              isSelected: false,
            })) || [],
      })),
  );

  // Pricing state for step 2 - initialize with existing pricing
  const [pricingData, setPricingData] = useState<AddonPricingData[]>(pricing);

  // UI state for collapsible groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const {
    isOpen: isSaving,
    open: startSaving,
    close: stopSaving,
  } = useToggle();

  // Extract primary variants if they exist
  const primaryVariants = AddonUtils.extractPrimaryVariants(variantFormData);
  const hasPrimaryVariants = primaryVariants.length > 0;

  // Update pricing data when prop changes
  useEffect(() => {
    if (pricing?.length > 0) {
      setPricingData(pricing);
    }
  }, [pricing]);

  // Update form data when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setFormData(defaultValue);
    }
  }, [defaultValue]);

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleGroupSelectionChange = (groupIndex: number, isSelected: boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;

      return prev.map((group, index) => {
        if (index === groupIndex) {
          return {
            ...group,
            isSelected,
            addons: group.addons.map((addon) => ({
              ...addon,
              isSelected,
            })),
          };
        }
        return group;
      });
    });
  };

  const handleAddonSelectionChange = (
    groupIndex: number,
    addonIndex: number,
    isSelected: boolean,
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;

      return prev.map((group, gIndex) => {
        if (gIndex === groupIndex) {
          const updatedAddons = group.addons.map((addon, aIndex) =>
            aIndex === addonIndex ? { ...addon, isSelected } : addon,
          );

          // Update group selection based on addon selections
          const hasSelectedAddons = updatedAddons.some((a) => a.isSelected);

          return {
            ...group,
            addons: updatedAddons,
            isSelected: hasSelectedAddons,
          };
        }
        return group;
      });
    });
  };

  const validateSelection = (): boolean => {
    if (!formData) return false;

    const hasSelectedAddons = formData.some((group) =>
      group.addons.some((addon) => addon.isSelected),
    );

    if (!hasSelectedAddons) {
      toast.error("Please select at least one addon");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    startSaving();

    if (!validateSelection()) {
      stopSaving();
      return;
    }

    try {
      // Generate pricing data and move to step 2
      const pricing = AddonUtils.generateAddonPricingData(
        formData,
        variantFormData,
        pricingData.length > 0 ? pricingData : [],
        itemId,
      );

      if (pricing.length === 0) {
        toast.error("No pricing data generated");
        stopSaving();
        return;
      }

      setPricingData(pricing);
      setCurrentStep(2);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing addons");
    }

    stopSaving();
  };

  const handleFinalSubmit = () => {
    if (!onSave) {
      toast.error("Save handler not provided");
      return;
    }

    startSaving();
    try {
      onSave(formData, pricingData);
      toast.success("Addons saved successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while saving");
    }
    stopSaving();
  };

  const updatePricingField = (
    pricingId: string,
    field: keyof AddonPricingData,
    value: any,
  ) => {
    setPricingData((prev) =>
      prev.map((pricing) =>
        pricing._id === pricingId ? { ...pricing, [field]: value } : pricing,
      ),
    );
  };

  const handleReset = () => {
    setFormData(
      addonGroups.map((group) => ({
        _id: group._id,
        label: group.label,
        allowMulti: group.allowMulti,
        min: group.min,
        max: group.max,
        description: group.description,
        isSelected: false,
        addons:
          addons
            ?.filter((a) => a.groupId === group._id)
            .map((addon) => ({
              _id: addon._id,
              label: addon.label,
              price: addon.price,
              groupId: addon.groupId,
              isSelected: false,
            })) || [],
      })),
    );
    setPricingData([]);
    setCurrentStep(1);
  };

  const steps = [
    { id: 1, name: "Selection", description: "Select addons to map" },
    { id: 2, name: "Pricing", description: "Configure addon pricing" },
  ];

  // Get selected addons count
  const selectedAddonsCount =
    formData?.reduce(
      (count, group) =>
        count + group.addons.filter((addon) => addon.isSelected).length,
      0,
    ) || 0;

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
        {currentStep === 1 && selectedAddonsCount > 0 && (
          <span className="bg-pl-100 text-pl-700 dark:bg-pd-900 dark:text-pd-300 rounded-full px-3 py-1 text-sm font-medium">
            {selectedAddonsCount} addon{selectedAddonsCount !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {/* Warning if no variants configured */}
      {!hasPrimaryVariants && currentStep === 1 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 rounded-lg border p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Note:</strong> No variants detected for this product. Addon
            pricing will be configured at the product level (not per variant).
            Consider configuring variants first for more flexible pricing options.
          </p>
        </div>
      )}

      {/* Step 1 Content - Addon Selection */}
      {currentStep === 1 && (
        <div className="flex w-full flex-col gap-6">
          <div className="max-h-[60vh] overflow-auto">
            <Container
              title="Addon Selection"
              subtitle="Select which addon groups and addons apply to this product"
            >
              <div className="space-y-4">
                {formData?.map((group, groupIndex) => {
                  const isExpanded = expandedGroups.has(group._id);
                  const selectedCount = group.addons.filter(
                    (a) => a.isSelected,
                  ).length;

                  return (
                    <div
                      key={group._id}
                      className={`rounded-xl border-2 transition-all ${
                        group.isSelected || selectedCount > 0
                          ? "border-pl-300 bg-pl-50/50 dark:border-pd-400 dark:bg-pd-900/20"
                          : "border-nl-200 dark:border-nd-500 dark:bg-nd-700 bg-white"
                      }`}
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={group.isSelected}
                            onChange={(e) =>
                              handleGroupSelectionChange(groupIndex, e.target.checked)
                            }
                          />
                          <div>
                            <h4 className="text-nl-800 dark:text-nd-200 font-semibold">
                              {group.label}
                            </h4>
                            <p className="text-nl-500 dark:text-nd-400 text-sm">
                              {group.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {selectedCount > 0 && (
                            <span className="bg-pl-100 text-pl-700 dark:bg-pd-800 dark:text-pd-200 rounded-full px-2 py-1 text-xs font-medium">
                              {selectedCount} of {group.addons.length} selected
                            </span>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleGroupExpansion(group._id)}
                          >
                            {isExpanded ? (
                              <ChevronDown size={20} />
                            ) : (
                              <ChevronRight size={20} />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Addon List */}
                      {isExpanded && (
                        <div className="border-nl-200 dark:border-nd-600 border-t p-4">
                          <div className="space-y-2">
                            {group.addons.map((addon, addonIndex) => (
                              <div
                                key={addon._id}
                                className={`bg-nl-50 dark:bg-nd-800 flex items-center justify-between rounded-lg p-3 transition-all ${
                                  addon.isSelected
                                    ? "ring-2 ring-pl-300 dark:ring-pd-400"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={addon.isSelected}
                                    onChange={(e) =>
                                      handleAddonSelectionChange(
                                        groupIndex,
                                        addonIndex,
                                        e.target.checked,
                                      )
                                    }
                                  />
                                  <span className="text-nl-700 dark:text-nd-300 font-medium">
                                    {addon.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-nl-500 dark:text-nd-400 text-sm">
                                    Default Price:
                                  </span>
                                  <span className="text-nl-700 dark:text-nd-300 font-semibold">
                                    ₹{addon.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Container>
          </div>

          {/* Form Actions */}
          <div className="border-nl-200 dark:border-nd-600 flex w-full items-center justify-between border-t pt-4">
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
              onClick={handleSubmit}
              isLoading={isSaving}
              endIcon={<ChevronRight size={20} />}
              disabled={selectedAddonsCount === 0}
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
              title="Addon Pricing Configuration"
              subtitle={
                hasPrimaryVariants
                  ? "Set pricing and visibility for each variant × addon combination"
                  : "Set pricing and visibility for each addon"
              }
            >
              <div className="space-y-6">
                {hasPrimaryVariants ? (
                  // Variant-specific pricing
                  primaryVariants.map((primaryVariant) => {
                    const variantPricing = pricingData.filter(
                      (p) => p.variantId === primaryVariant._id,
                    );
                    const addonPricing = variantPricing.filter(
                      (p) => p.type === "addon",
                    );

                    if (addonPricing.length === 0) return null;

                    return (
                      <div
                        key={primaryVariant._id}
                        className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 rounded-xl border bg-white p-6"
                      >
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {primaryVariant.label}
                          </h3>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            Primary Variant
                          </span>
                        </div>

                        {formData
                          ?.filter((group) =>
                            group.addons.some((a) => a.isSelected),
                          )
                          .map((addonGroup) => {
                            const groupAddons = addonPricing.filter(
                              (p) =>
                                p.addonId &&
                                formData
                                  ?.find((g) => g._id === addonGroup._id)
                                  ?.addons.find(
                                    (a) => a._id === p.addonId && a.isSelected,
                                  ),
                            );

                            if (groupAddons.length === 0) return null;

                            return (
                              <div
                                key={addonGroup._id}
                                className="bg-nl-50 dark:bg-nd-800 mb-4 rounded-lg p-4"
                              >
                                <h5 className="text-nl-700 dark:text-nd-300 mb-3 font-medium">
                                  {addonGroup.label}
                                </h5>
                                <div className="space-y-2">
                                  {groupAddons.map((pricing) => {
                                    const addon = formData
                                      ?.flatMap((g) => g.addons)
                                      .find((a) => a._id === pricing.addonId);

                                    if (!addon) return null;

                                    return (
                                      <div
                                        key={pricing._id}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Switch
                                            checked={pricing.isVisible}
                                            setChecked={(checked) =>
                                              updatePricingField(
                                                pricing._id,
                                                "isVisible",
                                                checked,
                                              )
                                            }
                                          />
                                          <span className="text-nl-700 dark:text-nd-300 text-sm">
                                            {addon.label}
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
                                                parseFloat(e.target.value) || 0,
                                              )
                                            }
                                            className="w-20 text-right"
                                            disabled={!pricing.isVisible}
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
                    );
                  })
                ) : (
                  // Product-level pricing (no variants)
                  <div className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 rounded-xl border bg-white p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        Product-Level Addons
                      </h3>
                      <p className="text-nl-500 dark:text-nd-400 text-sm">
                        Configure pricing for all addons
                      </p>
                    </div>

                    {formData
                      ?.filter((group) =>
                        group.addons.some((a) => a.isSelected),
                      )
                      .map((addonGroup) => {
                        const groupAddons = pricingData.filter(
                          (p) =>
                            p.type === "addon" &&
                            p.addonId &&
                            formData
                              ?.find((g) => g._id === addonGroup._id)
                              ?.addons.find(
                                (a) => a._id === p.addonId && a.isSelected,
                              ),
                        );

                        if (groupAddons.length === 0) return null;

                        return (
                          <div
                            key={addonGroup._id}
                            className="bg-nl-50 dark:bg-nd-800 mb-4 rounded-lg p-4"
                          >
                            <h5 className="text-nl-700 dark:text-nd-300 mb-3 font-medium">
                              {addonGroup.label}
                            </h5>
                            <div className="space-y-2">
                              {groupAddons.map((pricing) => {
                                const addon = formData
                                  ?.flatMap((g) => g.addons)
                                  .find((a) => a._id === pricing.addonId);

                                if (!addon) return null;

                                return (
                                  <div
                                    key={pricing._id}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={pricing.isVisible}
                                        setChecked={(checked) =>
                                          updatePricingField(
                                            pricing._id,
                                            "isVisible",
                                            checked,
                                          )
                                        }
                                      />
                                      <span className="text-nl-700 dark:text-nd-300 text-sm">
                                        {addon.label}
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
                                            parseFloat(e.target.value) || 0,
                                          )
                                        }
                                        className="w-20 text-right"
                                        disabled={!pricing.isVisible}
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
            </Container>
          </div>

          <div className="border-nl-200 dark:border-nd-600 flex w-full items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              type="button"
            >
              Back to Selection
            </Button>

            <Button onClick={handleFinalSubmit} isLoading={isSaving}>
              Save Configuration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddonStepperForm;
