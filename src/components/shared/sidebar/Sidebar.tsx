import { useToggle } from "@/hooks/useToggle";
import { usePermissions } from "@/hooks/usePermissions";
import { routeHandler } from "@/routes/routeHendler";
import { cn } from "@/utils/helpers";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { sidebarStateUtil } from "../utils/sidebarUtil";
import type { NavItemTypes } from "./NavItem";
import NavItem from "./NavItem";
import { filterNavItemsByRole } from "@/constants/navItems";

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { navItems } = props;
  const [isExpanded, setIsExpanded] = useState("");
  const { role } = usePermissions();

  // Filter navigation items based on user role
  const filteredNavItems = useMemo(() => {
    if (!role) return [];
    return filterNavItemsByRole(navItems, role);
  }, [navItems, role]);

  const initialCollapsed = sidebarStateUtil.getCollapsedState();
  const { isOpen, toggle, open } = useToggle(initialCollapsed !== false);

  const onNavClick = (label: string) => {
    if (!isOpen) {
      open();
      sidebarStateUtil.saveCollapsedState(!isOpen);
    }

    if (isExpanded === label) {
      setIsExpanded("");
    } else {
      setIsExpanded(label);
    }
  };
  const { pathname } = useLocation();

  useEffect(() => {
    const activeParent = filteredNavItems.find((parent) =>
      parent.children?.some(
        (child) =>
          "path" in child && routeHandler.isCurrentRoute(child.path, pathname),
      ),
    )?.label;

    setIsExpanded(activeParent || "");
  }, [filteredNavItems, pathname]);

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded("");
    }
  }, [isOpen]);

  const handleSidebarCollapseToggle = () => {
    toggle();
    setIsExpanded("");
    sidebarStateUtil.saveCollapsedState(!isOpen);

    if (!isOpen) {
      const activeParent = filteredNavItems.find((parent) =>
        parent.children?.some(
          (child) =>
            "path" in child &&
            routeHandler.isCurrentRoute(child.path, pathname),
        ),
      )?.label;

      setIsExpanded(activeParent || "");
    }
  };

  return (
    <div
      className={cn(
        isOpen ? "w-64" : "w-[67px]",
        "border-r-nl-200 dark:border-r-nd-600 relative flex shrink-0 flex-col gap-y-2 border-r px-3 py-1.5 transition-all duration-300 ease-in-out",
      )}
    >
      <div className="mb-1 flex h-14 p-3">
        <h5 className="text-pl-600 dark:text-pd-200 font-bold">PS</h5>
      </div>
      {filteredNavItems?.map((item, index) => (
        <NavItem
          key={index}
          isExpanded={item.label === isExpanded}
          item={item}
          onClick={() => onNavClick(item.label)}
          isSidebarCollapsed={!isOpen}
        />
      ))}
      <button
        onClick={handleSidebarCollapseToggle}
        className="border-nl-200 dark:bg-nd-900 dark:border-nd-500 fall hover:bg-nl-50 hover:dark:bg-nd-700 absolute top-1/2 -right-2.5 z-20 size-5 -translate-y-1/2 cursor-pointer rounded-full border bg-white transition-colors"
      >
        <ChevronRight
          size={16}
          className={cn(
            "dark:text-nd-300 text-nl-200 transition-transform",
            isOpen ? "-scale-x-100" : "scale-x-100",
            "text-nl-400",
          )}
        />
      </button>
    </div>
  );
};

export default Sidebar;

interface SidebarProps {
  navItems: NavItemTypes[];
}
