import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { CheckCircle2, Pencil, Trash2, X } from "lucide-react";
import { useCallback, type FC } from "react";
import VariantDialog from "../../variants/VariantDialog";
import type { VariantFormData, VariantPricingData } from "../../variants/VariantStepperForm";
import { useProductWizard } from "../ProductWizardContext";

const VariantsStep: FC = () => {
  const {
    variantFormData,
    setVariantFormData,
    pricingFormData,
    setPricingFormData,
    deletedVariantIds,
    setDeletedVariantIds,
    deletedVariantGroupIds,
    setDeletedVariantGroupIds,
    isVariantDialogOpen,
    openVariantDialog,
    closeVariantDialog,
    allAddonGroups,
    allAddons,
    productId,
  } = useProductWizard();

  const handleSaveVariants = useCallback(
    (
      variantData: VariantFormData,
      pricingData: VariantPricingData[],
      deletedVariantIds: string[],
      deletedVariantGroupIds: string[]
    ) => {
      setVariantFormData(variantData);
      setPricingFormData(pricingData);
      setDeletedVariantIds(deletedVariantIds);
      setDeletedVariantGroupIds(deletedVariantGroupIds);
      closeVariantDialog();
    },
    [
      setVariantFormData,
      setPricingFormData,
      setDeletedVariantIds,
      setDeletedVariantGroupIds,
      closeVariantDialog,
    ]
  );

  // Remove a single variant from a group
  const handleRemoveVariant = useCallback(
    (groupId: string, variantId: string, isNew: boolean) => {
      const updatedGroups = variantFormData.variantGroups.map((group) =>
        group._id === groupId
          ? {
              ...group,
              variants: group.variants.filter((v) => v._id !== variantId),
            }
          : group
      );
      setVariantFormData({ variantGroups: updatedGroups });

      // Track deletion for existing variants (not new ones)
      if (!isNew) {
        setDeletedVariantIds([...deletedVariantIds, variantId]);
      }

      // Remove related pricing
      const updatedPricing = pricingFormData.filter(
        (p) => p.variantId !== variantId && p.subVariantId !== variantId
      );
      setPricingFormData(updatedPricing);
    },
    [variantFormData, pricingFormData, deletedVariantIds, setVariantFormData, setDeletedVariantIds, setPricingFormData]
  );

  // Remove an entire variant group
  const handleRemoveGroup = useCallback(
    (groupId: string, isNew: boolean, variantIds: { id: string; isNew: boolean }[]) => {
      const updatedGroups = variantFormData.variantGroups.filter((g) => g._id !== groupId);
      setVariantFormData({ variantGroups: updatedGroups });

      // Track deletion for existing group
      if (!isNew) {
        setDeletedVariantGroupIds([...deletedVariantGroupIds, groupId]);
      }

      // Track deletion for existing variants in the group
      const existingVariantIds = variantIds
        .filter((v) => !v.isNew)
        .map((v) => v.id);
      if (existingVariantIds.length > 0) {
        setDeletedVariantIds([...deletedVariantIds, ...existingVariantIds]);
      }

      // Remove related pricing
      const updatedPricing = pricingFormData.filter((p) => p.variantGroupId !== groupId);
      setPricingFormData(updatedPricing);
    },
    [variantFormData, pricingFormData, deletedVariantIds, deletedVariantGroupIds, setVariantFormData, setDeletedVariantGroupIds, setDeletedVariantIds, setPricingFormData]
  );

  // Clear all variants
  const handleClearAll = useCallback(() => {
    // Track all existing groups and variants for deletion
    const existingGroupIds = variantFormData.variantGroups
      .filter((g) => !g.isNew)
      .map((g) => g._id);
    const existingVariantIds = variantFormData.variantGroups
      .flatMap((g) => g.variants)
      .filter((v) => !v.isNew)
      .map((v) => v._id);

    if (existingGroupIds.length > 0) {
      setDeletedVariantGroupIds([...deletedVariantGroupIds, ...existingGroupIds]);
    }
    if (existingVariantIds.length > 0) {
      setDeletedVariantIds([...deletedVariantIds, ...existingVariantIds]);
    }

    // Clear all form data
    setVariantFormData({ variantGroups: [] });
    setPricingFormData([]);
  }, [
    variantFormData,
    deletedVariantIds,
    deletedVariantGroupIds,
    setVariantFormData,
    setPricingFormData,
    setDeletedVariantGroupIds,
    setDeletedVariantIds,
  ]);

  const hasVariants =
    variantFormData?.variantGroups && variantFormData.variantGroups.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Variants
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add size, flavor, or quantity options. Customers must select at least one variant to order.
        </p>
      </div>

      {/* Variants Content */}
      <div className="flex flex-col gap-4">
        {hasVariants ? (
          <>
            {/* Clear All Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                color="danger"
                size="sm"
                onClick={handleClearAll}
                startIcon={<Trash2 size={14} />}
              >
                Clear All
              </Button>
            </div>

            {/* Variants Summary */}
            {variantFormData.variantGroups.map((group) => (
              <div
                key={group._id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {group.label}
                    </span>
                    {group.isPrimary && (
                      <span className="rounded-full bg-pl-100 px-2 py-0.5 text-xs font-medium text-pl-700 dark:bg-pl-900 dark:text-pl-300">
                        Primary
                      </span>
                    )}
                  </div>
                  {/* Remove Group Button - only for non-primary groups */}
                  {!group.isPrimary && (
                    <IconButton
                      icon={Trash2}
                      size="xs"
                      onClick={() =>
                        handleRemoveGroup(
                          group._id,
                          group.isNew,
                          group.variants.map((v) => ({ id: v._id, isNew: v.isNew }))
                        )
                      }
                      ariaLabel="Remove group"
                      noDefaultFill
                      className="text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {group.variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="group flex items-center justify-between rounded-md bg-gray-50 px-4 py-2 dark:bg-gray-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {variant.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${variant.price || 0}
                        </span>
                        {/* Remove Variant Button - only if group has more than 1 variant */}
                        {group.variants.length > 1 && (
                          <IconButton
                            icon={X}
                            size="xs"
                            onClick={() =>
                              handleRemoveVariant(group._id, variant._id, variant.isNew)
                            }
                            ariaLabel="Remove variant"
                            noDefaultFill
                            className="text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Edit Variants Button */}
            <button
              type="button"
              onClick={openVariantDialog}
              className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-pl-400 hover:bg-pl-50 dark:border-gray-600 dark:hover:border-pl-500 dark:hover:bg-pd-900/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pl-100 dark:bg-pl-900">
                <Pencil className="h-5 w-5 text-pl-600 dark:text-pl-400" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Edit Variants
              </span>
            </button>
          </>
        ) : (
          /* Empty State */
          <button
            type="button"
            onClick={openVariantDialog}
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-pl-400 hover:bg-pl-50 dark:border-gray-600 dark:hover:border-pl-500 dark:hover:bg-pd-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pl-100 dark:bg-pl-900">
              <CheckCircle2 className="h-5 w-5 text-pl-600 dark:text-pl-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Variants
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click to add size, flavor, or other variant options
            </span>
          </button>
        )}
      </div>

      {/* Variant Dialog */}
      {isVariantDialogOpen && (
        <VariantDialog
          addonGroups={allAddonGroups}
          addons={allAddons}
          formData={variantFormData}
          isOpen
          onClose={closeVariantDialog}
          onSave={handleSaveVariants}
          pricing={pricingFormData}
          productId={productId}
        />
      )}
    </div>
  );
};

export default VariantsStep;
