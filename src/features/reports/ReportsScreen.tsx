import ComingSoon from "@/components/shared/ComingSoon";
import { TrendingUp } from "lucide-react";

const ReportsScreen = () => {
  return (
    <ComingSoon
      title="Reports"
      subtitle="Powerful reporting tools are coming"
      description="Generate detailed reports on sales, inventory, customer behavior, and more. Export data in multiple formats and schedule automated reports."
      icon={TrendingUp}
    />
  );
};

export default ReportsScreen;
