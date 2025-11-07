import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import type { DiscountResponse } from "@/types/discount.types";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchApplicableDiscounts } from "./hooks/useFetchApplicableDiscounts";

type Props = {
  userId: string;
  cartIds: string[];
  storeId: string;
  selectedDiscountId: string;
  initDiscount?: DiscountResponse;
  onSelectDiscount: (discountId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
};

const ApplicableDiscountDropdown: FC<Props> = (props) => {
  const {
    userId,
    cartIds,
    storeId,
    selectedDiscountId,
    onSelectDiscount,
    initDiscount,
    error,
    label = "Discount",
    variant,
  } = props;

  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const [selectedDiscountOption, setSelectedDiscountOption] =
    useState<SelectOption>(null);

  useEffect(() => {
    if (initDiscount) {
      setSelectedDiscountOption((prev) =>
        prev
          ? prev
          : {
              label: `${initDiscount.name} (${initDiscount.couponCode})`,
              value: initDiscount._id,
            },
      );
    }
  }, [initDiscount]);

  const discountParams = useMemo(
    () => ({
      userId,
      cartIds,
      storeId,
      search: debounceVal,
    }),
    [userId, cartIds, storeId, debounceVal],
  );

  const { data: discountList = [], isFetching: isDiscountsFetching } =
    useFetchApplicableDiscounts(discountParams);

  const discountOptions = useMemo(() => {
    const options = discountList
      .filter((discount) => discount.active)
      .map((discount) => ({
        label: `${discount.name} (${discount.couponCode})`,
        value: discount._id,
      }));

    if (selectedDiscountOption) {
      options.push(selectedDiscountOption);
    }
    return uniqBy(options, (e) => e.value);
  }, [discountList, selectedDiscountOption]);

  const selectedOption = useMemo(
    () => discountOptions.find((e) => e.value === selectedDiscountId),
    [selectedDiscountId, discountOptions],
  );

  const handleChange = useCallback(
    (val: SelectOption) => {
      setSelectedDiscountOption(val);
      onSelectDiscount(val?.value || "");
    },
    [onSelectDiscount],
  );

  return (
    <Select
      label={label}
      variant={variant}
      isLoading={isDiscountsFetching}
      options={discountOptions}
      value={selectedOption}
      onChange={handleChange as any}
      placeholder={"Select discount"}
      onInputChange={(nVal) =>
        onInputChange({
          target: {
            value: nVal,
          },
        } as any)
      }
      inputValue={inputValue}
      error={error}
      isCreatable={false}
      isDisabled={!userId || !storeId}
      isClearable={true}
    />
  );
};

export default ApplicableDiscountDropdown;
