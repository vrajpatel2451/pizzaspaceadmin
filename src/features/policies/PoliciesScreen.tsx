import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { useToggle } from "@/hooks/useToggle";
import { policyApiService } from "@/infrastructure/PolicyApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { PolicyListResponse } from "@/types/policy.types";
import { Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchPoliciesList } from "./hooks";

const PoliciesScreen = () => {
  const navigate = useNavigate();
  const { data: list, isFetching, refetch } = useFetchPoliciesList();

  const columns: TableColumn<PolicyListResponse>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Slug",
      accessor: "slug",
      cell: (val) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700">
          {val}
        </code>
      ),
    },
    {
      header: "Show on Footer",
      accessor: "showOnFooter",
      cell: (val) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            val
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {val ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      cell: (_, row) => <PolicyActions policy={row} onRefresh={refetch} />,
    },
  ];

  const handleCreate = useCallback(() => {
    navigate(routeConstants.policyCreate);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-end">
        <Button
          startIcon={<Plus className="text-white" size={20} />}
          onClick={handleCreate}
        >
          Create
        </Button>
      </div>

      <Table
        className="mt-4"
        columns={columns}
        data={list}
        isLoading={isFetching}
        isMuted={isFetching}
      />
    </div>
  );
};

type ActionsProps = {
  policy: PolicyListResponse;
  onRefresh: () => void;
};

const PolicyActions: FC<ActionsProps> = (props) => {
  const { policy, onRefresh } = props;
  const { _id, name } = policy;
  const navigate = useNavigate();
  const { isOpen, open, close } = useToggle();
  const {
    isOpen: isDeleteInProgress,
    open: startDeleteProgress,
    close: stopDeleteProgress,
  } = useToggle();

  const handleEdit = useCallback(() => {
    navigate(routeConstants.policyEdit.replace(":id", _id));
  }, [_id, navigate]);

  const onDelete = useCallback(async () => {
    startDeleteProgress();
    const { success } = await policyApiService.deletePolicy(_id);
    if (success) {
      close();
      onRefresh();
      toast.success("Policy deleted successfully");
    } else {
      toast.error("Error deleting policy");
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
          title="Delete Policy!"
          name={name}
        />
      )}
      <IconButton icon={Pen} onClick={handleEdit} />
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
    label: "Policies",
    to: routeConstants.policies,
  },
];

export default PoliciesScreen;
