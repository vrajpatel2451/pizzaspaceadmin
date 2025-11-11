import { cn } from "@/utils/helpers";
import type { FC } from "react";

type ShimmerProps = {
  className?: string;
  width?: string;
  height?: string;
};

const Shimmer: FC<ShimmerProps> = ({ className, width, height }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-nl-200 dark:bg-nd-700",
        className
      )}
      style={{ width, height }}
    />
  );
};

export default Shimmer;
