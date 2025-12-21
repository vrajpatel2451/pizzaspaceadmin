import { Button } from "@/components/base/Button";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { useCallback, type FC } from "react";
import AddonDialog from "../../addons/AddonDialog";
import type { AddonFormData, AddonPricingData } from "../../addons/AddonStepperForm";
import { useProductWizard } from "../ProductWizardContext";

const AddonsStep: FC = () => {
  const {
    addonFormData,
    setAddonFormData,
    addonPricingFormData,
    setAddonPricingFormData,
    isAddonDialogOpen,
    openAddonDialog,
    closeAddonDialog,
    allAddonGroups,
    allAddons,
    variantFormData,
    productId,
  } = useProductWizard();

  const handleSaveAddons = useCallback(
    (addonData: AddonFormData, pricingData: AddonPricingData[]) => {
      setAddonFormData(addonData);
      setAddonPricingFormData(pricingData);
      closeAddonDialog();
    },
    [setAddonFormData, setAddonPricingFormData, closeAddonDialog]
  );

  // Check if there are any selected addons
  const selectedAddonsCount =
    addonFormData?.reduce(
      (count, group) =>
        count + group.addons.filter((addon) => addon.isSelected).length,
      0
    ) || 0;

  const hasSelectedAddons = selectedAddonsCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Addons
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Allow customers to customize dishes with optional extras
        </p>
      </div>

      {/* Addons Content */}
      <div className="flex flex-col gap-4">
        {hasSelectedAddons ? (
          <>
            {/* Addons Summary */}
            <div className="rounded-lg border border-gray-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
                <span className="font-medium text-green-800 dark:text-green-300">
                  {selectedAddonsCount} Add-on
                  {selectedAddonsCount !== 1 ? "s" : ""} Selected
                </span>
              </div>

              <div className="space-y-2">
                {addonFormData
                  ?.filter((group) =>
                    group.addons.some((addon) => addon.isSelected)
                  )
                  .map((group) => {
                    const selectedAddons = group.addons.filter(
                      (a) => a.isSelected
                    );
                    return (
                      <div
                        key={group._id}
                        className="rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="mb-2">
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {group.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedAddons.map((addon) => (
                            <div
                              key={addon._id}
                              className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-700"
                            >
                              <span className="text-xs text-gray-700 dark:text-gray-200">
                                {addon.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Enter Pricing Button */}
            <Button onClick={openAddonDialog} className="w-full">
              Enter Pricing
            </Button>
          </>
        ) : (
          /* Empty State */
          <button
            type="button"
            onClick={openAddonDialog}
            className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-pl-400 hover:bg-pl-50 dark:border-gray-600 dark:hover:border-pl-500 dark:hover:bg-pd-900/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pl-100 dark:bg-pl-900">
              <PlusCircle className="h-5 w-5 text-pl-600 dark:text-pl-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Map Add-ons
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click to select add-ons for this product
            </span>
          </button>
        )}
      </div>

      {/* Addon Dialog */}
      {isAddonDialogOpen && (
        <AddonDialog
          addonGroups={allAddonGroups}
          addons={allAddons}
          formData={addonFormData}
          isOpen
          onClose={closeAddonDialog}
          onSave={handleSaveAddons}
          pricing={addonPricingFormData}
          productId={productId}
          variantFormData={variantFormData}
        />
      )}
    </div>
  );
};

export default AddonsStep;
