import Chip, { type ChipColor } from "@/components/base/Chip";
import { Popover } from "@/components/compound/Popover";
import type { AdminTransformedOrder, OrderStatus } from "@/types/order.types";
import { CurrencyUtils } from "@/utils/currencyUtils";
import { prettyDate } from "@/utils/formatDateTime";
import { Eye, MoreVertical, Truck, RefreshCw } from "lucide-react";
import { type FC } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/helpers";

type Props = {
  order: AdminTransformedOrder;
};

// Status color mapping based on order status
const getStatusColor = (status: OrderStatus): ChipColor => {
  switch (status) {
    case "delivered":
      return "green";
    case "preparing":
    case "ready_to_pickup":
    case "on_the_way":
      return "purple";
    case "initiated":
    case "payment_confirmed":
      return "orange";
    case "cancelled":
    case "payment_error":
      return "red";
    default:
      return "gray";
  }
};

// Border color mapping
const getBorderColor = (status: OrderStatus): string => {
  switch (status) {
    case "delivered":
      return "border-t-green-500";
    case "preparing":
    case "ready_to_pickup":
    case "on_the_way":
      return "border-t-purple-500";
    case "initiated":
    case "payment_confirmed":
      return "border-t-orange-500";
    case "cancelled":
    case "payment_error":
      return "border-t-red-500";
    default:
      return "border-t-gray-500";
  }
};

// Format status text
const formatStatus = (status: OrderStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const OrderCard: FC<Props> = ({ order }) => {
  const {
    _id,
    status,
    customer,
    seller,
    payment,
    items,
    billing,
    createdDate,
  } = order;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = billing?.customerTotal?.total || 0;

  // Placeholder handlers for actions
  const handleViewDetails = () => {
    toast.info(`View details for order ${_id} - Coming soon!`);
  };

  const handleAssignDelivery = () => {
    toast.info(`Assign delivery for order ${_id} - Coming soon!`);
  };

  const handleChangeStatus = () => {
    toast.info(`Change status for order ${_id} - Coming soon!`);
  };

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleViewDetails}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
      <button
        onClick={handleAssignDelivery}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Truck size={16} />
        <span>Assign Delivery Boy</span>
      </button>
      <button
        onClick={handleChangeStatus}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <RefreshCw size={16} />
        <span>Change Status</span>
      </button>
    </div>
  );

  return (
    <div
      className={cn(
        "border-nl-200 dark:border-nd-700 dark:bg-nd-800 rounded-lg border bg-white shadow-sm",
        "border-t-4",
        getBorderColor(status),
      )}
    >
      {/* Header: Order ID, Status, Actions */}
      <div className="border-nl-100 dark:border-nd-700 flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <span className="text-nl-900 dark:text-nd-50 text-sm font-semibold">
            #{_id}
          </span>
          <Chip label={formatStatus(status)} color={getStatusColor(status)} />
        </div>
        <Popover
          trigger={
            <button className="hover:bg-nl-100 dark:hover:bg-nd-700 rounded-md p-1">
              <MoreVertical
                size={18}
                className="text-nl-600 dark:text-nd-300"
              />
            </button>
          }
        >
          {actionsMenu}
        </Popover>
      </div>

      {/* Body: Customer Info and Order Details */}
      <div className="p-4">
        {/* Customer Name and Phone */}
        <div className="mb-4">
          <h3 className="text-nl-900 dark:text-nd-50 text-lg font-bold">
            {customer?.info?.name}
          </h3>
          <p className="text-nl-600 dark:text-nd-300 text-sm">
            {customer?.info?.phone}
          </p>
        </div>

        {/* Two-column info grid */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Store */}
          <div>
            <p className="text-nl-500 dark:text-nd-400 text-xs">Store</p>
            <p className="text-nl-800 dark:text-nd-100 text-sm font-medium">
              {seller?.info?.name}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-nl-500 dark:text-nd-400 text-xs">Payment</p>
            <p className="text-nl-800 dark:text-nd-100 text-sm font-medium capitalize">
              {payment?.method === "cash" ? "Cash On Delivery" : "Online"}
            </p>
          </div>

          {/* Items Count */}
          <div>
            <p className="text-nl-500 dark:text-nd-400 text-xs">Items</p>
            <p className="text-nl-800 dark:text-nd-100 text-sm font-medium">
              {totalItems}
            </p>
          </div>

          {/* Order Time */}
          <div>
            <p className="text-nl-500 dark:text-nd-400 text-xs">Time</p>
            <p className="text-nl-800 dark:text-nd-100 text-sm font-medium">
              {new Date(createdDate).toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Date and Total Amount */}
      <div className="border-nl-100 dark:border-nd-700 flex items-center justify-between border-t px-4 py-3">
        <span className="text-nl-600 dark:text-nd-300 text-sm">
          {prettyDate(createdDate)}
        </span>
        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
          {CurrencyUtils.formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
