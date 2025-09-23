import { Button } from "@/components/base/Button";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import Spinner from "@/components/compound/spinner/Spinner";
import StoreDropdown from "@/features/company-management/components/StoreDropdown";
import { useToggle } from "@/hooks/useToggle";
import { routeConstants } from "@/routes/routeConstants";
import type { AddonBulkGetParams } from "@/types/addon.types";
import { Plus, RefreshCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { useFetchAddonList } from "../hooks";
import AddonCard from "./AddonCard";
import AddonCreateDialog from "./AddonCreateDialog";

const AddonScreen = () => {
  const [query, setQuery] = useState<AddonBulkGetParams>({});
  const { storeId } = query || {};
  const onReset = useCallback(() => {
    setQuery({});
  }, []);
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
        <div className="filters-wrapper">
          <StoreDropdown
            variant="minimal"
            onChange={(storeId) => setQuery((prev) => ({ ...prev, storeId }))}
            storeId={storeId}
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
      {isFetching && (
        <div className="col-span-full">
          <Spinner />
        </div>
      )}
      {!isFetching && (
        <>
          {isError && <div className="col-span-full">{errorMessage}</div>}
          {!isError && (
            <div className="w-full flex-1">
              <div className="grid h-full w-full grid-cols-3 gap-4 overflow-auto">
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
