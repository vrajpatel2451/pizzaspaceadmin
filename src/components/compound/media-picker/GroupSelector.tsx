import Select, {
  findOptionByValue,
  type SelectOnChangeVal,
  type SelectOption,
} from "@/components/base/Select";
import { useEffect } from "react";
import { useFetchAllFolders } from "./hooks";

interface GroupSelectorProps {
  defaultGroup?: string;
  selectedGroup: SelectOption;
  setSelectedGroup: React.Dispatch<React.SetStateAction<SelectOption>>;
}

const GroupSelector: React.FC<GroupSelectorProps> = (props) => {
  const { defaultGroup, selectedGroup, setSelectedGroup } = props;
  const { data, isFetching: isLoading } = useFetchAllFolders();

  const groupOptions: SelectOption[] = (data ?? [])?.map((i) => ({
    label: i,
    value: i,
  }));

  useEffect(() => {
    if (defaultGroup) {
      const found = findOptionByValue(groupOptions, defaultGroup);
      if (found) setSelectedGroup(found);
    }
  }, [defaultGroup, groupOptions, setSelectedGroup]);

  const handleChange = (val: SelectOnChangeVal) => {
    setSelectedGroup(val as SelectOption);
  };

  return (
    <div>
      <Select
        options={groupOptions}
        value={selectedGroup}
        onChange={handleChange}
        placeholder="Select folder"
        isLoading={isLoading}
        label="Select Folder"
        isCreatable={true}
      />
    </div>
  );
};

export default GroupSelector;
