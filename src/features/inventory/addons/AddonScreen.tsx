import { Button } from "@/components/base/Button";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import Spinner from "@/components/compound/spinner/Spinner";
import RBACStoreDropdown from "@/features/company-management/components/RBACStoreDropdown";
import { useToggle } from "@/hooks/useToggle";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import { routeConstants } from "@/routes/routeConstants";
import type { AddonBulkGetParams } from "@/types/addon.types";
import { Plus, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFetchAddonList } from "../hooks";
import AddonCard from "./AddonCard";
import AddonCreateDialog from "./AddonCreateDialog";

const AddonScreen = () => {
  // Store filter with RBAC awareness
  const {
    displayStoreId,
    effectiveStoreId,
    hideStoreDropdown,
    onStoreChange,
    resetStoreFilter,
    isReady,
  } = useStoreFilter();

  const [query, setQuery] = useState<AddonBulkGetParams>({});

  // Sync store filter to query - only after auth is ready
  useEffect(() => {
    if (!isReady) return;
    setQuery((prev) => ({
      ...prev,
      storeId: effectiveStoreId,
    }));
  }, [effectiveStoreId, isReady]);

  const onReset = useCallback(() => {
    resetStoreFilter();
    setQuery({});
  }, [resetStoreFilter]);
  const { data, isFetching, isError, errorMessage, refetch } =
    useFetchAddonList(query);
  const { close, isOpen, open } = useToggle();

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-4">
      {isOpen && <AddonCreateDialog isOpen onClose={close} onSave={refetch} />}
      <div className="col-span-full">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="col-span-full flex items-center gap-4">
        {!hideStoreDropdown && (
          <div className="filters-wrapper">
            <RBACStoreDropdown
              variant="minimal"
              onChange={onStoreChange}
              storeId={displayStoreId}
            />
          </div>
        )}
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
      {isFetching && (
        <div className="col-span-full">
          <Spinner />
        </div>
      )}
      {!isFetching && (
        <>
          {isError && <div className="col-span-full">{errorMessage}</div>}
          {!isError && (
            <div className="w-full flex-1 overflow-auto">
              <div className="grid w-full grid-cols-3 content-start gap-4">
                {data?.addonGroups?.map((group) => (
                  <AddonCard
                    addonGroup={group}
                    addons={
                      data?.addons?.filter((e) => e.groupId === group._id) || []
                    }
                    onEdit={refetch}
                    onDelete={refetch}
                    key={group._id}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Menu & Products",
    to: routeConstants.menuAndProducts,
  },
  {
    label: "Addons",
    to: routeConstants.addons,
  },
];

export default AddonScreen;
