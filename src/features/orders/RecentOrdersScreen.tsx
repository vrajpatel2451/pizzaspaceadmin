import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { Input } from "@/components/base/Input";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type { PaginationProps } from "@/components/compound/Pagination";
import Pagination from "@/components/compound/Pagination";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type { OrderQueryParams } from "@/types/order.types";
import { RefreshCcw, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import OrderCard from "./components/OrderCard";
import { useFetchOrderList } from "./hooks";
import RefundItemsDialog from "./components/RefundItemsDialog";
import ChangeStatusDialog from "./components/ChangeStatusDialog";
import AssignStaffDialog from "./components/AssignStaffDialog";
import type { AdminTransformedOrder } from "@/types/order.types";

// Status options for dropdown
const statusOptions: SelectOption[] = [
  { label: "Initiated", value: "initiated" },
  { label: "Payment Confirmed", value: "payment_confirmed" },
  { label: "Payment Error", value: "payment_error" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready to Pickup", value: "ready_to_pickup" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
];

const RecentOrdersScreen = () => {
  // Get today's start and end times
  const getTodayDateRange = useCallback(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return {
      startTime: startOfToday.toISOString(),
      endTime: endOfToday.toISOString(),
    };
  }, []);

  const { startTime, endTime } = getTodayDateRange();

  // Query state
  const [query, setQuery] = useState<OrderQueryParams>({
    limit: 9,
    page: 1,
    search: "",
    startTime,
    endTime,
  });

  // Filter states
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

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
    onInputChange({ target: { value: "" } } as any);
    setQuery({
      limit: 9,
      page: 1,
      search: "",
      startTime,
      endTime,
    });
  }, [onInputChange, startTime, endTime]);

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

  // Fetch orders
  const { data, isFetching, refetch } = useFetchOrderList(query);
  const { data: orders, meta } = data || {};

  // Dialog states
  const [selectedOrder, setSelectedOrder] = useState<AdminTransformedOrder | null>(null);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isChangeStatusDialogOpen, setIsChangeStatusDialogOpen] = useState(false);
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
  }, [refetch]);

  // Pagination props
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (currentPage) => {
        setQuery((prev) => ({ ...prev, page: currentPage }));
      },
    }),
    [meta],
  );

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

      {/* Orders Grid */}
      {isFetching && !orders && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-nl-100 dark:bg-nd-700 h-64 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {!isFetching && !orders?.length && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-nl-600 dark:text-nd-300 text-lg">
            No orders found for today
          </p>
          <p className="text-nl-500 dark:text-nd-400 mt-2 text-sm">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onOpenRefund={handleOpenRefund}
                onOpenChangeStatus={handleOpenChangeStatus}
                onOpenAssignStaff={handleOpenAssignStaff}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination {...paginationProps} />
            </div>
          )}
        </>
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
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Recent Orders",
    to: routeConstants.recentOrders,
  },
];

export default RecentOrdersScreen;
