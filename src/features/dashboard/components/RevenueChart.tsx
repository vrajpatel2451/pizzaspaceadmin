import type { TimelineData } from "@/types/analytics.types";
import dayjs from "dayjs";
import { type FC, useMemo } from "react";
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
import ChartCard from "./ChartCard";

interface RevenueChartProps {
  data: TimelineData | undefined;
  isLoading?: boolean;
}

// Color palette for different stores
const STORE_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f97316", // orange
  "#a855f7", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
];

const RevenueChart: FC<RevenueChartProps> = ({ data, isLoading }) => {
  const { chartData, storeKeys, storeMeta } = useMemo(() => {
    if (!data || !data.data) {
      return { chartData: [], storeKeys: [], storeMeta: {} };
    }

    const storeIds = Object.keys(data.data);
    if (storeIds.length === 0) {
      return { chartData: [], storeKeys: [], storeMeta: data.meta || {} };
    }

    // Get all unique timestamps
    const allTimestamps = new Set<string>();
    storeIds.forEach((id) => {
      data.data[id]?.forEach(([ts]) => allTimestamps.add(ts));
    });

    // Build chart data points
    const points = Array.from(allTimestamps)
      .sort()
      .map((timestamp) => {
        const point: Record<string, any> = {
          timestamp,
          displayTime: formatTimestamp(timestamp),
        };
        storeIds.forEach((id) => {
          const entry = data.data[id]?.find(([ts]) => ts === timestamp);
          point[id] = entry ? entry[1] : 0;
        });
        return point;
      });

    return {
      chartData: points,
      storeKeys: storeIds,
      storeMeta: data.meta || {},
    };
  }, [data]);

  const hasData = chartData.length > 0 && storeKeys.length > 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ChartCard title="Revenue Trend" subtitle="Revenue over time by store" isLoading={isLoading}>
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="displayTime"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-gray-500"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-gray-500"
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                storeMeta[name] || name,
              ]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend
              formatter={(value) => storeMeta[value] || value}
              wrapperStyle={{ paddingTop: "10px" }}
            />
            {storeKeys.map((storeId, index) => (
              <Line
                key={storeId}
                type="monotone"
                dataKey={storeId}
                name={storeId}
                stroke={STORE_COLORS[index % STORE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState message="No revenue data available for the selected time range" />
      )}
    </ChartCard>
  );
};

const EmptyChartState: FC<{ message: string }> = ({ message }) => (
  <div className="flex h-full items-center justify-center">
    <p className="text-nl-500 dark:text-nd-400 text-sm">{message}</p>
  </div>
);

function formatTimestamp(timestamp: string): string {
  const date = dayjs(timestamp);
  const now = dayjs();

  // If same day, show time only
  if (date.isSame(now, "day")) {
    return date.format("HH:mm");
  }

  // If within last 7 days, show day and time
  if (now.diff(date, "day") < 7) {
    return date.format("ddd HH:mm");
  }

  // Otherwise show date
  return date.format("MMM D");
}

export default RevenueChart;
