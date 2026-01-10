import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Switch from "@/components/base/Switch";
import DeleteDialog from "@/components/compound/DeleteDialog";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { contactInfoApiService } from "@/infrastructure/ContactInfoApiService";
import type {
  ContactInfoQueryParams,
  ContactInfoResponse,
} from "@/types/contactInfo.types";
import { prettyDate } from "@/utils/formatDateTime";
import { MapPin, Pen, Plus, Trash } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import ContactInfoDialog from "./ContactInfoDialog";
import { useFetchContactInfoList } from "./hooks";

const ContactInfoScreen = () => {
  const [query, setQuery] = useState<ContactInfoQueryParams>({
    limit: 10,
    page: 1,
  });

  const { data, isFetching, refetch, setData } = useFetchContactInfoList(query);
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

  const handlePublishToggle = useCallback(
    async (id: string, currentStatus: boolean) => {
      const { success, data: updatedData } =
        await contactInfoApiService.updateContactInfo(id, {
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
          `Contact info ${!currentStatus ? "published" : "unpublished"} successfully`
        );
      } else {
        toast.error("Failed to update publish status");
      }
    },
    [setData]
  );

  const columns: TableColumn<ContactInfoResponse>[] = [
    {
      header: "Address",
      accessor: "addressLine1",
      cell: (val, row) => (
        <div className="max-w-[200px]">
          <div className="truncate font-medium text-slate-800">{val}</div>
          {row.addressLine2 && (
            <div className="truncate text-sm text-slate-500">
              {row.addressLine2}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Area / City",
      accessor: "area",
      cell: (val, row) => (
        <span className="text-slate-600">{`${val}, ${row.city}`}</span>
      ),
    },
    {
      header: "Phone",
      accessor: "phone",
      cell: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      header: "Email",
      accessor: "email",
      cell: (val) => (
        <span className="text-slate-600">{val}</span>
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
      header: "Created At",
      accessor: "createdAt",
      cell: (date) => (
        <span className="text-slate-500">{prettyDate(date)}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => <ContactInfoActions contactInfo={row} onRefresh={refetch} />,
    },
  ];

  const { close, isOpen, open } = useToggle();

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      {isOpen && <ContactInfoDialog onClose={close} onSave={refetch} isOpen />}

      <div className="mb-4 flex justify-end">
        <Button
          startIcon={<Plus className="text-white" size={18} />}
          onClick={open}
        >
          Add Contact
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={MapPin}
          title="No contact information yet"
          description="Add your first contact entry to display business locations and contact details on your website."
          actionLabel="Add Contact"
          onAction={open}
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
    </ScreenContainer>
  );
};

type ActionsProps = {
  contactInfo: ContactInfoResponse;
  onRefresh: () => void;
};

const ContactInfoActions: FC<ActionsProps> = (props) => {
  const { contactInfo, onRefresh } = props;
  const { _id, addressLine1 } = contactInfo;
  const { isOpen, open, close } = useToggle();
  const { isOpen: isEditOpen, open: openEdit, close: closeEdit } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await contactInfoApiService.deleteContactInfo(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Contact info deleted successfully");
    } else {
      toast.error("Error deleting contact info");
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
          title="Delete Contact Info!"
          name={addressLine1}
        />
      )}
      {isEditOpen && (
        <ContactInfoDialog
          onClose={closeEdit}
          onSave={onRefresh}
          isOpen
          contactInfo={contactInfo}
        />
      )}
      <IconButton icon={Pen} onClick={openEdit} />
      <IconButton icon={Trash} onClick={open} />
    </div>
  );
};

export default ContactInfoScreen;
