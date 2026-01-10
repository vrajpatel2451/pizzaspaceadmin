import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import EmptyState from "@/components/shared/EmptyState";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useToggle } from "@/hooks/useToggle";
import { policyApiService } from "@/infrastructure/PolicyApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { PolicyListResponse } from "@/types/policy.types";
import { FileText, Pen, Plus, Trash } from "lucide-react";
import { useCallback, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchPoliciesList } from "./hooks";

const PoliciesScreen = () => {
  const navigate = useNavigate();
  const { data: list, isFetching, refetch } = useFetchPoliciesList();

  const columns: TableColumn<PolicyListResponse>[] = [
    {
      header: "Policy Name",
      accessor: "name",
      cell: (val) => (
        <span className="font-medium text-slate-800">{val}</span>
      ),
    },
    {
      header: "URL Slug",
      accessor: "slug",
      cell: (val) => (
        <code className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-mono text-slate-600">
          /{val}
        </code>
      ),
    },
    {
      header: "Footer Visibility",
      accessor: "showOnFooter",
      cell: (val) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            val
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {val ? "Shown" : "Hidden"}
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

  const isEmpty = !isFetching && (!list || list.length === 0);

  return (
    <ScreenContainer>
      <div className="mb-4 flex justify-end">
        <Button
          startIcon={<Plus className="text-white" size={18} />}
          onClick={handleCreate}
        >
          Create Policy
        </Button>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={FileText}
          title="No policies created yet"
          description="Create your first policy document to display important legal information on your website."
          actionLabel="Create Policy"
          onAction={handleCreate}
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

export default PoliciesScreen;
