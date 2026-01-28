import Chip, { type ChipColor } from "@/components/base/Chip";
import Divider from "@/components/base/Divider";
import { IconButton } from "@/components/base/IconButton";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import ScreenContainer from "@/components/shared/ScreenContainer";
import EmptyState from "@/components/shared/EmptyState";
import { routeConstants } from "@/routes/routeConstants";
import type {
  AdminTransformedOrder,
  OrderDeliveryType,
  OrderStatus,
} from "@/types/order.types";
import { CurrencyUtils } from "@/utils/currencyUtils";
import { prettyDate } from "@/utils/formatDateTime";
import {
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Truck,
  MoreVertical,
  MessageSquare,
  Star,
  DollarSign,
  FileText,
  Receipt,
  Package,
  User,
  Store,
  Phone,
  Mail,
  FileWarning,
} from "lucide-react";
import { useState, type FC, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFetchOrderDetails } from "./hooks";
import ChangeStatusDialog from "./components/ChangeStatusDialog";
import AssignStaffDialog from "./components/AssignStaffDialog";
import RefundItemsDialog from "./components/RefundItemsDialog";
import OrderStatusHistoryDialog from "./components/OrderStatusHistoryDialog";
import { Popover } from "@/components/compound/Popover";
import { orderApiService } from "@/infrastructure/OrderApiService";
import { Button } from "@/components/base/Button";

// Status color mapping
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

