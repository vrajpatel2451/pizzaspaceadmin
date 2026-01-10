import { cn } from "@/utils/helpers";
import { Pizza } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
  variant?: "light" | "dark";
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, variant = "light" }) => {
  const textColor = variant === "dark" ? "text-white" : "text-orange-600";

  if (collapsed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
        <Pizza className="h-6 w-6 text-white" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
        <Pizza className="h-6 w-6 text-white" />
      </div>
      <span className={cn("text-lg font-bold", textColor)}>Pizza Space</span>
    </div>
  );
};

export default Logo;
