import { Input } from "@/components/base/Input";
import Switch from "@/components/base/Switch";
import { Button } from "@/components/base/Button";
import Container from "@/components/compound/Container";
import StoreMultiSelectDropdown from "@/features/company-management/components/StoreMultiSelectDropdown";
import type { ComboGroupFormData } from "@/types/product.types";
import { Copy, Edit2, Plus, Trash2 } from "lucide-react";
import { type FC } from "react";

interface ComboGroupFormProps {
  group: ComboGroupFormData;
  index: number;
  onUpdate: (updates: Partial<ComboGroupFormData>) => void;
  onRemove: () => void;
  onClone: () => void;
  onEditProducts: () => void;
}

const ComboGroupForm: FC<ComboGroupFormProps> = ({
  group,
  index,
  onUpdate,
  onRemove,
  onClone,
  onEditProducts,
}) => {
  return (
    <Container
      title={group.label || `Selection Group ${index + 1}`}
      isCollapsible
      defaultOpen={true}
    >
      <div className="flex flex-col gap-4">
        {/* Group Details */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Group Label"
            placeholder="e.g., Choose Your Pizzas"
            value={group.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Optional description"
            value={group.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
          />
          <div className="col-span-2">
            <StoreMultiSelectDropdown
              label="Group Stores"
              storeIds={group.storeIds || []}
              onChange={(ids) => onUpdate({ storeIds: ids })}
              placeholder="Select stores for this combo group"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Min Selection"
            type="number"
            min={1}
            value={group.minSelection}
            onChange={(e) => onUpdate({ minSelection: parseInt(e.target.value) || 1 })}
          />
          <Input
            label="Max Selection"
            type="number"
            min={1}
            value={group.maxSelection}
            onChange={(e) => onUpdate({ maxSelection: parseInt(e.target.value) || 1 })}
          />
          <div className="flex items-end">
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={group.allowCustomization}
                setChecked={(val) => onUpdate({ allowCustomization: val })}
                size="sm"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Allow Customization
              </span>
            </div>
          </div>
        </div>

        {/* Products Section - Just show count */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Products in this group
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {group.products.length}
              <span className="ml-1 text-sm font-normal text-gray-500">
                {group.products.length === 1 ? "product" : "products"}
              </span>
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEditProducts}
            startIcon={group.products.length > 0 ? <Edit2 size={16} /> : <Plus size={16} />}
          >
            {group.products.length > 0 ? "Edit Products" : "Add Products"}
          </Button>
        </div>

        {/* Group Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClone}
            startIcon={<Copy size={14} />}
          >
            Clone Group
          </Button>
          <Button
            type="button"
            variant="ghost"
            color="danger"
            size="sm"
            onClick={onRemove}
            startIcon={<Trash2 size={14} />}
          >
            Remove Group
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ComboGroupForm;
