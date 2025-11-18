import Select, { type SelectOption } from "@/components/base/Select";
import { useInputState } from "@/hooks/useInputState";
import type { StaffQueryParams } from "@/types/user.types";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState, type FC } from "react";
import { useFetchStaffList } from "../hooks/useFetchStaffList";

type Props = {
  staffId: string;
  onChange: (staffId: string) => void;
  error?: string;
  label?: string;
  variant?: "default" | "minimal";
};

const StaffDropdown: FC<Props> = (props) => {
  const {
    staffId,
    onChange,
    error,
    label = "Select Rider",
    variant = "default",
  } = props;
  const { debounceVal, inputValue, onInputChange } = useInputState("", 300);
  const [selectedStaffOption, setSelectedStaffOption] =
    useState<SelectOption | null>(null);

  // Fetch staff with search and filter by delivery_boy role
  const staffQuery = useMemo<StaffQueryParams>(
    () => ({
      limit: 10,
      page: 1,
      search: debounceVal,
      role: "delivery_boy", // Only show delivery boys
    }),
    [debounceVal],
  );

  const { data: staffMetaData, isFetching: isStaffFetching } =
    useFetchStaffList(staffQuery);
  const { data: staffList = [] } = staffMetaData || {};

  // Map staff to select options
  const staffOptions = useMemo(() => {
    const options = staffList.map((staff) => ({
      label: `${staff.name} (${staff.email})`,
      value: staff._id,
    }));

    // Add the selected option if it's not in the list
    if (
      selectedStaffOption &&
      !options.find((o) => o.value === selectedStaffOption.value)
    ) {
      options.unshift(selectedStaffOption);
    }

    return uniqBy(options, (e) => e.value);
  }, [staffList, selectedStaffOption]);

  // Set selected option when staffId changes
  useEffect(() => {
    if (staffId) {
      const option = staffOptions.find((o) => o.value === staffId);
      if (option) {
        setSelectedStaffOption(option);
      }
    } else {
      setSelectedStaffOption(null);
    }
  }, [staffId, staffOptions]);

  const handleChange = (val: SelectOption | null) => {
    setSelectedStaffOption(val);
    onChange(val?.value || "");
  };

  return (
    <Select
      label={label}
      variant={variant}
      isLoading={isStaffFetching}
      options={staffOptions}
      value={selectedStaffOption}
      onChange={handleChange as any}
      placeholder="Select rider"
      onInputChange={(nVal) =>
        onInputChange({ target: { value: nVal } } as any)
      }
      inputValue={inputValue}
      error={error}
    />
  );
};

export default StaffDropdown;
