import type { PaginationMeta } from "@/types/baseApi.types";
import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "../base/IconButton";

export interface PaginationProps extends PaginationMeta {
  onPageChange: (currentPage: number) => void;
  className?: string;
  selectedIds?: string[];
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    selectedIds,
    className,
    hasNextPage,
    onPageChange,
    hasPrevPage,
  } = props;

  if (totalPages < 2) return;

  const goToPage = (currentPage: number) => {
    onPageChange(currentPage);
  };

  const handleNextPage = () => {
    if (hasNextPage) goToPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (hasPrevPage) goToPage(currentPage - 1);
  };

  const pageList = getPageNumbers(currentPage, totalPages);
  const resultStart = (currentPage - 1) * pageSize + 1;
  const resultEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <p className="text-nl-500">
        {selectedIds && selectedIds?.length > 0 && (
          <>
            {" "}
            {selectedIds?.length === pageSize
              ? "All items on this page selected"
              : `${selectedIds?.length} item selected`}{" "}
            -{" "}
          </>
        )}
        Showing {resultStart}-{resultEnd} of {totalItems} results
      </p>
      <div className="flex items-center gap-x-2">
        <IconButton
          icon={ChevronLeft}
          onClick={handlePreviousPage}
          size={"xs"}
          disableHoverBg
          className={cn(basClasses, buttonColorClasses)}
          strokeWidth={1.6}
          disabled={!hasPrevPage || currentPage < 2}
        />
        <div className="flex gap-x-1">
          {pageList.map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                className="fall dark:text-nd-200 text-nl-600 size-7 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => goToPage(Number(page))}
                className={cn(
                  basClasses,
                  currentPage === page
                    ? activeButtonColorClasses
                    : buttonColorClasses,
                )}
              >
                {page}
              </button>
            ),
          )}
        </div>
        <IconButton
          icon={ChevronRight}
          onClick={handleNextPage}
          size={"xs"}
          disableHoverBg
          className={cn(basClasses, buttonColorClasses)}
          strokeWidth={1.6}
          disabled={!hasNextPage || currentPage >= totalPages}
        />
      </div>
    </div>
  );
};

const basClasses = `fall h-7 min-w-7 cursor-pointer rounded-lg border px-1 text-sm transition-all`;
const buttonColorClasses = `text-nl-400 dark:text-nd-300 hover:text-nl-600 hover:dark:text-nd-200 hover:bg-nl-50 hover:dark:bg-nd-600 border-transparent`;
const activeButtonColorClasses =
  "text-nl-600 dark:bg-nd-700 border-nl-200 dark:border-nd-400/50 dark:text-nd-50 bg-white";

export default Pagination;

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (currentPage === 5) {
    pages.push(1, "...", 4, 5, 6, "...", totalPages);
  } else if (currentPage === 6) {
    pages.push(1, "...", 5, 6, 7, "...", totalPages);
  } else {
    pages.push(1, "...");

    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return pages;
}
