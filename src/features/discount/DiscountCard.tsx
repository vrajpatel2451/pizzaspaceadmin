import { IconButton } from "@/components/base/IconButton";
import DeleteDialog from "@/components/compound/DeleteDialog";
import Dialog from "@/components/compound/Dialog";
import MenuItem from "@/components/compound/MenuItem";
import { Popover } from "@/components/compound/Popover";
import { toast } from "@/components/compound/Sonner";
import { useToggle } from "@/hooks/useToggle";
import { discountApiService } from "@/infrastructure/DiscountApiService";
import { routeConstants } from "@/routes/routeConstants";
import type { DiscountResponse } from "@/types/discount.types";
import { prettyDate } from "@/utils/formatDateTime";
import { MoreVertical } from "lucide-react";
import { useCallback, type FC } from "react";

type DiscountCardProps = {
  discount: DiscountResponse;
  //   isToggling?: boolean;
  onRefresh: () => void;
};

const DiscountCard: FC<DiscountCardProps> = ({
  discount,
  onRefresh,
  //   isToggling = false,
}) => {
  const {
    _id,
    discountType,
    active,
    couponCode,
    name,
    discountAmount,
    discountAmountType,
    startTime,
    endTime,
    conditionType,
  } = discount;

  const getConditionText = () => {
    switch (conditionType) {
      case "allProducts":
        return "Apply on all products";
      case "selectedCategories":
        return "Apply on selected categories";
      case "selectedProducts":
        return "Apply on selected products";
      default:
        return "";
    }
  };

  const getDiscountText = () => {
    if (discountAmountType === "percentage") {
      return `${discountAmount}% Off`;
    }
    return `$${discountAmount} Off`;
  };

  const formatDateRange = () => {
    const start = prettyDate(new Date(startTime));
    const end = prettyDate(new Date(endTime));
    return `${start} to ${end}`;
  };

  const {
    isOpen: isDeleting,
    open: startDeleting,
    close: stopDeleting,
  } = useToggle();
  const { isOpen, open, close } = useToggle();
  const onDeleteConfirm = useCallback(async () => {
    startDeleting();
    const { success } = await discountApiService.deleteDiscount(_id);
    if (success) {
      toast.success("Deleted successfully");
      close();
      onRefresh();
    } else {
      toast.error("Error deleting charges");
    }
    stopDeleting();
  }, [_id, close, onRefresh, startDeleting, stopDeleting]);
  const {
    isOpen: isActivating,
    open: startActivating,
    close: stopActivating,
  } = useToggle();
  const {
    isOpen: isActiveDialogOpen,
    open: openActiveDialog,
    close: closeActiveDialog,
  } = useToggle();
  const onActivate = useCallback(async () => {
    startActivating();
    const { success } = await discountApiService.updateDiscount(
      {
        active: !active,
      },
      _id,
    );
    if (success) {
      toast.success("Saved successfully");
      closeActiveDialog();
      onRefresh();
    } else {
      toast.error("Error saving charges");
    }
    stopActivating();
  }, [
    _id,
    active,
    closeActiveDialog,
    onRefresh,
    startActivating,
    stopActivating,
  ]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-md">
      {isOpen && (
        <DeleteDialog
          close={close}
          isOpen
          onDelete={onDeleteConfirm}
          isDeleting={isDeleting}
          title="Delete Discount!"
          name={name}
        />
      )}
      {isActiveDialogOpen && (
        <Dialog
          isOpen
          close={closeActiveDialog}
          title={active ? "Deactivate Discount?" : "Activate Discount?"}
          actions={{
            primary: {
              label: "Proceed",
              onClick: onActivate,
              loading: isActivating,
            },
            secondary: {
              label: "Cancel",
              onClick: closeActiveDialog,
              variant: "filled",
              color: "neutral",
            },
          }}
        >
          <h6 className="text-nl-600 dark:text-nd-200">
            Are you sure you want to
            <span className="text-nl-700 dark:text-nd-50 text-base! font-semibold">
              {" "}
              {!active ? "Activate" : "Deactivate"} {name}{" "}
            </span>
            ?
          </h6>
        </Dialog>
      )}
      {/* Header with Coupon Code and Toggle */}
      <div className="mb-6 flex items-center gap-4">
        <div className="border-pl-200 bg-pl-50 rounded-full border-2 px-4 py-1">
          <span className="text-pl-500 text-sm font-semibold">
            #{couponCode}
          </span>
        </div>
        <div className="flex-1" />
        {discount.active ? (
          <span className="bg-sl-500/10 dark:bg-sd-500/10 text-sl-600 dark:text-sd-400 rounded px-2 py-1 text-xs font-medium">
            Active
          </span>
        ) : (
          <span className="bg-dl-500/10 dark:bg-dd-500/10 text-dl-600 dark:text-dd-400 rounded px-2 py-1 text-xs font-medium">
            Inactive
          </span>
        )}
        <Popover trigger={<IconButton icon={MoreVertical} />}>
          <div className="min-w-48">
            <div className="menu-items">
              <MenuItem
                startIcon="Pen"
                to={routeConstants.discountDetails
                  .replace(":action", "edit")
                  .replace(":discountId", _id)
                  .replace(":discountType", discountType)}
              >
                Edit
              </MenuItem>
              <MenuItem
                startIcon={!active ? "Check" : "SquareX"}
                onClick={openActiveDialog}
              >
                {!active ? "Activate" : "Deactivate"}
              </MenuItem>
              <MenuItem startIcon="Trash" onClick={open}>
                Delete
              </MenuItem>
            </div>
          </div>
        </Popover>
      </div>

      {/* Discount Title */}
      <h3 className="text-nl-900 mb-1 text-lg font-semibold">
        {getDiscountText()} on {name}
      </h3>

      {/* Description/Condition */}
      <p className="text-nl-600 mb-6 text-xs">{getConditionText()}</p>

      {/* Date Range */}
      <div className="bg-pl-600 rounded-xl px-6 py-4 text-center">
        <p className="text-sm font-semibold text-white">{formatDateRange()}</p>
      </div>
    </div>
  );
};

export default DiscountCard;
