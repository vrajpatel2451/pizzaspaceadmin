import Spinner from "@/components/compound/spinner/Spinner";
import type { FC } from "react";

const StoreLoadingState: FC = () => {
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={48} />
        <p className="text-nl-600 dark:text-nd-400 text-sm">
          Loading store data...
        </p>
      </div>
    </div>
  );
};

export default StoreLoadingState;
