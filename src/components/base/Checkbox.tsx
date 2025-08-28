import React, { forwardRef } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/helpers";

const sizeClasses = {
  sm: {
    checkbox: "w-4 h-4",
    icon: "w-2.5 h-2.5",
    label: "text-sm",
    helper: "text-xs",
    gap: "gap-2",
    helperOffset: "ml-6",
    roundness: "rounded-sm",
  },
  md: {
    checkbox: "w-5 h-5",
    icon: "w-3 h-3",
    label: "text-sm",
    helper: "text-xs",
    gap: "gap-2.5",
    helperOffset: "ml-7.5",
    roundness: "rounded-md",
  },
  lg: {
    checkbox: "w-6 h-6",
    icon: "w-4 h-4",
    label: "text-base",
    helper: "text-sm",
    gap: "gap-3",
    helperOffset: "ml-9",
    roundness: "rounded-md",
  },
};

const checkboxBaseClasses = cn(
  "relative flex items-center justify-center border-[1.5px] transition-all duration-200 cursor-pointer",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-nd-800",
  "border-nl-300 dark:border-nd-500 bg-white dark:bg-nd-700",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-nl-300 dark:disabled:hover:border-nd-500",
  "disabled:hover:bg-white dark:disabled:hover:bg-nd-700",
);

const baseHoverClass =
  "hover:border-pl-400 dark:hover:border-pd-600 hover:bg-pl-50 dark:hover:bg-pd-500/40";

const checkedClasses = cn(
  "!border-[transparent] bg-pl-500 dark:bg-pd-500",
  "disabled:border-pl-300 dark:disabled:border-pd-300 disabled:bg-pl-300 dark:disabled:bg-pd-300",
);

const checkedHoverClass =
  "hover:border-[transparent] hover:bg-pl-600 dark:hover:bg-pd-600";

const errorClasses = cn(
  "border-dl-500 dark:border-dd-500",
  "hover:border-dl-600 dark:hover:border-dd-600",
  "focus-visible:ring-dl-500 dark:focus-visible:ring-dd-500",
);

const errorCheckedClasses = cn(
  "border-dl-500 dark:border-dd-500 bg-dl-500 dark:bg-dd-500",
  "hover:border-dl-600 dark:hover:border-dd-600 hover:bg-dl-600 dark:hover:bg-dd-600",
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  error?: string;
  indeterminate?: boolean;
  labelPosition?: "left" | "right";
  wrapperClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      label,
      helperText,
      error,
      indeterminate = false,
      labelPosition = "right",
      wrapperClassName,
      labelClassName,
      helperClassName,
      description,
      className,
      disabled,
      checked,
      id,
      ...props
    },
    ref,
  ) => {
    const sizeClass = sizeClasses[size];
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const getCheckboxClasses = () => {
      if (hasError) {
        return checked || indeterminate
          ? cn(
              checkboxBaseClasses,
              checkedHoverClass,
              errorCheckedClasses,
              className,
            )
          : cn(checkboxBaseClasses, baseHoverClass, errorClasses, className);
      }

      return checked || indeterminate
        ? cn(checkboxBaseClasses, checkedHoverClass, checkedClasses, className)
        : cn(checkboxBaseClasses, baseHoverClass, className);
    };

    const renderCheckbox = () => (
      <div className="relative shrink-0 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className="sr-only"
          disabled={disabled}
          checked={checked}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={cn(
            getCheckboxClasses(),
            sizeClass.checkbox,
            sizeClass.roundness,
            "flex size-5 shrink-0 items-center justify-center",
          )}
        >
          <span
            className={cn(
              "flex w-full shrink-0 items-center justify-center transition-opacity duration-200",
              checked || indeterminate ? "opacity-100" : "opacity-0",
            )}
          >
            {indeterminate ? (
              <Minus
                className={cn("text-nl-50 dark:text-white", sizeClass.icon)}
                strokeWidth={3}
              />
            ) : (
              <Check
                className={cn("text-nl-50 dark:text-white", sizeClass.icon)}
                strokeWidth={3}
              />
            )}
          </span>
        </label>
      </div>
    );

    const renderLabel = () => {
      if (!label) return null;

      return (
        <label
          htmlFor={checkboxId}
          className={cn(
            "text-nl-800 dark:text-nd-100 cursor-pointer leading-none font-medium select-none",
            disabled && "cursor-not-allowed opacity-50",
            sizeClass.label,
            labelClassName,
          )}
        >
          {label}
        </label>
      );
    };

    const renderHelperText = () => {
      const text = hasError ? error : helperText;
      if (!text && !description) return null;

      return (
        <div className="space-y-1">
          {text && (
            <p
              className={cn(
                "text-nl-600 dark:text-nd-300",
                hasError && "text-dl-500 dark:text-dd-500",
                sizeClass.helper,
                helperClassName,
              )}
            >
              {text}
            </p>
          )}
          {description && (
            <p className={cn("text-nl-500 dark:text-nd-400", sizeClass.helper)}>
              {description}
            </p>
          )}
        </div>
      );
    };

    const content = (
      <>
        {labelPosition === "left" && renderLabel()}
        {renderCheckbox()}
        {labelPosition === "right" && renderLabel()}
      </>
    );

    return (
      <div className={cn("inline-block", wrapperClassName)}>
        <div className={cn("flex items-start", sizeClass.gap)}>{content}</div>
        {(helperText || error || description) && (
          <div
            className={cn(
              "mt-1.5",
              labelPosition === "left" ? "mr-auto" : "ml-0",
              labelPosition === "right" && label && sizeClass.helperOffset,
            )}
          >
            {renderHelperText()}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
