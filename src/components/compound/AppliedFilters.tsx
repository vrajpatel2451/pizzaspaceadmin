// import { useRouter, useSearch } from "@tanstack/react-router";
// import { Tags, X } from "lucide-react";
// import { IconButton } from "../base/IconButton";
// import { Popover } from "./Popover";

// const AppliedFilters = () => {
//   const searchParams = useSearch({ strict: false });
//   const router = useRouter();

//   if (Object.keys(searchParams).length === 0) return null;

//   const filterItems: FilterItem[] = Object.entries(searchParams).map(
//     ([key, value]) => ({
//       label: key,
//       value: String(value),
//     }),
//   );

//   const handleClear = (key: string) => {
//     router.navigate({
//       search: {
//         ...router.state.location.search,
//         [key]: undefined,
//       } as any,
//     });
//   };

//   const handleClearAll = () => {
//     router.navigate({
//       search: {} as any,
//     });
//   };

//   return (
//     <div className="fade-in">
//       <Popover
//         trigger={
//           <IconButton
//             icon={Tags}
//             iconClassName="dark:text-nd-100 text-nl-600"
//           />
//         }
//       >
//         <div className="p-1 px-2">
//           <div className="flex items-center justify-between">
//             <p className="dark:text-nd-50 text-nl-700"> Active filters </p>
//             <button
//               className="dark:text-nd-200 text-nl-500 hover:dark:text-nd-50 hover:text-nl-700 cursor-pointer text-sm"
//               onClick={handleClearAll}
//             >
//               {" "}
//               Clear all{" "}
//             </button>
//           </div>
//           <div className="mt-2 flex flex-col gap-y-2">
//             {filterItems.map((item, index) => (
//               <FilterItem
//                 key={index}
//                 label={item.label}
//                 value={item.value}
//                 onClear={() => handleClear(item.label)}
//               />
//             ))}
//           </div>
//         </div>
//       </Popover>
//     </div>
//   );
// };

// export default AppliedFilters;

// interface FilterItem {
//   label: string;
//   value: string;
// }

// interface FilterItemsProps extends FilterItem {
//   onClear: () => void;
// }

// const FilterItem: React.FC<FilterItemsProps> = (props) => {
//   const { label, onClear, value } = props;

//   return (
//     <div className="bg-nl-50 dark:bg-nd-600 flex min-w-52 items-center justify-between rounded-md px-2 py-1.5">
//       <div>
//         <p className="dark:text-nd-200 text-nl-500"> {label} </p>
//         <p className="dark:text-nd-50 text-nl-700"> {value} </p>
//       </div>
//       <IconButton icon={X} size={"xs"} onClick={onClear} />
//     </div>
//   );
// };
