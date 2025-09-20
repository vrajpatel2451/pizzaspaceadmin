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
import useDebounce from "@/hooks/useDebounce";
import { useToggle } from "@/hooks/useToggle";
import { subCategoryApiService } from "@/infrastructure/SubCategoryApiService";
import { routeConstants } from "@/routes/routeConstants";
import type {
  CategoryQueryParams,
  SubCategoryResponse,
} from "@/types/category.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Eye, Pen, Plus, RefreshCcw, SearchIcon, Trash } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import CategoryDropdown from "./CategoryDropdown";
import SubCategoryDialog from "./SubCategoryDialog";
import { useFetchSubCategoryList } from "./hooks";

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
        return `${storeIds?.length || 0} Stores`;
      },
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

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <SubCategoryDialog onClose={close} onSave={refetch} isOpen />}
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search"}
          value={search || ""}
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <CategoryDropdown
              categoryId={categoryId}
              onChange={onChangeCategory}
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
          <Button
            startIcon={<Plus className="text-white" size={20} />}
            onClick={open}
          >
            Create
          </Button>
        </div>
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
    <div className="flex items-center gap-4">
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
      <IconButton icon={Eye} />
      <IconButton icon={Pen} onClick={openEdit} />
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
    label: "Sub Categories",
    to: routeConstants.subCategories,
  },
];

export default SubCategoryScreen;
