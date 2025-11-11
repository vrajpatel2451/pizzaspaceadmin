import Dialog from "@/components/compound/Dialog";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { Copy, ExternalLink, Check } from "lucide-react";
import { useState, type FC } from "react";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  close: () => void;
  paymentUrl: string;
};

const PaymentLinkDialog: FC<Props> = ({ isOpen, close, paymentUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      toast.success("Payment link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleOpenLink = () => {
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Online Payment Required"
      size="sm"
      actions={{
        primary: {
          label: "Close",
          onClick: close,
          variant: "ghost",
          color: "primary",
        },
      }}
    >
      <div className="space-y-4">
        <p className="text-nl-600 dark:text-nd-300 text-sm">
          This order requires online payment. Share the payment link below with the customer or open it directly.
        </p>

        {/* Payment Link Input */}
        <div>
          <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
            Payment Link
          </label>
          <div className="flex gap-2">
            <Input
              value={paymentUrl}
              readOnly
              fullWidth
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            color="primary"
            size="md"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            onClick={handleOpenLink}
            variant="filled"
            color="primary"
            size="md"
            className="flex-1"
          >
            <ExternalLink size={16} className="mr-2" />
            Open Link
          </Button>
        </div>

        {/* Helper Text */}
        <div className="bg-pl-50 dark:bg-pd-900 text-pl-700 dark:text-pd-200 rounded-md p-3 text-xs">
          <strong>Note:</strong> The customer must complete the payment through this link to confirm the order.
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentLinkDialog;
