// import Select, {
//   findOptionByValue,
//   type SelectOnChangeVal,
//   type SelectOption,
// } from "@/components/base/Select";
// import { mediaPickerQueries } from "@/features/media-picker/mediaPickerQueries";
// import { queryClient } from "@/queryClient";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";

// interface GroupSelectorProps {
//   defaultGroup?: string;
//   selectedGroup: SelectOption;
//   setSelectedGroup: React.Dispatch<React.SetStateAction<SelectOption>>;
// }

// const GroupSelector: React.FC<GroupSelectorProps> = (props) => {
//   const qc = queryClient;
//   const { defaultGroup, selectedGroup, setSelectedGroup } = props;

//   const { data, isLoading } = useQuery(mediaPickerQueries.getMediaGroups());

//   const groupOptions: SelectOption[] = (data ?? [])?.map((i) => ({
//     label: i,
//     value: i,
//   }));

//   useEffect(() => {
//     if (defaultGroup) {
//       const found = findOptionByValue(groupOptions, defaultGroup);
//       if (found) setSelectedGroup(found);
//     }
//   }, []);

//   const handleChange = (val: SelectOnChangeVal) => {
//     if ((val as SelectOption)?.__isNew__) {
//       qc.invalidateQueries({
//         queryKey: mediaPickerQueries.keys.groups,
//       });
//     }
//   };

//   return (
//     <div>
//       <Select
//         options={groupOptions}
//         value={selectedGroup}
//         onChange={handleChange}
//         placeholder="Select Parent Category"
//         isLoading={isLoading}
//         isCreatable={true}
//       />
//     </div>
//   );
// };

// export default GroupSelector;
