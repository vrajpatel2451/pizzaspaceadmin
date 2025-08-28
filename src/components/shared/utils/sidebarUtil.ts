const SIDEBAR_COLLAPSED_KEY = "is-sidebar-collapsed";

export const sidebarStateUtil = {
  saveCollapsedState(isCollapsed: boolean): void {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isCollapsed));
  },

  getCollapsedState(): boolean | null {
    const storedValue = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (storedValue === null) return null;

    try {
      const parsed = JSON.parse(storedValue);
      return typeof parsed === "boolean" ? parsed : null;
    } catch {
      return null;
    }
  },

  clearCollapsedState(): void {
    localStorage.removeItem(SIDEBAR_COLLAPSED_KEY);
  },
};
