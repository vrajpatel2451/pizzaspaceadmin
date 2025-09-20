import { cn } from "@/utils/helpers";
import { AlertTriangle, CircleCheck, Info, X, XCircle } from "lucide-react";
import React from "react";

interface CustomToastProps {
  type: "success" | "error" | "warning" | "info" | "default";
  message: string;
  description?: string;
  onClose: () => void;
  allowDismiss?: boolean;
  showIcons?: boolean;
}

const bgColorMap = {
  success: "bg-green-50",
  error: "bg-red-50",
  warning: "bg-orange-50",
  info: "bg-blue-50",
  default: "bg-gray-50",
};

const textColorMap = {
  success: "text-green-800",
  error: "text-red-800",
  warning: "text-orange-600",
  info: "text-blue-600",
  default: "text-gray-600",
};

const borderColorMap = {
  success: "border-green-400",
  error: "border-red-200",
  warning: "border-orange-200",
  info: "border-blue-200",
  default: "border-gray-300",
};

const iconMap = {
  success: <CircleCheck className={textColorMap["success"]} size={20} />,
  error: <XCircle className={textColorMap["error"]} size={20} />,
  warning: <AlertTriangle className={textColorMap["warning"]} size={20} />,
  info: <Info className={textColorMap["info"]} size={20} />,
  default: null as any,
};

const CustomToast: React.FC<CustomToastProps> = ({
  type,
  message,
  description,
  onClose,
  allowDismiss = true,
  showIcons = false,
}) => {
  return (
    <div
      className={cn(
        `w-full max-w-lg min-w-[350px] rounded-xl border p-4 shadow-2xs dark:shadow`,
        bgColorMap[type],
        borderColorMap[type],
      )}
    >
      <div className="flex items-center gap-3">
        {showIcons && iconMap[type]}
        <div className="flex-1">
          <p className={cn("text-base !font-medium", textColorMap[type])}>
            {message}
          </p>
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
        {allowDismiss && (
          <div
            className={cn(
              "cursor-pointer rounded-full p-1 transition-all hover:brightness-160",
              bgColorMap[type],
            )}
            onClick={onClose}
          >
            <X size={16} className={cn(textColorMap[type])} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomToast;
