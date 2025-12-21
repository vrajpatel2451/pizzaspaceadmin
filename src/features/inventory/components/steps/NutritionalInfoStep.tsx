import { Input } from "@/components/base/Input";
import Checkbox from "@/components/base/Checkbox";
import { Plus, X } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import { useProductWizard } from "../ProductWizardContext";

const commonAllergens = [
  "Gluten",
  "Egg",
  "Fish",
  "Milk",
  "Crustacean",
  "Tree nuts",
  "Peanut",
  "Soybeans",
  "Sulphide",
];

const NutritionalInfoStep: FC = () => {
  const { form } = useProductWizard();
  const [newAllergen, setNewAllergen] = useState("");

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const watchedAllergens = watch("allergicInfo");
  const watchedProtein = watch("protein");
  const watchedCarbs = watch("carbs");
  const watchedFats = watch("fats");

  // Calculate calories (approximate)
  const calculatedCalories = useMemo(() => {
    const protein = watchedProtein || 0;
    const carbs = watchedCarbs || 0;
    const fats = watchedFats || 0;
    // Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
    return Math.round(protein * 4 + carbs * 4 + fats * 9);
  }, [watchedProtein, watchedCarbs, watchedFats]);

  const handleAddAllergen = useCallback(() => {
    if (newAllergen.trim() && !watchedAllergens?.includes(newAllergen.trim())) {
      setValue("allergicInfo", [
        ...(watchedAllergens || []),
        newAllergen.trim(),
      ]);
      setNewAllergen("");
    }
  }, [newAllergen, watchedAllergens, setValue]);

  const handleRemoveAllergen = useCallback(
    (allergenToRemove: string) => {
      setValue(
        "allergicInfo",
        watchedAllergens?.filter((allergen) => allergen !== allergenToRemove) ||
          []
      );
    },
    [watchedAllergens, setValue]
  );

  const toggleCommonAllergen = useCallback(
    (allergen: string) => {
      const current = watchedAllergens || [];
      if (current.includes(allergen)) {
        setValue(
          "allergicInfo",
          current.filter((a) => a !== allergen)
        );
      } else {
        setValue("allergicInfo", [...current, allergen]);
      }
    },
    [watchedAllergens, setValue]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Nutritional Info
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add calorie counts, allergens, and other nutrition details
        </p>
      </div>

      {/* Show Nutrition Toggle */}
      <div className="flex items-center gap-2">
        <Checkbox id="showNutrition" defaultChecked />
        <label
          htmlFor="showNutrition"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          Show nutrition?
        </label>
      </div>

      {/* Nutritional Values */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Weight"
          type="number"
          step="0.1"
          placeholder="0"
          {...register("weight", { valueAsNumber: true })}
          error={errors.weight?.message}
          rightElement={<span className="text-gray-400 text-sm">g</span>}
        />

        <Input
          label="Protein"
          type="number"
          step="0.1"
          placeholder="0"
          {...register("protein", { valueAsNumber: true })}
          error={errors.protein?.message}
          rightElement={<span className="text-gray-400 text-sm">g</span>}
        />

        <Input
          label="Carbs"
          type="number"
          step="0.1"
          placeholder="0"
          {...register("carbs", { valueAsNumber: true })}
          error={errors.carbs?.message}
          rightElement={<span className="text-gray-400 text-sm">g</span>}
        />

        <Input
          label="Fat"
          type="number"
          step="0.1"
          placeholder="0"
          {...register("fats", { valueAsNumber: true })}
          error={errors.fats?.message}
          rightElement={<span className="text-gray-400 text-sm">g</span>}
        />

        <Input
          label="Fibres"
          type="number"
          step="0.1"
          placeholder="0"
          {...register("fiber", { valueAsNumber: true })}
          error={errors.fiber?.message}
          rightElement={<span className="text-gray-400 text-sm">g</span>}
        />

        {/* Calculated Calories */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Calories
          </label>
          <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 dark:border-gray-600 dark:bg-gray-800">
            <span className="text-gray-700 dark:text-gray-300">
              {calculatedCalories}
            </span>
            <span className="ml-1 text-sm text-gray-400">kcal</span>
          </div>
        </div>
      </div>

      {/* Allergen Info */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Allergen Info
        </label>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Does this dish contain any of this?
        </p>

        {/* Common Allergens */}
        <div className="flex flex-wrap gap-2">
          {commonAllergens.map((allergen) => {
            const isSelected = watchedAllergens?.includes(allergen);
            return (
              <button
                key={allergen}
                type="button"
                onClick={() => toggleCommonAllergen(allergen)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                  isSelected
                    ? "border-pl-500 bg-pl-50 text-pl-700 dark:border-pl-400 dark:bg-pl-900/30 dark:text-pl-300"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {allergen}
              </button>
            );
          })}
        </div>

        {/* Custom Allergens */}
        {watchedAllergens &&
          watchedAllergens.filter((a) => !commonAllergens.includes(a)).length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {watchedAllergens
                .filter((a) => !commonAllergens.includes(a))
                .map((allergen, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300"
                  >
                    {allergen}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergen(allergen)}
                      className="hover:text-red-900 dark:hover:text-red-100"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
            </div>
          )}

        {/* Add Custom Allergen */}
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Add custom allergen"
            value={newAllergen}
            onChange={(e) => setNewAllergen(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddAllergen();
              }
            }}
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleAddAllergen}
            className="flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NutritionalInfoStep;
