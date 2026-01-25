import { Button } from "@/components/base/Button";
import StoreMultiSelectDropdown from "@/features/company-management/components/StoreMultiSelectDropdown";
import {
  PoundSterling,
  RefreshCw,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import ChartTabs from "./components/ChartTabs";
import InsightsPanel from "./components/InsightsPanel";
import MetricCard from "./components/MetricCard";
import OrderDistribution from "./components/OrderDistribution";
import TimeRangeSelector from "./components/TimeRangeSelector";
import { useDashboardState } from "./hooks";

const DashboardScreen = () => {
  const {
    timeRange,
    selectedStoreIds,
    setTimeRange,
    setSelectedStoreIds,
    refetch,
    data,
    isFetching,
    isError,
    errorMessage,
  } = useDashboardState();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const totalOrders =
    (data?.initiatedOrders ?? 0) +
    (data?.confirmedNewOrders ?? 0) +
    (data?.ordersInPreparing ?? 0) +
    (data?.readyToPickupOrders ?? 0) +
    (data?.onTheWayOrders ?? 0) +
    (data?.deliveredOrders ?? 0);

  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:p-6">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-nl-900 dark:text-nd-50 text-xl font-bold lg:text-2xl">
            Dashboard
          </h1>
          <p className="text-nl-500 dark:text-nd-400 text-sm">
            Real-time business overview
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <div className="w-52">
            <StoreMultiSelectDropdown
              storeIds={selectedStoreIds}
              onChange={setSelectedStoreIds}
              placeholder="All stores"
            />
          </div>
          <Button
            variant="outline"
            color="neutral"
            size="sm"
            onClick={refetch}
            isLoading={isFetching}
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage || "Failed to load dashboard data."}
          </p>
        </div>
      )}

      {/* Main Content - Flex grow to fill remaining space */}
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Top Row: Hero Metrics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            icon={<PoundSterling />}
            label="Total Revenue"
            value={formatCurrency(data?.totalRevenue ?? 0)}
            // trend={{ value: "+12.5%", isPositive: true }}
            iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
            iconColor="text-emerald-500 dark:text-emerald-400"
            isLoading={isFetching}
          />
          <MetricCard
            icon={<ShoppingCart />}
            label="Total Orders"
            value={totalOrders.toLocaleString()}
            // trend={{ value: "+8.3%", isPositive: true }}
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-500 dark:text-orange-400"
            isLoading={isFetching}
          />
          <MetricCard
            icon={<Users />}
            label="Customers"
            value={(data?.totalCustomers ?? 0).toLocaleString()}
            // trend={{ value: "+5.2%", isPositive: true }}
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-500 dark:text-blue-400"
            isLoading={isFetching}
          />
          <MetricCard
            icon={<Store />}
            label="Stores"
            value={data?.totalStores ?? 0}
            secondaryLabel="Staff"
            secondaryValue={data?.totalStaff ?? 0}
            iconBgColor="bg-violet-100 dark:bg-violet-900/30"
            iconColor="text-violet-500 dark:text-violet-400"
            isLoading={isFetching}
          />
        </div>

        {/* Order Distribution */}
        <OrderDistribution data={data} isLoading={isFetching} />

        {/* Bottom Row: Charts + Insights */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Charts - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <ChartTabs
              ordersData={data?.orderCountTimelineWise}
              revenueData={data?.orderRevenueTimelineWise}
              isLoading={isFetching}
              startTime={timeRange.startTime}
              endTime={timeRange.endTime}
            />
          </div>

          {/* Insights Panel - Takes 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <InsightsPanel data={data} isLoading={isFetching} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