// Format status text
const formatStatus = (status: OrderStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format delivery type text
const formatDeliveryType = (type: OrderDeliveryType): string => {
  switch (type) {
    case "dineIn":
      return "Dine In";
    case "pickup":
      return "Collection";
    case "delivery":
      return "Delivery";
    default:
      return type;
  }
};

const OrderDetailsScreen = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    data: order,
    isFetching,
    refetch,
  } = useFetchOrderDetails(orderId || "");

  // Dialog states
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] =
    useState(false);
  const [isAssignStaffDialogOpen, setIsAssignStaffDialogOpen] = useState(false);
  const [isRefundItemsDialogOpen, setIsRefundItemsDialogOpen] = useState(false);
  const [isStatusHistoryDialogOpen, setIsStatusHistoryDialogOpen] =
    useState(false);

  // Dialog handlers
  const handleOpenChangeStatus = () => setIsChangeStatusDialogOpen(true);
  const handleCloseChangeStatus = () => setIsChangeStatusDialogOpen(false);

  const handleOpenAssignStaff = () => setIsAssignStaffDialogOpen(true);
  const handleCloseAssignStaff = () => setIsAssignStaffDialogOpen(false);

  const handleOpenRefund = () => setIsRefundItemsDialogOpen(true);
  const handleCloseRefund = () => setIsRefundItemsDialogOpen(false);

  const handleOpenStatusHistory = () => setIsStatusHistoryDialogOpen(true);
  const handleCloseStatusHistory = () => setIsStatusHistoryDialogOpen(false);

  // Save handlers that refresh data
  const handleSaveOrder = () => {
    refetch();
  };

  // Navigate back based on order status
  const handleGoBack = () => {
    if (order?.status === "delivered" || order?.status === "cancelled") {
      navigate(routeConstants.orderHistory);
    } else {
      navigate(routeConstants.recentOrders);
    }
  };

  if (isFetching) {
    return (
      <ScreenContainer>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <p className="text-slate-500">Loading order details...</p>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  if (!order) {
    return (
      <ScreenContainer>
        <EmptyState
          icon={FileWarning}
          title="Order not found"
          description="The order you're looking for doesn't exist or has been removed."
          actionLabel="Go Back"
          onAction={handleGoBack}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header Section */}
      <OrderHeader
        order={order}
        onOpenChangeStatus={handleOpenChangeStatus}
        onOpenAssignStaff={handleOpenAssignStaff}
        onOpenRefund={handleOpenRefund}
      />

      {/* Dialogs */}
      {order && (
        <>
          <ChangeStatusDialog
            order={order}
            isOpen={isChangeStatusDialogOpen}
            onClose={handleCloseChangeStatus}
            onSave={handleSaveOrder}
          />
          <AssignStaffDialog
            order={order}
            isOpen={isAssignStaffDialogOpen}
            onClose={handleCloseAssignStaff}
            onSave={handleSaveOrder}
          />
          <RefundItemsDialog
            order={order}
            isOpen={isRefundItemsDialogOpen}
            onClose={handleCloseRefund}
            onSave={handleSaveOrder}
          />
          <OrderStatusHistoryDialog
            order={order}
            isOpen={isStatusHistoryDialogOpen}
            onClose={handleCloseStatusHistory}
          />
        </>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Panel - 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <OrderItemsSection order={order} />

          {/* Billing Summary */}
          <BillingSummarySection order={order} />

          {/* Customer Details */}
          <CustomerDetailsSection order={order} />
        </div>

        {/* Right Sidebar - 1/3 */}
        <div className="space-y-6 lg:col-span-1">
          <OrderMetaSection
            order={order}
            onOpenStatusHistory={handleOpenStatusHistory}
          />

          {/* Store Details */}
          <StoreDetailsSection order={order} />

          {/* Staff/Rider Details */}
          {order.rider?.info && <RiderDetailsSection order={order} />}
        </div>
      </div>
    </ScreenContainer>
  );
};

type OrderHeaderProps = {
  order: AdminTransformedOrder;
  onOpenChangeStatus: () => void;
  onOpenAssignStaff: () => void;
  onOpenRefund: () => void;
};

const OrderHeader: FC<OrderHeaderProps> = ({
  order,
  onOpenChangeStatus,
  onOpenAssignStaff,
  onOpenRefund,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleViewTickets = useCallback(() => {
    toast.info(`View tickets for order ${order._id} - Coming soon!`);
  }, [order._id]);

  const handleViewReviews = useCallback(() => {
    toast.info(`View reviews for order ${order._id} - Coming soon!`);
  }, [order._id]);

  const handleDownloadInvoice = useCallback(
    async (format: "normal" | "thermal") => {
      setIsDownloading(true);
      try {
        const response = await orderApiService.downloadInvoice(
          order._id,
          format,
        );
        if (response.success && response.data) {
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.download = `invoice-${order._id.slice(-8)}-${format}.pdf`;
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
    [order._id],
  );

  // Status-based actions - always show menu
  const renderActions = () => {
    const { status } = order;

    const actionsMenu = (
      <div className="flex flex-col py-1">
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
          onClick={handleViewTickets}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
        >
          <MessageSquare size={16} className="text-slate-500" />
          <span>View Tickets</span>
        </button>
        <button
          onClick={handleViewReviews}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Star size={16} className="text-slate-500" />
          <span>View Reviews</span>
        </button>

        {/* Show actions based on status */}
        {status !== "cancelled" && status !== "delivered" && (
          <>
            <Divider className="my-1" />
            <button
              onClick={onOpenAssignStaff}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Truck size={16} className="text-slate-500" />
              <span>
                {order?.staffId ? "Update Delivery Boy" : "Assign Delivery Boy"}
              </span>
            </button>
            <button
              onClick={onOpenChangeStatus}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <CheckCircle size={16} className="text-slate-500" />
              <span>Update Status</span>
            </button>
          </>
        )}

        {status === "delivered" && (
          <>
            <Divider className="my-1" />
            <button
              onClick={onOpenRefund}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 transition-colors hover:bg-orange-50"
            >
              <DollarSign size={16} />
              <span>Process Refund</span>
            </button>
          </>
        )}
      </div>
    );

    return (
      <Popover trigger={<IconButton icon={MoreVertical} size="md" />}>
        {actionsMenu}
      </Popover>
    );
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <Chip
        label={formatStatus(order.status)}
        color={getStatusColor(order.status)}
      />
      {renderActions()}
    </div>
  );
};

type OrderItemsSectionProps = {
  order: AdminTransformedOrder;
};

const OrderItemsSection: FC<OrderItemsSectionProps> = ({ order }) => {
  const columns: TableColumn<AdminTransformedOrder["items"][0]>[] = [
    {
      header: "Item",
      accessor: "name",
      cell: (_, item) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-800">
            {item.name}
          </span>
          {item.variants.length > 0 && (
            <span className="text-xs text-slate-500">
              {item.variants.join(", ")}
            </span>
          )}
          {item.addons.length > 0 && (
            <span className="text-xs text-slate-500">
              Add-ons:{" "}
              {item.addons
                .map((addon) => `${addon.name} (${addon.quantity})`)
                .join(", ")}
            </span>
          )}
          {item.isRefunded && (
            <span className="text-xs font-medium text-red-600">
              Refunded: {item.refundQuantity} items
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Qty",
      accessor: "quantity",
      cell: (quantity) => (
        <span className="font-medium text-slate-700">{quantity}</span>
      ),
    },
    {
      header: "Price",
      accessor: "priceAfterDiscount",
      cell: (price) => (
        <span className="text-slate-600">
          {CurrencyUtils.formatCurrency(price)}
        </span>
      ),
    },
    {
      header: "Total",
      accessor: "priceAfterDiscount",
      cell: (price, item) => (
        <span className="font-semibold text-slate-800">
          {CurrencyUtils.formatCurrency(price * item.quantity)}
        </span>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <Package className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">Order Items</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {order.items.length} items
        </span>
      </div>
      <Table columns={columns} data={order.items} size="sm" />
    </div>
  );
};

type BillingSummarySectionProps = {
  order: AdminTransformedOrder;
};

const BillingSummarySection: FC<BillingSummarySectionProps> = ({ order }) => {
  const { billing } = order;
  const summary = billing.customerTotal;

  const hasItemDiscount = summary.itemTotal !== summary.itemTotalAfterDiscount;
  const hasPackingDiscount =
    summary.packingCharges !== summary.packingChargesAfterDiscount;
  const hasDeliveryDiscount =
    summary.deliveryCharges !== summary.deliveryChargesAfterDiscount;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <CreditCard className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">
          Billing Summary
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-3">
          {/* Item Total */}
          <BillingRow
            label="Item total"
            price={summary.itemTotal}
            discountPrice={summary.itemTotalAfterDiscount}
            showDiscount={hasItemDiscount}
          />

          {/* Packing Charges */}
          <BillingRow
            label="Restaurant packing charges"
            price={summary.packingCharges}
            discountPrice={summary.packingChargesAfterDiscount}
            showDiscount={hasPackingDiscount}
          />

          {/* Delivery Charges */}
          <BillingRow
            label="Delivery partner fee"
            price={summary.deliveryCharges}
            discountPrice={summary.deliveryChargesAfterDiscount}
            showDiscount={hasDeliveryDiscount}
          />

          {/* Extra Charges */}
          {summary.extraCharges &&
            Object.entries(summary.extraCharges).map(
              ([name, [original, afterDiscount]]) => (
                <BillingRow
                  key={name}
                  label={name}
                  price={original}
                  discountPrice={afterDiscount}
                  showDiscount={original !== afterDiscount}
                />
              ),
            )}

          {/* Tax */}
          <BillingRow
            label="Tax"
            price={summary.tax?.total || 0}
            discountPrice={summary.tax?.total || 0}
            showDiscount={false}
          />

          <Divider className="my-2" />

          {/* Total */}
          <div className="flex items-center justify-between py-2">
            <span className="text-base font-semibold text-slate-800">
              Total Amount
            </span>
            <span className="text-xl font-bold text-orange-600">
              {CurrencyUtils.formatCurrency(summary.total || 0)}
            </span>
          </div>

          {/* Savings Banner */}
          {summary.totalDiscount > 0 && (
            <div className="mt-2 rounded-lg bg-green-50 px-4 py-3 text-center">
              <span className="text-sm font-medium text-green-700">
                Customer saved{" "}
                {CurrencyUtils.formatCurrency(summary.totalDiscount)} on this
                order
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type BillingRowProps = {
  label: string;
  price: number;
  discountPrice: number;
  showDiscount: boolean;
};

const BillingRow: FC<BillingRowProps> = ({
  label,
  price,
  discountPrice,
  showDiscount,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600 capitalize">{label}</span>
      <div className="flex items-center gap-2">
        {showDiscount && (
          <span className="text-sm text-slate-400 line-through">
            {CurrencyUtils.formatCurrency(price)}
          </span>
        )}
        <span className="text-sm font-medium text-slate-800">
          {CurrencyUtils.formatCurrency(showDiscount ? discountPrice : price)}
        </span>
      </div>
    </div>
  );
};

type CustomerDetailsSectionProps = {
  order: AdminTransformedOrder;
};

const CustomerDetailsSection: FC<CustomerDetailsSectionProps> = ({ order }) => {
  const { customer } = order;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <User className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">
          Customer Details
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Name
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {customer?.info?.name || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Phone
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {customer?.info?.phone || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                Email
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {customer?.info?.email || "-"}
              </p>
            </div>
          </div>
          {customer?.address && (
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                  Delivery Address
                </p>
                <p className="mt-1 text-slate-700">
                  {customer.address.line1}
                  {customer.address.line2 &&
                    `, ${customer.address.line2}`}, {customer.address.area},{" "}
                  {customer.address.county} - {customer.address.zip}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type StoreDetailsSectionProps = {
  order: AdminTransformedOrder;
};

const StoreDetailsSection: FC<StoreDetailsSectionProps> = ({ order }) => {
  const { seller } = order;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <Store className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">Store Details</h2>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Store Name
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {seller?.info?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Phone
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {seller?.info?.phone || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Address
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {seller?.info?.line1}
            {seller?.info?.line2 && `, ${seller.info.line2}`},{" "}
            {seller?.info?.area}, {seller?.info?.city}, {seller?.info?.county} -{" "}
            {seller?.info?.zip}
          </p>
        </div>
      </div>
    </div>
  );
};

type RiderDetailsSectionProps = {
  order: AdminTransformedOrder;
};

const RiderDetailsSection: FC<RiderDetailsSectionProps> = ({ order }) => {
  const { rider } = order;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <Truck className="h-5 w-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">Delivery Rider</h2>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Name
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {rider?.info?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            Email
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {rider?.info?.email || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

type OrderMetaSectionProps = {
  order: AdminTransformedOrder;
  onOpenStatusHistory: () => void;
};

const OrderMetaSection: FC<OrderMetaSectionProps> = ({
  order,
  onOpenStatusHistory,
}) => {
  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Order Information
        </h2>
      </div>
      <div className="space-y-5 p-6">
        {/* Status */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
              Status
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenStatusHistory}
              className="text-slate-500 hover:text-slate-700"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
          <Chip
            label={formatStatus(order.status)}
            color={getStatusColor(order.status)}
          />
        </div>

        {/* Delivery Type */}
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
            Delivery Type
          </p>
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-slate-500" />
            <span className="font-medium text-slate-800">
              {formatDeliveryType(order.deliveryType)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
            Payment Method
          </p>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-slate-500" />
            <span className="font-medium text-slate-800 capitalize">
              {order.payment?.method === "cash"
                ? "Cash On Delivery"
                : "Online Payment"}
            </span>
          </div>
        </div>

        {/* Payment Reference */}
        {order.payment?.refId && (
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
              Payment Reference ID
            </p>
            <p className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-700">
              {order.payment.refId}
            </p>
          </div>
        )}

        {/* Customer Message */}
        {order.customerMessage && (
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
              Customer Note
            </p>
            <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-slate-700">
              {order.customerMessage}
            </p>
          </div>
        )}

        <Divider />

        {/* Status History */}
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
            <Clock size={14} />
            Status Timeline
          </p>
          <div className="relative space-y-4">
            {order.statusList.map((statusItem, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="relative flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                  {index < order.statusList.length - 1 && (
                    <div className="absolute top-3 h-full w-0.5 bg-slate-200" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-slate-800">
                    {formatStatus(statusItem.status)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {prettyDate(statusItem.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;
