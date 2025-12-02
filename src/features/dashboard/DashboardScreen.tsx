import ComingSoon from "@/components/shared/ComingSoon";
import { LayoutDashboard } from "lucide-react";

const DashboardScreen = () => {
  return (
    <ComingSoon
      title="Dashboard"
      subtitle="Your analytics hub is on the way"
      description="Get real-time insights into your business performance with comprehensive analytics, charts, and key metrics all in one place."
      icon={LayoutDashboard}
    />
  );
};

export default DashboardScreen;
