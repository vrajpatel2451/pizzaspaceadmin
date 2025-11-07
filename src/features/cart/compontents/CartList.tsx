import type { CartResponse } from "@/types/cart.types";
import { type FC } from "react";
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
