import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/utils/helpers";

interface ListItemProps {
  label: string;
  value: ReactNode;
  startIcon?: keyof typeof LucideIcons;
  iconClassName?: string;
  classname?: string;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { label, value, startIcon, classname, iconClassName } = props;
  const StartIcon = startIcon
    ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
    : null;

  return (
    <div className={cn("flex items-center gap-x-2", classname)}>
      {StartIcon && (
        <StartIcon className={cn(iconClassName)} strokeWidth={1.6} size={16} />
      )}
      <p className="text-nl-500 dark:text-nd-300"> {label}: </p>
      {typeof value === "string" || typeof value === "number" ? (
        <p className="text-nl-700 dark:text-nd-100 font-medium"> {value} </p>
      ) : (
        value
      )}
    </div>
  );
};
