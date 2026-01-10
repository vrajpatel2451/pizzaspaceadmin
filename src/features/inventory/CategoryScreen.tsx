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
import { categoryApiService } from "@/infrastructure/CategoryApiService";
import type {
  CategoryQueryParams,
  CategoryResponse,
} from "@/types/category.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Eye, FolderOpen, Pen, Plus, Store, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import CategoryDialog from "./CategoryDialog";
import AssignStoreToCategoryDialog from "./components/AssignStoreToCategoryDialog";
import { useFetchCategoryList } from "./hooks";

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
          className="size-10 rounded-lg border border-slate-200 object-cover"
        />
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
      header: "Created At",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-slate-600">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Stores",
      accessor: "storeIds",
      cell: (storeIds: string[]) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {storeIds.length} {storeIds.length === 1 ? "Store" : "Stores"}
        </span>
      ),
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

  const hasData = list && list.length > 0;
  const showEmptyState = !isFetching && !hasData;

  return (
    <ScreenContainer>
      {isOpen && <CategoryDialog onClose={close} onSave={refetch} isOpen />}

      <FilterBar
        searchValue={inputValue}
        onSearchChange={(value) =>
          onInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
        }
        searchPlaceholder="Search categories..."
        actions={
          <Button
            startIcon={<Plus size={18} />}
            onClick={open}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Create Category
          </Button>
        }
      />

      {showEmptyState ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories found"
          description="Get started by creating your first category to organize your products."
          actionLabel="Create Category"
          onAction={open}
        />
      ) : (
        <Table
          columns={columns}
          data={list || []}
          pagination={paginationProps}
          isLoading={isFetching}
          isMuted={isFetching}
        />
      )}
    </ScreenContainer>
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
    <div className="flex items-center gap-2">
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
      <IconButton
        icon={Eye}
        size="xs"
        className="text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        noDefaultFill
      />
      <IconButton
        icon={Pen}
        size="xs"
        onClick={openEdit}
        className="text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        noDefaultFill
      />
      <IconButton
        icon={Store}
        size="xs"
        onClick={openAssignStore}
        className="text-slate-500 hover:bg-orange-50 hover:text-orange-600"
        noDefaultFill
      />
      <IconButton
        icon={Trash}
        size="xs"
        onClick={open}
        className="text-slate-500 hover:bg-red-50 hover:text-red-600"
        noDefaultFill
      />
    </div>
  );
};

export default CategoryScreen;
