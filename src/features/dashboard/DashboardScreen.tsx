import ScreenContainer from "@/components/shared/ScreenContainer";
import {
  ShoppingBag,
  PoundSterling,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

// Mock data for demonstration
const statsData: StatCardProps[] = [
  {
    icon: ShoppingBag,
    label: "Today's Orders",
    value: "47",
    trend: { value: "+12%", isPositive: true },
  },
  {
    icon: PoundSterling,
    label: "Revenue",
    value: "£1,284.50",
    trend: { value: "+8.2%", isPositive: true },
  },
  {
    icon: Users,
    label: "New Customers",
    value: "12",
    trend: { value: "+5%", isPositive: true },
  },
  {
    icon: Clock,
    label: "Pending Orders",
    value: "8",
    trend: { value: "-3%", isPositive: false },
  },
];

const DashboardScreen = () => {
  return (
    <ScreenContainer>
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Placeholder sections for future content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-800">Recent Orders</h3>
          <p className="mt-2 text-sm text-slate-500">
            Order activity chart coming soon
          </p>
          <div className="mt-6 flex h-48 items-center justify-center rounded-lg bg-slate-50">
            <p className="text-slate-400">Chart Placeholder</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-800">Popular Items</h3>
          <p className="mt-2 text-sm text-slate-500">
            Top selling products will appear here
          </p>
          <div className="mt-6 flex h-48 items-center justify-center rounded-lg bg-slate-50">
            <p className="text-slate-400">Items Placeholder</p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default DashboardScreen;
