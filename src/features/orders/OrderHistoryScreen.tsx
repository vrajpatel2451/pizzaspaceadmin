import { Input } from "@/components/base/Input";
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
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { routeConstants } from "@/routes/routeConstants";
import type {
  AdminTransformedOrder,
  AdminTransformedOrderItem,
  OrderQueryParams,
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
  Calendar,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import { useFetchOrderList } from "./hooks";
import { useNavigate } from "react-router-dom";
import RefundItemsDialog from "./components/RefundItemsDialog";
import { orderApiService } from "@/infrastructure/OrderApiService";

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
  // Get today's date range as default
  const getTodayDateRange = useCallback(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return {
      startTime: startOfToday.toISOString(),
      endTime: endOfToday.toISOString(),
      startDate: startOfToday.toISOString().split("T")[0], // YYYY-MM-DD for input
      endDate: endOfToday.toISOString().split("T")[0],
    };
  }, []);

  const {
    startTime,
    endTime,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  } = getTodayDateRange();

  // Query state
  const [query, setQuery] = useState<OrderQueryParams>({
    limit: 8,
    page: 1,
    search: "",
    startTime,
    endTime,
    status: "delivered", // Default to delivered
  });

  // Store filter with RBAC awareness
  const {
    displayStoreId,
    effectiveStoreId,
    hideStoreDropdown,
    onStoreChange,
    resetStoreFilter,
    isReady,
  } = useStoreFilter();

  // Filter states
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const { status } = query;

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const selectedStatusOption = useMemo(
    () => statusOptions.find((e) => e.value === status),
    [status],
  );

  const handleChangeStatus = useCallback((val: SelectOnChangeVal) => {
    setQuery((prev) => ({ ...prev, status: (val as any)?.value }));
  }, []);

  // Reset all filters
  const onReset = useCallback(() => {
    resetStoreFilter();
    setSelectedCustomerId("");
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    onInputChange({ target: { value: "" } } as any);
    setQuery({
      limit: 8,
      page: 1,
      search: "",
      startTime,
      endTime,
      status: "delivered",
    });
  }, [
    onInputChange,
    startTime,
    endTime,
    defaultStartDate,
    defaultEndDate,
    resetStoreFilter,
  ]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      inputValue !== "" ||
      status !== "delivered" ||
      displayStoreId !== "" ||
      selectedCustomerId !== "" ||
      startDate !== defaultStartDate ||
      endDate !== defaultEndDate
    );
  }, [
    inputValue,
    status,
    displayStoreId,
    selectedCustomerId,
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
  ]);

  // Sync debounced search to query
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  // Sync store and customer filters to query
  useEffect(() => {
    if (!isReady) return;
    setQuery((prev) => ({
      ...prev,
      storeId: effectiveStoreId || undefined,
      customerId: selectedCustomerId || undefined,
    }));
  }, [effectiveStoreId, selectedCustomerId, isReady]);

  // Sync date range to query
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      setQuery((prev) => ({
        ...prev,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      }));
    }
  }, [startDate, endDate]);

  // Fetch orders
  const { data, isFetching, refetch } = useFetchOrderList(query);
  const { data: orders, meta } = data || {};

  // Refund dialog state
  const [selectedOrderForRefund, setSelectedOrderForRefund] =
    useState<AdminTransformedOrder | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Dialog handlers
  const handleOpenRefund = useCallback((order: AdminTransformedOrder) => {
    setSelectedOrderForRefund(order);
    setIsRefundDialogOpen(true);
  }, []);

  const handleCloseRefund = useCallback(() => {
    setIsRefundDialogOpen(false);
    setSelectedOrderForRefund(null);
  }, []);

  const handleSaveRefund = useCallback(() => {
    refetch();
    handleCloseRefund();
  }, [refetch, handleCloseRefund]);

  // Pagination props
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (cP) => {
        setQuery((prev) => ({ ...prev, page: cP }));
      },
    }),
    [meta],
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
        return <OrderActions order={row} onOpenRefund={handleOpenRefund} />;
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
        showReset={hasActiveFilters}
      >
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
          userId={selectedCustomerId}
          onChange={setSelectedCustomerId}
          variant="minimal"
          label=""
        />
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36"
          />
          <span className="text-slate-400">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-36"
          />
        </div>
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

      {/* Refund Dialog */}
      {selectedOrderForRefund && (
        <RefundItemsDialog
          order={selectedOrderForRefund}
          isOpen={isRefundDialogOpen}
          onClose={handleCloseRefund}
          onSave={handleSaveRefund}
        />
      )}
    </ScreenContainer>
  );
};

type OrderActionsProps = {
  order: AdminTransformedOrder;
  onOpenRefund: (order: AdminTransformedOrder) => void;
};

const OrderActions: FC<OrderActionsProps> = ({ order, onOpenRefund }) => {
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
