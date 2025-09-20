import { routeHandler } from "@/routes/routeHendler";
import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem: React.FC<NavItemProps> = (props) => {
  const { isExpanded, isSidebarCollapsed, item, onClick } = props;

  const contentRef = useRef<HTMLDivElement>(null);

  const NavItemIcon = item.icon
    ? (LucideIcons[item.icon] as LucideIcons.LucideIcon)
    : null;

  const hasChildren = item.children && item.children.length > 0;
  const { pathname } = useLocation();
  const isActive =
    "path" in item && routeHandler.isCurrentRoute(item.path, pathname);
  return (
    <div>
      {"path" in item ? (
        <Link
          to={item.path}
          // activeProps={{
          //   className: activeLinkClasses,
          // }}
          className={isActive ? activeLinkClasses : undefined}

          // activeOptions={{
          //   exact: true,
          // }}
        >
          <ItemContent
            NavItemIcon={NavItemIcon}
            hasChildren={Boolean(hasChildren)}
            isExpanded={isExpanded}
            item={item}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </Link>
      ) : (
        <ItemContent
          NavItemIcon={NavItemIcon}
          hasChildren={Boolean(hasChildren)}
          isExpanded={isExpanded}
          item={item}
          isSidebarCollapsed={isSidebarCollapsed}
          onClick={onClick}
        />
      )}

      {hasChildren && (
        <div
          className="ml-9 overflow-hidden transition-all duration-200 ease-in-out"
          style={{
            maxHeight: isExpanded
              ? `${contentRef.current?.scrollHeight || 1000}px`
              : "0px",
          }}
        >
          <div ref={contentRef} className="flex flex-col gap-y-1 py-1">
            {item?.children?.map((item, index) => (
              <NavItem
                key={index}
                isSidebarCollapsed={isSidebarCollapsed}
                item={item}
                isExpanded={isExpanded}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;

interface ItemContentProps {
  onClick?: () => void;
  NavItemIcon: LucideIcons.LucideIcon | null;
  hasChildren: boolean;
  isExpanded: boolean;
  item: NavItemTypes;
  isSidebarCollapsed: boolean;
}

const ItemContent: React.FC<ItemContentProps> = (props) => {
  const {
    NavItemIcon,
    hasChildren,
    isExpanded,
    onClick,
    item,
    isSidebarCollapsed,
  } = props;
  const { pathname } = useLocation();

  const activeParentLabel =
    item.children &&
    item.children.find(
      (e) => "path" in e && routeHandler.isCurrentRoute(e.path, pathname),
    );

  return (
    <div
      className={cn(
        "hover:dark:bg-nd-700 hover:bg-nl-100/60 relative flex cursor-pointer items-center gap-x-4 rounded-lg bg-inherit px-3 py-2 transition-colors ease-in-out",
        hasChildren &&
          activeParentLabel &&
          isSidebarCollapsed &&
          activeParentDotClasses,
      )}
      data-bg
      onClick={onClick}
    >
      {NavItemIcon && (
        <NavItemIcon
          data-icon
          className={cn(
            hasChildren && activeParentLabel
              ? labelClasses.active
              : labelClasses.default,
            "!h-[18px] !w-[18px] shrink-0 stroke-2",
          )}
        />
      )}
      <div
        className={cn(
          "flex w-full items-center transition-all duration-300",
          isSidebarCollapsed ? "wipe-out" : "wipe-in",
        )}
      >
        <p
          className={cn(
            "text-nowrap",
            hasChildren && activeParentLabel
              ? labelClasses.active
              : labelClasses.default,
            labelClasses.base,
            hasChildren ? "!text-[15px]" : "!text-sm",
          )}
          data-text
        >
          {item?.label}
        </p>
        {hasChildren && (
          <span className="ml-auto">
            <div
              className={cn(
                "transition-transform duration-300 ease-in-out",
                isExpanded ? "-scale-y-100" : "scale-y-100",
              )}
            >
              <LucideIcons.ChevronDown className="text-nl-500 dark:text-nd-300 size-4 shrink-0" />
            </div>
          </span>
        )}
      </div>
    </div>
  );
};

const activeLinkClasses =
  "**:data-bg:bg-pl-50 **:data-bg:dark:bg-pd-500 **:data-text:text-pl-500 **:data-text:dark:text-white **:data-icon:text-pl-500 **:data-icon:dark:text-white";
const labelClasses = {
  base: "font-medium",
  active: "text-pl-600 dark:text-white",
  default: "text-nl-600 dark:text-nd-200/70",
};

const activeParentDotClasses =
  "after:bg-pl-500 dark:after:border-nd-900 dark:after:bg-pd-300 relative after:absolute after:top-1/2 after:-right-[18.5px] after:size-3 after:-translate-y-1/2 after:rounded-full after:border-[3px] after:border-white after:content-['']";

interface NavItemProps {
  item: NavItemTypes;
  isSidebarCollapsed: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export type NavItemTypes = {
  label: string;
  icon?: keyof typeof LucideIcons;
} & (
  | { path: string; children?: NavItemTypes[] }
  | { children?: NavItemTypes[] }
);
