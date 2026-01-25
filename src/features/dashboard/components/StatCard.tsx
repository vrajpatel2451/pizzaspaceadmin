import { cn } from "@/utils/helpers";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { FC, ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  variant?: "default" | "compact";
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  isLoading = false,
  variant = "default",
  iconBgColor = "bg-orange-100 dark:bg-orange-900/30",
  iconColor = "text-orange-500 dark:text-orange-400",
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white",
          variant === "compact" ? "p-4" : "p-6",
        )}
      >
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
              variant === "compact" ? "h-10 w-10" : "h-12 w-12",
            )}
          />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className={cn(variant === "compact" ? "mt-3" : "mt-4")}>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div
            className={cn(
              "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
              variant === "compact" ? "mt-1 h-6 w-16" : "mt-1 h-8 w-20",
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white transition-shadow hover:shadow-sm",
        variant === "compact" ? "p-4" : "p-6",
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg",
            iconBgColor,
            variant === "compact" ? "h-10 w-10" : "h-12 w-12",
          )}
        >
          <span className={cn(iconColor, "[&>svg]:h-5 [&>svg]:w-5")}>
            {icon}
          </span>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className={cn(variant === "compact" ? "mt-3" : "mt-4")}>
        <p
          className={cn(
            "text-nl-500 dark:text-nd-400 font-medium",
            variant === "compact" ? "text-xs" : "text-sm",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-nl-800 dark:text-nd-100 font-semibold",
            variant === "compact" ? "mt-0.5 text-xl" : "mt-1 text-2xl",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
