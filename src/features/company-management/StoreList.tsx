import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { Input } from "@/components/base/Input";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useInputState } from "@/hooks/useInputState";
import { useToggle } from "@/hooks/useToggle";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { routeConstants } from "@/routes/routeConstants";
import { Eye, Pen, Plus, SearchIcon, Trash } from "lucide-react";
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
    [meta],
  );

  const columns: TableColumn<StoreResponse>[] = [
    {
      header: "Image",
      accessor: "imageUrl",
      cell: (val, row) => (
        <ImageComponent
          alt={row.name + " alt"}
          src={val}
          className="size-9 rounded-md"
        />
      ),
    },
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Delivery Radius",
      accessor: "deliveryRadius",
      cell: (val) => <p>{val} km</p>,
    },
    {
      header: "Info",
      accessor: "phone",
      cell: (_, row) => {
        return (
          <div>
            <p>{row.phone}</p>
            <p>{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Address & Location",
      accessor: "lat",
      cell: (_, row) => {
        return (
          <p className="h-[50px] w-[100px] overflow-hidden text-ellipsis whitespace-break-spaces">
            {row.line1} {row.line2} {row.area} {row.city} {row.county}{" "}
            {row.country} {row.zip} <span>SEE Location</span>
          </p>
        );
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <StoreActions store={row} onRefresh={refetch} />;
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

        <Link
          to={routeConstants.storesDetails
            .replace(":action", "create")
            .replace(":storeId", "new-store")}
        >
          <Button startIcon={<Plus className="text-white" size={20} />}>
            Create
          </Button>
        </Link>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={list}
        pagination={paginationProps}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
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
    <div className="flex items-center gap-4">
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
      <IconButton icon={Eye} />
      <IconButton
        icon={Pen}
        onClick={() =>
          nav(
            routeConstants.storesDetails
              .replace(":action", "edit")
              .replace(":storeId", _id),
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
    label: "Stores",
    to: routeConstants.stores,
  },
];

export default StoreListScreen;
