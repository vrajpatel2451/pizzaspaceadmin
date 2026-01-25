import type { DashboardResponse } from "@/types/analytics.types";
import { cn } from "@/utils/helpers";
import { CalendarCheck, Mail, MessageSquare } from "lucide-react";
import type { FC, ReactNode } from "react";
import RatingCard from "./RatingCard";

interface InsightsPanelProps {
  data: DashboardResponse | null;
  isLoading?: boolean;
}

interface EngagementItemProps {
  icon: ReactNode;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  isLoading?: boolean;
}

const EngagementItem: FC<EngagementItemProps> = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
        </div>
        <div className="h-5 w-8 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2.5 transition-all hover:scale-[1.02]",
        bgColor,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={iconColor}>{icon}</span>
        <span className="text-nl-700 dark:text-nd-200 text-sm font-medium">
          {label}
        </span>
      </div>
      <span className="text-nl-900 dark:text-nd-50 text-lg font-bold">
        {value.toLocaleString()}
      </span>
    </div>
  );
};

const InsightsPanel: FC<InsightsPanelProps> = ({ data, isLoading }) => {
  return (
    <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 flex h-full flex-col rounded-xl border bg-white p-4">
      {/* Ratings Section */}
      <div className="mb-4">
        <h3 className="text-nl-700 dark:text-nd-200 mb-2.5 text-xs font-semibold uppercase tracking-wide">
          Ratings & Reviews
        </h3>
        <div className="space-y-2">
          <RatingCard
            label="Order Rating"
            rating={data?.averageOrderReviews ?? 0}
            count={data?.totalOrderReviews ?? 0}
            isLoading={isLoading}
          />
          <RatingCard
            label="Item Rating"
            rating={data?.averageOrderItemReviews ?? 0}
            count={data?.totalOrderItemReviews ?? 0}
            isLoading={isLoading}
          />
          <RatingCard
            label="General Rating"
            rating={data?.averageGeneralRatings ?? 0}
            count={data?.totalGeneralRatings ?? 0}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="bg-nl-200 dark:bg-nd-600 my-2 h-px" />

      {/* Engagement Section */}
      <div className="flex-1">
        <h3 className="text-nl-700 dark:text-nd-200 mb-2.5 text-xs font-semibold uppercase tracking-wide">
          Customer Engagement
        </h3>
        <div className="space-y-2">
          <EngagementItem
            icon={<MessageSquare className="h-4 w-4" />}
            label="Order Queries"
            value={data?.totalOrderQueries ?? 0}
            bgColor="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-blue-500"
            isLoading={isLoading}
          />
          <EngagementItem
            icon={<CalendarCheck className="h-4 w-4" />}
            label="Reservations"
            value={data?.reservationRequests ?? 0}
            bgColor="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-500"
            isLoading={isLoading}
          />
          <EngagementItem
            icon={<Mail className="h-4 w-4" />}
            label="Contact Queries"
            value={data?.totalContactFormQueries ?? 0}
            bgColor="bg-slate-100 dark:bg-slate-800/50"
            iconColor="text-slate-500"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
