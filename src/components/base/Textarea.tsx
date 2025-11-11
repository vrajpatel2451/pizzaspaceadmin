import { cn } from "@/utils/helpers";
import { forwardRef, type TextareaHTMLAttributes } from "react";
import Label from "./Label";
import ErrorText from "./ErrorText";

type TextareaHTMLAttributesWithoutConflicts = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
>;

export interface TextareaProps
  extends TextareaHTMLAttributesWithoutConflicts {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  variant?: "outlined" | "filled" | "transparent";
  textareaSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  containerClassName?: string;
  textareaWrapperClassName?: string;
  className?: string;
  rows?: number;
  showCharCount?: boolean;
  formProps?: any;
}

export type TextareaRef = HTMLTextAreaElement;

const borderClasses = {
  default: "border-nl-200",
  hover: "hover:border-nl-300",
  focus: "focus-within:border-nl-400 hover:focus-within:border-nl-400",
};

const dangerBorderClasses =
  "border-dl-500 hover:border-dl-400 focus-within:border-danger-500";

const textClasses = {
  primary: "text-nl-800",
  secondary: "text-nl-700",
  muted: "text-nl-500",
  placeholder: "placeholder:text-nl-400",
};

const backgroundClasses = {
  primary: "bg-white",
  secondary: "bg-nl-50",
  transparent: "bg-transparent",
};

const disabledClasses =
  "disabled:bg-nl-100 disabled:text-nl-400 disabled:cursor-not-allowed";

const Textarea = forwardRef<TextareaRef, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      required = false,
      fullWidth = false,
      variant = "filled",
      textareaSize = "md",
      disabled = false,
      textareaWrapperClassName,
      rows = 3,
      showCharCount = false,
      maxLength,
      value,
      formProps,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "text-xs py-1.5 px-2.5",
      md: "text-sm py-2 px-3",
      lg: "text-sm py-2.5 px-3",
    };

    const getVariantClasses = () => {
      const baseClasses = "border transition-all duration-200 ease-in-out";

      switch (variant) {
        case "outlined":
          return cn(
            baseClasses,
            backgroundClasses.secondary,
            error
              ? dangerBorderClasses
              : cn(
                  borderClasses.default,
                  borderClasses.hover,
                  borderClasses.focus,
                ),
          );
        case "filled":
          return cn(
            baseClasses,
            backgroundClasses.primary,
            error
              ? dangerBorderClasses
              : cn(
                  borderClasses.default,
                  borderClasses.hover,
                  borderClasses.focus,
                ),
          );
        case "transparent":
          return cn(
            baseClasses,
            backgroundClasses.transparent,
            "border-transparent",
            error
              ? dangerBorderClasses
              : cn(borderClasses.hover, borderClasses.focus),
          );
        default:
          return baseClasses;
      }
    };

    const currentLength =
      typeof value === "string" ? value.length : value?.toString().length || 0;

    return (
      <div
        className={cn("space-y-1", fullWidth && "w-full", containerClassName)}
      >
        {label && <Label required={required}> {label} </Label>}
        <div
          className={cn(
            "rounded-lg",
            getVariantClasses(),
            textareaWrapperClassName,
          )}
        >
          <textarea
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            value={value}
            className={cn(
              "w-full bg-transparent transition-colors outline-none resize-none",
              textClasses.primary,
              textClasses.placeholder,
              disabledClasses,
              sizeClasses[textareaSize],
              className,
            )}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            {...props}
            {...formProps}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          {(helperText || error) && (
            <ErrorText className={error ? "text-dl-500" : textClasses.muted}>
              {error || helperText}
            </ErrorText>
          )}
          {showCharCount && maxLength && (
            <span
              className={cn(
                "text-xs",
                currentLength >= maxLength ? "text-dl-500" : textClasses.muted,
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
