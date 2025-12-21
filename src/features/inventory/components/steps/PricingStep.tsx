import { Input } from "@/components/base/Input";
import type { FC } from "react";
import { useProductWizard } from "../ProductWizardContext";

const PricingStep: FC = () => {
  const { form } = useProductWizard();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Pricing
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Keep same prices across menus offered for online ordering and in-restaurant dining
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6">
        {/* Base Price */}
        <div>
          <Input
            label="Base price"
            type="number"
            step="0.01"
            placeholder="0"
            {...register("basePrice", { valueAsNumber: true })}
            error={errors.basePrice?.message}
            rightElement={
              <span className="text-gray-400">$</span>
            }
          />
        </div>

        {/* Packing Charges */}
        <div>
          <Input
            label="Packing charges"
            type="number"
            step="0.01"
            placeholder="0"
            {...register("packagingCharges", { valueAsNumber: true })}
            error={errors.packagingCharges?.message}
            rightElement={
              <span className="text-gray-400">$</span>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PricingStep;
