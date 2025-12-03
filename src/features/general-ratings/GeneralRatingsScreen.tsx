import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { Select, type SelectOnChangeVal, type SelectOption } from "@/components/base/Select";
import Switch from "@/components/base/Switch";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { generalRatingApiService } from "@/infrastructure/GeneralRatingApiService";
import { routeConstants } from "@/routes/routeConstants";
import type {
  GeneralRatingQueryParams,
  GeneralRatingResponse,
} from "@/types/generalRating.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Phone, RefreshCcw, Star, Trash } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import { useFetchGeneralRatingsList } from "./hooks";

const publishedFilterOptions: SelectOption<string>[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "true" },
  { label: "Unpublished", value: "false" },
];

const GeneralRatingsScreen = () => {
  const [query, setQuery] = useState<GeneralRatingQueryParams>({
    limit: 10,
    page: 1,
  });
  const [publishedFilter, setPublishedFilter] = useState<SelectOption<string>>(
    publishedFilterOptions[0]
  );

  const { data, isFetching, refetch, setData } = useFetchGeneralRatingsList(
    query
  );
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

  const handlePublishedFilterChange = useCallback(
    (value: SelectOnChangeVal<string>) => {
      const option = value as SelectOption<string> | null;
      if (option) {
        setPublishedFilter(option);
        if (option.value === "all") {
          setQuery((prev) => {
            const { isPublished, ...rest } = prev;
            return { ...rest, page: 1 };
          });
        } else {
          setQuery((prev) => ({
            ...prev,
            isPublished: option.value === "true",
            page: 1,
          }));
        }
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setPublishedFilter(publishedFilterOptions[0]);
    setQuery({ limit: 10, page: 1 });
  }, []);

  const handlePublishToggle = useCallback(
    async (id: string, currentStatus: boolean) => {
      const { success, data: updatedData } =
        await generalRatingApiService.updateGeneralRating(id, {
          isPublished: !currentStatus,
        });
      if (success && updatedData) {
        setData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((item) =>
              item._id === id ? updatedData : item
            ),
          },
        }));
        toast.success(
          `Rating ${!currentStatus ? "published" : "unpublished"} successfully`
        );
      } else {
        toast.error("Failed to update publish status");
      }
    },
    [setData]
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating})</span>
      </div>
    );
  };

  const columns: TableColumn<GeneralRatingResponse>[] = [
    {
      header: "Person",
      accessor: "personName",
      cell: (val, row) => (
        <div className="flex items-center gap-3">
          {row.personImage ? (
            <ImageComponent
              alt={val}
              src={row.personImage}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {val.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium">{val}</div>
            {row.personTagRole && (
              <div className="text-sm text-gray-500">{row.personTagRole}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: "ratings",
      cell: (val) => renderStars(val),
    },
    {
      header: "Phone",
      accessor: "personPhone",
      cell: (val) => val || "-",
    },
    {
      header: "Published",
      accessor: "isPublished",
      cell: (val, row) => (
        <Switch
          checked={val}
          setChecked={() => handlePublishToggle(row._id, val)}
          size="sm"
        />
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      cell: (date) => prettyDate(date),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <GeneralRatingActions rating={row} onRefresh={refetch} />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-end">
        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <Select
              options={publishedFilterOptions}
              value={publishedFilter}
              onChange={handlePublishedFilterChange}
              placeholder="Published Status"
              variant="minimal"
            />
          </div>
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="ghost"
            onClick={handleReset}
          >
            Reset
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

type ActionsProps = {
  rating: GeneralRatingResponse;
  onRefresh: () => void;
};

const GeneralRatingActions: FC<ActionsProps> = (props) => {
  const { rating, onRefresh } = props;
  const { _id, personName, personPhone } = rating;
  const { isOpen, open, close } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await generalRatingApiService.deleteGeneralRating(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Rating deleted successfully");
    } else {
      toast.error("Error deleting rating");
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
          title="Delete Rating!"
          name={personName}
        />
      )}
      {personPhone && (
        <IconButton
          icon={Phone}
          onClick={() => window.open(`tel:${personPhone}`, "_self")}
        />
      )}
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
    label: "General Ratings",
    to: routeConstants.generalRatings,
  },
];

export default GeneralRatingsScreen;
