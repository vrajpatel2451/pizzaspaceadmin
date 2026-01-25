import type { ReportType } from "@/types/analytics.types";
import { Building2, Truck, Users, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ReportTab {
  id: ReportType;
  label: string;
  icon: LucideIcon;
  defaultSortBy: string;
  sortOptions: { value: string; label: string }[];
}

export const REPORT_TABS: ReportTab[] = [
  {
    id: "stores",
    label: "Stores",
    icon: Building2,
    defaultSortBy: "revenue",
    sortOptions: [
      { value: "revenue", label: "Revenue" },
      { value: "orders", label: "Orders" },
    ],
  },
  {
    id: "delivery-boys",
    label: "Delivery Boys",
    icon: Truck,
    defaultSortBy: "ordersCompleted",
    sortOptions: [
      { value: "ordersCompleted", label: "Orders Completed" },
      { value: "averageRatings", label: "Average Rating" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    defaultSortBy: "purchase",
    sortOptions: [
      { value: "purchase", label: "Total Spent" },
      { value: "orders", label: "Orders" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    defaultSortBy: "orderCount",
    sortOptions: [{ value: "orderCount", label: "Order Count" }],
  },
];

export const getReportTabById = (id: ReportType): ReportTab | undefined => {
  return REPORT_TABS.find((tab) => tab.id === id);
};

export const DEFAULT_REPORT_TAB: ReportType = "stores";
