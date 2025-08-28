import React from "react";
import { cn } from "@/utils/helpers";

const paddingMap = {
  sm: "px-3 py-2",
  md: "px-6 py-3",
  lg: "px-7 py-4",
};

const tableBodyCellClassName =
  "text-nl-600 dark:text-nd-200 text-sm font-normal whitespace-nowrap";

interface TableCellProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: any) => void;
  isMuted?: boolean;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  size = "md",
  className = "",
  isMuted = false,
  onClick,
}) => {
  return (
    <td
      className={cn(
        isMuted && "opacity-50",
        tableBodyCellClassName,
        paddingMap[size],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export default TableCell;
