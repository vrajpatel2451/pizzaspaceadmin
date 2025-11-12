import Chip from "@/components/base/Chip";
import Select, { type SelectOption } from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useFetchStoreList } from "../hooks";
import type { StoreQueryParams, StoreResponse } from "../types/StoreTypes";

type Props = {
  initialStores?: StoreResponse[];
  storeIds: string[];
  onChange: (storeIds: string[]) => void;
  error?: string;
  label?: string;
  placeholder?: string;
};

const StoreMultiSelectDropdown: FC<Props> = (props) => {
  const {
    storeIds,
    onChange,
    initialStores = [],
    error,
    label,
    placeholder = "Select stores",
  } = props;

  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);

  const [selectedStoreOptions, setSelectedStoreOptions] = useState<
    SelectOption[]
  >([]);

  // Initialize selected stores from initialStores prop
  useEffect(() => {
    if (initialStores && initialStores.length > 0) {
      const initialOptions = initialStores.map((store) => ({
        label: store.name,
        value: store._id,
      }));
      setSelectedStoreOptions((prev) =>
        prev.length === 0 ? initialOptions : prev,
      );
    }
  }, [initialStores]);

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
    const options =
      storeList?.map((e) => ({
        label: e.name,
        value: e._id,
      })) || [];

    // Add currently selected options to ensure they're available in the dropdown
    if (selectedStoreOptions.length > 0) {
      options.push(...selectedStoreOptions);
    }

    return uniqBy(options, (e) => e.value);
  }, [storeList, selectedStoreOptions]);

  // Sync selected options with storeIds prop
  const selectedOptions = useMemo(
    () => storeOptions.filter((option) => storeIds.includes(option.value)),
    [storeIds, storeOptions],
  );

  const handleChange = useCallback(
    (newValue: SelectOption | readonly SelectOption[] | null) => {
      if (Array.isArray(newValue)) {
        const options = [...newValue];
        setSelectedStoreOptions(options);
        onChange(options.map((opt) => opt.value));
      } else {
        setSelectedStoreOptions([]);
        onChange([]);
      }
    },
    [onChange],
  );

  const handleRemoveChip = useCallback(
    (valueToRemove: string) => {
      const updatedOptions = selectedOptions.filter(
        (opt) => opt.value !== valueToRemove,
      );
      setSelectedStoreOptions(updatedOptions);
      onChange(updatedOptions.map((opt) => opt.value));
    },
    [selectedOptions, onChange],
  );

  return (
    <div>
      <Select
        label={label}
        isMulti
        isLoading={isStoreFetching}
        options={storeOptions}
        value={selectedOptions}
        onChange={handleChange as any}
        placeholder={placeholder}
        onInputChange={(nVal) =>
          onInputChange({
            target: {
              value: nVal,
            },
          } as any)
        }
        inputValue={inputValue}
        error={error}
        menuPortalTarget={document.body}
        hideInputValues={true}
      />
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedOptions.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              isCollapsible
              onCollapse={() => handleRemoveChip(item.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreMultiSelectDropdown;
