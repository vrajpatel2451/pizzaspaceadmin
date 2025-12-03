import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Switch from "@/components/base/Switch";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import type { PaginationProps } from "@/components/compound/Pagination";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { contactInfoApiService } from "@/infrastructure/ContactInfoApiService";
import { routeConstants } from "@/routes/routeConstants";
import type {
  ContactInfoQueryParams,
  ContactInfoResponse,
} from "@/types/contactInfo.types";
import { prettyDate } from "@/utils/formatDateTime";
import { Pen, Plus, Trash } from "lucide-react";
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
          <div className="truncate font-medium">{val}</div>
          {row.addressLine2 && (
            <div className="truncate text-sm text-gray-500">
              {row.addressLine2}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Area / City",
      accessor: "area",
      cell: (val, row) => `${val}, ${row.city}`,
    },
    {
      header: "Phone",
      accessor: "phone",
    },
    {
      header: "Email",
      accessor: "email",
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
      cell: (date) => prettyDate(date),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => <ContactInfoActions contactInfo={row} onRefresh={refetch} />,
    },
  ];

  const { close, isOpen, open } = useToggle();

  return (
    <div className="flex flex-col gap-4 p-4">
      {isOpen && <ContactInfoDialog onClose={close} onSave={refetch} isOpen />}
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-end">
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Contact Info",
    to: routeConstants.contactInfo,
  },
];

export default ContactInfoScreen;
