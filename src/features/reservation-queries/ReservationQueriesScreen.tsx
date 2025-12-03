import { Button } from "@/components/base/Button";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { routeConstants } from "@/routes/routeConstants";
import type {
  ReservationQueryQueryParams,
  ReservationQueryResponse,
  ReservationStatus,
} from "@/types/reservationQuery.types";
import { prettyDate } from "@/utils/formatDateTime";
import { RefreshCcw } from "lucide-react";
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

  const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      reserved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    const labels: Record<string, string> = {
      open: "Open",
      reserved: "Reserved",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || ""}`}
      >
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
      cell: (val) => `#${val.slice(-8).toUpperCase()}`,
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Date",
      accessor: "date",
      cell: (date) => formatDate(date),
    },
    {
      header: "Time",
      accessor: "time",
    },
    {
      header: "Guests",
      accessor: "noOfGuest",
      cell: (val) => `${val} guest${val > 1 ? "s" : ""}`,
    },
    {
      header: "Message",
      accessor: "message",
      cell: (message) => (
        <span className="block max-w-[150px] truncate" title={message || "-"}>
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
        <span className="block max-w-[150px] truncate" title={message || "-"}>
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (date) => prettyDate(date),
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
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-end">
        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <Select
              options={statusOptions}
              value={selectedStatusOption}
              onChange={handleChangeStatus}
              placeholder="Select Status"
              variant="minimal"
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
        data={reservations}
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
    label: "Reservation Queries",
    to: routeConstants.reservationQueries,
  },
];

export default ReservationQueriesScreen;
