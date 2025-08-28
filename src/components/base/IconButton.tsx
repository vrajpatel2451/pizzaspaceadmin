import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils/helpers";

const sizeVariants = {
  xs: { size: 16, stroke: 1.5, padding: 0.5 },
  sm: { size: 18, stroke: 1.5 },
  md: { size: 24, stroke: 1.8 },
  lg: { size: 28, stroke: 2 },
  xl: { size: 32, stroke: 2.5 },
} as const;

const colorVariants = {
  neutral: "text-nl-700 dark:text-nd-50",
} as const;

const bgColorVariants = {
  neutral: "bg-nl-100/60 dark:bg-nd-600",
} as const;

const hoverBgVariants = {
  neutral: `hover:bg-nl-100 active:bg-nl-200 dark:hover:bg-nd-500 dark:active:bg-nd-500 dark:hover:[&>svg]:text-nd-100 hover:[&>svg]:text-nl-700`,
} as const;

const paddingVariants = {
  xs: "p-1",
  sm: "p-1",
  md: "p-2",
  lg: "p-2.5",
  xl: "p-3",
} as const;

export interface IconButtonProps {
  icon: LucideIcon;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: keyof typeof sizeVariants | number;
  color?: keyof typeof colorVariants | string;
  strokeWidth?: number;
  disabled?: boolean;
  noDefaultFill?: boolean;
  disableHoverBg?: boolean;
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
  tabIndex?: number;
  iconSize?: number;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      onClick,
      size = "sm",
      color = "neutral",
      strokeWidth,
      disabled = false,
      disableHoverBg = false,
      noDefaultFill = false,
      className = "",
      iconClassName = "",
      ariaLabel,
      type = "button",
      tabIndex,
      iconSize,
    },
    ref,
  ) => {
    const sizeOfIcon =
      typeof size === "number" ? size : sizeVariants[size].size;
    const iconStroke =
      strokeWidth || (typeof size === "number" ? 1 : sizeVariants[size].stroke);

    const colorClass =
      color in colorVariants
        ? colorVariants[color as keyof typeof colorVariants]
        : color;

    const hoverBgClass =
      !disableHoverBg && !disabled && color in hoverBgVariants
        ? hoverBgVariants[color as keyof typeof hoverBgVariants]
        : "";

    const bgColorClass =
      !noDefaultFill && color in bgColorVariants
        ? bgColorVariants[color as keyof typeof bgColorVariants]
        : "";

    const baseClasses = [
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-lg",
      "transition-colors",
      "duration-200",
      "focus:outline-none",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "disabled:hover:bg-transparent",
    ];

    const buttonClasses = [
      ...baseClasses,
      colorClass,
      hoverBgClass,
      bgColorClass,
      typeof size === "string" && paddingVariants[size]
        ? paddingVariants[size]
        : "p-2",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const iconClasses = ["shrink-0", iconClassName].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(buttonClasses, onClick ? "cursor-pointer" : "")}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      >
        <Icon
          size={iconSize || sizeOfIcon}
          strokeWidth={iconStroke}
          className={iconClasses}
        />
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export type IconButtonSize = keyof typeof sizeVariants;
export type IconButtonColor = keyof typeof colorVariants;
