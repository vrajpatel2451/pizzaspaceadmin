import { Button } from "@/components/base/Button";
import { Select, type SelectOption } from "@/components/base/Select";
import { Popover, PopoverClose } from "@/components/compound/Popover";
import { cn } from "@/utils/helpers";
import dayjs from "dayjs";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { type FC, useCallback, useMemo, useState } from "react";
import {
  getPresetById,
  PRESET_GROUPS,
  TIME_RANGE_PRESETS,
} from "../constants/timeRangePresets";
import type {
  CustomTimeRange,
  TimeRange,
  TimeRangePreset,
} from "../types/timeRange.types";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const TimeRangeSelector: FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [customRange, setCustomRange] = useState<CustomTimeRange>(() =>
    getInitialCustomRange(value),
  );

  const displayLabel = useMemo(() => {
    if (value.presetId) {
      const preset = getPresetById(value.presetId);
      return preset?.label || "Custom";
    }
    return formatDateRange(value.startTime, value.endTime);
  }, [value]);

  const handlePresetSelect = useCallback(
    (preset: TimeRangePreset) => {
      onChange({ ...preset.getRange(), presetId: preset.id });
      setIsOpen(false);
    },
    [onChange],
  );

  const handleApplyCustom = useCallback(() => {
    const range = buildISORange(customRange);
    onChange({ ...range, presetId: undefined });
    setIsOpen(false);
  }, [customRange, onChange]);

  const handleCustomRangeChange = useCallback(
    (field: keyof CustomTimeRange, val: string | number) => {
      setCustomRange((prev) => ({ ...prev, [field]: val }));
    },
    [],
  );

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          variant="outline"
          size="md"
          color="neutral"
          startIcon={<Calendar className="h-4 w-4" />}
          endIcon={<ChevronDown className="h-4 w-4" />}
          className={className}
        >
          {displayLabel}
        </Button>
      }
      align="start"
      className="w-[460px] !p-0"
    >
      {/* Tabs */}
      <div className="border-nl-200 dark:border-nd-600 flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "presets"
              ? "border-pl-500 dark:border-pd-400 text-pl-600 dark:text-pd-400 border-b-2"
              : "text-nl-500 dark:text-nd-400 hover:text-nl-700 dark:hover:text-nd-200",
          )}
        >
          Quick Select
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === "custom"
              ? "border-pl-500 dark:border-pd-400 text-pl-600 dark:text-pd-400 border-b-2"
              : "text-nl-500 dark:text-nd-400 hover:text-nl-700 dark:hover:text-nd-200",
          )}
        >
          Custom Range
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {activeTab === "presets" ? (
          <PresetsList
            activeId={value.presetId}
            onSelect={handlePresetSelect}
          />
        ) : (
          <CustomRangeForm
            value={customRange}
            onChange={handleCustomRangeChange}
            onApply={handleApplyCustom}
          />
        )}
      </div>
    </Popover>
  );
};

// Presets List Component
interface PresetsListProps {
  activeId?: string;
  onSelect: (preset: TimeRangePreset) => void;
}

