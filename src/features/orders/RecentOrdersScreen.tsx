import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Select, type SelectOption } from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type { PaginationProps } from "@/components/compound/Pagination";
import Pagination from "@/components/compound/Pagination";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type { OrderQueryParams, OrderStatus } from "@/types/order.types";
import { RotateCcw, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import OrderCard from "./components/OrderCard";
import { useFetchOrderList } from "./hooks";

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
  const [selectedStatus, setSelectedStatus] = useState<SelectOption | null>(
    null,
  );
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  // Sync debounced search to query
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal, page: 1 }));
  }, [debounceVal]);

  // Sync filters to query
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      status: selectedStatus?.value as OrderStatus | undefined,
      storeId: selectedStoreId || undefined,
      customerId: selectedCustomerId || undefined,
      page: 1, // Reset to first page when filters change
    }));
  }, [selectedStatus, selectedStoreId, selectedCustomerId]);

  // Fetch orders
  const { data, isFetching } = useFetchOrderList(query);
  const { data: orders, meta } = data || {};

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

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setSelectedStatus(null);
    setSelectedStoreId("");
    setSelectedCustomerId("");
    onInputChange({ target: { value: "" } } as any);
    setQuery((prev) => ({
      limit: prev.limit,
      page: 1,
      search: "",
      startTime,
      endTime,
    }));
  }, [onInputChange, startTime, endTime]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Breadcrumbs */}
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Filters Section */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="min-w-[200px] flex-1">
          <Input
            leftElement={<SearchIcon size={18} strokeWidth={1} />}
            placeholder="Search by order ID..."
            value={inputValue}
            onChange={onInputChange}
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[180px]">
          <Select
            value={selectedStatus}
            onChange={(option) => setSelectedStatus(option as SelectOption)}
            options={statusOptions}
            placeholder="Filter by status"
            isClearable
          />
        </div>

        {/* Store Filter */}
        <div className="min-w-[180px]">
          <StoreDropdown
            storeId={selectedStoreId}
            onChange={setSelectedStoreId}
            allowAll={false}
            variant="default"
          />
        </div>

        {/* Customer Filter */}
        <div className="min-w-[180px]">
          <UserDropdown
            userId={selectedCustomerId}
            onChange={setSelectedCustomerId}
            variant="default"
            label=""
          />
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          color="neutral"
          onClick={handleResetFilters}
          startIcon={<RotateCcw size={18} />}
        >
          Reset
        </Button>
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
              <OrderCard key={order._id} order={order} />
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
