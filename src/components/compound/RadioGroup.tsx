import { cn } from "@/utils/helpers";
import React, { forwardRef } from "react";

export type RadioGroupSize = "sm" | "md" | "lg";
export type RadioGroupOrientation = "horizontal" | "vertical";

export interface RadioOption {
  label: string;
  value: string;
  helperText?: string;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  size: RadioGroupSize;
  orientation?: RadioGroupOrientation;
}

const sizeConfig = {
  sm: {
    radio: "h-3 w-3",
    indicator: "h-1.5 w-1.5",
    text: "text-sm",
    gap: "gap-2",
  },
  md: {
    radio: "h-4 w-4",
    indicator: "h-2 w-2",
    text: "text-base",
    gap: "gap-2.5",
  },
  lg: {
    radio: "h-5 w-5",
    indicator: "h-2.5 w-2.5",
    text: "text-lg",
    gap: "gap-4",
  },
};

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      name,
      disabled = false,
      size,
      orientation = "vertical",
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || "",
    );
    const currentValue = value ?? internalValue;

    const handleValueChange = (newValue: string) => {
      if (disabled) return;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const config = sizeConfig[size];

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-3",
          className,
        )}
        {...props}
      >
        {options.map((option) => {
          const isChecked = currentValue === option.value;
          const isDisabled = disabled || option.disabled;

          const handleChange = () => {
            if (!isDisabled) {
              handleValueChange(option.value);
            }
          };

          const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              handleChange();
            }
          };

          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center transition-opacity",
                config.gap,
                isDisabled && "cursor-not-allowed opacity-50",
              )}
            >
              <div className="relative flex shrink-0 items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border transition-all duration-200 ease-in-out",
                    config.radio,
                    isChecked
                      ? "border-pl-500 dark:border-pd-600"
                      : "border-nl-300 dark:border-nd-500",
                    !isDisabled && "hover:border-opacity-80",
                    "focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none",
                    "focus-visible:ring-pl-500 dark:focus-visible:ring-pd-400",
                  )}
                  tabIndex={isDisabled ? -1 : 0}
                  role="radio"
                  aria-checked={isChecked}
                  aria-disabled={isDisabled}
                  onKeyDown={handleKeyDown}
                >
                  {isChecked && (
                    <div
                      className={cn(
                        "rounded-full transition-all duration-200 ease-in-out",
                        config.indicator,
                        "bg-pl-500 dark:bg-pd-400",
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col">
                <p
                  className={cn(
                    "leading-tight font-medium",
                    config.text,
                    "text-nl-700 dark:text-nd-100",
                  )}
                >
                  {option.label}
                </p>
                {option.helperText && (
                  <p className="text-nl-600 dark:text-nd-300 mt-1 text-sm leading-tight">
                    {option.helperText}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
