import React from "react";
import Select from "../base/Select";
import type { CustomSelectProps, SelectOption } from "../base/Select";
import Chip from "../base/Chip";

interface MultiSelectWithChipsProps {
  options: SelectOption[];
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  error?: CustomSelectProps["error"];
}

export const MultiSelectWithChips: React.FC<MultiSelectWithChipsProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isLoading = false,
  error = "",
}) => {
  const handleChange = (
    newValue: SelectOption | readonly SelectOption[] | null,
  ) => {
    if (Array.isArray(newValue)) {
      onChange([...newValue]);
    } else {
      onChange([]);
    }
  };

  return (
    <div>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        menuPortalTarget={document.body}
        hideInputValues={true}
        placeholder={placeholder}
        isLoading={isLoading}
        error={error}
      />
      <div className="mt-2 flex flex-wrap gap-1">
        {value?.map((item, index) => (
          <Chip
            key={index}
            label={item.label}
            isCollapsible
            onCollapse={() =>
              onChange(value.filter((v) => v.value !== item.value))
            }
          />
        ))}
      </div>
    </div>
  );
};
