import React, { type FC } from "react";
import CartSummaryWithCheckout from "./CartSummaryWithCheckout";
import { useFetchCartSummary } from "../hooks/useFetchCartSummary";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";

type Props = {
  query: PricingForCartParamsForAdmin;
};

const CartSummaryCheckoutWrapper: FC<Props> = (props) => {
  const { query } = props;
  const { data, isFetching } = useFetchCartSummary(query);
  return <CartSummaryWithCheckout isFetching={isFetching} summary={data} />;
};

export default CartSummaryCheckoutWrapper;
