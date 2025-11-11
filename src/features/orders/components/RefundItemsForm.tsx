import { Button } from "@/components/base/Button";
import { Checkbox } from "@/components/base/Checkbox";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { orderApiService } from "@/infrastructure/OrderApiService";
import type { AdminTransformedOrder, RefundItemData } from "@/types/order.types";
import { CurrencyUtils } from "@/utils/currencyUtils";
import { useCallback, useState, type FC, FormEvent } from "react";
import { toast } from "sonner";

type Props = {
  order: AdminTransformedOrder;
  onSubmitSuccess: (order: AdminTransformedOrder) => void;
};

type ItemFormErrors = {
  [itemId: string]: {
    refundQuantity?: string;
    refundAmount?: string;
    refundMessage?: string;
  };
};

const RefundItemsForm: FC<Props> = (props) => {
  const { order, onSubmitSuccess } = props;

  // Track which items are selected for refund
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  // Track form values for each item
  const [itemValues, setItemValues] = useState<Record<string, Partial<RefundItemData>>>({});

  // Track errors
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [generalError, setGeneralError] = useState<string>("");

  // Track loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    // Clear errors for this item when toggled
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });
  };

  const handleItemValueChange = (
    itemId: string,
    field: keyof RefundItemData,
    value: string | number,
  ) => {
    setItemValues((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: undefined,
      },
    }));
    setGeneralError("");
  };

  const validateForm = (): { valid: boolean; refundItems: RefundItemData[] } => {
    const newErrors: ItemFormErrors = {};
    const refundItems: RefundItemData[] = [];
    let hasError = false;

    // Find selected items
    const selectedItemIds = Object.keys(selectedItems).filter((id) => selectedItems[id]);

    if (selectedItemIds.length === 0) {
      setGeneralError("Please select at least one item to refund");
      return { valid: false, refundItems: [] };
    }

    // Validate each selected item
    for (const item of order.items) {
      if (selectedItems[item.itemId]) {
        const values = itemValues[item.itemId] || {};
        const itemErrors: ItemFormErrors[string] = {};

        // Validate quantity
        if (!values.refundQuantity || values.refundQuantity < 1) {
          itemErrors.refundQuantity = "Quantity must be at least 1";
          hasError = true;
        } else if (values.refundQuantity > item.quantity) {
          itemErrors.refundQuantity = `Cannot exceed ${item.quantity}`;
          hasError = true;
        }

        // Validate amount
        if (values.refundAmount === undefined || values.refundAmount === null || values.refundAmount < 0) {
          itemErrors.refundAmount = "Amount must be 0 or greater";
          hasError = true;
        }

        // Validate message
        if (!values.refundMessage || values.refundMessage.trim().length === 0) {
          itemErrors.refundMessage = "Refund reason is required";
          hasError = true;
        }

        if (Object.keys(itemErrors).length > 0) {
          newErrors[item.itemId] = itemErrors;
        } else {
          refundItems.push({
            itemId: item.itemId,
            refundQuantity: values.refundQuantity!,
            refundAmount: values.refundAmount!,
            refundMessage: values.refundMessage!.trim(),
          });
        }
      }
    }

    setErrors(newErrors);
    return { valid: !hasError, refundItems };
  };

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setGeneralError("");
      setErrors({});

      const { valid, refundItems } = validateForm();

      if (!valid) {
        return;
      }

      setIsSubmitting(true);

      try {
        const { success, errorMessage, data } = await orderApiService.refundItems(
          order._id,
          refundItems,
        );

        if (success && data) {
          toast.success("Refund processed successfully");
          onSubmitSuccess(data);
        } else {
          setGeneralError(errorMessage || "Failed to process refund");
          toast.error(errorMessage || "Failed to process refund");
        }
      } catch (error) {
        setGeneralError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [order._id, selectedItems, itemValues, onSubmitSuccess],
  );

  // Filter out already refunded items
  const availableItems = order.items.filter((item) => !item.isRefunded);

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="text-nl-600 dark:text-nd-400 text-sm">
        Select items to refund and enter refund details for each:
      </div>

      {generalError && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{generalError}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {availableItems.map((item) => {
          const isSelected = selectedItems[item.itemId];
          const values = itemValues[item.itemId] || {};
          const itemErrors = errors[item.itemId] || {};

          return (
            <div
              key={item.itemId}
              className="border-nl-200 dark:border-nd-700 rounded-lg border p-4"
            >
              <div className="mb-3 flex items-start gap-3">
                <Checkbox
                  checked={isSelected || false}
                  onChange={() => handleItemToggle(item.itemId)}
                />
                <div className="flex-1">
                  <div className="text-nl-900 dark:text-nd-50 font-medium">{item.name}</div>
                  <div className="text-nl-600 dark:text-nd-400 text-sm">
                    Quantity: {item.quantity} × {CurrencyUtils.formatCurrency(item.priceAfterDiscount)}
                  </div>
                  {item.variants.length > 0 && (
                    <div className="text-nl-500 dark:text-nd-400 text-xs">
                      Variants: {item.variants.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="ml-8 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    type="number"
                    label="Refund Quantity"
                    placeholder="Enter quantity"
                    min={1}
                    max={item.quantity}
                    value={values.refundQuantity || ""}
                    onChange={(e) =>
                      handleItemValueChange(
                        item.itemId,
                        "refundQuantity",
                        Number(e.target.value),
                      )
                    }
                    error={itemErrors.refundQuantity}
                  />
                  <Input
                    type="number"
                    label="Refund Amount"
                    placeholder="Enter amount"
                    min={0}
                    step="0.01"
                    value={values.refundAmount ?? ""}
                    onChange={(e) =>
                      handleItemValueChange(
                        item.itemId,
                        "refundAmount",
                        Number(e.target.value),
                      )
                    }
                    error={itemErrors.refundAmount}
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Refund Reason"
                      placeholder="Enter reason for refund"
                      value={values.refundMessage || ""}
                      onChange={(e) =>
                        handleItemValueChange(item.itemId, "refundMessage", e.target.value)
                      }
                      rows={2}
                      error={itemErrors.refundMessage}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {availableItems.length === 0 && (
        <div className="text-nl-500 dark:text-nd-400 text-center text-sm">
          All items in this order have already been refunded.
        </div>
      )}

      <div className="flex w-full items-center justify-end gap-4">
        <Button type="submit" isLoading={isSubmitting} disabled={availableItems.length === 0}>
          Process Refund
        </Button>
      </div>
    </form>
  );
};

export default RefundItemsForm;
