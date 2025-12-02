import Chip, { type ChipColor } from "@/components/base/Chip";
import Divider from "@/components/base/Divider";
import { IconButton } from "@/components/base/IconButton";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import Card from "@/components/compound/Card";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type { AdminTransformedOrder, OrderStatus } from "@/types/order.types";
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
} from "lucide-react";
import { useState, type FC, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useFetchOrderDetails } from "./hooks";
import ChangeStatusDialog from "./components/ChangeStatusDialog";
import AssignStaffDialog from "./components/AssignStaffDialog";
import RefundItemsDialog from "./components/RefundItemsDialog";
import OrderStatusHistoryDialog from "./components/OrderStatusHistoryDialog";
import { Popover } from "@/components/compound/Popover";
import { orderApiService } from "@/infrastructure/OrderApiService";

// Status color mapping
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

// Format status text
const formatStatus = (status: OrderStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const OrderDetailsScreen = () => {
  const { orderId } = useParams<{ orderId: string }>();

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
  const [isStatusHistoryDialogOpen, setIsStatusHistoryDialogOpen] = useState(false);

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

  // Dynamic breadcrumbs based on order status
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Dashboard",
      to: routeConstants.dashboard,
    },
    {
      label: order?.status === "delivered" || order?.status === "cancelled" ? "Order History" : "Recent Orders",
      to: order?.status === "delivered" || order?.status === "cancelled" ? routeConstants.orderHistory : routeConstants.recentOrders,
    },
    {
      label: "Order Details",
      to: routeConstants.orderDetails.replace(":orderId", orderId || ""),
    },
  ];

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-nl-600 dark:text-nd-300">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-nl-700 dark:text-nd-200 text-lg font-semibold">
          Order not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

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
        {/* Left Panel - 70% */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            {/* Order Items */}
            <OrderItemsSection order={order} />

            {/* Billing Summary */}
            <BillingSummarySection order={order} />

            {/* Customer Details */}
            <CustomerDetailsSection order={order} />
          </div>
        </div>

        {/* Right Sidebar - 30% */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-6">
            <OrderMetaSection order={order} onOpenStatusHistory={handleOpenStatusHistory} />

            {/* Store Details */}
            <StoreDetailsSection order={order} />

            {/* Staff/Rider Details */}
            {order.rider?.info && <RiderDetailsSection order={order} />}
          </div>
        </div>
      </div>
    </div>
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
        const response = await orderApiService.downloadInvoice(order._id, format);
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
      <div className="flex flex-col py-2">
        <button
          onClick={() => handleDownloadInvoice("normal")}
          disabled={isDownloading}
          className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
        >
          <FileText size={16} />
          <span>Download Invoice</span>
        </button>
        <button
          onClick={() => handleDownloadInvoice("thermal")}
          disabled={isDownloading}
          className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
        >
          <Receipt size={16} />
          <span>Download Receipt (Thermal)</span>
        </button>
        <button
          onClick={handleViewTickets}
          className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
        >
          <MessageSquare size={16} />
          <span>View Tickets</span>
        </button>
        <button
          onClick={handleViewReviews}
          className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
        >
          <Star size={16} />
          <span>View Reviews</span>
        </button>

        {/* Show actions based on status */}
        {status !== "cancelled" && status !== "delivered" && (
          <>
            <button
              onClick={onOpenAssignStaff}
              className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
            >
              <Truck size={16} />
              <span>{order?.staffId ? "Update Delivery Boy" : "Assign Delivery Boy"}</span>
            </button>
            <button
              onClick={onOpenChangeStatus}
              className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
            >
              <CheckCircle size={16} />
              <span>Update Status</span>
            </button>
          </>
        )}

        {status === "delivered" && (
          <button
            onClick={onOpenRefund}
            className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
          >
            <DollarSign size={16} />
            <span>Process Refund</span>
          </button>
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
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-nl-900 dark:text-nd-50 text-2xl font-bold">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <Chip
            label={formatStatus(order.status)}
            color={getStatusColor(order.status)}
          />
        </div>
        <p className="text-nl-600 dark:text-nd-300 mt-1 text-sm">
          Placed on {prettyDate(order.createdDate)}
        </p>
      </div>
      <div>{renderActions()}</div>
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
          <span className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {item.name}
          </span>
          {item.variants.length > 0 && (
            <span className="text-nl-500 dark:text-nd-400 text-xs">
              {item.variants.join(", ")}
            </span>
          )}
          {item.addons.length > 0 && (
            <span className="text-nl-500 dark:text-nd-400 text-xs">
              Add-ons:{" "}
              {item.addons
                .map((addon) => `${addon.name} (${addon.quantity})`)
                .join(", ")}
            </span>
          )}
          {item.isRefunded && (
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Refunded: {item.refundQuantity} items
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantity",
      cell: (quantity) => quantity,
    },
    {
      header: "Price",
      accessor: "priceAfterDiscount",
      cell: (price) => CurrencyUtils.formatCurrency(price),
    },
    {
      header: "Total",
      accessor: "priceAfterDiscount",
      cell: (price, item) =>
        CurrencyUtils.formatCurrency(price * item.quantity),
    },
  ];

  return (
    <Card title="Order Items" isCollapsible={true} defaultOpen={true}>
      <Table columns={columns} data={order.items} size="sm" />
    </Card>
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
    <Card title="Billing Summary" isCollapsible={true} defaultOpen={true}>
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

        <Divider />

        {/* Total */}
        <div className="flex items-center justify-between py-2">
          <span className="text-nl-900 dark:text-nd-50 text-base font-semibold">
            Total Amount
          </span>
          <span className="text-nl-900 dark:text-nd-50 text-xl font-bold">
            {CurrencyUtils.formatCurrency(summary.total || 0)}
          </span>
        </div>

        {/* Savings Banner */}
        {summary.totalDiscount > 0 && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-center dark:bg-green-900/20">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Customer saved{" "}
              {CurrencyUtils.formatCurrency(summary.totalDiscount)} on this
              order
            </span>
          </div>
        )}
      </div>
    </Card>
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
      <span className="text-nl-700 dark:text-nd-200 text-sm capitalize">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {showDiscount && (
          <span className="text-nl-400 dark:text-nd-400 text-sm line-through">
            {CurrencyUtils.formatCurrency(price)}
          </span>
        )}
        <span className="text-nl-900 dark:text-nd-50 text-sm font-medium">
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
    <Card title="Customer Details" isCollapsible={true} defaultOpen={true}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Name</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {customer?.info?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Phone</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {customer?.info?.phone || "-"}
          </p>
        </div>
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Email</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {customer?.info?.email || "-"}
          </p>
        </div>
        {customer?.address && (
          <div className="md:col-span-2">
            <p className="text-nl-500 dark:text-nd-400 mb-1 flex items-center gap-1 text-xs">
              <MapPin size={14} />
              Delivery Address
            </p>
            <p className="text-nl-900 dark:text-nd-50 text-sm">
              {customer.address.line1}
              {customer.address.line2 && `, ${customer.address.line2}`},{" "}
              {customer.address.area}, {customer.address.county} -{" "}
              {customer.address.zip}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

type StoreDetailsSectionProps = {
  order: AdminTransformedOrder;
};

const StoreDetailsSection: FC<StoreDetailsSectionProps> = ({ order }) => {
  const { seller } = order;

  return (
    <Card title="Store Details" isCollapsible={true} defaultOpen={true}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">
            Store Name
          </p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {seller?.info?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Phone</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {seller?.info?.phone || "-"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-nl-500 dark:text-nd-400 mb-1 flex items-center gap-1 text-xs">
            <MapPin size={14} />
            Store Address
          </p>
          <p className="text-nl-900 dark:text-nd-50 text-sm">
            {seller?.info?.line1}
            {seller?.info?.line2 && `, ${seller.info.line2}`},{" "}
            {seller?.info?.area}, {seller?.info?.city}, {seller?.info?.county} -{" "}
            {seller?.info?.zip}
          </p>
        </div>
      </div>
    </Card>
  );
};

type RiderDetailsSectionProps = {
  order: AdminTransformedOrder;
};

const RiderDetailsSection: FC<RiderDetailsSectionProps> = ({ order }) => {
  const { rider } = order;

  return (
    <Card
      title="Delivery Rider Details"
      isCollapsible={true}
      defaultOpen={true}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Name</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {rider?.info?.name || "-"}
          </p>
        </div>
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-1 text-xs">Email</p>
          <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
            {rider?.info?.email || "-"}
          </p>
        </div>
      </div>
    </Card>
  );
};

type OrderMetaSectionProps = {
  order: AdminTransformedOrder;
  onOpenStatusHistory: () => void;
};

const OrderMetaSection: FC<OrderMetaSectionProps> = ({ order, onOpenStatusHistory }) => {
  return (
    <Card title="Order Information" className="sticky top-4">
      <div className="flex flex-col gap-4">
        {/* Status */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-nl-500 dark:text-nd-400 text-xs">Status</p>
            <IconButton
              icon={Clock}
              size="xs"
              onClick={onOpenStatusHistory}
              ariaLabel="View status history"
              disableHoverBg
              noDefaultFill
            />
          </div>
          <Chip
            label={formatStatus(order.status)}
            color={getStatusColor(order.status)}
          />
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-2 text-xs">
            Payment Method
          </p>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-nl-600 dark:text-nd-300" />
            <span className="text-nl-900 dark:text-nd-50 text-sm font-medium capitalize">
              {order.payment?.method === "cash"
                ? "Cash On Delivery"
                : "Online Payment"}
            </span>
          </div>
        </div>

        {/* Payment Reference */}
        {order.payment?.refId && (
          <div>
            <p className="text-nl-500 dark:text-nd-400 mb-2 text-xs">
              Payment Reference ID
            </p>
            <p className="text-nl-900 dark:text-nd-50 font-mono text-sm">
              {order.payment.refId}
            </p>
          </div>
        )}

        {/* Customer Message */}
        {order.customerMessage && (
          <div>
            <p className="text-nl-500 dark:text-nd-400 mb-2 text-xs">
              Customer Note
            </p>
            <p className="text-nl-900 dark:text-nd-50 text-sm">
              {order.customerMessage}
            </p>
          </div>
        )}

        <Divider />

        {/* Status History */}
        <div>
          <p className="text-nl-500 dark:text-nd-400 mb-3 flex items-center gap-2 text-xs">
            <Clock size={14} />
            Status History
          </p>
          <div className="flex flex-col gap-3">
            {order.statusList.map((statusItem, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-primary-500 mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div className="flex-1">
                  <p className="text-nl-900 dark:text-nd-50 text-sm font-medium">
                    {formatStatus(statusItem.status)}
                  </p>
                  <p className="text-nl-500 dark:text-nd-400 text-xs">
                    {prettyDate(statusItem.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderDetailsScreen;
