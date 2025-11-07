import { IconButton } from "@/components/base/IconButton";
import Avatar from "@/components/compound/Avatar";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import Tabs from "@/components/compound/Tabs";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { routeConstants } from "@/routes/routeConstants";
import { Pen, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryChargesList from "../deliverycharges/DeliveryChargesFormList";
import ExtraChargesFromList from "../extracharges/ExtraChargesFormList";
import OrderTaxStructureScreen from "../ordertaxstructure/OrderTaxStructureScreen";
import { useFetchStoreDetails } from "./hooks";

type Params = {
  storeId: string;
};

const StoreViewScreen = () => {
  const { storeId } = useParams<Params>();
  const brdcrb = useMemo(() => breadcrumbs(storeId), [storeId]);
  const { data: store, isFetching } = useFetchStoreDetails(storeId);
  const fullAddress = [
    store?.line1 || "",
    store?.line2 || "",
    store?.area || "",
    store?.city || "",
    store?.county || "",
    store?.zip || "",
    store?.country || "",
  ]
    .filter(Boolean)
    .join(", ");

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${store.lat},${store.long}`,
      "_blank",
    );
  };

  const [currentTabId, setCurrentTabId] = useState("tax");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const canGoBack = useCanGoBack();
  const nav = useNavigate();

  const {
    isOpen: isDeleting,
    open: startDeleting,
    close: stopDeleting,
  } = useToggle();
  const { isOpen, open, close } = useToggle();
  const onDeleteConfirm = useCallback(async () => {
    startDeleting();
    const { success } = await storeApiService.deleteStore(storeId);
    if (success) {
      toast.success("Deleted successfully");
      if (canGoBack) {
        nav(-1);
      } else {
        nav(routeConstants.stores);
      }
    } else {
      toast.error("Error deleting charges");
    }
    stopDeleting();
  }, [canGoBack, nav, startDeleting, stopDeleting, storeId]);

  return (
    <div className="flex h-full w-full flex-col gap-4 px-8 py-4">
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDeleteConfirm}
          isDeleting={isDeleting}
          title="Delete Store!"
          name={store?.name}
        />
      )}
      <Breadcrumbs breadcrumbs={brdcrb} />
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <div className="flex w-full flex-1 flex-col gap-4">
          <div className="dark:bg-nd-700 border-pl-200 dark:border-nd-500 rounded-2xl border bg-white p-4">
            <div className="flex items-center gap-4">
              <Avatar
                image={store.imageUrl}
                fallback={getInitials(store.name)}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h2 className="text-nl-900 dark:text-nd-50 text-lg font-bold">
                    {store.name}
                  </h2>
                  {store.isActive ? (
                    <span className="bg-sl-500/10 dark:bg-sd-500/10 text-sl-600 dark:text-sd-400 rounded px-2 py-1 text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="bg-dl-500/10 dark:bg-dd-500/10 text-dl-600 dark:text-dd-400 rounded px-2 py-1 text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <IconButton
                icon={Pen}
                onClick={() =>
                  nav(
                    routeConstants.storesDetails
                      .replace(":action", "edit")
                      .replace(":storeId", storeId),
                  )
                }
              />
              <IconButton icon={Trash} onClick={open} />
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-4">
              {/* Email */}
              <div>
                <p className="text-nl-900 dark:text-nd-50 mb-1 text-xs font-semibold">
                  Email Id
                </p>
                <a
                  href={`mailto:${store.email}`}
                  className="text-nl-700 dark:text-nd-200 hover:text-pl-500 dark:hover:text-pd-400 text-sm"
                >
                  {store.email}
                </a>
              </div>

              {/* Address */}
              <div>
                <p className="text-nl-900 dark:text-nd-50 mb-1 text-xs font-semibold">
                  Store Address
                </p>
                <p className="cursor-pointer" onClick={openGoogleMaps}>
                  {fullAddress}
                </p>
              </div>
              {/* Phone */}
              <div>
                <p className="text-nl-900 dark:text-nd-50 mb-1 text-xs font-semibold">
                  Phone
                </p>
                <a
                  href={`tel:${store.phone}`}
                  className="text-nl-700 dark:text-nd-200 hover:text-pl-500 dark:hover:text-pd-400 text-sm"
                >
                  {store.phone}
                </a>
              </div>

              {/* Delivery Radius */}
              <div>
                <p className="text-nl-900 dark:text-nd-50 mb-1 text-xs font-semibold">
                  Delivery Radius
                </p>
                <p className="text-nl-700 dark:text-nd-200 text-sm">
                  {store.deliveryRadius} miles
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Section - Bottom 70% */}

          <Tabs
            buttonList={[
              {
                label: "Tax Structure",
                value: "tax",
              },
              {
                label: "Delivery Charges",
                value: "delivery",
              },
              {
                label: "Extra Charges",
                value: "extra",
              },
            ]}
            onChange={setCurrentTabId}
            selected={currentTabId}
            fullWidth
          />
          <div className="max-h-[50vh] w-full flex-1 overflow-hidden">
            {currentTabId === "tax" && (
              <OrderTaxStructureScreen storeId={storeId} />
            )}
            {currentTabId === "delivery" && (
              <DeliveryChargesList storeId={storeId} />
            )}
            {currentTabId === "extra" && (
              <ExtraChargesFromList storeId={storeId} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const breadcrumbs = (id: string): BreadcrumbItem[] => [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Stores",
    to: routeConstants.stores,
  },
  {
    label: "Store Details",
    to: routeConstants.storesDetails.replace(":storeId", id),
  },
];

export default StoreViewScreen;
