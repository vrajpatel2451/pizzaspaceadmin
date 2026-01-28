import { IconButton } from "@/components/base/IconButton";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Popover } from "@/components/compound/Popover";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import ScreenContainer from "@/components/shared/ScreenContainer";
import FilterBar from "@/components/shared/FilterBar";
import EmptyState from "@/components/shared/EmptyState";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import TimeRangeSelector from "@/features/dashboard/components/TimeRangeSelector";
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { routeConstants } from "@/routes/routeConstants";
import type {
  AdminTransformedOrder,
  AdminTransformedOrderItem,
  OrderQueryParams,
  OrderStatus,
} from "@/types/order.types";
import { CurrencyUtils } from "@/utils/currencyUtils";
import { prettyDate } from "@/utils/formatDateTime";
import {
  Eye,
  MessageSquare,
  Star,
  DollarSign,
  MoreVertical,
  FileText,
  Receipt,
  History,
  Truck,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import { useFetchOrderList } from "./hooks";
import { useNavigate } from "react-router-dom";
import RefundItemsDialog from "./components/RefundItemsDialog";
import ChangeStatusDialog from "./components/ChangeStatusDialog";
import AssignStaffDialog from "./components/AssignStaffDialog";
import { orderApiService } from "@/infrastructure/OrderApiService";
import { useOrderUrlParams } from "./hooks/useOrderUrlParams";

// Status color mapping
const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "preparing":
    case "ready_to_pickup":
    case "on_the_way":
      return "bg-blue-100 text-blue-800";
    case "initiated":
    case "payment_confirmed":
      return "bg-orange-100 text-orange-800";
    case "cancelled":
    case "payment_error":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

// Format status text
const formatStatus = (status: OrderStatus): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Status options all
const statusOptions: SelectOption[] = [
  { label: "Initiated", value: "initiated" },
  { label: "Payment Confirmed", value: "payment_confirmed" },
  { label: "Payment Error", value: "payment_error" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready to Pickup", value: "ready_to_pickup" },
  { label: "On The Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderHistoryScreen = () => {
  // URL-based params
  const {
    timeRange,
    setTimeRange,
    status,
    setStatus,
    customerId,
    setCustomerId,
    search,
    setSearch,
    page,
    setPage,
    resetFilters,
    hasActiveFilters,
  } = useOrderUrlParams({ defaultPreset: "today", defaultStatus: "delivered" });

  // Store filter with RBAC awareness
  const {
    displayStoreId,
    effectiveStoreId,
    hideStoreDropdown,
    onStoreChange,
    resetStoreFilter,
  } = useStoreFilter();

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState(search, 300);

  // Sync debounced search to URL
  useEffect(() => {
    if (debounceVal !== search) {
      setSearch(debounceVal);
    }
  }, [debounceVal, search, setSearch]);

  // Build query params
  const query = useMemo<OrderQueryParams>(
    () => ({
      limit: 8,
      page,
      search,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      status,
      storeId: effectiveStoreId || undefined,
      customerId: customerId || undefined,
    }),
    [page, search, timeRange, status, effectiveStoreId, customerId],
  );

  const selectedStatusOption = useMemo(
    () => statusOptions.find((e) => e.value === status),
    [status],
  );

  const handleChangeStatus = useCallback(
    (val: SelectOnChangeVal) => {
      setStatus((val as SelectOption)?.value as any);
    },
    [setStatus],
  );

  // Reset all filters
  const onReset = useCallback(() => {
    resetStoreFilter();
    onInputChange({ target: { value: "" } } as any);
    resetFilters();
  }, [onInputChange, resetStoreFilter, resetFilters]);

  // Fetch orders
  const { data, isFetching, refetch } = useFetchOrderList(query);
  const { data: orders, meta } = data || {};

  // Dialog states
  const [selectedOrder, setSelectedOrder] =
    useState<AdminTransformedOrder | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] =
    useState(false);
  const [isAssignStaffDialogOpen, setIsAssignStaffDialogOpen] = useState(false);

  // Dialog handlers
  const handleOpenRefund = useCallback((order: AdminTransformedOrder) => {
    setSelectedOrder(order);
    setIsRefundDialogOpen(true);
  }, []);

  const handleCloseRefund = useCallback(() => {
    setIsRefundDialogOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleOpenChangeStatus = useCallback((order: AdminTransformedOrder) => {
    setSelectedOrder(order);
    setIsChangeStatusDialogOpen(true);
  }, []);

  const handleCloseChangeStatus = useCallback(() => {
    setIsChangeStatusDialogOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleOpenAssignStaff = useCallback((order: AdminTransformedOrder) => {
    setSelectedOrder(order);
    setIsAssignStaffDialogOpen(true);
  }, []);

  const handleCloseAssignStaff = useCallback(() => {
    setIsAssignStaffDialogOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleSaveOrder = useCallback(() => {
    refetch();
    setSelectedOrder(null);
    setIsRefundDialogOpen(false);
    setIsChangeStatusDialogOpen(false);
    setIsAssignStaffDialogOpen(false);
  }, [refetch]);

  // Pagination props
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: setPage,
    }),
    [meta, setPage],
  );

  // Table columns
  const columns: TableColumn<AdminTransformedOrder>[] = [
    {
      header: "Order ID",
      accessor: "_id",
      cell: (val) => (
        <span className="font-mono text-sm font-medium text-slate-700">
          #{val.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
        >
          {formatStatus(status)}
        </span>
      ),
    },
    {
      header: "Customer Name",
      accessor: "customer",
      cell: (customer) => (
        <span className="font-medium text-slate-800">
          {customer?.info?.name || "-"}
        </span>
      ),
    },
    {
      header: "Phone",
      accessor: "customer",
      cell: (customer) => (
        <span className="text-slate-600">{customer?.info?.phone || "-"}</span>
      ),
    },
    {
      header: "Order Amount",
      accessor: "billing",
      cell: (billing) => (
        <span className="font-semibold text-orange-600">
          {CurrencyUtils.formatCurrency(billing?.customerTotal?.total || 0)}
        </span>
      ),
    },
    {
      header: "Store",
      accessor: "seller",
      cell: (seller) => (
        <span className="text-slate-600">{seller?.info?.name || "-"}</span>
      ),
    },
    {
      header: "Delivery Type",
      accessor: "deliveryType",
      cell: (type) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            type === "delivery"
              ? "bg-blue-100 text-blue-800"
              : type === "pickup"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
          }`}
        >
          {type === "dineIn"
            ? "Dine In"
            : type === "pickup"
              ? "Collection"
              : "Delivery"}
        </span>
      ),
    },
    {
      header: "Order At",
      accessor: "createdDate",
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Payment Method",
      accessor: "payment",
      cell: (payment) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            payment?.method === "cash"
              ? "bg-amber-100 text-amber-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {payment?.method === "cash" ? "Cash On Delivery" : "Online"}
        </span>
      ),
    },
    {
      header: "Total Items",
      accessor: "items",
      cell: (items) => {
        const totalItems = (items as AdminTransformedOrderItem[]).reduce(
          (sum: number, item) => sum + item.quantity,
          0,
        );
        const refundedItems = (items as AdminTransformedOrderItem[]).reduce(
          (sum: number, item) => sum + (item.refundQuantity || 0),
          0,
        );
        return (
          <span className="text-slate-700">
            {totalItems}
            {refundedItems > 0 && (
              <span className="ml-1 text-xs text-red-500">
                ({refundedItems} refunded)
              </span>
            )}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return (
          <OrderActions
            order={row}
            onOpenRefund={handleOpenRefund}
            onOpenChangeStatus={handleOpenChangeStatus}
            onOpenAssignStaff={handleOpenAssignStaff}
          />
        );
      },
    },
  ];

  return (
    <ScreenContainer>
      {/* Filter Bar */}
      <FilterBar
        searchValue={inputValue}
        onSearchChange={(value) =>
          onInputChange({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        searchPlaceholder="Search by order ID, customer name..."
        onReset={onReset}
        showReset={hasActiveFilters || displayStoreId !== ""}
      >
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        <Select
          options={statusOptions}
          value={selectedStatusOption}
          onChange={handleChangeStatus}
          placeholder="Select Status"
          variant="minimal"
          className="min-w-36"
        />
        {!hideStoreDropdown && (
          <RBACStoreDropdown
            storeId={displayStoreId}
            onChange={onStoreChange}
            allowAll={false}
            variant="minimal"
          />
        )}
        <UserDropdown
          userId={customerId}
          onChange={setCustomerId}
          variant="minimal"
          label=""
        />
      </FilterBar>

      {/* Empty State */}
      {!isFetching && !orders?.length && (
        <EmptyState
          icon={History}
          title="No orders in history"
          description="There are no completed or cancelled orders matching your filters."
        />
      )}

      {/* Table */}
      {(orders?.length || isFetching) && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={orders}
            size="sm"
            pagination={paginationProps}
            isLoading={isFetching}
            isMuted={isFetching}
          />
        </div>
      )}

      {/* Dialogs */}
      {selectedOrder && (
        <>
          <RefundItemsDialog
            order={selectedOrder}
            isOpen={isRefundDialogOpen}
            onClose={handleCloseRefund}
            onSave={handleSaveOrder}
          />
          <ChangeStatusDialog
            order={selectedOrder}
            isOpen={isChangeStatusDialogOpen}
            onClose={handleCloseChangeStatus}
            onSave={handleSaveOrder}
          />
          <AssignStaffDialog
            order={selectedOrder}
            isOpen={isAssignStaffDialogOpen}
            onClose={handleCloseAssignStaff}
            onSave={handleSaveOrder}
          />
        </>
      )}
    </ScreenContainer>
  );
};

type OrderActionsProps = {
  order: AdminTransformedOrder;
  onOpenRefund: (order: AdminTransformedOrder) => void;
  onOpenChangeStatus: (order: AdminTransformedOrder) => void;
  onOpenAssignStaff: (order: AdminTransformedOrder) => void;
};

const OrderActions: FC<OrderActionsProps> = ({
  order,
  onOpenRefund,
  onOpenChangeStatus,
  onOpenAssignStaff,
}) => {
  const { _id, status } = order;
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleViewDetails = useCallback(() => {
    navigate(routeConstants.orderDetails.replace(":orderId", _id));
  }, [_id, navigate]);

  const handleViewTickets = useCallback(() => {
    toast.info(`View tickets for order ${_id} - Coming soon!`);
  }, [_id]);

  const handleViewReviews = useCallback(() => {
    toast.info(`View reviews for order ${_id} - Coming soon!`);
  }, [_id]);

  const handleRefund = useCallback(() => {
    onOpenRefund(order);
  }, [order, onOpenRefund]);

  const handleChangeStatus = useCallback(() => {
    onOpenChangeStatus(order);
  }, [order, onOpenChangeStatus]);

  const handleAssignStaff = useCallback(() => {
    onOpenAssignStaff(order);
  }, [order, onOpenAssignStaff]);

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
      {status !== "delivered" && status !== "cancelled" && (
        <>
          <button
            onClick={handleAssignStaff}
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
        </>
      )}
      {status === "delivered" && (
        <button
          onClick={handleRefund}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
        >
          <DollarSign size={16} className="text-slate-500" />
          <span>Process Refund</span>
        </button>
      )}
    </div>
  );

  return (
    <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
      {actionsMenu}
    </Popover>
  );
};

export default OrderHistoryScreen;
