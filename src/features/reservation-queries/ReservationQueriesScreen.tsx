import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import type {
  ReservationQueryQueryParams,
  ReservationQueryResponse,
  ReservationStatus,
} from "@/types/reservationQuery.types";
import { useScreenNotification } from "@/hooks/useScreenNotification";
import { prettyDate } from "@/utils/formatDateTime";
import { CalendarDays, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReservationQueryActions from "./components/ReservationQueryActions";
import { useFetchReservationQueriesList } from "./hooks";

const statusOptions: SelectOption[] = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "Reserved", value: "reserved" },
  { label: "Cancelled", value: "cancelled" },
];

const ReservationQueriesScreen = () => {
  const [query, setQuery] = useState<ReservationQueryQueryParams>({
    limit: 10,
    page: 1,
  });

  const [selectedStatus, setSelectedStatus] = useState("");

  const selectedStatusOption = useMemo(
    () => statusOptions.find((e) => e.value === selectedStatus),
    [selectedStatus]
  );

  const handleChangeStatus = useCallback((val: SelectOnChangeVal) => {
    const value = (val as SelectOption)?.value || "";
    setSelectedStatus(value);
  }, []);

  const onReset = useCallback(() => {
    setSelectedStatus("");
    setQuery({
      limit: 10,
      page: 1,
    });
  }, []);

  // Register for FCM notifications
  useScreenNotification({
    categories: ["RESERVATION_CREATED"],
    onReset,
  });

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      status: selectedStatus
        ? (selectedStatus as ReservationStatus)
        : undefined,
      page: 1,
    }));
  }, [selectedStatus]);

  const { data, isFetching, setData, refetch } =
    useFetchReservationQueriesList(query);
  const { data: reservations, meta } = data || {};

  const handleReservationUpdate = useCallback(
    (updatedReservation: ReservationQueryResponse) => {
      setData((prev) => {
        if (!prev?.data?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((r: ReservationQueryResponse) =>
              r._id === updatedReservation._id ? updatedReservation : r
            ),
          },
        };
      });
    },
    [setData]
  );

  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (cP) => {
        setQuery((prev) => ({ ...prev, page: cP }));
      },
    }),
    [meta]
  );

  // Check if filters are active
  const hasActiveFilters = selectedStatus !== "";

  const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      open: "bg-yellow-50 text-yellow-700",
      reserved: "bg-green-50 text-green-700",
      cancelled: "bg-red-50 text-red-700",
    };

    const dotStyles: Record<string, string> = {
      open: "bg-yellow-500",
      reserved: "bg-green-500",
      cancelled: "bg-red-500",
    };

    const labels: Record<string, string> = {
      open: "Open",
      reserved: "Reserved",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status] || ""}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] || ""}`} />
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns: TableColumn<ReservationQueryResponse>[] = [
    {
      header: "Reservation ID",
      accessor: "_id",
      cell: (val) => (
        <span className="font-mono text-sm font-medium text-slate-800">
          #{val.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cell: (val) => (
        <span className="font-medium text-slate-800">{val}</span>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <CalendarDays size={14} className="text-slate-400" />
          {formatDate(date)}
        </div>
      ),
    },
    {
      header: "Time",
      accessor: "time",
      cell: (val) => (
        <span className="font-medium text-slate-700">{val}</span>
      ),
    },
    {
      header: "Guests",
      accessor: "noOfGuest",
      cell: (val) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Users size={14} className="text-slate-400" />
          {val} guest{val > 1 ? "s" : ""}
        </div>
      ),
    },
    {
      header: "Message",
      accessor: "message",
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
      header: "Created",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <ReservationQueryActions
          reservation={row}
          onReservationUpdate={handleReservationUpdate}
          onReservationDelete={refetch}
        />
      ),
    },
  ];

  return (
    <ScreenContainer>
      <FilterBar onReset={onReset} showReset={hasActiveFilters}>
        <Select
          options={statusOptions}
          value={selectedStatusOption}
          onChange={handleChangeStatus}
          placeholder="Select Status"
          variant="minimal"
        />
      </FilterBar>

      {!isFetching && (!reservations || reservations.length === 0) ? (
        <EmptyState
          icon={CalendarDays}
          title="No reservations found"
          description={
            hasActiveFilters
              ? "No reservations match your current filters. Try adjusting your selection."
              : "No reservation requests have been submitted yet."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={reservations}
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

export default ReservationQueriesScreen;
