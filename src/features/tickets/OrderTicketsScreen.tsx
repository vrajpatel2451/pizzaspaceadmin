import Divider from "@/components/base/Divider";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { useScreenNotification } from "@/hooks/useScreenNotification";
import { useUserDetailsMap } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import type {
  OrderTicketQueryParams,
  OrderTicketResponse,
} from "@/types/ticket.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Ticket } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchOrderTickets } from "./hooks";
import TicketActions from "./components/TicketActions";

const statusOptions: SelectOption[] = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

const OrderTicketsScreen = () => {
  // Query state
  const [query, setQuery] = useState<OrderTicketQueryParams>({
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
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const selectedStatusOption = useMemo(
    () => statusOptions.find((e) => e.value === selectedStatus),
    [selectedStatus],
  );

  const handleChangeStatus = useCallback((val: SelectOnChangeVal) => {
    const value = (val as SelectOption)?.value || "";
    setSelectedStatus(value);
  }, []);

  // Reset all filters
  const onReset = useCallback(() => {
    resetStoreFilter();
    setSelectedCustomerId("");
    setSelectedStatus("");
    onInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setQuery({
      limit: 10,
      currentPage: 1,
    });
  }, [onInputChange, resetStoreFilter]);

  // Register for FCM notifications
  useScreenNotification({
    categories: ["ORDER_TICKET_CREATED"],
    onReset,
  });

  // Handle search change for FilterBar
  const handleSearchChange = useCallback(
    (value: string) => {
      onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    },
    [onInputChange],
  );

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
    if (!isReady) return;
    setQuery((prev) => ({
      ...prev,
      storeId: effectiveStoreId || undefined,
      userId: selectedCustomerId || undefined,
      status: selectedStatus ? (selectedStatus as "open" | "closed") : undefined,
      currentPage: 1,
    }));
  }, [effectiveStoreId, selectedCustomerId, selectedStatus, isReady]);

  // Fetch tickets
  const { data, isFetching, setData } = useFetchOrderTickets(query);
  const { data: tickets, meta } = data || {};

  // Extract userIds from tickets to fetch customer details
  const userIds = useMemo(
    () => tickets?.map((ticket) => ticket.userId).filter(Boolean) || [],
    [tickets],
  );
  const { getUserById } = useUserDetailsMap(userIds);

  // Handle ticket update from actions
  const handleTicketUpdate = useCallback(
    (updatedTicket: OrderTicketResponse) => {
      setData((prev) => {
        if (!prev?.data?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((ticket: OrderTicketResponse) =>
              ticket._id === updatedTicket._id ? updatedTicket : ticket,
            ),
          },
        };
      });
    },
    [setData],
  );

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

  // Check if filters are active
  const hasActiveFilters =
    inputValue.length > 0 || selectedStatus !== "" || selectedCustomerId !== "";

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const isOpen = status === "open";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          isOpen
            ? "bg-yellow-50 text-yellow-700"
            : "bg-green-50 text-green-700"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isOpen ? "bg-yellow-500" : "bg-green-500"
          }`}
        />
        {isOpen ? "Open" : "Closed"}
      </span>
    );
  };

  // Table columns
  const columns: TableColumn<OrderTicketResponse>[] = [
    {
      header: "Ticket ID",
      accessor: "_id",
      cell: (val) => (
        <span className="font-mono text-sm font-medium text-slate-800">
          #{val.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Order ID",
      accessor: "orderId",
      cell: (val) => (
        <span className="font-mono text-sm text-slate-600">
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
          <span className="text-slate-600">{user?.name || "-"}</span>
        );
      },
    },
    {
      header: "Message",
      accessor: "message",
      cell: (message) => (
        <span
          className="block max-w-[200px] truncate text-slate-600"
          title={message}
        >
          {message}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => renderStatusBadge(status),
    },
    {
      header: "Closing Message",
      accessor: "closingMessage",
      cell: (message) => (
        <span
          className="block max-w-36 truncate text-slate-500"
          title={message || "-"}
        >
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Images",
      accessor: "imageList",
      cell: (images) => (
        <span className="text-slate-500">
          {images?.length > 0 ? `${images.length} image(s)` : "-"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        const user = getUserById(row.userId);
        return (
          <TicketActions
            ticket={row}
            customerPhone={user?.phone}
            customerEmail={user?.email}
            onTicketUpdate={handleTicketUpdate}
          />
        );
      },
    },
  ];

  return (
    <ScreenContainer>
      <FilterBar
        searchValue={inputValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by Order ID"
        onReset={onReset}
        showReset={hasActiveFilters}
      >
        <Select
          options={statusOptions}
          value={selectedStatusOption}
          onChange={handleChangeStatus}
          placeholder="Select Status"
          variant="minimal"
        />
        {!hideStoreDropdown && (
          <>
            <Divider vertical className="mx-2 h-6" />
            <RBACStoreDropdown
              storeId={displayStoreId}
              onChange={onStoreChange}
              allowAll={false}
              variant="minimal"
            />
          </>
        )}
        <Divider vertical className="mx-2 h-6" />
        <UserDropdown
          userId={selectedCustomerId}
          onChange={setSelectedCustomerId}
          variant="minimal"
          label=""
        />
      </FilterBar>

      {!isFetching && (!tickets || tickets.length === 0) ? (
        <EmptyState
          icon={Ticket}
          title="No tickets found"
          description={
            hasActiveFilters
              ? "No tickets match your current filters. Try adjusting your search."
              : "No order tickets have been submitted yet."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={tickets}
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

export default OrderTicketsScreen;
