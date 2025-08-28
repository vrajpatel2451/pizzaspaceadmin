import { cn } from "@/utils/helpers";
import React from "react";

export type TooltipPosition = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  maxWidth?: number;
  offset?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  disabled = false,
  className = "",
  contentClassName = "",
  arrow = true,
  maxWidth = 250,
  offset = 8,
  size = "md",
}) => {
  if (!content) {
    return <div>{children}</div>;
  }

  if (disabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: offset,
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: offset,
        };
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: offset,
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: offset,
        };
      default:
        return {};
    }
  };

  const getArrowPosition = (): React.CSSProperties => {
    const base = {
      position: "absolute" as const,
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "inherit",
      transform: "rotate(45deg)",
    };

    switch (position) {
      case "top":
        return {
          ...base,
          bottom: "-0.25rem",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
        };
      case "right":
        return {
          ...base,
          left: "-0.25rem",
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
        };
      case "bottom":
        return {
          ...base,
          top: "-0.25rem",
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
        };
      case "left":
        return {
          ...base,
          right: "-0.25rem",
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)",
        };
      default:
        return {};
    }
  };

  const tooltipStyle: React.CSSProperties = {
    ...getPositionStyles(),
    maxWidth,
  };

  const sizeMap = {
    sm: "text-xs",
    md: "text-sm",
  };

  const baseTooltipClasses = `absolute z-50 px-1.5 py-0.5 truncate rounded-lg shadow-md bg-nl-500 dark:bg-nd-400 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none overflow-visible`;

  return (
    <div
      className={`group relative inline-block ${className}`}
      style={{ overflow: "visible" }}
    >
      <div className="inline-flex">{children}</div>
      <div
        role="tooltip"
        style={tooltipStyle}
        className={cn(sizeMap[size], baseTooltipClasses, contentClassName)}
      >
        {content}
        {arrow && <span style={getArrowPosition()} />}
      </div>
    </div>
  );
};

export default Tooltip;
