import { cartApiService } from "@/infrastructure/CartApiService";
import { orderApiService } from "@/infrastructure/OrderApiService";
import type {
  CartCreateData,
  CartQueryParams,
  CartResponse,
  CartUpdateData,
  OrderDeliveryType,
} from "@/types/cart.types";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { toast } from "sonner";
import { v4 } from "uuid";
import CartList from "./CartList";
import ItemListGridView from "./ItemListGridView";
import { useFetchCartList } from "../hooks";
import type { OnAddToCart, OnEditToCart } from "../types/cart.types";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";
import CartHeaderSection from "./CartHeaderSection";
import CustomerDetailsSection from "./CustomerDetailsSection";
import DiscountSection from "./DiscountSection";
import { useFetchCartSummary } from "../hooks/useFetchCartSummary";
import CartSummaryWithCheckout from "./CartSummaryWithCheckout";
import CheckoutDialog from "./CheckoutDialog";
import PaymentLinkDialog from "./PaymentLinkDialog";
import { useToggle } from "@/hooks/useToggle";
import type { PaymentType } from "@/types/order.types";

type Props = {
  storeId: string; // REQUIRED - never empty
  onClose: () => void;
};

const CartContent: FC<Props> = (props) => {
  const { storeId } = props;

  // State management
  const [deliveryType, setDeliveryType] =
    useState<OrderDeliveryType>("delivery");
  const [cartList, setCartList] = useState<CartResponse[]>([]);
  const [userId, setUserId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [discountId, setDiscountId] = useState("");

  // Dialog states
  const {
    isOpen: isCheckoutDialogOpen,
    open: openCheckoutDialog,
    close: closeCheckoutDialog,
  } = useToggle();

  const {
    isOpen: isPaymentLinkDialogOpen,
    open: openPaymentLinkDialog,
    close: closePaymentLinkDialog,
  } = useToggle();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  // Refs for user update logic
  const isUpdatingUser = useRef(false);

  // Fetch cart list
  const params = useMemo<CartQueryParams>(
    () => ({
      storeId,
      all: true,
      fromWeb: false,
    }),
    [storeId],
  );
  const { data } = useFetchCartList(params);
  const { data: dCartList } = data || {};

  // Cart state for summary calculation
  const cartState = useMemo<PricingForCartParamsForAdmin>(
    () => ({
      addressId: addressId,
      cartIds: cartList.map((e) => e._id),
      discountIds: discountId ? [discountId] : [],
      storeId,
      deliveryType,
    }),
    [cartList, storeId, addressId, discountId, deliveryType],
  );

  // Fetch cart summary with controlled fetching
  const {
    data: summaryData,
    isFetching: isSummaryFetching,
    refetch,
  } = useFetchCartSummary(cartState);

  // Sync fetched cart list with local state
  useEffect(() => {
    setCartList(dCartList || []);
  }, [dCartList]);

  // Update cart items with selected user

  // Call API to associate cart items with user
  const updateCartUser = useCallback(
    async (userId: string) => {
      setUserId(userId);
      isUpdatingUser.current = true;
      const cartIds = cartList.map((cart) => cart._id);

      const { success, data, errorMessage } = await cartApiService.updateUser(
        userId,
        cartIds,
      );

      if (success && data) {
        // setCartList(data);
        toast.success("Updated success fully");
      } else {
        toast.error(errorMessage || "Failed to update cart user");
      }

      isUpdatingUser.current = false;
    },
    [cartList],
  );

  // Controlled summary fetching
  useEffect(() => {
    const shouldFetch =
      cartList.length > 0 &&
      storeId &&
      userId &&
      (deliveryType !== "delivery" || addressId);

    if (shouldFetch) {
      refetch();
    }
  }, [cartList, storeId, userId, addressId, deliveryType, discountId, refetch]);

  // Calculate total from summary
  const totalAmount = summaryData?.total || 0;

  // Cart operations
  const onAddToCart: OnAddToCart = useCallback(
    async (
      itemId,
      categoryId,
      quantity,
      selectedVariantId,
      selectedPricingIds,
    ) => {
      const cartExists = cartList?.find(
        (e) => e.storeId === storeId && itemId === e.itemId,
      );
      if (cartExists) {
        toast.warning("Item is already in the cart");
      } else {
        const addData: CartCreateData = {
          fromWeb: false,
          itemId,
          categoryId,
          pricing: selectedPricingIds,
          quantity,
          sessionId: v4(),
          storeId,
          variantId: selectedVariantId,
          userId,
        };
        const { success, data, errorMessage } =
          await cartApiService.addToCart(addData);
        if (success) {
          setCartList((prev) => [...prev, data]);
          toast.success("Item added successfully");
          return true;
        } else {
          toast.error(errorMessage || "Something went wrong");
        }
      }
      return false;
    },
    [cartList, storeId, userId],
  );

  const onEditToCart: OnEditToCart = useCallback(
    async (cartId, itemId, quantity, selectedVariantId, selectedPricingIds) => {
      const editData: CartUpdateData = {
        itemId,
        pricing: selectedPricingIds,
        quantity,
        variantId: selectedVariantId,
      };
      const { success, data, errorMessage } =
        await cartApiService.updateCartItem(editData, cartId);
      if (success) {
        setCartList((prev) => prev.map((e) => (e._id === data._id ? data : e)));
        toast.success("Item updated successfully");
        return true;
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      return false;
    },
    [],
  );

  const onDeleteCart = useCallback(async (cartId: string) => {
    const { success, errorMessage } =
      await cartApiService.removeFromCart(cartId);
    if (success) {
      setCartList((prev) => prev.filter((e) => e._id !== cartId));
      toast.success("Item removed successfully");
      return true;
    } else {
      toast.error(errorMessage || "Something went wrong");
    }
    return false;
  }, []);

  const onClearAll = useCallback(async () => {
    if (cartList.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove all ${cartList.length} items from the cart?`,
    );

    if (!confirmed) return;

    // Delete all cart items
    const deletePromises = cartList.map((cart) =>
      cartApiService.removeFromCart(cart._id),
    );

    try {
      const results = await Promise.all(deletePromises);
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        setCartList([]);
        toast.success("Cart cleared successfully");
      } else {
        toast.error("Some items could not be removed");
      }
    } catch {
      toast.error("Failed to clear cart");
    }
  }, [cartList]);

  // Checkout handlers
  const handleCheckoutClick = useCallback(() => {
    openCheckoutDialog();
  }, [openCheckoutDialog]);

  const handleCheckoutSubmit = useCallback(
    async (paymentType: PaymentType, customerMessage?: string) => {
      setIsSubmittingCheckout(true);

      try {
        const checkoutData = {
          userId,
          cartIds: cartList.map((cart) => cart._id),
          discountIds: discountId ? [discountId] : [],
          addressId: deliveryType === "delivery" ? addressId : undefined,
          paymentType,
          deliveryType,
          storeId,
          customerMessage,
        };

        const { success, data, errorMessage } =
          await orderApiService.checkout(checkoutData);

        if (success && data) {
          // Reset cart state
          setCartList([]);
          setUserId("");
          setAddressId("");
          setDiscountId("");
          setDeliveryType("delivery");

          // Close checkout dialog
          closeCheckoutDialog();

          // Show success message
          toast.success("Order created successfully!");

          // Handle payment link if needed
          if (data.openPaymentLink && data.paymentUrl) {
            setPaymentUrl(data.paymentUrl);
            openPaymentLinkDialog();
          }
        } else {
          toast.error(errorMessage || "Failed to create order");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while creating the order");
      } finally {
        setIsSubmittingCheckout(false);
      }
    },
    [
      userId,
      cartList,
      discountId,
      addressId,
      deliveryType,
      storeId,
      closeCheckoutDialog,
      openPaymentLinkDialog,
    ],
  );

  return (
    <>
      {/* Left Panel - Product Grid */}
      <div className="h-full w-[70%] overflow-hidden">
        <ItemListGridView selectedStoreId={storeId} onAddToCart={onAddToCart} />
      </div>

      {/* Right Panel - Cart & Checkout */}
      <div className="dark:bg-nd-900 border-nl-100 flex h-full w-[30%] flex-col overflow-hidden rounded-xl border bg-white shadow-lg">
        {/* Cart Header with Total */}
        <CartHeaderSection
          totalAmount={totalAmount}
          itemCount={cartList.length}
          isLoading={isSummaryFetching}
        />

        {/* Cart Items List */}
        <div className="flex-1 overflow-hidden">
          <CartList
            cartList={cartList}
            onEditToCart={onEditToCart}
            onRemoveToCart={onDeleteCart}
            onClearAll={onClearAll}
          />
        </div>

        {/* Customer Details Section */}
        <CustomerDetailsSection
          userId={userId}
          addressId={addressId}
          deliveryType={deliveryType}
          onUserChange={updateCartUser}
          onAddressChange={setAddressId}
          onDeliveryTypeChange={setDeliveryType}
          defaultOpen={true}
        />

        {/* Discount Section */}
        <DiscountSection
          userId={userId}
          cartIds={cartList.map((e) => e._id)}
          storeId={storeId}
          selectedDiscountId={discountId}
          initDiscount={undefined}
          onSelectDiscount={setDiscountId}
          defaultOpen={false}
        />

        {/* Bill Breakdown and Complete Order */}
        <CartSummaryWithCheckout
          summary={summaryData || null}
          isFetching={isSummaryFetching}
          userId={userId}
          addressId={addressId}
          deliveryType={deliveryType}
          cartListLength={cartList.length}
          onCheckoutClick={handleCheckoutClick}
        />
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={isCheckoutDialogOpen}
        close={closeCheckoutDialog}
        onSubmitCheckout={handleCheckoutSubmit}
        isSubmitting={isSubmittingCheckout}
      />

      {/* Payment Link Dialog */}
      <PaymentLinkDialog
        isOpen={isPaymentLinkDialogOpen}
        close={closePaymentLinkDialog}
        paymentUrl={paymentUrl}
      />
    </>
  );
};

export default CartContent;
