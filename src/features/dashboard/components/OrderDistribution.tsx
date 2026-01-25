import { cn } from "@/utils/helpers";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";
import { type FC, type ReactNode, useMemo } from "react";

interface OrderDistributionProps {
  data: {
    initiatedOrders?: number;
    confirmedNewOrders?: number;
    paymentErrorOrders?: number;
    cancelledOrders?: number;
    ordersInPreparing?: number;
    readyToPickupOrders?: number;
    onTheWayOrders?: number;
    deliveredOrders?: number;
  } | null;
  isLoading?: boolean;
}

interface StatusItem {
  key: string;
  label: string;
  shortLabel: string;
  value: number;
  icon: ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
}

const OrderDistribution: FC<OrderDistributionProps> = ({ data, isLoading }) => {
  const statuses: StatusItem[] = useMemo(
    () => [
      {
        key: "initiated",
        label: "Initiated",
        shortLabel: "Init",
        value: data?.initiatedOrders ?? 0,
        icon: <Clock className="h-3.5 w-3.5" />,
        color: "#3b82f6",
        bgColor: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      {
        key: "confirmed",
        label: "Confirmed",
        shortLabel: "Conf",
        value: data?.confirmedNewOrders ?? 0,
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        color: "#22c55e",
        bgColor: "bg-green-500",
        textColor: "text-green-600 dark:text-green-400",
      },
      {
        key: "preparing",
        label: "Preparing",
        shortLabel: "Prep",
        value: data?.ordersInPreparing ?? 0,
        icon: <Utensils className="h-3.5 w-3.5" />,
        color: "#f97316",
        bgColor: "bg-orange-500",
        textColor: "text-orange-600 dark:text-orange-400",
      },
      {
        key: "ready",
        label: "Ready",
        shortLabel: "Ready",
        value: data?.readyToPickupOrders ?? 0,
        icon: <Package className="h-3.5 w-3.5" />,
        color: "#a855f7",
        bgColor: "bg-purple-500",
        textColor: "text-purple-600 dark:text-purple-400",
      },
      {
        key: "onWay",
        label: "On Way",
        shortLabel: "Way",
        value: data?.onTheWayOrders ?? 0,
        icon: <Truck className="h-3.5 w-3.5" />,
        color: "#06b6d4",
        bgColor: "bg-cyan-500",
        textColor: "text-cyan-600 dark:text-cyan-400",
      },
      {
        key: "delivered",
        label: "Delivered",
        shortLabel: "Done",
        value: data?.deliveredOrders ?? 0,
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        color: "#10b981",
        bgColor: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400",
      },
      {
        key: "paymentError",
        label: "Payment Error",
        shortLabel: "Error",
        value: data?.paymentErrorOrders ?? 0,
        icon: <AlertCircle className="h-3.5 w-3.5" />,
        color: "#eab308",
        bgColor: "bg-yellow-500",
        textColor: "text-yellow-600 dark:text-yellow-400",
      },
      {
        key: "cancelled",
        label: "Cancelled",
        shortLabel: "Canc",
        value: data?.cancelledOrders ?? 0,
        icon: <XCircle className="h-3.5 w-3.5" />,
        color: "#ef4444",
        bgColor: "bg-red-500",
        textColor: "text-red-600 dark:text-red-400",
      },
    ],
    [data],
  );

  const totalOrders = useMemo(
    () => statuses.reduce((sum, s) => sum + s.value, 0),
    [statuses],
  );

  const activeOrders = useMemo(
    () =>
      (data?.initiatedOrders ?? 0) +
      (data?.confirmedNewOrders ?? 0) +
      (data?.ordersInPreparing ?? 0) +
      (data?.readyToPickupOrders ?? 0) +
      (data?.onTheWayOrders ?? 0),
    [data],
  );

  if (isLoading) {
    return (
      <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 flex-1 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        {/* Left: Title + Summary */}
        <div className="flex shrink-0 items-center gap-4">
          <div>
            <h3 className="text-nl-900 dark:text-nd-50 text-sm font-semibold">
              Orders
            </h3>
            <div className="text-nl-500 dark:text-nd-400 flex items-center gap-2 text-xs">
              <span>
                <span className="font-semibold text-orange-500">{activeOrders}</span> active
              </span>
              <span className="text-nl-300 dark:text-nd-600">•</span>
              <span>
                <span className="text-nl-900 dark:text-nd-50 font-semibold">{totalOrders}</span> total
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Stacked Progress Bar */}
        <div className="flex-1">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            {totalOrders > 0 ? (
              statuses.map((status) => {
                const percentage = (status.value / totalOrders) * 100;
                if (percentage === 0) return null;
                return (
                  <div
                    key={status.key}
                    className={cn("h-full transition-all", status.bgColor)}
                    style={{ width: `${percentage}%` }}
                    title={`${status.label}: ${status.value} (${percentage.toFixed(1)}%)`}
                  />
                );
              })
            ) : (
              <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        </div>

        {/* Right: Status Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-x-5">
          {statuses.map((status) => (
            <div
              key={status.key}
              className="flex items-center gap-1.5"
              title={status.label}
            >
              <span className={cn("flex items-center", status.textColor)}>
                {status.icon}
              </span>
              <span className={cn("text-base font-bold tabular-nums", status.textColor)}>
                {status.value}
              </span>
              <span className="text-nl-500 dark:text-nd-400 hidden text-xs sm:inline">
                {status.shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDistribution;
