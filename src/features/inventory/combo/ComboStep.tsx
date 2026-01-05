import { useCallback, type FC } from "react";
import { Plus } from "lucide-react";
import { useProductWizard } from "../components/ProductWizardContext";
import ComboGroupForm from "./ComboGroupForm";
import ComboProductPicker from "./ComboProductPicker";
import { ComboUtils } from "./ComboUtils";
import type { ComboGroupFormData, ComboGroupProductFormData } from "@/types/product.types";

const ComboStep: FC = () => {
  const {
    comboFormData,
    setComboFormData,
    deletedComboGroupIds,
    setDeletedComboGroupIds,
    isComboPickerOpen,
    openComboPicker,
    closeComboPicker,
    activeComboGroupId,
    setActiveComboGroupId,
  } = useProductWizard();

  // Add new combo group
  const handleAddGroup = useCallback(() => {
    const newGroup = ComboUtils.createEmptyGroup();
    setComboFormData([...comboFormData, newGroup]);
  }, [comboFormData, setComboFormData]);

  // Remove combo group
  const handleRemoveGroup = useCallback(
    (groupId: string, isNew: boolean) => {
      if (!isNew) {
        setDeletedComboGroupIds([...deletedComboGroupIds, groupId]);
      }
      setComboFormData(comboFormData.filter((g) => g._id !== groupId));
    },
    [comboFormData, deletedComboGroupIds, setComboFormData, setDeletedComboGroupIds]
  );

  // Clone combo group
  const handleCloneGroup = useCallback(
    (groupId: string) => {
      const groupToClone = comboFormData.find((g) => g._id === groupId);
      if (groupToClone) {
        const clonedGroup = ComboUtils.cloneGroup(groupToClone);
        setComboFormData([...comboFormData, clonedGroup]);
      }
    },
    [comboFormData, setComboFormData]
  );

  // Update group field
  const handleUpdateGroup = useCallback(
    (groupId: string, updates: Partial<ComboGroupFormData>) => {
      setComboFormData(
        comboFormData.map((g) => (g._id === groupId ? { ...g, ...updates } : g))
      );
    },
    [comboFormData, setComboFormData]
  );

  // Open product picker for a group
  const handleOpenPicker = useCallback(
    (groupId: string) => {
      setActiveComboGroupId(groupId);
      openComboPicker();
    },
    [setActiveComboGroupId, openComboPicker]
  );

  // Handle products selected from picker - replaces the entire product list
  const handleProductsSelected = useCallback(
    (products: ComboGroupProductFormData[]) => {
      if (!activeComboGroupId) return;

      setComboFormData(
        comboFormData.map((g) =>
          g._id === activeComboGroupId
            ? { ...g, products: products }
            : g
        )
      );
      closeComboPicker();
      setActiveComboGroupId(null);
    },
    [activeComboGroupId, comboFormData, setComboFormData, closeComboPicker, setActiveComboGroupId]
  );

  // Get existing products for the active group
  const existingProducts =
    activeComboGroupId
      ? comboFormData.find((g) => g._id === activeComboGroupId)?.products || []
      : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Combo Products
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create selection groups for your combo deal. Each group allows customers to choose products.
        </p>
      </div>

      {/* Combo Groups */}
      <div className="flex flex-col gap-4">
        {comboFormData.map((group, index) => (
          <ComboGroupForm
            key={group._id}
            group={group}
            index={index}
            onUpdate={(updates) => handleUpdateGroup(group._id, updates)}
            onRemove={() => handleRemoveGroup(group._id, group.isNew)}
            onClone={() => handleCloneGroup(group._id)}
            onEditProducts={() => handleOpenPicker(group._id)}
          />
        ))}

        {/* Add Group Button */}
        <button
          type="button"
          onClick={handleAddGroup}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-pl-400 hover:bg-pl-50 dark:border-gray-600 dark:hover:border-pl-500 dark:hover:bg-pd-900/20"
        >
          <Plus size={20} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Add Selection Group
          </span>
        </button>
      </div>

      {/* Product Picker Sheet */}
      <ComboProductPicker
        isOpen={isComboPickerOpen}
        onClose={() => {
          closeComboPicker();
          setActiveComboGroupId(null);
        }}
        onSelect={handleProductsSelected}
        existingProducts={existingProducts}
      />
    </div>
  );
};

export default ComboStep;
