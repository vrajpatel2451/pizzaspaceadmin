import type { TimelineData } from "@/types/analytics.types";
import { cn } from "@/utils/helpers";
import dayjs from "dayjs";
import { BarChart3, TrendingUp } from "lucide-react";
import { type FC, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartTabsProps {
  ordersData: TimelineData | undefined;
  revenueData: TimelineData | undefined;
  isLoading?: boolean;
}

type ChartTab = "orders" | "revenue";

const STORE_COLORS = [
  "#f97316", // orange
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
];

const ChartTabs: FC<ChartTabsProps> = ({
  ordersData,
  revenueData,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("orders");

  const currentData = activeTab === "orders" ? ordersData : revenueData;

  const { chartData, storeKeys, storeMeta } = useMemo(() => {
    if (!currentData || !currentData.data) {
      return { chartData: [], storeKeys: [], storeMeta: {} };
    }

    const storeIds = Object.keys(currentData.data);
    if (storeIds.length === 0) {
      return { chartData: [], storeKeys: [], storeMeta: currentData.meta || {} };
    }

    const allTimestamps = new Set<string>();
    storeIds.forEach((id) => {
      currentData.data[id]?.forEach(([ts]) => allTimestamps.add(ts));
    });

    const points = Array.from(allTimestamps)
      .sort()
      .map((timestamp) => {
        const point: Record<string, any> = {
          timestamp,
          displayTime: formatTimestamp(timestamp),
        };
        storeIds.forEach((id) => {
          const entry = currentData.data[id]?.find(([ts]) => ts === timestamp);
          point[id] = entry ? entry[1] : 0;
        });
        return point;
      });

    return {
      chartData: points,
      storeKeys: storeIds,
      storeMeta: currentData.meta || {},
    };
  }, [currentData]);

  const hasData = chartData.length > 0 && storeKeys.length > 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="border-nl-200 dark:border-nd-600 dark:bg-nd-800 flex h-full flex-col rounded-xl border bg-white">
      {/* Tab Header */}
      <div className="border-nl-200 dark:border-nd-600 flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === "orders"
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                : "text-nl-500 hover:bg-nl-100 dark:text-nd-400 dark:hover:bg-nd-700",
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === "revenue"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "text-nl-500 hover:bg-nl-100 dark:text-nd-400 dark:hover:bg-nd-700",
            )}
          >
            <TrendingUp className="h-4 w-4" />
            Revenue
          </button>
        </div>
        <span className="text-nl-400 dark:text-nd-500 text-xs">
          {activeTab === "orders" ? "Orders over time" : "Revenue over time"}
        </span>
      </div>

      {/* Chart Content */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <ChartSkeleton />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: activeTab === "revenue" ? 10 : 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-gray-500"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-gray-500"
                tickFormatter={activeTab === "revenue" ? formatCurrency : undefined}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  activeTab === "revenue" ? formatCurrency(value) : value,
                  storeMeta[name] || name,
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend
                formatter={(value) => storeMeta[value] || value}
                wrapperStyle={{ paddingTop: "8px", fontSize: "11px" }}
              />
              {storeKeys.map((storeId, index) => (
                <Line
                  key={storeId}
                  type="monotone"
                  dataKey={storeId}
                  name={storeId}
                  stroke={STORE_COLORS[index % STORE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-nl-500 dark:text-nd-400 text-sm">
              No {activeTab} data available for the selected time range
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChartSkeleton: FC = () => (
  <div className="flex h-full items-end justify-between gap-2 px-4">
    {Array.from({ length: 10 }).map((_, i) => (
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

function formatTimestamp(timestamp: string): string {
  const date = dayjs(timestamp);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    return date.format("HH:mm");
  }
  if (now.diff(date, "day") < 7) {
    return date.format("ddd HH:mm");
  }
  return date.format("MMM D");
}

export default ChartTabs;
