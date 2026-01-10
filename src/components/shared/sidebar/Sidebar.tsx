import { useToggle } from "@/hooks/useToggle";
import { usePermissions } from "@/hooks/usePermissions";
import { routeHandler } from "@/routes/routeHendler";
import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { sidebarStateUtil } from "../utils/sidebarUtil";
import type { NavItemTypes } from "./NavItem";
import NavItem from "./NavItem";
import {
  GROUPED_NAV_ITEMS,
  filterGroupedNavItemsByRole,
  type NavGroup,
} from "@/constants/navItems";
import Logo from "../Logo";
import UserProfileSection from "./UserProfileSection";
import LogoutDialog from "../LogoutDialog";

const Sidebar: React.FC<SidebarProps> = () => {
  const [isExpanded, setIsExpanded] = useState("");
  const { role } = usePermissions();
  const { close, isOpen: isLogoutOpen, open: openLogout } = useToggle();

  // Filter navigation groups based on user role
  const filteredNavGroups = useMemo(() => {
    if (!role) return [];
    return filterGroupedNavItemsByRole(GROUPED_NAV_ITEMS, role);
  }, [role]);

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

  // Find active parent across all groups
  const findActiveParent = useCallback(
    (groups: NavGroup[]): string | undefined => {
      for (const group of groups) {
        const activeParent = group.items.find((parent) =>
          parent.children?.some(
            (child) =>
              "path" in child &&
              routeHandler.isCurrentRoute(child.path, pathname)
          )
        );
        if (activeParent) return activeParent.label;
      }
      return undefined;
    },
    [pathname]
  );

  useEffect(() => {
    const activeParent = findActiveParent(filteredNavGroups);
    setIsExpanded(activeParent || "");
  }, [filteredNavGroups, findActiveParent]);

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
      const activeParent = findActiveParent(filteredNavGroups);
      setIsExpanded(activeParent || "");
    }
  };

  return (
    <>
      <div
        className={cn(
          isOpen ? "w-64" : "w-[72px]",
          "relative flex h-full shrink-0 flex-col bg-slate-900 transition-all duration-300 ease-in-out"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 shrink-0 items-center border-b border-slate-700/50 px-4">
          <Logo collapsed={!isOpen} variant="dark" />
        </div>

        {/* User Profile Section */}
        <div className="shrink-0 border-b border-slate-700/50 px-3 py-4">
          <UserProfileSection collapsed={!isOpen} onLogoutClick={openLogout} />
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-3">
          {filteredNavGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {/* Group Header */}
              {isOpen && (
                <div className="mb-2 px-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {group.group}
                  </span>
                </div>
              )}
              {/* Group Items */}
              <div className="flex flex-col gap-y-1">
                {group.items.map((item, itemIndex) => (
                  <NavItem
                    key={itemIndex}
                    isExpanded={item.label === isExpanded}
                    item={item}
                    onClick={() => onNavClick(item.label)}
                    isSidebarCollapsed={!isOpen}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle Button */}
        <button
          onClick={handleSidebarCollapseToggle}
          className="absolute top-1/2 -right-3 z-20 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-800 transition-colors hover:bg-slate-700"
        >
          {isOpen ? (
            <ChevronLeft size={14} className="text-slate-400" />
          ) : (
            <ChevronRight size={14} className="text-slate-400" />
          )}
        </button>
      </div>
      <LogoutDialog isOpen={isLogoutOpen} close={close} />
    </>
  );
};

export default Sidebar;

interface SidebarProps {
  navItems?: NavItemTypes[];
}
