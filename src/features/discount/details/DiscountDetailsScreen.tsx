import type { BreadcrumbItem } from "@/components/compound/Breadcrumbs";
import Breadcrumbs from "@/components/compound/Breadcrumbs";
import Spinner from "@/components/compound/spinner/Spinner";
import ScreenContainer from "@/components/shared/ScreenContainer";
import { useFetchStoreDetails } from "@/features/company-management/hooks";
import { routeConstants } from "@/routes/routeConstants";
import type { DiscountType } from "@/types/discount.types";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFetchDiscountDetails } from "../hooks";
import type { DiscountFormFields } from "./DiscountForm";
import DiscountForm from "./DiscountForm";

type DiscountAction = "create" | "edit";

type Params = {
  action: DiscountAction;
  discountType: DiscountType;
  discountId: string;
};

const DiscountDetailsScreen = () => {
  const { discountId, action, discountType } = useParams<Params>();
  const brdcrb = useMemo(
    () => breadcrumbs(action, discountId, discountType),
    [action, discountId, discountType],
  );
  const { data, isFetching, refetch, setData } = useFetchDiscountDetails(
    discountId,
    true,
  );

  useEffect(() => {
    if (action === "edit" && discountId) {
      refetch();
    } else {
      setData((prev) => ({ ...prev, isFetching: false }));
    }
  }, [action, refetch, discountId, setData]);

  const { storeId } = data || {};
  const { data: storeDetails, refetch: fetchStores } = useFetchStoreDetails(
    storeId,
    true,
  );
  useEffect(() => {
    if (storeId) {
      fetchStores();
    }
  }, [storeId, fetchStores]);

  const defaultData = useMemo<DiscountFormFields>(() => {
    if (data && action === "edit") {
      return {
        active: data.active,
        conditionType: data.conditionType,
        couponCode: data.couponCode,
        customerType: data.customerType,
        description: data.description,
        discountAmount: data.discountAmount,
        discountAmountType: data.discountAmountType,
        discountType: data.discountType,
        endTime: data.endTime,
        hideFromSuggestion: data.hideFromSuggestion,
        maximumAmount: data.maximumAmount,
        name: data.name,
        referenceIds: data.referenceIds,
        startTime: data.startTime,
        storeId: data.storeId,
      };
    } else {
      return {
        active: true,
        conditionType: "allProducts",
        couponCode: "",
        customerType: "allCustomers",
        description: "",
        discountAmount: 0,
        discountAmountType: "fix",
        discountType: discountType,
        endTime: "",
        hideFromSuggestion: false,
        maximumAmount: 0,
        name: "",
        referenceIds: [],
        startTime: "",
        storeId: "all",
      };
    }
  }, [data, action, discountType]);

  return (
    <ScreenContainer>
      <div className="flex items-center justify-between">
        <Breadcrumbs breadcrumbs={brdcrb} />
      </div>

      {isFetching ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={24} />
            <span className="text-sm text-slate-500">Loading discount details...</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <DiscountForm
            action={action}
            defaultValue={defaultData}
            id={discountId}
            selectedStoreInfo={storeDetails}
          />
        </div>
      )}
    </ScreenContainer>
  );
};

const breadcrumbs = (
  action: DiscountAction,
  id: string,
  type: DiscountType,
): BreadcrumbItem[] => [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Discounts",
    to: routeConstants.discounts,
  },
  {
    label: action === "edit" ? "Edit Discount" : "Create Discount",
    to: routeConstants.discountDetails
      .replace(":action", action)
      .replace(":discountType", type)
      .replace(":discountId", id),
  },
];

export default DiscountDetailsScreen;
