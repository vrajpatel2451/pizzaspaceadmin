import { cn } from "@/utils/helpers";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { FC, ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  secondaryLabel?: string;
  secondaryValue?: string | number;
  isLoading?: boolean;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

const MetricCard: FC<MetricCardProps> = ({
  icon,
  label,
  value,
  trend,
  secondaryLabel,
  secondaryValue,
  isLoading = false,
  iconBgColor = "bg-orange-100 dark:bg-orange-900/30",
  iconColor = "text-orange-500 dark:text-orange-400",
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "border-nl-200 dark:border-nd-600 dark:bg-nd-800 flex flex-col justify-between rounded-xl border bg-white p-5",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-3">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-nl-200 dark:border-nd-600 dark:bg-nd-800 flex flex-col justify-between rounded-xl border bg-white p-5 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            iconBgColor,
          )}
        >
          <span className={cn(iconColor, "[&>svg]:h-5 [&>svg]:w-5")}>{icon}</span>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trend.isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-nl-900 dark:text-nd-50 text-2xl font-bold">{value}</p>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="text-nl-500 dark:text-nd-400 text-sm font-medium">
            {label}
          </p>
          {secondaryLabel && secondaryValue !== undefined && (
            <p className="text-nl-400 dark:text-nd-500 text-xs">
              {secondaryLabel}: <span className="font-medium">{secondaryValue}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
