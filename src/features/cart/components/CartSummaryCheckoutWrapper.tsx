import { type FC } from "react";
import CartSummaryWithCheckout from "./CartSummaryWithCheckout";
import { useFetchCartSummary } from "../hooks/useFetchCartSummary";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";

type Props = {
  query: PricingForCartParamsForAdmin;
  userId?: string;
  addressId?: string;
  cartListLength?: number;
};

const CartSummaryCheckoutWrapper: FC<Props> = (props) => {
  const { query, userId = "", addressId = "", cartListLength = 0 } = props;
  const { data, isFetching } = useFetchCartSummary(query);
  return (
    <CartSummaryWithCheckout
      isFetching={isFetching}
      summary={data || null}
      userId={userId}
      addressId={addressId}
      cartListLength={cartListLength}
    />
  );
};

export default CartSummaryCheckoutWrapper;
