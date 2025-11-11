import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchDiscountList } from "./hooks";
import type { DiscountQueryParams } from "@/types/discount.types";
import type { PaginationProps } from "@/components/compound/Pagination";
import Breadcrumbs, {
  type BreadcrumbItem,
} from "@/components/compound/Breadcrumbs";
import { routeConstants } from "@/routes/routeConstants";
import { Button } from "@/components/base/Button";
import { Plus, RefreshCcw, SearchIcon } from "lucide-react";
import { Input } from "@/components/base/Input";
import { useInputState } from "@/hooks/useInputState";
import Pagination from "@/components/compound/Pagination";
import Spinner from "@/components/compound/spinner/Spinner";
import { Popover } from "@/components/compound/Popover";
import MenuItem from "@/components/compound/MenuItem";
import DiscountCard from "./DiscountCard";
import Select, { type SelectOption } from "@/components/base/Select";
import StoreDropdown from "../company-management/components/StoreDropdown";
import Divider from "@/components/base/Divider";

const discountTypeOptions = [
  { label: "Normal", value: "normal" },
  { label: "Packaging", value: "packaging" },
  { label: "Delivery Charges", value: "deliveryCharges" },
];

const discountAmountTypeOptions = [
  { label: "Fixed Amount", value: "fix" },
  { label: "Percentage", value: "percentage" },
];

const conditionTypeOptions = [
  { label: "All Products", value: "allProducts" },
  { label: "Selected Categories", value: "selectedCategories" },
  { label: "Selected Products", value: "selectedProducts" },
];

const customerTypeOptions = [
  { label: "All Customers", value: "allCustomers" },
  { label: "New Customers", value: "newCustomers" },
];

const DiscountListScreen = () => {
  const [discountQueryParams, setDiscountQueryParams] =
    useState<DiscountQueryParams>({
      page: 1,
      limit: 12,
      search: "",
    });

  const {
    conditionType,
    customerType,
    discountAmountType,
    discountType,
    storeId,
  } = discountQueryParams || {};

  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  useEffect(() => {
    setDiscountQueryParams((prev) => ({ ...prev, search: debounceVal }));
  }, [debounceVal]);

  const onReset = useCallback(() => {
    setDiscountQueryParams({
      page: 1,
      limit: 12,
      search: "",
    });
  }, []);

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
  const onChangeDiscountType = useCallback((opt: SelectOption) => {
    setDiscountQueryParams((prev) => ({
      ...prev,
      discountType: opt?.value as any,
    }));
  }, []);
  const selectedDiscountAmountOption = useMemo(
    () =>
      discountAmountTypeOptions?.find((e) => e.value === discountAmountType),
    [discountAmountType],
  );
  const onChangeDiscountAmountType = useCallback((opt: SelectOption) => {
    setDiscountQueryParams((prev) => ({
      ...prev,
      discountAmountType: opt?.value as any,
    }));
  }, []);
  const selectedConditionOption = useMemo(
    () => conditionTypeOptions?.find((e) => e.value === conditionType),
    [conditionType],
  );
  const onChangeConditionType = useCallback((opt: SelectOption) => {
    setDiscountQueryParams((prev) => ({
      ...prev,
      conditionType: opt?.value as any,
    }));
  }, []);
  const selectedCustomerOption = useMemo(
    () => customerTypeOptions?.find((e) => e.value === customerType),
    [customerType],
  );
  const onChangeCustomerType = useCallback((opt: SelectOption) => {
    setDiscountQueryParams((prev) => ({
      ...prev,
      customerType: opt?.value as any,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex w-full items-center justify-between">
        <Input
          leftElement={<SearchIcon size={18} strokeWidth={1} />}
          placeholder={"Search"}
          value={inputValue}
          onChange={onInputChange}
        />

        <div className="flex items-center gap-4">
          <div className="filters-wrapper">
            <Select
              options={discountTypeOptions}
              value={selectedDiscountOption}
              onChange={onChangeDiscountType as any}
              placeholder="Discount Type"
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <StoreDropdown
              onChange={(storeId) =>
                setDiscountQueryParams((prev) => ({ ...prev, storeId }))
              }
              storeId={storeId}
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <Select
              options={discountAmountTypeOptions}
              value={selectedDiscountAmountOption}
              onChange={onChangeDiscountAmountType as any}
              placeholder="Amount Type"
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <Select
              options={conditionTypeOptions}
              value={selectedConditionOption}
              onChange={onChangeConditionType as any}
              placeholder="Condition"
              variant="minimal"
            />
            <Divider vertical className="mx-3 h-6" />
            <Select
              options={customerTypeOptions}
              value={selectedCustomerOption}
              onChange={onChangeCustomerType as any}
              placeholder="Customer Condition"
              variant="minimal"
            />
          </div>
          <Button
            startIcon={<RefreshCcw size={20} />}
            variant="ghost"
            onClick={onReset}
          >
            Reset
          </Button>
          {/* <Link
            to={routeConstants.discountDetails
              .replace(":action", "create")
              .replace(":discountId", "new-discount")}
          >
            <Button startIcon={<Plus className="text-white" size={20} />}>
              Create
            </Button>
          </Link> */}

          <Popover
            trigger={
              <Button startIcon={<Plus className="text-white" size={20} />}>
                Create
              </Button>
            }
          >
            <div className="menu-items">
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
        </div>
      </div>
      <div className="w-full flex-1">
        {isFetching && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner />
            <div>Fetching...</div>
          </div>
        )}
        {!isFetching && (
          <>
            {isError && (
              <div className="flex h-full w-full items-center justify-center">
                Error: {errorMessage}
              </div>
            )}
            {!isError && (
              <>
                {!discountList?.length && (
                  <div className="flex h-full w-full items-center justify-center">
                    There are no such discounts
                  </div>
                )}
                {Boolean(discountList?.length) && (
                  <div className="grid h-full w-full grid-cols-4 gap-4 overflow-auto">
                    {...(discountList || [])?.map((discount) => (
                      <DiscountCard
                        discount={discount}
                        key={discount._id}
                        onRefresh={refetch}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Pagination {...discountPagination} />
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Dashboard",
    to: routeConstants.dashboard,
  },
  {
    label: "Discounts",
    to: routeConstants.discounts,
  },
];

export default DiscountListScreen;
