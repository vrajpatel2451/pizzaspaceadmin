import { cn } from "@/utils/helpers";
import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, type InputHTMLAttributes, useState } from "react";
import Label from "./Label";
import ErrorText from "./ErrorText";

type InputHTMLAttributesWithoutConflicts = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
>;

export interface InputProps extends InputHTMLAttributesWithoutConflicts {
  label?: string;
  helperText?: string;
  error?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  required?: boolean;
  variant?: "outlined" | "filled" | "transparent";
  inputSize?: "sm" | "md" | "lg";
  togglePassword?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
  inputWrapperClassName?: string;
  className?: string;
  leftElementClassname?: string;
  rightElementClassname?: string;
  formProps?: any;
}

export type InputRef = HTMLInputElement;

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

const toggleButtonClasses =
  "cursor-pointer transition-colors duration-200 focus:outline-none text-nl-400 hover:text-nl-600 focus:text-primary-400";

const Input = forwardRef<InputRef, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      rightElement,
      leftElement,
      required = false,
      fullWidth = false,
      variant = "filled",
      inputSize = "md",
      type = "text",
      disabled = false,
      togglePassword = false,
      inputWrapperClassName,
      leftElementClassname = "",
      rightElementClassname = "",
      formProps,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const sizeClasses = {
      sm: "text-xs py-1.5 px-2.5",
      md: "text-sm py-1.5 md:py-2 px-3",
      lg: "text-sm py-2.5 md:py-3 px-3",
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

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div
        className={cn("space-y-1", fullWidth && "w-full", containerClassName)}
      >
        {label && <Label required={required}> {label} </Label>}
        <div
          className={cn(
            "flex overflow-hidden rounded-lg",
            getVariantClasses(),
            inputWrapperClassName,
          )}
        >
          {leftElement && (
            <div
              className={cn(
                "pointer-events-none flex aspect-square size-10 min-w-10 items-center justify-center",
                leftElementClassname,
              )}
            >
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full bg-transparent transition-colors outline-none",
              textClasses.primary,
              textClasses.placeholder,
              disabledClasses,
              sizeClasses[inputSize],
              leftElement && "pl-0",
              (rightElement || (togglePassword && type === "password")) &&
                "pr-3",
              className,
            )}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            {...props}
            {...formProps}
          />
          {(rightElement || (togglePassword && type === "password")) && (
            <div
              className={cn("flex items-center pr-2", rightElementClassname)}
            >
              {togglePassword && type === "password" ? (
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className={toggleButtonClasses}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ) : (
                rightElement
              )}
            </div>
          )}
        </div>
        {(helperText || error) && (
          <ErrorText className={error ? "text-dl-500" : textClasses.muted}>
            {error || helperText}
          </ErrorText>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
