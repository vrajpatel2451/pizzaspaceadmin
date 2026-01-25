import { cn } from "@/utils/helpers";
import type { ReportType } from "@/types/analytics.types";
import type { FC } from "react";
import { REPORT_TABS } from "../constants/reportTabs";

interface ReportTabsProps {
  activeTab: ReportType;
  onTabChange: (tab: ReportType) => void;
}

const ReportTabs: FC<ReportTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
      {REPORT_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-white text-orange-600 shadow-sm dark:bg-slate-700 dark:text-orange-400"
                : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReportTabs;
