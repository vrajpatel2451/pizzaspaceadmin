import ScreenContainer from "@/components/shared/ScreenContainer";
import {
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  TrendingUp,
} from "lucide-react";

interface ReportCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100">
        <Icon className="h-6 w-6 text-orange-500" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
};

const reportTypes: ReportCardProps[] = [
  {
    icon: BarChart3,
    title: "Sales Report",
    description: "Track daily, weekly, and monthly sales performance with detailed breakdowns.",
  },
  {
    icon: PieChart,
    title: "Product Analysis",
    description: "Analyze best-selling products, categories, and inventory turnover rates.",
  },
  {
    icon: LineChart,
    title: "Revenue Trends",
    description: "Monitor revenue trends over time with forecasting and growth analysis.",
  },
  {
    icon: FileText,
    title: "Customer Reports",
    description: "Insights into customer behavior, retention rates, and ordering patterns.",
  },
];

const ReportsScreen = () => {
  return (
    <ScreenContainer>
      {/* Coming Soon Banner */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <TrendingUp className="h-7 w-7 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Powerful Reporting Tools Coming Soon
            </h2>
            <p className="mt-1 text-slate-600">
              We're building comprehensive reporting features to help you make data-driven decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Report Types Preview */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Upcoming Report Features
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reportTypes.map((report, index) => (
            <ReportCard
              key={index}
              icon={report.icon}
              title={report.title}
              description={report.description}
            />
          ))}
        </div>
      </div>

      {/* Placeholder Chart Area */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-800">Report Preview</h3>
        <p className="mt-2 text-sm text-slate-500">
          Interactive charts and exportable reports will be available here
        </p>
        <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-slate-50">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-400">Charts and Analytics Coming Soon</p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default ReportsScreen;
