import { useFetchAllProductList } from "@/features/inventory/hooks";
import type { CartResponse } from "@/types/cart.types";
import type { ProductQueryParams } from "@/types/product.types";
import { useEffect, useMemo, type FC } from "react";
import Spinner from "@/components/compound/spinner/Spinner";
import type { OnEditToCart } from "../types/cart.types";
import CartProductEditView from "./CartProductEditView";

type Props = {
  cartList: CartResponse[];
  onEditToCart: OnEditToCart;
  onRemoveToCart: (cartId: string) => Promise<boolean>;
};

const CartList: FC<Props> = (props) => {
  const { cartList, onEditToCart, onRemoveToCart } = props;

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-auto">
      {cartList?.map((prod) => (
        <CartProductEditView
          onAddToCart={onEditToCart}
          onRemove={onRemoveToCart}
          cart={prod}
          key={prod._id}
        />
      ))}
    </div>
  );
};

export default CartList;
