import Chip, { type ChipColor } from "@/components/base/Chip";
import { IconButton } from "@/components/base/IconButton";
import { Popover } from "@/components/compound/Popover";
import type { AdminTransformedOrder, OrderStatus } from "@/types/order.types";
import { CurrencyUtils } from "@/utils/currencyUtils";
import { prettyDate } from "@/utils/formatDateTime";
import {
  Eye,
  MoreVertical,
  Truck,
  RefreshCw,
  DollarSign,
  FileText,
  Receipt,
  Clock,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useState, useCallback, type FC } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";
import { routeConstants } from "@/routes/routeConstants";
import { orderApiService } from "@/infrastructure/OrderApiService";

type Props = {
  order: AdminTransformedOrder;
  onOpenRefund?: (order: AdminTransformedOrder) => void;
  onOpenChangeStatus?: (order: AdminTransformedOrder) => void;
  onOpenAssignStaff?: (order: AdminTransformedOrder) => void;
};

// Status color mapping based on order status
const getStatusColor = (status: OrderStatus): ChipColor => {
  switch (status) {
    case "delivered":
      return "green";
    case "preparing":
    case "ready_to_pickup":
    case "on_the_way":
      return "blue";
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

// Status indicator color for the left border
const getStatusIndicatorColor = (status: OrderStatus): string => {
  switch (status) {
    case "delivered":
      return "bg-green-500";
    case "preparing":
    case "ready_to_pickup":
    case "on_the_way":
      return "bg-blue-500";
    case "initiated":
    case "payment_confirmed":
      return "bg-orange-500";
    case "cancelled":
    case "payment_error":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

// Format status text
const formatStatus = (status: OrderStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const OrderCard: FC<Props> = ({
  order,
  onOpenRefund,
  onOpenChangeStatus,
  onOpenAssignStaff,
}) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    _id,
    status,
    customer,
    seller,
    payment,
    items,
    billing,
    createdDate,
    deliveryType,
  } = order;

  const totalAmount = billing?.customerTotal?.total || 0;

  // Action handlers
  const handleViewDetails = () => {
    navigate(routeConstants.orderDetails.replace(":orderId", _id));
  };

  const handleAssignDelivery = () => {
    if (onOpenAssignStaff) {
      onOpenAssignStaff(order);
    } else {
      toast.info(`Assign delivery for order ${_id} - Coming soon!`);
    }
  };

  const handleChangeStatus = () => {
    if (onOpenChangeStatus) {
      onOpenChangeStatus(order);
    } else {
      toast.info(`Change status for order ${_id} - Coming soon!`);
    }
  };

  const handleRefund = () => {
    if (onOpenRefund) {
      onOpenRefund(order);
    }
  };

  const handleDownloadInvoice = useCallback(
    async (format: "normal" | "thermal") => {
      setIsDownloading(true);
      try {
        const response = await orderApiService.downloadInvoice(_id, format);
        if (response.success && response.data) {
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.download = `invoice-${_id.slice(-8)}-${format}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("Invoice downloaded successfully");
        } else {
          toast.error(response.errorMessage || "Failed to download invoice");
        }
      } catch {
        toast.error("Failed to download invoice");
      } finally {
        setIsDownloading(false);
      }
    },
    [_id],
  );

  const actionsMenu = (
    <div className="flex flex-col py-1">
      <button
        onClick={handleViewDetails}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Eye size={16} className="text-slate-500" />
        <span>View Details</span>
      </button>
      <button
        onClick={() => handleDownloadInvoice("normal")}
        disabled={isDownloading}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        <FileText size={16} className="text-slate-500" />
        <span>Download Invoice</span>
      </button>
      <button
        onClick={() => handleDownloadInvoice("thermal")}
        disabled={isDownloading}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        <Receipt size={16} className="text-slate-500" />
        <span>Download Receipt (Thermal)</span>
      </button>
      <button
        onClick={handleAssignDelivery}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Truck size={16} className="text-slate-500" />
        <span>Assign Delivery Boy</span>
      </button>
      <button
        onClick={handleChangeStatus}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <RefreshCw size={16} className="text-slate-500" />
        <span>Change Status</span>
      </button>
      {status === "delivered" && onOpenRefund && (
        <button
          onClick={handleRefund}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 transition-colors hover:bg-orange-50"
        >
          <DollarSign size={16} />
          <span>Process Refund</span>
        </button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md",
      )}
    >
      {/* Status indicator bar */}
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-1",
          getStatusIndicatorColor(status),
        )}
      />

      {/* Header: Order ID, Status, Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 pl-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-slate-800">
            #{_id.slice(-8).toUpperCase()}
          </span>
          <Chip label={formatStatus(status)} color={getStatusColor(status)} />
        </div>
        <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
          {actionsMenu}
        </Popover>
      </div>

      {/* Body: Customer Info and Order Details */}
      <div className="px-5 py-4 pl-6">
        {/* Customer Name and Phone */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {customer?.info?.name || "Unknown Customer"}
          </h3>
          <p className="text-sm text-slate-500">
            {customer?.info?.phone || "-"}
          </p>
        </div>

        {/* Two-column info grid */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Store */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-400 uppercase">
              <MapPin size={12} />
              Store
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {seller?.info?.name || "-"}
            </p>
          </div>

          {/* Delivery Type */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-400 uppercase">
              <ShoppingBag size={12} />
              Type
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {deliveryType === "dineIn"
                ? "Dine In"
                : deliveryType === "pickup"
                  ? "Collection"
                  : "Delivery"}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Payment
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700 capitalize">
              {payment?.method === "cash" ? "Cash On Delivery" : "Online"}
            </p>
          </div>

          {/* Order Time */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-400 uppercase">
              <Clock size={12} />
              Time
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {new Date(createdDate).toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        {/* Order Items */}
        {items.length > 0 && (
          <div className="mt-1 border-t border-dashed border-slate-200 pt-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide text-slate-400 uppercase">
              <ShoppingBag size={12} />
              Items ({items.length})
            </p>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {item.name}
                      <span className="ml-1 text-slate-400">
                        x{item.quantity}
                      </span>
                    </p>
                    {item.variants.length > 0 && (
                      <p className="truncate text-xs text-slate-400">
                        {item.variants.join(", ")}
                      </p>
                    )}
                    {item.addons.length > 0 && (
                      <p className="truncate text-xs text-slate-400">
                        +{" "}
                        {item.addons
                          .map((a) => `${a.name} x${a.quantity}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    {CurrencyUtils.formatCurrency(
                      item.priceAfterDiscount * item.quantity,
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Date and Total Amount */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 pl-6">
        <span className="text-sm text-slate-500">
          {prettyDate(createdDate)}
        </span>
        <span className="text-lg font-bold text-orange-600">
          {CurrencyUtils.formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
