import { cn } from "@/utils/helpers";
import type { FC, ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  actions?: ReactNode;
}

const ChartCard: FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  isLoading = false,
  className,
  actions,
}) => {
  return (
    <div
      className={cn(
        "border-nl-200 dark:border-nd-600 dark:bg-nd-800 rounded-xl border bg-white p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-nl-800 dark:text-nd-100 text-lg font-semibold">
            {title}
          </h3>
          {subtitle && (
            <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <div className="h-[300px]">{children}</div>
      )}
    </div>
  );
};

const ChartSkeleton: FC = () => {
  return (
    <div className="flex h-[300px] items-end justify-between gap-2 px-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t bg-gray-200 dark:bg-gray-700"
          style={{
            height: `${Math.random() * 60 + 20}%`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default ChartCard;