const PresetsList: FC<PresetsListProps> = ({ activeId, onSelect }) => {
  return (
    <div className="space-y-4">
      {PRESET_GROUPS.map((group) => {
        const presets = TIME_RANGE_PRESETS.filter((p) => p.group === group.key);
        return (
          <div key={group.key}>
            <p className="text-nl-500 dark:text-nd-400 mb-2 text-xs font-medium uppercase tracking-wide">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <PopoverClose key={preset.id} asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(preset)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      activeId === preset.id
                        ? "bg-pl-100 text-pl-700 dark:bg-pd-900/30 dark:text-pd-400"
                        : "bg-nl-100 text-nl-700 hover:bg-nl-200 dark:bg-nd-700 dark:text-nd-200 dark:hover:bg-nd-600",
                    )}
                  >
                    {preset.label}
                    {activeId === preset.id && <Check className="h-3.5 w-3.5" />}
                  </button>
                </PopoverClose>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Custom Range Form Component
interface CustomRangeFormProps {
  value: CustomTimeRange;
  onChange: (field: keyof CustomTimeRange, val: string | number) => void;
  onApply: () => void;
}

const CustomRangeForm: FC<CustomRangeFormProps> = ({
  value,
  onChange,
  onApply,
}) => {
  const hourOptions = useMemo<SelectOption<string>[]>(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        label: i.toString().padStart(2, "0"),
        value: i.toString(),
      })),
    [],
  );

  const minuteOptions = useMemo<SelectOption<string>[]>(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        label: i.toString().padStart(2, "0"),
        value: i.toString(),
      })),
    [],
  );

  const isValidRange = useMemo(() => {
    const start = dayjs(
      `${value.startDate}T${value.startHour.toString().padStart(2, "0")}:${value.startMinute.toString().padStart(2, "0")}`,
    );
    const end = dayjs(
      `${value.endDate}T${value.endHour.toString().padStart(2, "0")}:${value.endMinute.toString().padStart(2, "0")}`,
    );
    return end.isAfter(start);
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Start Date/Time */}
      <div className="space-y-2">
        <label className="text-nl-700 dark:text-nd-200 text-sm font-medium">
          Start
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="border-nl-200 bg-white dark:border-nd-500 dark:bg-nd-800 text-nl-800 dark:text-nd-100 flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
          />
          <Select
            options={hourOptions}
            value={hourOptions.find(
              (opt) => opt.value === value.startHour.toString(),
            )}
            onChange={(opt) =>
              opt && onChange("startHour", parseInt((opt as SelectOption).value))
            }
            width={75}
            isSearchable={false}
          />
          <span className="text-nl-500 dark:text-nd-400">:</span>
          <Select
            options={minuteOptions}
            value={minuteOptions.find(
              (opt) => opt.value === value.startMinute.toString(),
            )}
            onChange={(opt) =>
              opt &&
              onChange("startMinute", parseInt((opt as SelectOption).value))
            }
            width={75}
            isSearchable={false}
          />
        </div>
      </div>

      {/* End Date/Time */}
      <div className="space-y-2">
        <label className="text-nl-700 dark:text-nd-200 text-sm font-medium">
          End
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={value.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="border-nl-200 bg-white dark:border-nd-500 dark:bg-nd-800 text-nl-800 dark:text-nd-100 flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
          />
          <Select
            options={hourOptions}
            value={hourOptions.find(
              (opt) => opt.value === value.endHour.toString(),
            )}
            onChange={(opt) =>
              opt && onChange("endHour", parseInt((opt as SelectOption).value))
            }
            width={75}
            isSearchable={false}
          />
          <span className="text-nl-500 dark:text-nd-400">:</span>
          <Select
            options={minuteOptions}
            value={minuteOptions.find(
              (opt) => opt.value === value.endMinute.toString(),
            )}
            onChange={(opt) =>
              opt &&
              onChange("endMinute", parseInt((opt as SelectOption).value))
            }
            width={75}
            isSearchable={false}
          />
        </div>
      </div>

      {/* Validation Error */}
      {!isValidRange && (
        <p className="text-dl-500 dark:text-dd-400 text-sm">
          End time must be after start time
        </p>
      )}

      {/* Apply Button */}
      <PopoverClose asChild>
        <Button
          onClick={onApply}
          fullWidth
          disabled={!isValidRange}
          color="primary"
        >
          Apply Range
        </Button>
      </PopoverClose>
    </div>
  );
};

// Helper functions
function getInitialCustomRange(timeRange: TimeRange): CustomTimeRange {
  const start = dayjs(timeRange.startTime);
  const end = dayjs(timeRange.endTime);

  return {
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
    startHour: start.hour(),
    startMinute: start.minute(),
    endHour: end.hour(),
    endMinute: end.minute(),
  };
}

function buildISORange(customRange: CustomTimeRange): {
  startTime: string;
  endTime: string;
} {
  const start = dayjs(
    `${customRange.startDate}T${customRange.startHour.toString().padStart(2, "0")}:${customRange.startMinute.toString().padStart(2, "0")}:00`,
  );
  const end = dayjs(
    `${customRange.endDate}T${customRange.endHour.toString().padStart(2, "0")}:${customRange.endMinute.toString().padStart(2, "0")}:00`,
  );

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

function formatDateRange(startTime: string, endTime: string): string {
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  const startStr = start.format("MMM D, HH:mm");
  const endStr =
    start.isSame(end, "day")
      ? end.format("HH:mm")
      : end.format("MMM D, HH:mm");

  return `${startStr} - ${endStr}`;
}

export default TimeRangeSelector;
