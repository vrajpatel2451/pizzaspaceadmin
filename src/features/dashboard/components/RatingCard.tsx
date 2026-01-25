import { Star } from "lucide-react";
import type { FC } from "react";

interface RatingCardProps {
  label: string;
  rating: number;
  count: number;
  isLoading?: boolean;
}

const RatingCard: FC<RatingCardProps> = ({
  label,
  rating,
  count,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2.5 dark:from-amber-900/20 dark:to-yellow-900/20">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2.5 transition-all hover:from-amber-100 hover:to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {/* Full stars */}
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star
              key={`full-${i}`}
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            />
          ))}
          {/* Half star */}
          {hasHalfStar && (
            <div className="relative">
              <Star className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              </div>
            </div>
          )}
          {/* Empty stars */}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600"
            />
          ))}
        </div>
        <span className="text-nl-700 dark:text-nd-200 text-sm font-medium">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-nl-900 dark:text-nd-50 text-sm font-bold">
          {rating.toFixed(1)}
        </span>
        <span className="text-nl-400 dark:text-nd-500 text-xs">
          ({count.toLocaleString()})
        </span>
      </div>
    </div>
  );
};

export default RatingCard;
