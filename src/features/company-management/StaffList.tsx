import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import { IconButton } from "@/components/base/IconButton";
import { Input } from "@/components/base/Input";
import Select, {
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useInputState } from "@/hooks/useInputState";
import { useToggle } from "@/hooks/useToggle";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import { staffApiService } from "@/infrastructure/StaffApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { StaffQueryParams, StaffResponse } from "@/types/user.types";
import { Eye, Pen, Plus, RefreshCcw, SearchIcon, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchStaffList } from "./hooks";

const options: SelectOption[] = [
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
    () => options.find((e) => e.value === role),
    [role],
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
    [meta],
  );

  const columns: TableColumn<StaffResponse>[] = [
    {
      header: "ID",
      accessor: "_id",
      cell: (val) => `#${val}`,
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
      header: "Role",
      accessor: "role",
    },
    {
      header: "Store",
      accessor: "storeId",
      cell: (store) => {
        return (
          <p className="h-[50px] w-[100px] overflow-hidden text-ellipsis whitespace-break-spaces">
            {store || "-"}
          </p>
        );
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <StaffActions staff={row} onRefresh={refetch} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search"}
          value={inputValue}
          onChange={onInputChange}
        />

        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            {!hideStoreDropdown && (
              <>
                <RBACStoreDropdown
                  storeId={displayStoreId}
                  onChange={onStoreChange}
                  variant="minimal"
                />
                <Divider vertical className="mx-3 h-6" />
              </>
            )}
            <Select
              options={options}
              value={selectedRoleOption}
              onChange={handleChangeRole}
              placeholder="Select Role"
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
          <Link
            to={routeConstants.staffDetails
              .replace(":action", "create")
              .replace(":staffId", "new-staff")}
          >
            <Button startIcon={<Plus className="text-white" size={20} />}>
              Create
            </Button>
          </Link>
        </div>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={list}
        size="sm"
        pagination={paginationProps}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
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
    <div className="flex items-center gap-4">
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
      <IconButton icon={Eye} />
      <IconButton
        icon={Pen}
        onClick={() =>
          nav(
            routeConstants.staffDetails
              .replace(":action", "edit")
              .replace(":staffId", _id),
          )
        }
      />
      <IconButton icon={Trash} onClick={open} />
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Staff",
    to: routeConstants.staff,
  },
];

export default StaffListScreen;
