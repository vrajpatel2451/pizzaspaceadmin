import { Button } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import Dialog from "@/components/compound/Dialog";
import Spinner from "@/components/compound/spinner/Spinner";
import { useToggle } from "@/hooks/useToggle";
import type { CustomerBillingOnCart } from "@/types/pricing.types";
import { Info, Receipt } from "lucide-react";
import { type FC } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { CurrencyUtils } from "@/utils/currencyUtils";

type Props = {
  summary: CustomerBillingOnCart | null;
  isFetching: boolean;
  userId: string;
  addressId: string;
  cartListLength: number;
};

const CartSummaryWithCheckout: FC<Props> = (props) => {
  const { isFetching, summary, userId, addressId, cartListLength } = props;

  const {
    isOpen: isGSTModalOpen,
    open: openGSTModal,
    close: closeGSTModal,
  } = useToggle();

  const {
    isOpen: isDeliveryModalOpen,
    open: openDeliveryModal,
    close: closeDeliveryModal,
  } = useToggle();

  // Check if there are discounts
  const hasItemDiscount =
    summary?.itemTotal !== summary?.itemTotalAfterDiscount;
  const hasPackingDiscount =
    summary?.packingCharges !== summary?.packingChargesAfterDiscount;
  const hasDeliveryDiscount =
    summary?.deliveryCharges !== summary?.deliveryChargesAfterDiscount;

  const isReadyForCheckout = Boolean(userId && addressId && cartListLength > 0);

  const totalAmount = summary?.total || 0;

  return (
    <div className="border-nl-200 dark:border-nd-700 flex w-full flex-col border-t">
      {/* Bill Breakdown Section */}
      <CollapsibleSection
        title="Bill Breakdown"
        icon={<Receipt size={18} />}
        defaultOpen={true}
        isDisabled={!summary && !isFetching}
      >
        {isFetching && (
          <div className="py-8">
            <Spinner />
          </div>
        )}

        {!isFetching && !summary && (
          <div className="bg-nl-100 text-nl-600 dark:bg-nd-800 dark:text-nd-400 rounded-md p-4 text-center text-sm">
            {!cartListLength
              ? "Add items to see pricing"
              : !userId
                ? "Select customer to calculate billing"
                : !addressId
                  ? "Select delivery address to calculate billing"
                  : "Unable to calculate pricing"}
          </div>
        )}

        {!isFetching && summary && (
          <div className="flex flex-col">
            {/* Line Items */}
            <div className="mb-4 flex flex-col gap-3">
              {/* Item Total */}
              <PriceLabelChip
                label="Item total"
                price={summary.itemTotal}
                discountPrice={summary.itemTotalAfterDiscount}
                showDiscount={hasItemDiscount}
              />

              {/* Restaurant Packing Charges */}
              <PriceLabelChip
                label="Restaurant packing charges"
                price={summary.packingCharges}
                discountPrice={summary.packingChargesAfterDiscount}
                showDiscount={hasPackingDiscount}
              />

              {/* Delivery Partner Fee */}
              <PriceLabelChip
                label="Delivery partner fee"
                price={summary.deliveryCharges}
                discountPrice={summary.deliveryChargesAfterDiscount}
                showDiscount={hasDeliveryDiscount}
                showInfo
                onInfoClick={openDeliveryModal}
              />

              {/* Extra Charges */}
              {summary.extraCharges &&
                Object.entries(summary.extraCharges).map(
                  ([name, [original, afterDiscount]]) => (
                    <PriceLabelChip
                      key={name}
                      label={name}
                      price={original}
                      discountPrice={afterDiscount}
                      showDiscount={original !== afterDiscount}
                    />
                  ),
                )}

              {/* GST/Tax */}
              <PriceLabelChip
                label="Tax"
                price={summary.tax?.total || 0}
                discountPrice={summary.tax?.total || 0}
                showDiscount={false}
                showInfo
                onInfoClick={openGSTModal}
              />
            </div>

            <Divider />

            {/* To Pay Section */}
            <div className="my-4">
              <div className="flex items-center justify-between">
                <span className="text-nl-900 dark:text-nd-50 text-base font-semibold">
                  Total Amount
                </span>
                <span className="text-nl-900 dark:text-nd-50 text-lg font-bold">
                  {CurrencyUtils.formatCurrency(summary.total || 0)}
                </span>
              </div>
            </div>

            {/* Savings Banner */}
            {summary.totalDiscount > 0 && (
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-center dark:bg-green-900/20">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  You saved{" "}
                  {CurrencyUtils.formatCurrency(summary.totalDiscount)} on this
                  order
                </span>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Complete Order Button */}
      <div className="p-4">
        <Button className="w-full" size="lg" disabled={!isReadyForCheckout}>
          Complete Order
          {summary && isReadyForCheckout
            ? ` - ${CurrencyUtils.formatCurrency(totalAmount)}`
            : ""}
        </Button>
        {!isReadyForCheckout && (
          <p className="text-nl-500 dark:text-nd-400 mt-2 text-center text-xs">
            {!cartListLength
              ? "Add items to continue"
              : !userId
                ? "Select customer to continue"
                : !addressId
                  ? "Select delivery address to continue"
                  : "Complete required fields to continue"}
          </p>
        )}
      </div>

      {/* Modals */}
      {summary && (
        <>
          {/* GST Breakdown Modal */}
          <Dialog
            isOpen={isGSTModalOpen}
            close={closeGSTModal}
            size="sm"
            title="Tax"
            actions={{
              primary: {
                label: "Okay",
                onClick: closeGSTModal,
                variant: "ghost",
                color: "primary",
              },
            }}
          >
            <div className="flex flex-col gap-4">
              <p className="text-nl-600 dark:text-nd-300 text-sm">
                Pizzaspace has no role to play in taxes levied by the govt.
              </p>

              <div className="flex flex-col gap-2">
                {summary.tax && (
                  <>
                    <BreakdownRow
                      label="Tax on item total"
                      value={summary.tax.itemTotal}
                    />
                    <BreakdownRow
                      label="Tax on packaging charges"
                      value={summary.tax.packing}
                    />
                    <BreakdownRow
                      label="Tax on delivery charges"
                      value={summary.tax.deliveryCharges}
                    />

                    {/* GST on Extra Charges */}
                    {summary.tax.extraCharges &&
                      Object.entries(summary.tax.extraCharges).map(
                        ([name, value]) => (
                          <BreakdownRow
                            key={name}
                            label={`Tax on ${name}`}
                            value={value}
                          />
                        ),
                      )}

                    <Divider />

                    <BreakdownRow
                      label="Total"
                      value={summary.tax.total}
                      isBold
                    />
                  </>
                )}
              </div>
            </div>
          </Dialog>

          {/* Delivery Fee Breakdown Modal */}
          <Dialog
            isOpen={isDeliveryModalOpen}
            close={closeDeliveryModal}
            size="sm"
            title="Delivery partner fee"
            actions={{
              primary: {
                label: "Okay",
                onClick: closeDeliveryModal,
                variant: "ghost",
                color: "primary",
              },
            }}
          >
            <div className="flex flex-col gap-2">
              <BreakdownRow
                label="Base delivery charges"
                value={summary.deliveryCharges}
              />

              {/* Show discount if applicable */}
              {hasDeliveryDiscount && (
                <BreakdownRow
                  label="Discount on Delivery fee"
                  value={
                    -(
                      summary.deliveryCharges -
                      summary.deliveryChargesAfterDiscount
                    )
                  }
                  isDiscount
                />
              )}

              {hasDeliveryDiscount && (
                <>
                  <Divider />
                  <BreakdownRow
                    label="Total"
                    value={summary.deliveryChargesAfterDiscount}
                    isBold
                  />
                </>
              )}
            </div>
          </Dialog>
        </>
      )}
    </div>
  );
};

type ListProps = {
  label: string;
  price: number;
  discountPrice: number;
  showDiscount: boolean;
  showInfo?: boolean;
  onInfoClick?: () => void;
};

const PriceLabelChip: FC<ListProps> = (props) => {
  const { discountPrice, label, price, showDiscount, showInfo, onInfoClick } =
    props;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-nl-700 dark:text-nd-200 text-sm capitalize">
          {label}
        </span>
        {showInfo && (
          <button
            onClick={onInfoClick}
            className="text-nl-500 hover:text-primary-500 transition-colors"
            type="button"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showDiscount && (
          <span className="text-nl-400 dark:text-nd-400 text-sm line-through">
            {CurrencyUtils.formatCurrency(price)}
          </span>
        )}
        <span className="text-nl-900 dark:text-nd-50 text-sm font-medium">
          {CurrencyUtils.formatCurrency(showDiscount ? discountPrice : price)}
        </span>
      </div>
    </div>
  );
};

type BreakdownRowProps = {
  label: string;
  value: number;
  isBold?: boolean;
  isDiscount?: boolean;
};

const BreakdownRow: FC<BreakdownRowProps> = ({
  label,
  value,
  isBold,
  isDiscount,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${isBold ? "font-semibold" : ""} text-nl-700 dark:text-nd-200`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${isBold ? "font-semibold" : ""} ${
          isDiscount
            ? "text-success-600 dark:text-success-400"
            : "text-nl-900 dark:text-nd-50"
        }`}
      >
        {isDiscount && value > 0 ? "-" : ""}
        {CurrencyUtils.formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
};

export default CartSummaryWithCheckout;
