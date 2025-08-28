import Checkbox from "@/components/base/Checkbox";
import { cn } from "@/utils/helpers";
import React, { useState } from "react";
import type { PaginationProps } from "../Pagination";
// import Pagination from "../Pagination";
import TableCell from "./TableCell";
import Pagination from "../Pagination";
// import TableOptions, { type TableOptionsProps } from "./TableOptions";

export function Table<T extends Record<string, any>>(props: TableProps<T>) {
  const {
    columns,
    data,
    emptyMessage,
    enableRowSelection,
    filterComponent,
    isLoading,
    onSort,
    pagination,
    size = "md",
    sortable,
    rowSelectionKey = "id",
    className = "",
    onRowClick,
    // showTableOptions = false,
    customRender,
    isMuted = false,
    ...rest
  } = props;

  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof T) => {
    if (!sortable || !onSort) return;

    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort(column, newDirection);
  };

  const renderCell = (row: T, column: TableColumn<T>) => {
    const value =
      typeof column.accessor === "function"
        ? column.accessor(row)
        : row[column.accessor];

    return column.cell ? column.cell(value, row) : value;
  };

  const selectedIds =
    enableRowSelection && "selectedIds" in rest ? rest.selectedIds : [];

  const onRowSelection =
    enableRowSelection && "onRowSelection" in rest
      ? rest.onRowSelection
      : undefined;

  const getRowId = (row: T) => String(row[rowSelectionKey]);

  const allRowsSelected =
    enableRowSelection &&
    data.length > 0 &&
    data.every((row) => selectedIds.includes(getRowId(row)));

  const someRowsSelected =
    enableRowSelection &&
    data.some((row) => selectedIds.includes(getRowId(row)));

  const toggleSelectAll = () => {
    if (!onRowSelection) return;

    const allSelected = data.every((row) =>
      selectedIds.includes(getRowId(row)),
    );

    data.forEach((row) => {
      const rowId = getRowId(row);
      const isSelected = selectedIds.includes(rowId);

      if (allSelected && isSelected) {
        onRowSelection(rowId);
      } else if (!allSelected && !isSelected) {
        onRowSelection(rowId);
      }
    });
  };

  return (
    <div className={cn("flex w-full flex-col rounded-xl", className)}>
      {filterComponent && <div className="mt-4">{filterComponent}</div>}

      <div className="w-full">
        <div className="no-scrollbar border-nl-200/80 dark:border-nd-500/80 w-full overflow-hidden overflow-x-auto rounded-xl border">
          <table className="divide-nl-200/60 dark:divide-nd-500/60 w-full divide-y">
            <thead className="bg-nl-50 dark:bg-nd-700">
              <tr>
                {enableRowSelection && (
                  <th className={cn(paddingMap[size], checkboxClasses)}>
                    <Checkbox
                      checked={allRowsSelected}
                      indeterminate={!allRowsSelected && someRowsSelected}
                      onChange={toggleSelectAll}
                      size="sm"
                    />
                  </th>
                )}
                {columns?.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={cn(
                      tableHeadClassName,
                      paddingMap[size],
                      column.className,
                    )}
                    onClick={() => {
                      if (
                        sortable &&
                        typeof column.accessor === "string" &&
                        column.sortable
                      ) {
                        handleSort(column.accessor);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {sortable &&
                        typeof column.accessor === "string" &&
                        column.sortable && (
                          <span className="ml-1">
                            {sortColumn === column.accessor ? (
                              sortDirection === "asc" ? (
                                "↑"
                              ) : (
                                "↓"
                              )
                            ) : (
                              <span className="text-nl-600">↕</span>
                            )}
                          </span>
                        )}
                    </div>
                  </th>
                ))}
                {/* {showTableOptions && (
                  <th className={cn(tableOptionsClasses)}></th>
                )} */}
              </tr>
            </thead>
            <tbody className="divide-nl-100/70 dark:divide-nd-600 dark:bg-nd-800 divide-y bg-white">
              {customRender
                ? customRender
                : data?.length > 0 &&
                  !isLoading &&
                  data?.map((row, rowIndex) => {
                    const rowId = getRowId(row);
                    return (
                      <tr
                        key={rowIndex}
                        className="hover:bg-nl-50/60 hover:dark:bg-nd-700/70"
                        onClick={() => onRowClick?.(row)}
                      >
                        {enableRowSelection && (
                          <TableCell isMuted={isMuted}>
                            <Checkbox
                              checked={selectedIds.includes(rowId)}
                              onChange={() => onRowSelection?.(rowId)}
                              size="sm"
                            />
                          </TableCell>
                        )}
                        {columns?.map((column, colIndex) => (
                          <TableCell
                            key={colIndex}
                            className={cn(column.className)}
                            isMuted={isMuted}
                          >
                            {renderCell(row, column)}
                          </TableCell>
                        ))}
                        {/* {showTableOptions && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <TableOptions {...showTableOptions(row)} />
                          </TableCell>
                        )} */}
                      </tr>
                    );
                  })}
              {data?.length < 1 && !isLoading && (
                <tr>
                  <td
                    colSpan={columns?.length}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No Data
                    {/* <NoData title={emptyMessage} /> */}
                  </td>
                </tr>
              )}
              {isLoading && (
                <>
                  {Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(columns?.length || 4)
                          .fill(null)
                          .map((_, i) => (
                            <td
                              key={i}
                              className={`p-1 text-center`}
                              style={{
                                height: loadingHeightMap[size],
                              }}
                            >
                              <div
                                className={cn(
                                  "shimmer h-full rounded bg-gray-200/70",
                                )}
                              ></div>
                            </td>
                          ))}
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {pagination && (
        <Pagination
          className="mt-4"
          selectedIds={selectedIds}
          {...pagination}
        />
      )}
    </div>
  );
}

const paddingMap = {
  sm: "px-3 py-2",
  md: "px-6 py-3",
  lg: "px-7 py-4",
};

const loadingHeightMap = {
  sm: "37px",
  md: "53px",
  lg: "61px",
};

const checkboxClasses = `text-left flex pr-1 pl-3`;

export type TableColumn<T> = {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  id?: string;
};

interface BaseTableCommonProps<T> {
  columns?: TableColumn<T>[];
  data: T[];
  filterComponent?: React.ReactNode;
  pagination?: PaginationProps;
  sortable?: boolean;
  onSort?: (column: keyof T, direction: "asc" | "desc") => void;
  isLoading?: boolean;
  emptyMessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  rowSelectionKey?: keyof T;
  onRowClick?: (row: T) => void;
  // showTableOptions?: (row: T) => TableOptionsProps;
  customRender?: React.ReactNode;
  isMuted?: boolean;
}

interface TablePropsWithoutSelection<T> extends BaseTableCommonProps<T> {
  enableRowSelection?: false;
}

interface TablePropsWithSelection<T> extends BaseTableCommonProps<T> {
  enableRowSelection: true;
  selectedIds: string[];
  onRowSelection: (id: string) => void;
}

type TableProps<T> = TablePropsWithSelection<T> | TablePropsWithoutSelection<T>;

const tableHeadClassName =
  "dark:text-nd-100 text-nl-800 text-left text-xs font-semibold tracking-wider uppercase text-nowrap";
// const tableOptionsClasses = `w-10`;
