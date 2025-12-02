import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { Input } from "@/components/base/Input";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Popover } from "@/components/compound/Popover";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useFetchUserList } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type { UserQueryParams, UserResponse } from "@/types/user.types";
import { prettyDate } from "@/utils/formatDateTime";
import {
  Edit,
  MoreVertical,
  Plus,
  RefreshCcw,
  SearchIcon,
  UserCheck,
  UserX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";

const CustomerListScreen = () => {
  const navigate = useNavigate();

  // Query state
  const [query, setQuery] = useState<UserQueryParams>({
    limit: 10,
    page: 1,
    search: "",
  });

  // Search with debounce
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  // Reset all filters
  const onReset = useCallback(() => {
    onInputChange({ target: { value: "" } } as any);
    setQuery({
      limit: 10,
      page: 1,
      search: "",
    });
  }, [onInputChange]);

  // Sync debounced search to query
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal, page: 1 }));
  }, [debounceVal]);

  // Fetch customers
  const { data, isFetching, refetch } = useFetchUserList(query);
  const { data: customers, meta } = data || {};

  // Pagination props
  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (cP) => {
        setQuery((prev) => ({ ...prev, page: cP }));
      },
    }),
    [meta],
  );

  // Navigate to create customer
  const handleCreateCustomer = useCallback(() => {
    navigate(routeConstants.createCustomer);
  }, [navigate]);

  // Table columns
  const columns: TableColumn<UserResponse>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (val) => val || "-",
    },
    {
      header: "Email",
      accessor: "email",
      cell: (val) => val || "-",
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => val || "-",
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (val) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            val
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (date) => prettyDate(date),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <CustomerActions customer={row} onRefresh={refetch} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search by name, email or phone"}
          value={inputValue}
          onChange={onInputChange}
        />

        <div className="flex items-center gap-4">
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="ghost"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            startIcon={<Plus size={20} />}
            variant="filled"
            onClick={handleCreateCustomer}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={customers}
        size="sm"
        pagination={paginationProps}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
  );
};

type CustomerActionsProps = {
  customer: UserResponse;
  onRefresh: () => void;
};

const CustomerActions: FC<CustomerActionsProps> = ({ customer }) => {
  const { _id, isActive } = customer;
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(
      routeConstants.customerDetails
        .replace(":action", "edit")
        .replace(":customerId", _id),
    );
  }, [_id, navigate]);

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleEdit}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
      >
        <Edit size={16} />
        <span>Edit Customer</span>
      </button>
      <button
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm"
        disabled
      >
        {isActive ? <UserX size={16} /> : <UserCheck size={16} />}
        <span>{isActive ? "Deactivate" : "Activate"}</span>
      </button>
    </div>
  );

  return (
    <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
      {actionsMenu}
    </Popover>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Customers",
    to: routeConstants.customerList,
  },
];

export default CustomerListScreen;
