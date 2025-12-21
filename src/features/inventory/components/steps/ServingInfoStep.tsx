import { Input } from "@/components/base/Input";
import { Select, type SelectOption } from "@/components/base/Select";
import type { FC } from "react";
import { Controller } from "react-hook-form";
import { useProductWizard } from "../ProductWizardContext";

const dishSizeUnitOptions: SelectOption[] = [
  // Piece based
  { value: "piece", label: "Piece" },
  { value: "pieces", label: "Pieces" },
  { value: "slice", label: "Slice" },
  { value: "slices", label: "Slices" },
  { value: "pack", label: "Pack" },
  { value: "bucket", label: "Bucket" },
  { value: "platter", label: "Platter" },
  // Weight based
  { value: "gram", label: "Gram" },
  { value: "kilograms", label: "Kilograms" },
  { value: "mg", label: "Milligram" },
  { value: "pound", label: "Pound" },
  { value: "ounce", label: "Ounce" },
  // Volume based
  { value: "ml", label: "Milliliter" },
  { value: "liter", label: "Liter" },
  { value: "cup", label: "Cup" },
  { value: "pint", label: "Pint" },
  { value: "quart", label: "Quart" },
  { value: "gallon", label: "Gallon" },
  // Count based
  { value: "dozen", label: "Dozen" },
  { value: "half_dozen", label: "Half Dozen" },
];

const noOfPeopleOptions: SelectOption[] = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5", label: "5 people" },
  { value: "6", label: "6 people" },
  { value: "7", label: "7 people" },
  { value: "8", label: "8 people" },
  { value: "10", label: "10 people" },
  { value: "12", label: "12 people" },
];

const ServingInfoStep: FC = () => {
  const { form } = useProductWizard();

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Serving Info
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add serving info to improve customer experience
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6">
        {/* Number of People */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Number of people
          </label>
          <Controller
            name="noOfPeople"
            control={control}
            render={({ field }) => (
              <Select
                options={noOfPeopleOptions}
                value={noOfPeopleOptions.find(
                  (opt) => opt.value === String(field.value)
                )}
                onChange={(val) =>
                  field.onChange(parseInt((val as SelectOption).value, 10))
                }
                placeholder="Select number of people"
              />
            )}
          />
          {errors.noOfPeople && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.noOfPeople.message}
            </p>
          )}
        </div>

        {/* Dish Size */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Dish size
          </label>
          <Controller
            name="dishSize"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="1"
                  value={field.value.count}
                  onChange={(e) =>
                    field.onChange({
                      ...field.value,
                      count: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="flex-1"
                />
                <div className="w-40">
                  <Select
                    options={dishSizeUnitOptions}
                    value={dishSizeUnitOptions.find(
                      (option) => option.value === field.value.unit
                    )}
                    onChange={(val) =>
                      field.onChange({
                        ...field.value,
                        unit: (val as SelectOption).value,
                      })
                    }
                    placeholder="Unit"
                  />
                </div>
              </div>
            )}
          />
          {errors.dishSize && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.dishSize.count?.message || errors.dishSize.unit?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServingInfoStep;
