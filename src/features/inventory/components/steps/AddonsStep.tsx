import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { CheckCircle2, PlusCircle, Trash2, X } from "lucide-react";
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

  // Remove a single addon (deselect it)
  const handleRemoveAddon = useCallback(
    (groupId: string, addonId: string) => {
      const updatedFormData = addonFormData.map((group) =>
        group._id === groupId
          ? {
              ...group,
              addons: group.addons.map((addon) =>
                addon._id === addonId
                  ? { ...addon, isSelected: false }
                  : addon
              ),
              // Update group selection - if no addons are selected, group is not selected
              isSelected: group.addons.some(
                (a) => a._id !== addonId && a.isSelected
              ),
            }
          : group
      );
      setAddonFormData(updatedFormData);

      // Remove related pricing for this addon
      const updatedPricing = addonPricingFormData.filter((p) => p.addonId !== addonId);
      setAddonPricingFormData(updatedPricing);
    },
    [addonFormData, addonPricingFormData, setAddonFormData, setAddonPricingFormData]
  );

  // Remove all addons in a group (deselect all)
  const handleRemoveGroup = useCallback(
    (groupId: string) => {
      const group = addonFormData?.find((g) => g._id === groupId);
      const addonIds = group?.addons.map((a) => a._id) || [];

      const updatedFormData = addonFormData.map((g) =>
        g._id === groupId
          ? {
              ...g,
              isSelected: false,
              addons: g.addons.map((addon) => ({
                ...addon,
                isSelected: false,
              })),
            }
          : g
      );
      setAddonFormData(updatedFormData);

      // Remove related pricing for all addons in this group
      const updatedPricing = addonPricingFormData.filter(
        (p) => p.addonGroupId !== groupId && !addonIds.includes(p.addonId || "")
      );
      setAddonPricingFormData(updatedPricing);
    },
    [addonFormData, addonPricingFormData, setAddonFormData, setAddonPricingFormData]
  );

  // Clear all addons (deselect all)
  const handleClearAll = useCallback(() => {
    const updatedFormData = addonFormData.map((group) => ({
      ...group,
      isSelected: false,
      addons: group.addons.map((addon) => ({
        ...addon,
        isSelected: false,
      })),
    }));
    setAddonFormData(updatedFormData);

    // Clear all addon pricing
    setAddonPricingFormData([]);
  }, [addonFormData, setAddonFormData, setAddonPricingFormData]);

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
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {group.label}
                          </span>
                          {/* Remove Group Button */}
                          <IconButton
                            icon={Trash2}
                            size="xs"
                            onClick={() => handleRemoveGroup(group._id)}
                            ariaLabel="Remove all addons in this group"
                            noDefaultFill
                            className="text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedAddons.map((addon) => (
                            <div
                              key={addon._id}
                              className="flex items-center gap-1 rounded-full bg-gray-50 py-1 pl-2.5 pr-1 dark:bg-gray-700"
                            >
                              <span className="text-xs text-gray-700 dark:text-gray-200">
                                {addon.label}
                              </span>
                              {/* Remove Addon Button */}
                              <IconButton
                                icon={X}
                                size="xs"
                                iconSize={12}
                                onClick={() =>
                                  handleRemoveAddon(group._id, addon._id)
                                }
                                ariaLabel="Remove addon"
                                noDefaultFill
                                className="text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                              />
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
