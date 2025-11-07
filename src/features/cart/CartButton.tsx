import { IconButton } from "@/components/base/IconButton";
import { useToggle } from "@/hooks/useToggle";
import { ShoppingBasket } from "lucide-react";
import CartDialog from "./CartDialog";

const CartButton = () => {
  const { isOpen, open, close } = useToggle();
  return (
    <>
      {isOpen && <CartDialog close={close} isOpen />}
      <IconButton
        onClick={open}
        icon={ShoppingBasket}
        size={"xl"}
        className="bg-pl-500"
        iconClassName="text-white"
      />
    </>
  );
};

export default CartButton;
