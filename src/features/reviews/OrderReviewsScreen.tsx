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
import { Table, type TableColumn } from "@/components/compound/table/Table";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useUserDetailsMap } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type { OrderReviewQueryParams, OrderReviewResponse } from "@/types/review.types";
import { prettyDate } from "@/utils/formatDateTime";
import { RefreshCcw, SearchIcon, Star } from "lucide-react";
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

const OrderReviewsScreen = () => {
  // Query state
  const [query, setQuery] = useState<OrderReviewQueryParams>({
    limit: 10,
    currentPage: 1,
  });

  // Filter states
  const [selectedStoreId, setSelectedStoreId] = useState("");
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
    setSelectedStoreId("");
    setSelectedCustomerId("");
    setSelectedRating("");
    onInputChange({ target: { value: "" } } as any);
    setQuery({
      limit: 10,
      currentPage: 1,
    });
  }, [onInputChange]);

  // Sync debounced search to query (search on orderId)
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      orderId: debounceVal || undefined,
      currentPage: 1,
    }));
  }, [debounceVal]);

  // Sync filters to query
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      storeId: selectedStoreId || undefined,
      userId: selectedCustomerId || undefined,
      overallRatings: selectedRating ? parseInt(selectedRating) : undefined,
      currentPage: 1,
    }));
  }, [selectedStoreId, selectedCustomerId, selectedRating]);

  // Fetch reviews
  const { data, isFetching } = useFetchOrderReviews(query);
  const { data: reviews, meta } = data || {};

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

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  // Table columns
  const columns: TableColumn<OrderReviewResponse>[] = [
    {
      header: "Review ID",
      accessor: "_id",
      cell: (val) => `#${val.slice(-8).toUpperCase()}`,
    },
    {
      header: "Order ID",
      accessor: "orderId",
      cell: (val) => `#${val.slice(-8).toUpperCase()}`,
    },
    {
      header: "Customer",
      accessor: "userId",
      cell: (userId) => {
        const user = getUserById(userId);
        return user?.name || "-";
      },
    },
    {
      header: "Overall Rating",
      accessor: "overallRatings",
      cell: (rating) => renderStars(rating),
    },
    {
      header: "Message",
      accessor: "overallMessage",
      cell: (message) => (
        <span className="max-w-[200px] truncate block" title={message || "-"}>
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Delivery Rating",
      accessor: "deliveryBoyRatings",
      cell: (rating) => (rating ? renderStars(rating) : "-"),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (date) => prettyDate(date),
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
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search by Order ID"}
          value={inputValue}
          onChange={onInputChange}
        />

        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <Select
              options={ratingOptions}
              value={selectedRatingOption}
              onChange={handleChangeRating}
              placeholder="Select Rating"
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

      <Table
        className="mt-4"
        columns={columns}
        data={reviews}
        size="sm"
        pagination={paginationProps}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Order Reviews",
    to: routeConstants.orderReviews,
  },
];

export default OrderReviewsScreen;
