import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Popover } from "@/components/compound/Popover";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useFetchUserList } from "@/features/user/hooks";
import { useInputState } from "@/hooks/useInputState";
import { routeConstants } from "@/routes/routeConstants";
import type { UserQueryParams, UserResponse } from "@/types/user.types";
import { prettyDate } from "@/utils/formatDateTime";
import {
  Edit,
  MoreVertical,
  Plus,
  UserCheck,
  UserX,
  Users,
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
    onInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
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

  // Handle search change for FilterBar
  const handleSearchChange = useCallback(
    (value: string) => {
      onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    },
    [onInputChange],
  );

  // Check if filters are active
  const hasActiveFilters = inputValue.length > 0;

  // Table columns
  const columns: TableColumn<UserResponse>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-600">
            {val ? val.charAt(0).toUpperCase() : row.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="font-medium text-slate-800">{val || "-"}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      cell: (val) => <span className="text-slate-600">{val || "-"}</span>,
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => <span className="text-slate-600">{val || "-"}</span>,
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            val
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              val ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      cell: (date) => <span className="text-slate-500">{prettyDate(date)}</span>,
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
    <ScreenContainer>
      <div className="flex justify-end">
        <Button
          startIcon={<Plus size={18} />}
          variant="filled"
          onClick={handleCreateCustomer}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Add Customer
        </Button>
      </div>

      <FilterBar
        searchValue={inputValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name, email or phone"
        onReset={onReset}
        showReset={hasActiveFilters}
      />

      {!isFetching && (!customers || customers.length === 0) ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description={
            hasActiveFilters
              ? "No customers match your current filters. Try adjusting your search."
              : "Get started by adding your first customer."
          }
          actionLabel={hasActiveFilters ? undefined : "Add Customer"}
          onAction={hasActiveFilters ? undefined : handleCreateCustomer}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={customers}
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
    <div className="flex min-w-40 flex-col py-1">
      <button
        onClick={handleEdit}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Edit size={16} className="text-slate-500" />
        <span>Edit Customer</span>
      </button>
      <button
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled
      >
        {isActive ? (
          <UserX size={16} className="text-slate-500" />
        ) : (
          <UserCheck size={16} className="text-slate-500" />
        )}
        <span>{isActive ? "Deactivate" : "Activate"}</span>
      </button>
    </div>
  );

  return (
    <Popover
      trigger={
        <IconButton
          icon={MoreVertical}
          size="sm"
          className="text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        />
      }
    >
      {actionsMenu}
    </Popover>
  );
};

export default CustomerListScreen;
