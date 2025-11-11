import { useEffect, useMemo, type FC } from "react";
import CartSummaryWithCheckout from "./CartSummaryWithCheckout";
import { useFetchCartSummary } from "../hooks/useFetchCartSummary";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";

type Props = {
  query: PricingForCartParamsForAdmin;
  userId?: string;
  addressId?: string;
  cartListLength?: number;
  onCheckoutClick: () => void;
};

const CartSummaryCheckoutWrapper: FC<Props> = (props) => {
  const { query, userId = "", addressId = "", cartListLength = 0, onCheckoutClick } = props;
  const { data, isFetching, refetch, setData } = useFetchCartSummary(
    query,
    true,
  );

  const { deliveryType, cartIds, storeId } = query;

  const shouldFetchApi = useMemo(() => {
    if (
      !userId ||
      !addressId ||
      !storeId ||
      !cartIds?.length ||
      !deliveryType
    ) {
      return false;
    }

    if (deliveryType === "delivery" && !addressId) {
      return false;
    }
    return true;
  }, [addressId, cartIds, deliveryType, storeId, userId]);

  useEffect(() => {
    if (shouldFetchApi) {
      refetch();
    } else {
      setData((prev) => ({
        ...prev,
        isFetching: false,
        data: null,
        isError: false,
      }));
    }
  }, [refetch, setData, shouldFetchApi]);

  return (
    <CartSummaryWithCheckout
      isFetching={isFetching}
      summary={data || null}
      userId={userId}
      addressId={addressId}
      cartListLength={cartListLength}
      deliveryType={deliveryType}
      onCheckoutClick={onCheckoutClick}
    />
  );
};

export default CartSummaryCheckoutWrapper;
