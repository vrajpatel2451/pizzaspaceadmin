import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { IconButton } from "@/components/base/IconButton";
import { Input } from "@/components/base/Input";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Popover } from "@/components/compound/Popover";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
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
  RefreshCcw,
  SearchIcon,
  Star,
  DollarSign,
  MoreVertical,
  FileText,
  Receipt,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import { useFetchOrderList } from "./hooks";
import { useNavigate } from "react-router-dom";
import RefundItemsDialog from "./components/RefundItemsDialog";
import { orderApiService } from "@/infrastructure/OrderApiService";

// Status options limited to delivered and cancelled
const statusOptions: SelectOption[] = [
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

  // Filter states
  const [selectedStoreId, setSelectedStoreId] = useState("");
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
    setSelectedStoreId("");
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
  }, [onInputChange, startTime, endTime, defaultStartDate, defaultEndDate]);

  // Sync debounced search to query
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  // Sync store and customer filters to query
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      storeId: selectedStoreId || undefined,
      customerId: selectedCustomerId || undefined,
    }));
  }, [selectedStoreId, selectedCustomerId]);

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
      cell: (val) => `#${val.slice(-8).toUpperCase()}`,
    },
    {
      header: "Customer Name",
      accessor: "customer",
      cell: (customer) => customer?.info?.name || "-",
    },
    {
      header: "Phone",
      accessor: "customer",
      cell: (customer) => customer?.info?.phone || "-",
    },
    {
      header: "Order Amount",
      accessor: "billing",
      cell: (billing) =>
        CurrencyUtils.formatCurrency(billing?.customerTotal?.total || 0),
    },
    {
      header: "Store",
      accessor: "seller",
      cell: (seller) => seller?.info?.name || "-",
    },
    {
      header: "Order At",
      accessor: "createdDate",
      cell: (date) => prettyDate(date),
    },
    {
      header: "Payment Method",
      accessor: "payment",
      cell: (payment) =>
        payment?.method === "cash" ? "Cash On Delivery" : "Online",
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
        return refundedItems > 0
          ? `${totalItems} (${refundedItems} refunded)`
          : `${totalItems}`;
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
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search"}
          value={inputValue}
          onChange={onInputChange}
        />

        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <Select
              options={statusOptions}
              value={selectedStatusOption}
              onChange={handleChangeStatus}
              placeholder="Select Status"
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <StoreDropdown
              storeId={selectedStoreId}
              onChange={setSelectedStoreId}
              allowAll={false}
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <UserDropdown
              userId={selectedCustomerId}
              onChange={setSelectedCustomerId}
              variant="minimal"
              label=""
            />
            <Divider vertical className="mx-3 h-6" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <Divider vertical className="mx-3 h-6" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="ghost"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={orders}
        size="sm"
        pagination={paginationProps}
        isLoading={isFetching}
        isMuted={isFetching}
      />

      {/* Refund Dialog */}
      {selectedOrderForRefund && (
        <RefundItemsDialog
          order={selectedOrderForRefund}
          isOpen={isRefundDialogOpen}
          onClose={handleCloseRefund}
          onSave={handleSaveRefund}
        />
      )}
    </div>
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
    <div className="flex flex-col py-2">
      <button
        onClick={handleViewDetails}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Eye size={16} />
        <span>View Details</span>
      </button>
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
      {status === "delivered" && (
        <button
          onClick={handleRefund}
          className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
        >
          <DollarSign size={16} />
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Order History",
    to: routeConstants.orderHistory,
  },
];

export default OrderHistoryScreen;
