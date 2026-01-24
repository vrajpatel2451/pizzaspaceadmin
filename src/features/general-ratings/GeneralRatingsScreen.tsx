import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { Select, type SelectOnChangeVal, type SelectOption } from "@/components/base/Select";
import Switch from "@/components/base/Switch";
import DeleteDialog from "@/components/compound/DeleteDialog";
import ImageComponent from "@/components/compound/ImageComponent";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import FilterBar from "@/components/shared/FilterBar";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { generalRatingApiService } from "@/infrastructure/GeneralRatingApiService";
import type {
  GeneralRatingQueryParams,
  GeneralRatingResponse,
} from "@/types/generalRating.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Pencil, Phone, Plus, RefreshCcw, Star, Trash } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import GeneralRatingDialog from "./GeneralRatingDialog";
import { useFetchGeneralRatingsList } from "./hooks";

const publishedFilterOptions: SelectOption<string>[] = [
  { label: "All Ratings", value: "all" },
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
  const [selectedRating, setSelectedRating] =
    useState<GeneralRatingResponse | null>(null);
  const {
    isOpen: isDialogOpen,
    open: openDialog,
    close: closeDialog,
  } = useToggle();

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
          setQuery((prev) => ({
              limit: prev.limit,
              page: 1,
              sortBy: prev.sortBy,
              isAscending: prev.isAscending,
            }));
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

  const handleOpenCreate = useCallback(() => {
    setSelectedRating(null);
    openDialog();
  }, [openDialog]);

  const handleOpenEdit = useCallback(
    (rating: GeneralRatingResponse) => {
      setSelectedRating(rating);
      openDialog();
    },
    [openDialog]
  );

  const handleCloseDialog = useCallback(() => {
    setSelectedRating(null);
    closeDialog();
  }, [closeDialog]);

  const handleSaveRating = useCallback(
    (savedRating: GeneralRatingResponse) => {
      if (selectedRating) {
        // Update existing rating in list
        setData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            data: prev.data.data.map((item) =>
              item._id === savedRating._id ? savedRating : item
            ),
          },
        }));
      } else {
        // Refetch to get the new rating in the list
        refetch();
      }
    },
    [selectedRating, setData, refetch]
  );

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
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200"
            }
          />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">{rating}/5</span>
      </div>
    );
  };

  const columns: TableColumn<GeneralRatingResponse>[] = [
    {
      header: "Customer",
      accessor: "personName",
      cell: (val, row) => (
        <div className="flex items-center gap-3">
          {row.personImage ? (
            <ImageComponent
              alt={val}
              src={row.personImage}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
              {val.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-slate-800">{val}</div>
            {row.personTagRole && (
              <div className="text-xs text-slate-500">{row.personTagRole}</div>
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
      cell: (val) => (
        <span className="text-slate-600">{val || "-"}</span>
      ),
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
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <GeneralRatingActions
          rating={row}
          onRefresh={refetch}
          onEdit={handleOpenEdit}
        />
      ),
    },
  ];

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      <FilterBar
        className="mb-4"
        actions={
          <div className="flex items-center gap-2">
            <Button
              startIcon={<RefreshCcw size={18} />}
              variant="ghost"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              startIcon={<Plus size={18} />}
              onClick={handleOpenCreate}
            >
              Add Rating
            </Button>
          </div>
        }
      >
        <Select
          options={publishedFilterOptions}
          value={publishedFilter}
          onChange={handlePublishedFilterChange}
          placeholder="Filter by status"
          variant="minimal"
        />
      </FilterBar>

      {isEmpty ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Customer reviews will appear here once they start submitting feedback."
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list}
            pagination={paginationProps}
            isLoading={isFetching}
            isMuted={isFetching}
          />
        </div>
      )}

      <GeneralRatingDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveRating}
        rating={selectedRating || undefined}
      />
    </ScreenContainer>
  );
};

type ActionsProps = {
  rating: GeneralRatingResponse;
  onRefresh: () => void;
  onEdit: (rating: GeneralRatingResponse) => void;
};

const GeneralRatingActions: FC<ActionsProps> = (props) => {
  const { rating, onRefresh, onEdit } = props;
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
      <IconButton icon={Pencil} onClick={() => onEdit(rating)} />
      <IconButton icon={Trash} onClick={open} />
    </div>
  );
};

export default GeneralRatingsScreen;
