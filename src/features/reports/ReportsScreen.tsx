import { Button } from "@/components/base/Button";
import ScreenContainer from "@/components/shared/ScreenContainer";
import StoreMultiSelectDropdown from "@/features/company-management/components/StoreMultiSelectDropdown";
import TimeRangeSelector from "@/features/dashboard/components/TimeRangeSelector";
import type {
  CustomerReportItem,
  DeliveryBoyReportItem,
  ProductReportItem,
  ReportsRequest,
  StoreReportItem,
} from "@/types/analytics.types";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";
import ComparisonSelector from "./components/ComparisonSelector";
import CustomersTable from "./components/CustomersTable";
import DeliveryBoysTable from "./components/DeliveryBoysTable";
import ProductsTable from "./components/ProductsTable";
import ReportTabs from "./components/ReportTabs";
import StoresTable from "./components/StoresTable";
import { useComparisonPeriod, useFetchReports, useReportsState } from "./hooks";

const ReportsScreen = () => {
  const {
    activeTab,
    timeRange,
    comparisonPresetId,
    customCompareStart,
    customCompareEnd,
    selectedStoreIds,
    sortBy,
    sortOrder,
    limit,
    setActiveTab,
    setTimeRange,
    setComparisonPreset,
    setCustomComparisonRange,
    setSelectedStoreIds,
    setSortBy,
    toggleSortOrder,
  } = useReportsState();

  // Calculate comparison period
  const comparisonPeriod = useComparisonPeriod({
    currentRange: timeRange,
    comparisonPresetId,
    customCompareStart,
    customCompareEnd,
  });

  // Build API request
  const request = useMemo<ReportsRequest>(
    () => ({
      type: activeTab,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      compareStartTime: comparisonPeriod.startTime,
      compareEndTime: comparisonPeriod.endTime,
      storeIds: selectedStoreIds.length > 0 ? selectedStoreIds : undefined,
      limit,
      sortBy,
      sortOrder,
    }),
    [
      activeTab,
      timeRange,
      comparisonPeriod,
      selectedStoreIds,
      limit,
      sortBy,
      sortOrder,
    ],
  );

  // Fetch reports data
  const { data, isFetching, refetch } = useFetchReports(request);

  // Handle sort
  const handleSort = (field: string) => {
    if (field === sortBy) {
      toggleSortOrder();
    } else {
      setSortBy(field);
    }
  };

  // Render appropriate table based on active tab
  const renderTable = () => {
    const tableData = data || [];

    switch (activeTab) {
      case "stores":
        return (
          <StoresTable
            data={tableData as StoreReportItem[]}
            isLoading={isFetching}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        );
      case "delivery-boys":
        return (
          <DeliveryBoysTable
            data={tableData as DeliveryBoyReportItem[]}
            isLoading={isFetching}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        );
      case "customers":
        return (
          <CustomersTable
            data={tableData as CustomerReportItem[]}
            isLoading={isFetching}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        );
      case "products":
        return (
          <ProductsTable
            data={tableData as ProductReportItem[]}
            isLoading={isFetching}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-start gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <ComparisonSelector
            value={comparisonPresetId}
            onChange={setComparisonPreset}
            onCustomRangeChange={setCustomComparisonRange}
            customStartTime={customCompareStart}
            customEndTime={customCompareEnd}
          />
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

      {/* Tabs */}
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        {renderTable()}
      </div>
    </ScreenContainer>
  );
};

export default ReportsScreen;
