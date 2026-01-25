import { cn } from "@/utils/helpers";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";
import type { FC, ReactNode } from "react";

interface OrderStage {
  key: string;
  label: string;
  shortLabel: string;
  count: number;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

interface OrderPipelineProps {
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

const OrderPipeline: FC<OrderPipelineProps> = ({ data, isLoading }) => {
  const stages: OrderStage[] = [
    {
      key: "initiated",
      label: "Initiated",
      shortLabel: "Init",
      count: data?.initiatedOrders ?? 0,
      icon: <Clock className="h-4 w-4" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
      iconColor: "text-blue-500",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      shortLabel: "Conf",
      count: data?.confirmedNewOrders ?? 0,
      icon: <CheckCircle className="h-4 w-4" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
      iconColor: "text-green-500",
    },
    {
      key: "payment_error",
      label: "Payment Error",
      shortLabel: "Err",
      count: data?.paymentErrorOrders ?? 0,
      icon: <AlertCircle className="h-4 w-4" />,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-300",
      iconColor: "text-yellow-500",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      shortLabel: "Canc",
      count: data?.cancelledOrders ?? 0,
      icon: <XCircle className="h-4 w-4" />,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300",
      iconColor: "text-red-500",
    },
    {
      key: "preparing",
      label: "Preparing",
      shortLabel: "Prep",
      count: data?.ordersInPreparing ?? 0,
      icon: <Utensils className="h-4 w-4" />,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
      iconColor: "text-orange-500",
    },
    {
      key: "ready",
      label: "Ready",
      shortLabel: "Rdy",
      count: data?.readyToPickupOrders ?? 0,
      icon: <Package className="h-4 w-4" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
      iconColor: "text-purple-500",
    },
    {
      key: "on_way",
      label: "On Way",
      shortLabel: "Way",
      count: data?.onTheWayOrders ?? 0,
      icon: <Truck className="h-4 w-4" />,
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
      textColor: "text-cyan-700 dark:text-cyan-300",
      iconColor: "text-cyan-500",
    },
    {
      key: "delivered",
      label: "Delivered",
      shortLabel: "Done",
      count: data?.deliveredOrders ?? 0,
      icon: <CheckCircle className="h-4 w-4" />,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-700 dark:text-emerald-300",
      iconColor: "text-emerald-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white p-4">
        <div className="mb-3 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2 overflow-x-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-20 flex-shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white p-4">
      <h3 className="text-nl-700 dark:text-nd-200 mb-3 text-xs font-semibold uppercase tracking-wide">
        Order Pipeline
      </h3>
      <div className="flex items-center gap-1">
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex items-center">
            <div
              className={cn(
                "flex min-w-[72px] flex-col items-center rounded-lg px-3 py-2 transition-transform hover:scale-105",
                stage.bgColor,
              )}
            >
              <div className={cn("mb-1", stage.iconColor)}>{stage.icon}</div>
              <span className={cn("text-lg font-bold", stage.textColor)}>
                {stage.count}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  stage.textColor,
                  "opacity-70",
                )}
              >
                {stage.shortLabel}
              </span>
            </div>
            {index < stages.length - 1 && (
              <ChevronRight className="text-nl-300 dark:text-nd-600 mx-0.5 h-4 w-4 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPipeline;
