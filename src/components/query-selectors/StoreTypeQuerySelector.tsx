// import { StoreTypeEnum } from "@/features/category/types";
// // import { useRouter, useSearch } from "@tanstack/react-router";
// import Select, {
//   findOptionByValue,
//   type SelectOnChangeVal,
//   type SelectOption,
// } from "../base/Select";

// const StoreTypeQuerySelector = () => {
//   const router = useRouter();
//   const { type: activeType } = useSearch({ strict: false });

//   const handleChange = (val: SelectOnChangeVal) => {
//     const type = (val as SelectOption)?.value;
//     router.navigate({
//       search: {
//         ...router.state.location.search,
//         type: type || undefined,
//       } as any,
//     });
//   };

//   console.log({ activeType });

//   return (
//     <Select
//       variant="minimal"
//       options={options}
//       placeholder="Type"
//       width={80}
//       onChange={handleChange}
//       value={findOptionByValue(options, activeType ?? "")}
//     />
//   );
// };

// export default StoreTypeQuerySelector;

// const options: SelectOption[] = [
//   {
//     label: "All",
//     value: "",
//   },
//   {
//     label: "Restaurant",
//     value: StoreTypeEnum.restaurant,
//   },
//   {
//     label: "Super Market",
//     value: StoreTypeEnum.super_market,
//   },
// ];
