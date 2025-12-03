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
  ContactQueryQueryParams,
  ContactQueryResponse,
  ContactQueryStatus,
} from "@/types/contactQuery.types";
import { prettyDate } from "@/utils/formatDateTime";
import { RefreshCcw } from "lucide-react";
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

  const renderSubjectBadge = (subject: string) => {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {subjectLabels[subject] || subject}
      </span>
    );
  };

  const columns: TableColumn<ContactQueryResponse>[] = [
    {
      header: "Query ID",
      accessor: "_id",
      cell: (val) => `#${val.slice(-8).toUpperCase()}`,
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => val || "-",
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
        <span className="block max-w-[200px] truncate" title={message}>
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
        <span className="block max-w-[150px] truncate" title={message || "-"}>
          {message || "-"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (date) => prettyDate(date),
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
        data={queries}
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
    label: "Contact Queries",
    to: routeConstants.contactQueries,
  },
];

export default ContactQueriesScreen;
