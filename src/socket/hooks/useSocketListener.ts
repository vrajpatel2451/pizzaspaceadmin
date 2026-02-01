import { useEffect, useCallback } from "react";
import { socketService } from "../SocketService";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "@/components/compound/Sonner";
import type { SocketNotificationPayload } from "../types";
import type { NotificationCategory } from "@/firebase/types";
import { logger } from "@/logger/core";

export const useSocketListener = () => {
  const { getCallbackForCategory, shouldRefetchCurrentScreen } =
    useNotificationStore();

  const handleNotification = useCallback(
    (payload: SocketNotificationPayload) => {
      const { title, body, category } = payload;

      logger.info("Socket: Processing notification", {
        category,
        title,
        component: "useSocketListener",
        feature: "socket",
      });

      // Show toast notification
      if (title) {
        toast.info(title, {
          description: body,
        });
      }

      // Check if current screen should refetch
      const notificationCategory = category as NotificationCategory;
      if (
        notificationCategory &&
        shouldRefetchCurrentScreen(notificationCategory)
      ) {
        const callback = getCallbackForCategory(notificationCategory);
        if (callback) {
          logger.info("Socket: Triggering screen refetch", {
            category,
            component: "useSocketListener",
            feature: "socket",
          });
          callback();
        }
      }
    },
    [getCallbackForCategory, shouldRefetchCurrentScreen],
  );

  useEffect(() => {
    socketService.setNotificationHandler(handleNotification);

    return () => {
      socketService.setNotificationHandler(null);
    };
  }, [handleNotification]);
};
