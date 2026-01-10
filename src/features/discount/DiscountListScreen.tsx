import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchDiscountList } from "./hooks";
import type { DiscountQueryParams } from "@/types/discount.types";
import type { PaginationProps } from "@/components/compound/Pagination";
import { Button } from "@/components/base/Button";
import { Plus, Percent } from "lucide-react";
import Pagination from "@/components/compound/Pagination";
import Spinner from "@/components/compound/spinner/Spinner";
import { Popover } from "@/components/compound/Popover";
import MenuItem from "@/components/compound/MenuItem";
import DiscountCard from "./DiscountCard";
import Select, { type SelectOption, type SelectOnChangeVal } from "@/components/base/Select";
import RBACStoreDropdown from "../company-management/components/RBACStoreDropdown";
import { useStoreFilter } from "@/hooks/useStoreFilter";
import ScreenContainer from "@/components/shared/ScreenContainer";
import FilterBar from "@/components/shared/FilterBar";
import EmptyState from "@/components/shared/EmptyState";
import { routeConstants } from "@/routes/routeConstants";
import { useInputState } from "@/hooks/useInputState";

const discountTypeOptions: SelectOption[] = [
  { label: "Normal", value: "normal" },
  { label: "Packaging", value: "packaging" },
  { label: "Delivery Charges", value: "deliveryCharges" },
];

const discountAmountTypeOptions: SelectOption[] = [
  { label: "Fixed Amount", value: "fix" },
  { label: "Percentage", value: "percentage" },
];

const conditionTypeOptions: SelectOption[] = [
  { label: "All Products", value: "allProducts" },
  { label: "Selected Categories", value: "selectedCategories" },
  { label: "Selected Products", value: "selectedProducts" },
];

const customerTypeOptions: SelectOption[] = [
  { label: "All Customers", value: "allCustomers" },
  { label: "New Customers", value: "newCustomers" },
];

