import Select, {
  type CustomSelectProps,
  type SelectOption,
} from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchStoreList } from "../hooks";
import type { StoreQueryParams, StoreResponse } from "../types/StoreTypes";

type Props = {
  intStore?: StoreResponse;
  storeId: string;
  onChange: (storeId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
};

const StoreDropdown: FC<Props> = (props) => {
  const { storeId, onChange, intStore, error, label, variant } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const [selectedStoreOption, setSelectedStoreOption] =
    useState<SelectOption>(null);

  useEffect(() => {
    if (intStore) {
      setSelectedStoreOption((prev) =>
        prev ? prev : { label: intStore.name, value: intStore._id },
      );
    }
  }, [intStore]);

  const ctQuery = useMemo<StoreQueryParams>(
    () => ({
      limit: 10,
      page: 1,
      search: debounceVal,
    }),
    [debounceVal],
  );
  const { data: storeMetaData, isFetching: isStoreFetching } =
    useFetchStoreList(ctQuery);
  const { data: storeList } = storeMetaData || {};
  const storeOptions = useMemo(() => {
    const storeOptions =
      storeList?.map((e) => ({
        label: e.name,
        value: e._id,
      })) || [];
    if (selectedStoreOption) {
      storeOptions.push(selectedStoreOption);
    }
    return uniqBy(storeOptions, (e) => e.value);
  }, [storeList, selectedStoreOption]);

  const selectedOption = useMemo(
    () => storeOptions.find((e) => e.value === storeId),
    [storeId, storeOptions],
  );

  const handleChange = useCallback(
    (val: SelectOption) => {
      setSelectedStoreOption(val);
      onChange(val?.value || "");
    },
    [onChange],
  );

  return (
    <Select
      label={label}
      variant={variant}
      isLoading={isStoreFetching}
      options={storeOptions}
      value={selectedOption}
      onChange={handleChange as any}
      placeholder={"Select store"}
      onInputChange={(nVal) =>
        onInputChange({
          target: {
            value: nVal,
          },
        } as any)
      }
      inputValue={inputValue}
      error={error}
    />
  );
};

export default StoreDropdown;
