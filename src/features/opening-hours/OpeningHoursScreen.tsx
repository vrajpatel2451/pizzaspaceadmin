import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { openingHoursApiService } from "@/infrastructure/OpeningHoursApiService";
import type { OpeningHoursResponse } from "@/types/openingHours.types";
import { Clock, Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import OpeningHoursDialog from "./OpeningHoursDialog";
import { useFetchOpeningHoursList } from "./hooks";

const OpeningHoursScreen = () => {
  const { data: list, isFetching, refetch } = useFetchOpeningHoursList();

  const columns: TableColumn<OpeningHoursResponse>[] = [
    {
      header: "Day",
      accessor: "day",
      cell: (val) => (
        <span className="font-medium text-slate-800">{val}</span>
      ),
    },
    {
      header: "Opening Time",
      accessor: "startTime",
      cell: (val) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center rounded-lg bg-green-50 px-3 text-sm font-medium text-green-700">
            {val}
          </div>
        </div>
      ),
    },
    {
      header: "Closing Time",
      accessor: "endTime",
      cell: (val) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center rounded-lg bg-red-50 px-3 text-sm font-medium text-red-700">
            {val}
          </div>
        </div>
      ),
    },
    {
      header: "Order",
      accessor: "sortOrder",
      cell: (val) => (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
          {val}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => (
        <OpeningHoursActions openingHours={row} onRefresh={refetch} />
      ),
    },
  ];

  const { close, isOpen, open } = useToggle();

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      {isOpen && <OpeningHoursDialog onClose={close} onSave={refetch} isOpen />}

      <div className="mb-4 flex justify-end">
        <Button
          startIcon={<Plus className="text-white" size={18} />}
          onClick={open}
        >
          Add Hours
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={Clock}
          title="No opening hours configured"
          description="Add your business operating hours to let customers know when you're open."
          actionLabel="Add Hours"
          onAction={open}
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <Table
            columns={columns}
            data={list}
            isLoading={isFetching}
            isMuted={isFetching}
          />
        </div>
      )}
    </ScreenContainer>
  );
};

type ActionsProps = {
  openingHours: OpeningHoursResponse;
  onRefresh: () => void;
};

const OpeningHoursActions: FC<ActionsProps> = (props) => {
  const { openingHours, onRefresh } = props;
  const { _id, day } = openingHours;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await openingHoursApiService.deleteOpeningHours(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Opening hours deleted successfully");
    } else {
      toast.error("Error deleting opening hours");
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
          title="Delete Opening Hours!"
          name={day}
        />
      )}
      {isEditOpen && (
        <OpeningHoursDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          openingHours={openingHours}
        />
      )}
      <IconButton icon={Pen} onClick={openEdit} />
      <IconButton icon={Trash} onClick={open} />
    </div>
  );
};

export default OpeningHoursScreen;
