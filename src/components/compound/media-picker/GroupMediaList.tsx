// import { Button } from "@/components/base/Button";
// import { IconButton } from "@/components/base/IconButton";
// import { mediaPickerQueries } from "@/features/media-picker/mediaPickerQueries";
// import { mediaPickerServices } from "@/features/media-picker/mediaPickerServices";
// import { cn } from "@/utils/helpers";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { ArrowLeft, Check } from "lucide-react";
// import ImageComponent from "../ImageComponent";

// interface GroupMediaListProps {
//   name: string;
//   onBackClick: () => void;
//   multiple?: boolean;
//   selectedUrls?: string[];
//   onUploadComplete?: (urls: string | string[]) => void;
// }

// const GroupMediaList: React.FC<GroupMediaListProps> = ({
//   name,
//   onBackClick,
//   onUploadComplete,
//   multiple = false,
//   selectedUrls = [],
// }) => {
//   const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
//     useInfiniteQuery({
//       queryKey: mediaPickerQueries.keys.groupMediaList({
//         group: name,
//       }),
//       queryFn: ({ pageParam }) =>
//         mediaPickerServices.getGroupMediaList({
//           group: name,
//           currentPage: pageParam,
//           pageSize: 24,
//         }),
//       initialPageParam: 1,
//       getNextPageParam: (lastPage) => {
//         if (lastPage.meta.hasNextPage) {
//           return lastPage.meta.currentPage + 1;
//         }
//         return undefined;
//       },
//     });

//   const allMedia = data?.pages.flatMap((page) => page.data) ?? [];

//   const handleImageSelect = (imagePath: string) => {
//     const fullUrl = imagePath;

//     if (multiple) {
//       if (selectedUrls.includes(fullUrl)) {
//         const newUrls = selectedUrls.filter((url) => url !== fullUrl);
//         onUploadComplete?.(newUrls);
//       } else {
//         const newUrls = [...selectedUrls, fullUrl];
//         onUploadComplete?.(newUrls);
//       }
//     } else {
//       const isAlreadySelected = selectedUrls[0] === fullUrl;
//       onUploadComplete?.(isAlreadySelected ? [] : [fullUrl]);
//     }
//   };

//   const isSelected = (imagePath: string) => {
//     const fullUrl = imagePath;
//     return selectedUrls.includes(fullUrl);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-[218px]">
//         <div className="mb-4 flex justify-between">
//           <div className="shimmer h-[38px] w-72" />
//           <div className="shimmer h-[38px] w-64" />
//         </div>
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1">
//           {Array(8)
//             .fill(null)
//             .map((_, i) => (
//               <div className="shimmer size-28 shrink-0" key={i} />
//             ))}
//         </div>
//         <div className="mt-6 flex justify-between">
//           <div className="shimmer h-[28px] w-64" />
//           <div className="shimmer h-[28px] w-72" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[218px]">
//       <div className="mb-4 flex items-center gap-x-3">
//         <IconButton
//           icon={ArrowLeft}
//           size={"sm"}
//           className="dark:bg-nd-800 bg-white"
//           iconClassName="text-nl-400 dark:text-nd-300"
//           strokeWidth={2}
//           onClick={onBackClick}
//         />
//         <h6 className="text-nl-700 dark:text-nd-100 mr-auto font-semibold">
//           {name}
//         </h6>
//       </div>

//       <div className="no-scrollbar grid max-h-[50vh] grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 overflow-y-auto p-1">
//         {allMedia?.map((e, i) => {
//           const selected = isSelected(e?.path);
//           return (
//             <div key={i} className="relative">
//               <button
//                 onClick={() => handleImageSelect(e?.path)}
//                 className={cn(
//                   `fall relative block w-full rounded-lg p-0.5 transition-all`,
//                   selected &&
//                     `ring-pl-500 ring-offset-pl-500 dark:ring-offset-pd-600 ring-2`,
//                 )}
//               >
//                 <ImageComponent
//                   alt={e?.name}
//                   src={e?.path}
//                   className={cn(
//                     "size-28 shrink-0 rounded-lg object-cover transition-all",
//                     selected && "scale-[85%]",
//                   )}
//                 />

//                 {selected && (
//                   <div className="dark:bg-pd-50 absolute right-1 bottom-1 z-10 rounded-full bg-white p-1">
//                     <Check
//                       size={12}
//                       className="dark:text-pd-500 text-pl-600"
//                       strokeWidth={4}
//                     />
//                   </div>
//                 )}

//                 {selected && (
//                   <div className="bg-pl-600/20 dark:bg-pd-500/20 absolute inset-0 rounded-lg" />
//                 )}
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {hasNextPage && (
//         <div className="fall mt-6">
//           <Button
//             color="neutral"
//             onClick={fetchNextPage}
//             disabled={isLoading || isFetchingNextPage}
//             isLoading={isFetchingNextPage}
//           >
//             Load More
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GroupMediaList;
