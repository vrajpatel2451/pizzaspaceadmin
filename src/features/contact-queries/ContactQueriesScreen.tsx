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
  ContactQueryQueryParams,
  ContactQueryResponse,
  ContactQueryStatus,
} from "@/types/contactQuery.types";
import { prettyDate } from "@/utils/formatDateTime";
import { MessageSquare } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ContactQueryActions from "./components/ContactQueryActions";
import { useFetchContactQueriesList } from "./hooks";

const statusOptions: SelectOption[] = [
  { label: "All Status", value: "" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

const subjectLabels: Record<string, string> = {
  "general inquiry": "General Inquiry",
  "order issue": "Order Issue",
  feedback: "Feedback",
  other: "Other",
  reservation: "Reservation",
  "general complaint": "General Complaint",
};

const ContactQueriesScreen = () => {
  const [query, setQuery] = useState<ContactQueryQueryParams>({
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
        ? (selectedStatus as ContactQueryStatus)
        : undefined,
      page: 1,
    }));
  }, [selectedStatus]);

  const { data, isFetching, setData, refetch } = useFetchContactQueriesList(query);
  const { data: queries, meta } = data || {};

  const handleQueryUpdate = useCallback(
    (updatedQuery: ContactQueryResponse) => {
      setData((prev) => {
        if (!prev?.data?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((q: ContactQueryResponse) =>
              q._id === updatedQuery._id ? updatedQuery : q
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

  const renderSubjectBadge = (subject: string) => {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
        {subjectLabels[subject] || subject}
      </span>
    );
  };

  const columns: TableColumn<ContactQueryResponse>[] = [
    {
      header: "Query ID",
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
      header: "Email",
      accessor: "email",
      cell: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => <span className="text-slate-600">{val || "-"}</span>,
    },
    {
      header: "Subject",
      accessor: "subject",
      cell: (subject) => renderSubjectBadge(subject),
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
      header: "Date",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <ContactQueryActions
          query={row}
          onQueryUpdate={handleQueryUpdate}
          onQueryDelete={refetch}
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

      {!isFetching && (!queries || queries.length === 0) ? (
        <EmptyState
          icon={MessageSquare}
          title="No contact queries found"
          description={
            hasActiveFilters
              ? "No queries match your current filters. Try adjusting your selection."
              : "No contact queries have been submitted yet."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={queries}
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

export default ContactQueriesScreen;