const DiscountListScreen = () => {
  // Store filter with RBAC awareness
  const {
    displayStoreId,
    effectiveStoreId,
    hideStoreDropdown,
    onStoreChange,
    resetStoreFilter,
    isReady,
  } = useStoreFilter();

  const [discountQueryParams, setDiscountQueryParams] =
    useState<DiscountQueryParams>({
      page: 1,
      limit: 12,
      search: "",
    });

  const { conditionType, customerType, discountAmountType, discountType } =
    discountQueryParams || {};

  // Sync store filter to query params - only after auth is ready
  useEffect(() => {
    if (!isReady) return;
    setDiscountQueryParams((prev) => ({
      ...prev,
      storeId: effectiveStoreId,
    }));
  }, [effectiveStoreId, isReady]);

  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  useEffect(() => {
    setDiscountQueryParams((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  const onReset = useCallback(() => {
    resetStoreFilter();
    onInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setDiscountQueryParams({
      page: 1,
      limit: 12,
      search: "",
    });
  }, [resetStoreFilter, onInputChange]);

  const { data, isFetching, isError, errorMessage, refetch } =
    useFetchDiscountList(discountQueryParams);
  const { data: discountList, meta: discountMeta } = data || {};
  const discountPagination = useMemo<PaginationProps>(
    () => ({
      ...discountMeta,
      onPageChange: (cPage) => {
        setDiscountQueryParams((prev) => ({ ...prev, page: cPage }));
      },
    }),
    [discountMeta],
  );

  const selectedDiscountOption = useMemo(
    () => discountTypeOptions?.find((e) => e.value === discountType),
    [discountType],
  );
  const onChangeDiscountType = useCallback((val: SelectOnChangeVal) => {
    const opt = val as SelectOption | null;
    setDiscountQueryParams((prev) => ({
      ...prev,
      discountType: opt?.value as DiscountQueryParams["discountType"],
    }));
  }, []);
  const selectedDiscountAmountOption = useMemo(
    () =>
      discountAmountTypeOptions?.find((e) => e.value === discountAmountType),
    [discountAmountType],
  );
  const onChangeDiscountAmountType = useCallback((val: SelectOnChangeVal) => {
    const opt = val as SelectOption | null;
    setDiscountQueryParams((prev) => ({
      ...prev,
      discountAmountType: opt?.value as DiscountQueryParams["discountAmountType"],
    }));
  }, []);
  const selectedConditionOption = useMemo(
    () => conditionTypeOptions?.find((e) => e.value === conditionType),
    [conditionType],
  );
  const onChangeConditionType = useCallback((val: SelectOnChangeVal) => {
    const opt = val as SelectOption | null;
    setDiscountQueryParams((prev) => ({
      ...prev,
      conditionType: opt?.value as DiscountQueryParams["conditionType"],
    }));
  }, []);
  const selectedCustomerOption = useMemo(
    () => customerTypeOptions?.find((e) => e.value === customerType),
    [customerType],
  );
  const onChangeCustomerType = useCallback((val: SelectOnChangeVal) => {
    const opt = val as SelectOption | null;
    setDiscountQueryParams((prev) => ({
      ...prev,
      customerType: opt?.value as DiscountQueryParams["customerType"],
    }));
  }, []);

  // Check for active filters
  const hasActiveFilters = discountType || discountAmountType || conditionType || customerType || (displayStoreId && !hideStoreDropdown) || inputValue;

  // Create button with popover
  const createButton = (
    <Popover
      trigger={
        <Button
          startIcon={<Plus className="text-white" size={18} />}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Create Discount
        </Button>
      }
    >
      <div className="menu-items min-w-52">
        <MenuItem
          startIcon="Boxes"
          to={routeConstants.discountDetails
            .replace(":action", "create")
            .replace(":discountId", "new-discount")
            .replace(":discountType", "normal")}
        >
          Discount On Item
        </MenuItem>
        <MenuItem
          startIcon="PackageOpen"
          to={routeConstants.discountDetails
            .replace(":action", "create")
            .replace(":discountId", "new-discount")
            .replace(":discountType", "packaging")}
        >
          Discount On Packing Charges
        </MenuItem>
        <MenuItem
          startIcon="Truck"
          to={routeConstants.discountDetails
            .replace(":action", "create")
            .replace(":discountId", "new-discount")
            .replace(":discountType", "deliveryCharges")}
        >
          Discount On Delivery Charges
        </MenuItem>
      </div>
    </Popover>
  );

  return (
    <ScreenContainer>
      <div className="flex justify-end">
        {createButton}
      </div>

      <FilterBar
        searchValue={inputValue}
        onSearchChange={(val) => onInputChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)}
        searchPlaceholder="Search discounts..."
        showReset={Boolean(hasActiveFilters)}
        onReset={onReset}
      >
        <Select
          options={discountTypeOptions}
          value={selectedDiscountOption}
          onChange={onChangeDiscountType}
          placeholder="Discount Type"
          variant="minimal"
        />
        {!hideStoreDropdown && (
          <RBACStoreDropdown
            onChange={onStoreChange}
            storeId={displayStoreId}
            variant="minimal"
          />
        )}
        <Select
          options={discountAmountTypeOptions}
          value={selectedDiscountAmountOption}
          onChange={onChangeDiscountAmountType}
          placeholder="Amount Type"
          variant="minimal"
        />
        <Select
          options={conditionTypeOptions}
          value={selectedConditionOption}
          onChange={onChangeConditionType}
          placeholder="Condition"
          variant="minimal"
        />
        <Select
          options={customerTypeOptions}
          value={selectedCustomerOption}
          onChange={onChangeCustomerType}
          placeholder="Customer Type"
          variant="minimal"
        />
      </FilterBar>

      <div className="flex-1">
        {isFetching ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3">
              <Spinner />
              <span className="text-sm text-slate-500">Loading discounts...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
            <div className="text-center">
              <p className="text-sm font-medium text-red-600">Error loading discounts</p>
              <p className="mt-1 text-xs text-slate-500">{errorMessage}</p>
            </div>
          </div>
        ) : !discountList?.length ? (
          <EmptyState
            icon={Percent}
            title="No discounts found"
            description="There are no discounts matching your criteria. Create a new discount to get started."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {discountList.map((discount) => (
              <DiscountCard
                discount={discount}
                key={discount._id}
                onRefresh={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {discountList && discountList.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Pagination {...discountPagination} />
        </div>
      )}
    </ScreenContainer>
  );
};

export default DiscountListScreen;
