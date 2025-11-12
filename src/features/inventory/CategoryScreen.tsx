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
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import { routeConstants } from "@/routes/routeConstants";
import type {
  CategoryQueryParams,
  CategoryResponse,
} from "@/types/category.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Eye, Pen, Plus, SearchIcon, Store, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import CategoryDialog from "./CategoryDialog";
import { useFetchCategoryList } from "./hooks";
import AssignStoreToCategoryDialog from "./components/AssignStoreToCategoryDialog";

const CategoryScreen = () => {
  const [query, setQuery] = useState<CategoryQueryParams>({
    limit: 8,
    page: 1,
    search: "",
  });
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  useEffect(() => {
    setQuery((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  const { data, isFetching, refetch } = useFetchCategoryList(query);
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

  const columns: TableColumn<CategoryResponse>[] = [
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
      header: "Created At",
      accessor: "createdAt",
      cell: (date) => {
        return prettyDate(date);
      },
    },
    {
      header: "Stores Using this Categories",
      accessor: "storeIds",
      cell: (storeIds: string[]) => {
        return `${storeIds.length} Stores`;
      },
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <CategoryActions category={row} onRefresh={refetch} />;
      },
    },
  ];

  const { close, isOpen, open } = useToggle();

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <CategoryDialog onClose={close} onSave={refetch} isOpen />}
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search"}
          value={inputValue}
          onChange={onInputChange}
        />
        <Button
          startIcon={<Plus className="text-white" size={20} />}
          onClick={open}
        >
          Create
        </Button>
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
  category: CategoryResponse;
  onRefresh: () => void;
};

const CategoryActions: FC<Props> = (props) => {
  const { category, onRefresh } = props;
  const { _id, name } = category;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();
  const {
    isOpen: isAssignStoreOpen,
    open: openAssignStore,
    close: closeAssignStore,
  } = useToggle();
  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await categoryApiService.deleteCategory(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Category deleted successfully");
    } else {
      toast.error("Error deleting Category");
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
          title="Delete Category!"
          name={name}
        />
      )}
      {isEditOpen && (
        <CategoryDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          category={category}
        />
      )}
      {isAssignStoreOpen && (
        <AssignStoreToCategoryDialog
          category={category}
          isOpen
          onClose={closeAssignStore}
          onSave={onRefresh}
        />
      )}
      <IconButton icon={Eye} />
      <IconButton icon={Pen} onClick={openEdit} />
      <IconButton icon={Store} onClick={openAssignStore} />
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
    label: "Categories",
    to: routeConstants.categories,
  },
];

export default CategoryScreen;
