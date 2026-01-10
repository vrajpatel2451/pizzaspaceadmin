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
import useDebounce from "@/hooks/useDebounce";
import { useToggle } from "@/hooks/useToggle";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import type {
  CategoryQueryParams,
  SubCategoryResponse,
} from "@/types/category.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Eye, Layers, Pen, Plus, Store, Trash } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import CategoryDropdown from "./CategoryDropdown";
import AssignStoreToSubCategoryDialog from "./components/AssignStoreToSubCategoryDialog";
import { useFetchSubCategoryList } from "./hooks";
import SubCategoryDialog from "./SubCategoryDialog";

const SubCategoryScreen = () => {
  const [query, setQuery] = useState<CategoryQueryParams>({
    limit: 8,
    page: 1,
    search: "",
  });

  const onReset = useCallback(() => {
    setQuery({
      limit: 8,
      page: 1,
      search: "",
    });
  }, []);
  const { categoryId, search } = query;
  const onChangeCategory = useCallback((categoryId: string) => {
    setQuery((prev) => ({ ...prev, categoryId }));
  }, []);

  const debouncedQuery = useDebounce(query);
  const { data, isFetching, refetch } = useFetchSubCategoryList(debouncedQuery);
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

  const columns: TableColumn<SubCategoryResponse>[] = [
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
          {storeIds?.length || 0} {(storeIds?.length || 0) === 1 ? "Store" : "Stores"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => {
        return <SubCategoryActions subCategory={row} onRefresh={refetch} />;
      },
    },
  ];

  const { close, isOpen, open } = useToggle();

  const hasFilters = categoryId || search;
  const hasData = list && list.length > 0;
  const showEmptyState = !isFetching && !hasData;

  return (
    <ScreenContainer>
      {isOpen && <SubCategoryDialog onClose={close} onSave={refetch} isOpen />}

      <div className="flex justify-end">
        <Button
          startIcon={<Plus className="text-white" size={18} />}
          onClick={open}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Create Sub Category
        </Button>
      </div>

      <FilterBar
        searchValue={search || ""}
        onSearchChange={(value) =>
          setQuery((prev) => ({ ...prev, search: value }))
        }
        searchPlaceholder="Search sub categories..."
        onReset={onReset}
        showReset={!!hasFilters}
      >
        <CategoryDropdown
          categoryId={categoryId}
          onChange={onChangeCategory}
          variant="minimal"
        />
      </FilterBar>

      {showEmptyState ? (
        <EmptyState
          icon={Layers}
          title="No sub categories found"
          description="Get started by creating your first sub category to organize your products."
          actionLabel="Create Sub Category"
          onAction={open}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list || []}
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
  subCategory: SubCategoryResponse;
  onRefresh: () => void;
};

const SubCategoryActions: FC<Props> = (props) => {
  const { subCategory, onRefresh } = props;
  const { _id, name } = subCategory;
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
    const { success } = await subCategoryApiService.deleteSubCategory(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("SubCategory deleted successfully");
    } else {
      toast.error("Error deleting SubCategory");
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
          title="Delete SubCategory!"
          name={name}
        />
      )}
      {isEditOpen && (
        <SubCategoryDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          subCategory={subCategory}
        />
      )}
      {isAssignStoreOpen && (
        <AssignStoreToSubCategoryDialog
          subCategory={subCategory}
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

export default SubCategoryScreen;
