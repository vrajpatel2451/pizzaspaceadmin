import { CheckCircle2, Pencil } from "lucide-react";
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
    setDeletedVariantIds,
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
            {/* Variants Summary */}
            {variantFormData.variantGroups.map((group) => (
              <div
                key={group._id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {group.label}
                  </span>
                  {group.isPrimary && (
                    <span className="rounded-full bg-pl-100 px-2 py-0.5 text-xs font-medium text-pl-700 dark:bg-pl-900 dark:text-pl-300">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {group.variants.map((variant) => (
                    <div
                      key={variant._id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-2 dark:bg-gray-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {variant.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${variant.price || 0}
                      </span>
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
