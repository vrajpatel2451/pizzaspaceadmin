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
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import UserDropdown from "@/features/user/UserDropdown";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { useUserDetailsMap } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type {
  OrderTicketQueryParams,
  OrderTicketResponse,
} from "@/types/ticket.types";
import { prettyDate } from "@/utils/formatDateTime";
import { RefreshCcw, SearchIcon } from "lucide-react";
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
    onInputChange({ target: { value: "" } } as any);
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

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const isOpen = status === "open";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isOpen
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        }`}
      >
        {isOpen ? "Open" : "Closed"}
      </span>
    );
  };

  // Table columns
  const columns: TableColumn<OrderTicketResponse>[] = [
    {
      header: "Ticket ID",
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
      header: "Message",
      accessor: "message",
      cell: (message) => (
        <span className="max-w-[200px] truncate block" title={message}>
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
          className="max-w-[150px] truncate block"
          title={message || "-"}
        >
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Images",
      accessor: "imageList",
      cell: (images) => (images?.length > 0 ? `${images.length} image(s)` : "-"),
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
              options={statusOptions}
              value={selectedStatusOption}
              onChange={handleChangeStatus}
              placeholder="Select Status"
              variant="minimal"
            />
            {!hideStoreDropdown && (
              <>
                <Divider vertical className="mx-3 h-6" />
                <RBACStoreDropdown
                  storeId={displayStoreId}
                  onChange={onStoreChange}
                  allowAll={false}
                  variant="minimal"
                />
              </>
            )}
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
        data={tickets}
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
    label: "Order Tickets",
    to: routeConstants.orderTickets,
  },
];

export default OrderTicketsScreen;
