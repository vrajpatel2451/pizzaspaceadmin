import Dialog from "@/components/compound/Dialog";
import type { AdminTransformedOrder } from "@/types/order.types";
import { prettyDate } from "@/utils/formatDateTime";
import { CheckCircle } from "lucide-react";
import { type FC } from "react";

type Props = {
  order: AdminTransformedOrder;
  isOpen: boolean;
  onClose: () => void;
};

// Format status text
const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const OrderStatusHistoryDialog: FC<Props> = (props) => {
  const { isOpen, onClose, order } = props;

  // Sort status list by date (oldest first)
  const sortedStatusList = [...order.statusList].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Order Status"
      size="md"
      subTitle="View the complete order status history"
    >
      <div className="relative flex flex-col gap-0 py-2">
        {sortedStatusList.map((statusItem, index) => {
          const isLastItem = index === sortedStatusList.length - 1;
          const date = new Date(statusItem.createdAt);

          return (
            <div key={index} className="relative">
              {/* Vertical line connector */}
              {!isLastItem && (
                <div className="absolute left-[18px] top-[28px] h-[calc(100%+8px)] w-0.5 bg-nl-200 dark:bg-nd-600" />
              )}

              <div
                className={`relative flex items-start gap-3 rounded-lg p-3 ${
                  isLastItem
                    ? "bg-purple-50 dark:bg-purple-900/20"
                    : "hover:bg-nl-50 dark:hover:bg-nd-700"
                }`}
              >
                {/* Icon */}
                <div
                  className={`relative z-10 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                    isLastItem
                      ? "bg-purple-500 dark:bg-purple-600"
                      : "bg-nl-200 dark:bg-nd-600"
                  }`}
                >
                  <CheckCircle
                    size={12}
                    className={isLastItem ? "text-white" : "text-nl-500 dark:text-nd-300"}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isLastItem
                        ? "text-purple-900 dark:text-purple-100"
                        : "text-nl-900 dark:text-nd-50"
                    }`}
                  >
                    {formatStatus(statusItem.status)}
                  </p>
                  <p className="text-nl-600 dark:text-nd-400 mt-0.5 text-xs">
                    {prettyDate(date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};

export default OrderStatusHistoryDialog;
