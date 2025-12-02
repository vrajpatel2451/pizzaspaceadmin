import { IconButton } from "@/components/base/IconButton";
import { Popover } from "@/components/compound/Popover";
import { MoreVertical, Phone, Mail } from "lucide-react";
import { useCallback, type FC } from "react";
import { toast } from "sonner";

type ReviewActionsProps = {
  customerPhone?: string;
  customerEmail?: string;
};

const ReviewActions: FC<ReviewActionsProps> = ({
  customerPhone,
  customerEmail,
}) => {
  const handleCallCustomer = useCallback(() => {
    if (customerPhone) {
      window.open(`tel:${customerPhone}`, "_self");
    } else {
      toast.error("Customer phone number not available");
    }
  }, [customerPhone]);

  const handleEmailCustomer = useCallback(() => {
    if (customerEmail) {
      window.open(`mailto:${customerEmail}`, "_blank");
    } else {
      toast.error("Customer email not available");
    }
  }, [customerEmail]);

  const actionsMenu = (
    <div className="flex flex-col py-2">
      <button
        onClick={handleCallCustomer}
        disabled={!customerPhone}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
      >
        <Phone size={16} />
        <span>Call Customer</span>
      </button>
      <button
        onClick={handleEmailCustomer}
        disabled={!customerEmail}
        className="text-nl-700 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-600 flex items-center gap-3 px-4 py-2 text-sm disabled:opacity-50"
      >
        <Mail size={16} />
        <span>Email Customer</span>
      </button>
    </div>
  );

  return (
    <Popover trigger={<IconButton icon={MoreVertical} size="sm" />}>
      {actionsMenu}
    </Popover>
  );
};

export default ReviewActions;
