import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNotificationStore } from "@/store/notificationStore";
import type {
  NotificationCategory,
  ScreenRefetchCallback,
} from "@/firebase/types";

interface UseScreenNotificationOptions {
  categories: NotificationCategory[];
  onReset: ScreenRefetchCallback;
}

export const useScreenNotification = (
  options: UseScreenNotificationOptions
) => {
  const { categories, onReset } = options;
  const { pathname } = useLocation();
  const { registerScreen, unregisterScreen, setCurrentRoute } =
    useNotificationStore();

  // Use ref to avoid re-registering on every onReset change
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  // Use ref for categories to maintain stable reference
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  useEffect(() => {
    // Update current route
    setCurrentRoute(pathname);

    // Register screen with stable callback wrapper
    registerScreen({
      route: pathname,
      categories: categoriesRef.current,
      onReset: () => onResetRef.current(),
    });

    return () => {
      unregisterScreen(pathname);
    };
  }, [pathname, registerScreen, unregisterScreen, setCurrentRoute]);
};
