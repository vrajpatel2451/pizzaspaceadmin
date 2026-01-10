import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { IconButton } from "@/components/base/IconButton";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import DeleteDialog from "@/components/compound/DeleteDialog";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import { useInputState } from "@/hooks/useInputState";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { useToggle } from "@/hooks/useToggle";
import { staffApiService } from "@/infrastructure/StaffApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { StaffQueryParams, StaffResponse } from "@/types/user.types";
import { Eye, Pen, Plus, Trash, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchStaffList } from "./hooks";

const roleOptions: SelectOption[] = [
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Delivery Boy",
    value: "delivery_boy",
  },
  {
    label: "Kitchen",
    value: "kitchen",
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "manager":
      return "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20";
    case "delivery_boy":
      return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20";
    case "kitchen":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20";
  }
};

const formatRoleName = (role: string) => {
  switch (role) {
    case "delivery_boy":
      return "Delivery";
    case "manager":
      return "Manager";
    case "kitchen":
      return "Kitchen";
    default:
      return role;
  }
};

const StaffListScreen = () => {
  // Store filter with RBAC awareness
  const {
    displayStoreId,
    effectiveStoreId,
    hideStoreDropdown,
    onStoreChange,
    resetStoreFilter,
    isReady,
  } = useStoreFilter();

  const [query, setQuery] = useState<StaffQueryParams>({
    limit: 8,
    isActive: false,
    storeId: "",
    page: 1,
    search: "",
  });

  // Sync store filter to query - only after auth is ready
  useEffect(() => {
    if (!isReady) return;
    setQuery((prev) => ({
      ...prev,
      storeId: effectiveStoreId || "",
    }));
  }, [effectiveStoreId, isReady]);

  const onReset = useCallback(() => {
    resetStoreFilter();
    setQuery({
      limit: 8,
      isActive: false,
      storeId: "",
      page: 1,
      search: "",
    });
  }, [resetStoreFilter]);

  const { role } = query;

  const selectedRoleOption = useMemo(
    () => roleOptions.find((e) => e.value === role),
    [role]
  );

  const handleChangeRole = useCallback((val: SelectOnChangeVal) => {
    setQuery((prev) => ({ ...prev, role: (val as any)?.value }));
  }, []);

  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  const { data, isFetching, refetch } = useFetchStaffList(query);
  const { data: list, meta } = data || {};

  const paginationProps = useMemo<PaginationProps>(
    () => ({
      ...meta,
      onPageChange: (cP) => {
        setQuery((prev) => ({ ...prev, page: cP }));
      },
    }),
    [meta]
  );

  const nav = useNavigate();

  const columns: TableColumn<StaffResponse>[] = [
    {
      header: "Staff Member",
      accessor: "name",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-700">
            {row.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (val) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(val)}`}
        >
          {formatRoleName(val)}
        </span>
      ),
    },
    {
      header: "Store",
      accessor: "storeId",
      cell: (store) => {
        return (
          <p className="text-sm text-slate-600">{store || "Not assigned"}</p>
        );
      },
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (val) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            val
              ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
              : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <StaffActions staff={row} onRefresh={refetch} />;
      },
    },
  ];

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      <FilterBar
        searchValue={inputValue}
        onSearchChange={(val) =>
          onInputChange({ target: { value: val } } as any)
        }
        searchPlaceholder="Search staff..."
        showReset={Boolean(query.role || query.storeId || query.search)}
        onReset={onReset}
        actions={
          <Link
            to={routeConstants.staffDetails
              .replace(":action", "create")
              .replace(":staffId", "new-staff")}
          >
            <Button startIcon={<Plus className="h-4 w-4" />}>Add Staff</Button>
          </Link>
        }
      >
        {!hideStoreDropdown && (
          <>
            <RBACStoreDropdown
              storeId={displayStoreId}
              onChange={onStoreChange}
              variant="minimal"
            />
            <Divider vertical className="mx-1 h-6" />
          </>
        )}
        <Select
          options={roleOptions}
          value={selectedRoleOption}
          onChange={handleChangeRole}
          placeholder="Select Role"
          variant="minimal"
        />
      </FilterBar>

      {isEmpty ? (
        <EmptyState
          icon={Users}
          title="No staff members found"
          description="Get started by adding your first team member."
          actionLabel="Add Staff"
          onAction={() =>
            nav(
              routeConstants.staffDetails
                .replace(":action", "create")
                .replace(":staffId", "new-staff")
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list}
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

type Props = {
  staff: StaffResponse;
  onRefresh: () => void;
};

const StaffActions: FC<Props> = (props) => {
  const { staff, onRefresh } = props;
  const { _id, name } = staff;
  const nav = useNavigate();
  const { isOpen, open, close } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();
  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await staffApiService.deleteStaff(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Staff deleted successfully");
    } else {
      toast.error("Error deleting staff");
    }
    stopDeleteProgress();
  }, [_id, close, onRefresh, startDeleteProgress, stopDeleteProgress]);

  return (
    <div className="flex items-center gap-1">
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDelete}
          isDeleting={isDeleteInProgress}
          title="Delete Staff!"
          name={name}
        />
      )}
      <IconButton
        icon={Eye}
        size="sm"
        noDefaultFill
        onClick={() =>
          nav(
            routeConstants.staffDetails
              .replace(":action", "edit")
              .replace(":staffId", _id)
          )
        }
      />
      <IconButton
        icon={Pen}
        size="sm"
        noDefaultFill
        onClick={() =>
          nav(
            routeConstants.staffDetails
              .replace(":action", "edit")
              .replace(":staffId", _id)
          )
        }
      />
      <IconButton
        icon={Trash}
        size="sm"
        noDefaultFill
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={open}
      />
    </div>
  );
};

export default StaffListScreen;
