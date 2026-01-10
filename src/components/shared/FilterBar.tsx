import { cn } from "@/utils/helpers";
import { Search, X } from "lucide-react";
import { Input } from "../base/Input";
import { Button } from "../base/Button";

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onReset?: () => void;
  showReset?: boolean;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  actions,
  onReset,
  showReset = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}
        {children}
        {showReset && onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
      {actions && (
        <div className="flex flex-shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
};

export default FilterBar;
