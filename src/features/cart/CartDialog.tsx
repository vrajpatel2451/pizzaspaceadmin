import Dialog from "@/components/compound/Dialog";
import { useEffect, useState, useRef, type FC } from "react";
import { toast } from "sonner";
import StoreDropdown from "../company-management/components/StoreDropdown";
import CartEmptyStateHelper from "./components/CartEmptyStateHelper";
import StoreLoadingState from "./components/StoreLoadingState";
import CartContent from "./components/CartContent";

type Props = {
  isOpen: boolean;
  close: () => void;
};

const CartDialog: FC<Props> = (props) => {
  const { close, isOpen } = props;

  // Store selection and loading state
  const [storeId, setStoreId] = useState("");
  const [isLoadingStore, setIsLoadingStore] = useState(false);
  const previousStoreIdRef = useRef<string>("");
  const isInitialMountRef = useRef(true);

  // Store change detection with confirmation and loading delay
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousStoreIdRef.current = storeId;
      return;
    }

    // Detect store change
    if (storeId && previousStoreIdRef.current && storeId !== previousStoreIdRef.current) {
      // Show confirmation if store was previously selected (CartContent was mounted)
      const confirmed = window.confirm(
        "Changing the store will clear your cart, selected customer, address, and discounts. Continue?"
      );

      if (!confirmed) {
        // Revert store selection
        setStoreId(previousStoreIdRef.current);
        return;
      }

      toast.info("Cart will be cleared due to store change");

      // Trigger loading state for 300ms delay
      setIsLoadingStore(true);

      const timer = setTimeout(() => {
        setIsLoadingStore(false);
      }, 300);

      // Update ref for next comparison
      previousStoreIdRef.current = storeId;

      return () => clearTimeout(timer);
    }

    // Update ref for next comparison
    previousStoreIdRef.current = storeId;
  }, [storeId]);

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title={
        <div className="flex items-center gap-4">
          <h5 className="text-nl-700 dark:text-nd-50 font-medium">POS for</h5>
          <StoreDropdown
            storeId={storeId}
            onChange={setStoreId}
            variant="minimal"
          />
        </div>
      }
      size="full"
    >
      <div className="flex h-[90vh]">
        {/* Conditional rendering based on store selection and loading state */}
        {!storeId ? (
          // No store selected - show empty state helper
          <CartEmptyStateHelper />
        ) : isLoadingStore ? (
          // Store just changed - show loading state
          <StoreLoadingState />
        ) : (
          // Store ready - render cart content with key to force remount
          <CartContent
            key={storeId}
            storeId={storeId}
            onClose={close}
          />
        )}
      </div>
    </Dialog>
  );
};

export default CartDialog;
