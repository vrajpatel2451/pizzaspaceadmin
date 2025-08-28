// import { Search as SearchIcon } from "lucide-react";
// import { Input } from "../base/Input";
// import { useRouter, useSearch } from "@tanstack/react-router";
// import { useEffect } from "react";
// import useDebounce from "@/hooks/useDebounce";
// import type { PaginationQueryParams } from "@/types/general.types";

// interface SearchProps {
//   placeholder?: string;
//   value: string;
//   setValue: React.Dispatch<React.SetStateAction<string>>;
// }

// const Search: React.FC<SearchProps> = ({ placeholder, setValue, value }) => {
//   const router = useRouter();
//   // const { search: urlSearch = "" } = useSearch({ strict: false });
//   const debouncedValue = useDebounce(value, 400);

//   useEffect(() => {
//     setValue(urlSearch);
//   }, [urlSearch]);

//   useEffect(() => {
//     router.navigate({
//       to: ".",
//       replace: true,
//       // search: (old: PaginationQueryParams) => ({
//       //   ...old,
//       //   search: debouncedValue || undefined,
//       //   currentPage: debouncedValue !== urlSearch ? 1 : old.currentPage,
//       // }),
//     });
//   }, [debouncedValue, urlSearch, router]);

//   return (
//     <Input
//       leftElement={<SearchIcon size={18} strokeWidth={1} />}
//       placeholder={placeholder || "Search"}
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//     />
//   );
// };

// export default Search;
