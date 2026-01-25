import { cn } from "@/utils/helpers";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { FC } from "react";

type FormatType = "number" | "currency" | "rating" | "percent";

interface ComparisonCellProps {
  current: number;
  previous: number;
  format?: FormatType;
  showPercentChange?: boolean;
  className?: string;
}

const ComparisonCell: FC<ComparisonCellProps> = ({
  current,
  previous,
  format = "number",
  showPercentChange = true,
  className,
}) => {
  // Handle undefined/null values during tab transitions
  if (current == null || previous == null) {
    return (
      <div className={cn("flex flex-col gap-0.5", className)}>
        <span className="font-semibold text-slate-400 dark:text-slate-500">—</span>
      </div>
    );
  }

  const diff = current - previous;
  const percentChange =
    previous !== 0 ? ((current - previous) / previous) * 100 : current > 0 ? 100 : 0;

  const isPositive = diff > 0;
  const isNegative = diff < 0;
  const isNeutral = diff === 0;

  const formatValue = (value: number): string => {
    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case "rating":
        return value.toFixed(1);
      case "percent":
        return `${value.toFixed(1)}%`;
      case "number":
      default:
        return value.toLocaleString();
    }
  };

  const formatDiff = (): string => {
    if (format === "rating") {
      // For ratings, show absolute diff not percentage
      const absDiff = Math.abs(diff);
      return absDiff.toFixed(1);
    }
    if (showPercentChange) {
      return `${Math.abs(percentChange).toFixed(1)}%`;
    }
    return formatValue(Math.abs(diff));
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {formatValue(current)}
        {format === "rating" && (
          <span className="ml-0.5 text-amber-500">★</span>
        )}
      </span>
      <span
        className={cn(
          "flex items-center gap-0.5 text-xs font-medium",
          isPositive && "text-emerald-600 dark:text-emerald-400",
          isNegative && "text-red-600 dark:text-red-400",
          isNeutral && "text-slate-400 dark:text-slate-500",
        )}
      >
        {isPositive && <ArrowUp className="h-3 w-3" />}
        {isNegative && <ArrowDown className="h-3 w-3" />}
        {isNeutral && <Minus className="h-3 w-3" />}
        <span>{isNeutral ? "—" : formatDiff()}</span>
      </span>
    </div>
  );
};

export default ComparisonCell;
