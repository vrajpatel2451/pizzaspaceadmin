import type { BreadcrumbItem } from "@/components/compound/Breadcrumbs";
import { routeConstants } from "@/routes/routeConstants";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useFetchDiscountDetails } from "../hooks";
import { useFetchStoreDetails } from "@/features/company-management/hooks";
import type { DiscountFormFields } from "./DiscountForm";
import type { DiscountType } from "@/types/discount.types";
import Breadcrumbs from "@/components/compound/Breadcrumbs";
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
    <div className="flex w-full flex-col gap-4 px-8 py-4">
      <Breadcrumbs breadcrumbs={brdcrb} />
      {isFetching && <div>Loading...</div>}
      {!isFetching && (
        <DiscountForm
          action={action}
          defaultValue={defaultData}
          id={discountId}
          selectedStoreInfo={storeDetails}
        />
      )}
    </div>
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
    label: "Discount Details",
    to: routeConstants.discountDetails
      .replace(":action", action)
      .replace(":discountType", type)
      .replace(":discountId", id),
  },
];

export default DiscountDetailsScreen;
