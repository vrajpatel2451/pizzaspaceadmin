import { IconButton } from "@/components/base/IconButton";
import Avatar from "@/components/compound/Avatar";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { toast } from "@/components/compound/Sonner";
import Tabs from "@/components/compound/Tabs";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useCanGoBack } from "@/hooks/useCanGoBack";
import { useToggle } from "@/hooks/useToggle";
import { storeApiService } from "@/infrastructure/StoreApiService";
import { routeConstants } from "@/routes/routeConstants";
import { Mail, MapPin, Pen, Phone, Trash, Truck } from "lucide-react";
import { useCallback, useState } from "react";
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
      "_blank"
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

  if (isFetching) {
    return (
      <ScreenContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="text-slate-500">Loading store details...</div>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
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

      {/* Store Profile Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Store Info */}
          <div className="flex items-start gap-4">
            <Avatar
              image={store.imageUrl}
              fallback={getInitials(store.name)}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-800">
                  {store.name}
                </h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    store.isActive
                      ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                      : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                  }`}
                >
                  {store.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Store ID: {storeId}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={Pen}
              size="sm"
              onClick={() =>
                nav(
                  routeConstants.storesDetails
                    .replace(":action", "edit")
                    .replace(":storeId", storeId)
                )
              }
              ariaLabel="Edit store"
            />
            <IconButton
              icon={Trash}
              size="sm"
              className="text-red-500 hover:bg-red-50"
              onClick={open}
              ariaLabel="Delete store"
            />
          </div>
        </div>

        {/* Store Details Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <Mail className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </p>
              <a
                href={`mailto:${store.email}`}
                className="mt-1 block truncate text-sm font-medium text-slate-800 hover:text-orange-600"
              >
                {store.email}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Phone
              </p>
              <a
                href={`tel:${store.phone}`}
                className="mt-1 block text-sm font-medium text-slate-800 hover:text-orange-600"
              >
                {store.phone}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Address
              </p>
              <p
                className="mt-1 cursor-pointer text-sm font-medium text-slate-800 hover:text-orange-600"
                onClick={openGoogleMaps}
              >
                {fullAddress}
              </p>
            </div>
          </div>

          {/* Delivery Radius */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <Truck className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Delivery Radius
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {store.deliveryRadius} miles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 pt-4">
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
        </div>
        <div className="max-h-[50vh] overflow-auto p-6">
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
    </ScreenContainer>
  );
};

export default StoreViewScreen;
