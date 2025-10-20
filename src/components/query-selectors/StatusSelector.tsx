// import { useRouter, useSearch } from "@tanstack/react-router";
// import Select, {
//   findOptionByValue,
//   type SelectOnChangeVal,
//   type SelectOption,
// } from "../base/Select";

// const StatusSelector = () => {
//   const router = useRouter();
//   const { active: activeSearch } = useSearch({ strict: false });

//   const handleChange = (val: SelectOnChangeVal) => {
//     const active = (val as SelectOption)?.value;
//     router.navigate({
//       search: {
//         ...router.state.location.search,
//         active: active || undefined,
//       } as any,
//     });
//   };

//   return (
//     <Select
//       variant="minimal"
//       options={statusOptions}
//       placeholder="Status"
//       width={80}
//       onChange={handleChange}
//       value={findOptionByValue(statusOptions, activeSearch ?? "")}
//     />
//   );
// };

// export default StatusSelector;

// const statusOptions: SelectOption[] = [
//   {
//     label: "All",
//     value: "",
//   },
//   {
//     label: "Active",
//     value: "true",
//   },
//   {
//     label: "Inactive",
//     value: "false",
//   },
// ];
