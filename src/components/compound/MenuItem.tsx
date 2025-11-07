import * as LucideIcons from "lucide-react";
import { PopoverClose } from "./Popover";
import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  children: ReactNode;
  onClick?: (e?: any) => void;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
  disableClosePopoverOnClick?: boolean;
  to?: string;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const {
    children,
    onClick,
    to,
    endIcon,
    startIcon,
    disableClosePopoverOnClick = false,
  } = props;

  const StartIcon = startIcon
    ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
    : null;
  const EndIcon = endIcon
    ? (LucideIcons[endIcon] as LucideIcons.LucideIcon)
    : null;

  const content = (
    <div className="hover:bg-nl-100/70 hover:dark:bg-nd-500/70 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors">
      {StartIcon && <StartIcon className={cn(iconClassName)} />}
      <p className="text-nl-700 dark:text-nd-100">{children}</p>
      {EndIcon && <EndIcon className={cn(iconClassName)} />}
    </div>
  );

  if (disableClosePopoverOnClick) {
    return <div>{content}</div>;
  }

  if (to) {
    return (
      <PopoverClose asChild>
        <Link to={to}>{content}</Link>
      </PopoverClose>
    );
  }

  return (
    <PopoverClose onClick={onClick} asChild>
      {content}
    </PopoverClose>
  );
};

const iconClassName = `dark:text-nd-100 text-nl-600 h-4 w-4 shrink-0 stroke-2`;

export default MenuItem;
