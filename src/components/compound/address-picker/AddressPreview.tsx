import { cn } from "@/utils/helpers";
import type { ParsedAddress } from "./types";

interface Props {
  address: ParsedAddress | null;
  isLoading?: boolean;
  className?: string;
}

const AddressPreview = ({ address, isLoading, className }: Props) => {
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-lg bg-nl-50 p-4 dark:bg-nd-700",
          className,
        )}
      >
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-3/4 rounded bg-nl-200 dark:bg-nd-600" />
          <div className="h-3 w-1/2 rounded bg-nl-200 dark:bg-nd-600" />
        </div>
      </div>
    );
  }

  if (!address) {
    return (
      <div
        className={cn(
          "rounded-lg bg-nl-50 p-4 dark:bg-nd-700",
          className,
        )}
      >
        <p className="text-sm text-nl-500 dark:text-nd-400">
          Drag the map to position the pin at your store location
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-lg bg-nl-50 p-4 dark:bg-nd-700", className)}
    >
      <p className="font-medium text-nl-800 dark:text-nd-100">
        {address.formattedAddress || address.line1}
      </p>
      <p className="mt-1 text-sm text-nl-500 dark:text-nd-400">
        {[address.area, address.city, address.zip].filter(Boolean).join(", ")}
      </p>
    </div>
  );
};

export default AddressPreview;
