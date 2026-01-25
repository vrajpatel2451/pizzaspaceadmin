import { Button } from "@/components/base/Button";
import { Popover, PopoverClose } from "@/components/compound/Popover";
import { cn } from "@/utils/helpers";
import dayjs from "dayjs";
import { ArrowLeftRight, Check, ChevronDown } from "lucide-react";
import { type FC, useCallback, useMemo, useState } from "react";
import {
  COMPARISON_PRESETS,
  type ComparisonPresetId,
} from "../constants/comparisonPresets";

interface ComparisonSelectorProps {
  value: ComparisonPresetId;
  onChange: (presetId: ComparisonPresetId) => void;
  onCustomRangeChange?: (startTime: string, endTime: string) => void;
  customStartTime?: string;
  customEndTime?: string;
  className?: string;
}

const ComparisonSelector: FC<ComparisonSelectorProps> = ({
  value,
  onChange,
  onCustomRangeChange,
  customStartTime,
  customEndTime,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(value === "custom");
  const [customStart, setCustomStart] = useState(
    customStartTime
      ? dayjs(customStartTime).format("YYYY-MM-DD")
      : dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  );
  const [customEnd, setCustomEnd] = useState(
    customEndTime
      ? dayjs(customEndTime).format("YYYY-MM-DD")
      : dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  );

  const displayLabel = useMemo(() => {
    if (value === "custom" && customStartTime && customEndTime) {
      const start = dayjs(customStartTime);
      const end = dayjs(customEndTime);
      if (start.isSame(end, "day")) {
        return `vs ${start.format("MMM D")}`;
      }
      return `vs ${start.format("MMM D")} - ${end.format("MMM D")}`;
    }
    const preset = COMPARISON_PRESETS.find((p) => p.id === value);
    return `vs ${preset?.label || "Previous Period"}`;
  }, [value, customStartTime, customEndTime]);

  const handlePresetSelect = useCallback(
    (presetId: ComparisonPresetId) => {
      if (presetId === "custom") {
        setShowCustomForm(true);
      } else {
        onChange(presetId);
        setShowCustomForm(false);
        setIsOpen(false);
      }
    },
    [onChange],
  );

  const handleApplyCustom = useCallback(() => {
    const startTime = dayjs(customStart).startOf("day").toISOString();
    const endTime = dayjs(customEnd).endOf("day").toISOString();
    onCustomRangeChange?.(startTime, endTime);
    setIsOpen(false);
  }, [customStart, customEnd, onCustomRangeChange]);

  const isValidCustomRange = useMemo(() => {
    const start = dayjs(customStart);
    const end = dayjs(customEnd);
    return start.isValid() && end.isValid() && !end.isBefore(start);
  }, [customStart, customEnd]);

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          variant="outline"
          size="md"
          color="neutral"
          startIcon={<ArrowLeftRight className="h-4 w-4" />}
          endIcon={<ChevronDown className="h-4 w-4" />}
          className={className}
        >
          {displayLabel}
        </Button>
      }
      align="start"
      className="w-[300px] !p-0"
    >
      <div className="p-3">
        {!showCustomForm ? (
          <div className="space-y-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Compare With
            </p>
            {COMPARISON_PRESETS.map((preset) => (
              <PopoverClose
                key={preset.id}
                asChild={preset.id !== "custom"}
              >
                <button
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    value === preset.id
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700",
                  )}
                >
                  <span>{preset.label}</span>
                  {value === preset.id && preset.id !== "custom" && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              </PopoverClose>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Custom Comparison Range
              </p>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                Back to presets
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none dark:border-slate-600 dark:bg-slate-800"
                />
              </div>
            </div>

            {!isValidCustomRange && (
              <p className="text-xs text-red-500">
                End date must be on or after start date
              </p>
            )}

            <PopoverClose asChild>
              <Button
                onClick={handleApplyCustom}
                fullWidth
                disabled={!isValidCustomRange}
                color="primary"
                size="sm"
              >
                Apply Custom Range
              </Button>
            </PopoverClose>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default ComparisonSelector;
