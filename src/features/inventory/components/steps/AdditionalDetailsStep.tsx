import { Input } from "@/components/base/Input";
import type { SpiceLevel } from "@/types/product.types";
import { Flame, Plus, X } from "lucide-react";
import { useCallback, useState, type FC } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useProductWizard } from "../ProductWizardContext";

const spiceLevelOptions = [
  { value: "0_chilli", label: "Mild", icon: 1 },
  { value: "1_chilli", label: "Medium", icon: 2 },
  { value: "2_chilli", label: "Hot", icon: 3 },
];

const AdditionalDetailsStep: FC = () => {
  const { form } = useProductWizard();
  const [newTag, setNewTag] = useState("");
  const [newIngredient, setNewIngredient] = useState({ name: "", count: 0 });

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredientList",
  });

  const watchedTags = watch("tags");

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !watchedTags?.includes(newTag.trim())) {
      setValue("tags", [...(watchedTags || []), newTag.trim()]);
      setNewTag("");
    }
  }, [newTag, watchedTags, setValue]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setValue(
        "tags",
        watchedTags?.filter((tag) => tag !== tagToRemove) || []
      );
    },
    [watchedTags, setValue]
  );

  const handleAddIngredient = useCallback(() => {
    if (newIngredient.name.trim()) {
      addIngredient({
        name: newIngredient.name.trim(),
        count: newIngredient.count || 0,
      });
      setNewIngredient({ name: "", count: 0 });
    }
  }, [newIngredient, addIngredient]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Additional Details
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add extra information to provide more context about the product.
        </p>
      </div>

      {/* Ingredients */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Ingredients
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Type and press Enter to add a tag"
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient((prev) => ({ ...prev, name: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddIngredient();
              }
            }}
            className="flex-1"
            rightElement={
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-gray-400 hover:text-pl-500"
              >
                <Plus size={18} />
              </button>
            }
          />
        </div>
        {ingredientFields.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {ingredientFields.map((ingredient, index) => (
              <span
                key={ingredient.id}
                className="flex items-center gap-1 rounded-full bg-pl-100 px-3 py-1 text-sm text-pl-700 dark:bg-pd-900 dark:text-pd-300"
              >
                {ingredient.name}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="hover:text-pl-900 dark:hover:text-pd-100"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tags
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Type and press Enter to add a tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1"
            rightElement={
              <button
                type="button"
                onClick={handleAddTag}
                className="text-gray-400 hover:text-pl-500"
              >
                <Plus size={18} />
              </button>
            }
          />
        </div>
        {watchedTags && watchedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {watchedTags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded-full bg-pl-100 px-3 py-1 text-sm text-pl-700 dark:bg-pd-900 dark:text-pd-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-pl-900 dark:hover:text-pd-100"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Spice Level */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          Spice level
        </label>
        <Controller
          name="spiceLevel"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3">
              {spiceLevelOptions.map((option) => {
                const isSelected = field.value?.includes(
                  option.value as SpiceLevel
                );
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const current = field.value || [];
                      if (isSelected) {
                        field.onChange(
                          current.filter((level) => level !== option.value)
                        );
                      } else {
                        field.onChange([...current, option.value]);
                      }
                    }}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 px-6 py-4 transition-all ${
                      isSelected
                        ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: option.icon }).map((_, i) => (
                        <Flame
                          key={i}
                          size={16}
                          className={
                            isSelected
                              ? "text-red-500"
                              : "text-gray-400"
                          }
                        />
                      ))}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-red-700 dark:text-red-300"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
              {/* No Spice option */}
              <button
                type="button"
                onClick={() => {
                  field.onChange([]);
                }}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 px-6 py-4 transition-all ${
                  field.value?.length === 0
                    ? "border-gray-500 bg-gray-50 dark:border-gray-400 dark:bg-gray-700"
                    : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
                }`}
              >
                <div className="flex h-4 items-center">
                  <X size={16} className="text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  No Spice
                </span>
              </button>
            </div>
          )}
        />
      </div>

      {/* Frosting */}
      <Input
        label="Frosting"
        placeholder="Special frosting details"
        {...register("frosting")}
        error={errors.frosting?.message}
      />
    </div>
  );
};

export default AdditionalDetailsStep;
