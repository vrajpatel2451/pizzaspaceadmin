import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useInputState } from "@/hooks/useInputState";
import { useToggle } from "@/hooks/useToggle";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { routeConstants } from "@/routes/routeConstants";
import {
  Eye,
  MapPin,
  Pen,
  Phone,
  Plus,
  Store,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchStoreList } from "./hooks";
import type { StoreQueryParams, StoreResponse } from "./types/StoreTypes";

const StoreListScreen = () => {
  const [query, setQuery] = useState<StoreQueryParams>({
    limit: 8,
    isActive: false,
    page: 1,
    search: "",
  });
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  const { data, isFetching, refetch } = useFetchStoreList(query);
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

  const columns: TableColumn<StoreResponse>[] = [
    {
      header: "Store",
      accessor: "name",
      cell: (_, row) => (
        <div className="flex items-center gap-3">
          <ImageComponent
            alt={row.name + " alt"}
            src={row.imageUrl}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-500">
              {row.deliveryRadius} km delivery radius
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "phone",
      cell: (_, row) => {
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              {row.phone}
            </div>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Address",
      accessor: "lat",
      cell: (_, row) => {
        const address = [row.line1, row.area, row.city, row.zip]
          .filter(Boolean)
          .join(", ");
        return (
          <div className="flex items-start gap-1.5 max-w-[200px]">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
            <p className="text-sm text-slate-600 line-clamp-2">{address}</p>
          </div>
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
        return <StoreActions store={row} onRefresh={refetch} />;
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
        searchPlaceholder="Search stores..."
        actions={
          <Link
            to={routeConstants.storesDetails
              .replace(":action", "create")
              .replace(":storeId", "new-store")}
          >
            <Button startIcon={<Plus className="h-4 w-4" />}>Add Store</Button>
          </Link>
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={Store}
          title="No stores found"
          description="Get started by creating your first store location."
          actionLabel="Add Store"
          onAction={() =>
            nav(
              routeConstants.storesDetails
                .replace(":action", "create")
                .replace(":storeId", "new-store")
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list}
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
  store: StoreResponse;
  onRefresh: () => void;
};

const StoreActions: FC<Props> = (props) => {
  const { store, onRefresh } = props;
  const { _id, name } = store;
  const nav = useNavigate();
  const { isOpen, open, close } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();
  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await storeApiService.deleteStore(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Store deleted successfully");
    } else {
      toast.error("Error deleting store");
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
          title="Delete Store!"
          name={name}
        />
      )}
      <IconButton
        icon={Eye}
        size="sm"
        noDefaultFill
        onClick={() => nav(routeConstants.storesView.replace(":storeId", _id))}
      />
      <IconButton
        icon={Pen}
        size="sm"
        noDefaultFill
        onClick={() =>
          nav(
            routeConstants.storesDetails
              .replace(":action", "edit")
              .replace(":storeId", _id)
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

export default StoreListScreen;
