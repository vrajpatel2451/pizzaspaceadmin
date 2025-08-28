import { X } from "lucide-react";
import React from "react";
import { cn } from "../../utils/helpers";

export type ChipColor =
  | "gray"
  | "blue"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "green"
  | "teal"
  | "pink"
  | "indigo"
  | "sky";

interface ChipProps {
  label: string;
  color?: ChipColor;
  className?: string;
  isCollapsible?: boolean;
  onCollapse?: (e: any) => void;
}

const colorMap: Record<ChipColor, { bg: string; text: string }> = {
  gray: {
    bg: "bg-gray-100 dark:bg-neutral-800",
    text: "text-gray-600 dark:text-nd-100",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-800 dark:text-blue-300",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-950",
    text: "text-red-800 dark:text-red-300",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-800 dark:text-purple-300",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-600 dark:text-orange-300",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-800 dark:text-green-500",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950",
    text: "text-teal-700 dark:text-teal-300",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950",
    text: "text-pink-600 dark:text-pink-400",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950",
    text: "text-indigo-600 dark:text-indigo-200",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950",
    text: "text-sky-600 dark:text-sky-200",
  },
};

const Chip: React.FC<ChipProps> = ({
  label,
  color = "gray",
  className = "",
  isCollapsible = false,
  onCollapse,
}) => {
  const { bg, text } = colorMap[color];

  if (!label) return "No Chip Label";

  return (
    <div
      className={cn(
        `inline-flex items-center justify-center rounded-lg px-1.5 py-1`,
        bg,
        className,
      )}
    >
      <span className={cn("text-sm font-semibold", text)}>{label}</span>
      {isCollapsible && (
        <X
          size={16}
          onClick={onCollapse}
          className="ml-1 cursor-pointer"
          strokeWidth={1.2}
        />
      )}
    </div>
  );
};

export default Chip;
