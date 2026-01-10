import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import ScreenContainer from "@/components/shared/ScreenContainer";
import FilterBar from "@/components/shared/FilterBar";
import EmptyState from "@/components/shared/EmptyState";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import StaffDropdown from "@/features/company-management/components/StaffDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useUserDetailsMap } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import type { OrderReviewQueryParams, OrderReviewResponse } from "@/types/review.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Star, Truck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchOrderReviews } from "./hooks";
import ReviewActions from "./components/ReviewActions";

const ratingOptions: SelectOption[] = [
  { label: "All Ratings", value: "" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

const DeliveryBoyReviewsScreen = () => {
  // Query state - filter to only show reviews with delivery ratings
  const [query, setQuery] = useState<OrderReviewQueryParams>({
    limit: 10,
    currentPage: 1,
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
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const selectedRatingOption = useMemo(
    () => ratingOptions.find((e) => e.value === selectedRating),
    [selectedRating],
  );

  const handleChangeRating = useCallback((val: SelectOnChangeVal) => {
    const value = (val as SelectOption)?.value || "";
    setSelectedRating(value);
  }, []);

  // Reset all filters
  const onReset = useCallback(() => {
    resetStoreFilter();
    setSelectedStaffId("");
    setSelectedCustomerId("");
    setSelectedRating("");
    onInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setQuery({
      limit: 10,
      currentPage: 1,
    });
  }, [onInputChange, resetStoreFilter]);

  // Sync debounced search to query (search on orderId)
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      orderId: debounceVal || undefined,
      currentPage: 1,
    }));
  }, [debounceVal]);

  // Sync filters to query - filter by deliveryBoyRatings and staffId
  useEffect(() => {
    if (!isReady) return;
    setQuery((prev) => ({
      ...prev,
      storeId: effectiveStoreId || undefined,
      staffId: selectedStaffId || undefined,
      userId: selectedCustomerId || undefined,
      deliveryBoyRatings: selectedRating ? parseInt(selectedRating) : undefined,
      currentPage: 1,
    }));
  }, [effectiveStoreId, selectedStaffId, selectedCustomerId, selectedRating, isReady]);

  // Fetch reviews
  const { data, isFetching } = useFetchOrderReviews(query);
  const { data: allReviews, meta } = data || {};

  // Filter to only show reviews that have delivery ratings
  const reviews = useMemo(() => {
    return allReviews?.filter((review) => review.deliveryBoyRatings && review.deliveryBoyRatings > 0) || [];
  }, [allReviews]);

  // Extract userIds from reviews to fetch customer details
  const userIds = useMemo(
    () => reviews?.map((review) => review.userId).filter(Boolean) || [],
    [reviews],
  );
  const { getUserById } = useUserDetailsMap(userIds);

  // Pagination props
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (cP) => {
        setQuery((prev) => ({ ...prev, currentPage: cP }));
      },
    }),
    [meta],
  );

  // Render stars with orange color
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-orange-400 text-orange-400"
                : "text-slate-300"
            }
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-700">({rating})</span>
      </div>
    );
  };

  // Check for active filters
  const hasActiveFilters = selectedRating || selectedCustomerId || selectedStaffId || (displayStoreId && !hideStoreDropdown) || inputValue;

  // Table columns - focused on delivery boy info
  const columns: TableColumn<OrderReviewResponse>[] = [
    {
      header: "Review ID",
      accessor: "_id",
      cell: (val) => (
        <span className="font-mono text-xs text-slate-600">
          #{val.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Order ID",
      accessor: "orderId",
      cell: (val) => (
        <span className="font-mono text-xs text-slate-600">
          #{val.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Customer",
      accessor: "userId",
      cell: (userId) => {
        const user = getUserById(userId);
        return (
          <span className="font-medium text-slate-800">
            {user?.name || "-"}
          </span>
        );
      },
    },
    {
      header: "Staff ID",
      accessor: "staffId",
      cell: (val) => (
        <span className="font-mono text-xs text-slate-600">
          {val ? `#${val.slice(-8).toUpperCase()}` : "-"}
        </span>
      ),
    },
    {
      header: "Delivery Rating",
      accessor: "deliveryBoyRatings",
      cell: (rating) => (rating ? renderStars(rating) : <span className="text-slate-400">-</span>),
    },
    {
      header: "Delivery Message",
      accessor: "deliveryBoyMessage",
      cell: (message) => (
        <span className="max-w-[200px] truncate block text-slate-600" title={message || "-"}>
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-sm text-slate-600">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        const user = getUserById(row.userId);
        return (
          <ReviewActions
            customerPhone={user?.phone}
            customerEmail={user?.email}
          />
        );
      },
    },
  ];

  return (
    <ScreenContainer>
      <FilterBar
        searchValue={inputValue}
        onSearchChange={(val) => onInputChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)}
        searchPlaceholder="Search by Order ID..."
        showReset={Boolean(hasActiveFilters)}
        onReset={onReset}
      >
        <Select
          options={ratingOptions}
          value={selectedRatingOption}
          onChange={handleChangeRating}
          placeholder="Select Delivery Rating"
          variant="minimal"
        />
        {!hideStoreDropdown && (
          <RBACStoreDropdown
            storeId={displayStoreId}
            onChange={onStoreChange}
            variant="minimal"
          />
        )}
        <StaffDropdown
          staffId={selectedStaffId}
          onChange={setSelectedStaffId}
          variant="minimal"
          label=""
        />
        <UserDropdown
          userId={selectedCustomerId}
          onChange={setSelectedCustomerId}
          variant="minimal"
          label=""
        />
      </FilterBar>

      {!isFetching && (!reviews || reviews.length === 0) ? (
        <EmptyState
          icon={Truck}
          title="No delivery reviews found"
          description="There are no delivery reviews matching your criteria. Try adjusting your filters."
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <Table
            columns={columns}
            data={reviews}
            size="sm"
            pagination={paginationProps}
            isLoading={isFetching}
            isMuted={isFetching}
          />
        </div>
      )}
    </ScreenContainer>
  );
};

export default DeliveryBoyReviewsScreen;
