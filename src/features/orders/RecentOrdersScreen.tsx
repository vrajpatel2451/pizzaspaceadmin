import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { PaginationProps } from "@/components/compound/Pagination";
import Pagination from "@/components/compound/Pagination";
import ScreenContainer from "@/components/shared/ScreenContainer";
import FilterBar from "@/components/shared/FilterBar";
import EmptyState from "@/components/shared/EmptyState";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import type { OrderQueryParams } from "@/types/order.types";
import { ShoppingBag } from "lucide-react";
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
    onInputChange({ target: { value: "" } } as any);
    setQuery({
      limit: 9,
      page: 1,
      search: "",
      startTime,
      endTime,
    });
  }, [onInputChange, startTime, endTime, resetStoreFilter]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      inputValue !== "" ||
      status !== undefined ||
      displayStoreId !== "" ||
      selectedCustomerId !== ""
    );
  }, [inputValue, status, displayStoreId, selectedCustomerId]);

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
    <ScreenContainer>
      {/* Filter Bar */}
      <FilterBar
        searchValue={inputValue}
        onSearchChange={(value) =>
          onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
        }
        searchPlaceholder="Search by order ID, customer name..."
        onReset={onReset}
        showReset={hasActiveFilters}
      >
        <Select
          options={statusOptions}
          value={selectedStatusOption}
          onChange={handleChangeStatus}
          placeholder="All Statuses"
          variant="minimal"
          className="min-w-40"
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
      </FilterBar>

      {/* Loading State */}
      {isFetching && !orders && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isFetching && !orders?.length && (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description="There are no orders for today yet. New orders will appear here automatically."
        />
      )}

      {/* Orders Grid */}
      {orders && orders.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex justify-center">
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
    </ScreenContainer>
  );
};

export default RecentOrdersScreen;
