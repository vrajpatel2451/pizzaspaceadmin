import { useEffect, useCallback } from "react";
import { onMessage, type MessagePayload } from "firebase/messaging";
import { getMessagingInstance } from "../config";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "@/components/compound/Sonner";
import type { NotificationCategory, FCMNotificationPayload } from "../types";
import { CATEGORY_TO_ROUTE } from "../types";
import { logger } from "@/logger/core";
import { useNavigate } from "react-router-dom";

export const useFCMListener = () => {
  const navigate = useNavigate();
  const { getCallbackForCategory, shouldRefetchCurrentScreen } =
    useNotificationStore();

  const handleNotification = useCallback(
    (payload: MessagePayload) => {
      const { notification, data } =
        payload as unknown as FCMNotificationPayload;
      const category = data?.category as NotificationCategory;

      logger.info("FCM: Foreground notification received", {
        category,
        title: notification?.title,
        component: "useFCMListener",
        feature: "fcm",
      });

      // Show toast notification
      if (notification?.title) {
        toast.info(notification.title, {
          description: notification.body,
        });
      }

      // Check if current screen should refetch
      if (category && shouldRefetchCurrentScreen(category)) {
        const callback = getCallbackForCategory(category);
        if (callback) {
          logger.info("FCM: Triggering screen refetch", {
            category,
            component: "useFCMListener",
            feature: "fcm",
          });
          callback();
        }
      }
    },
    [getCallbackForCategory, shouldRefetchCurrentScreen]
  );

  // Handle background notification clicks (from service worker)
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_CLICK") {
        const { category, targetUrl } = event.data;

        logger.info("FCM: Handling notification click", {
          category,
          targetUrl,
          component: "useFCMListener",
          feature: "fcm",
        });

        // Navigate to the target route
        navigate(targetUrl);

        // Trigger refetch after navigation with a small delay
        setTimeout(() => {
          const callback = getCallbackForCategory(category);
          if (callback) {
            callback();
          }
        }, 100);
      }
    };

    navigator.serviceWorker?.addEventListener(
      "message",
      handleServiceWorkerMessage
    );
    return () => {
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [navigate, getCallbackForCategory]);

  // Set up foreground message listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      const messaging = await getMessagingInstance();
      if (messaging) {
        unsubscribe = onMessage(messaging, handleNotification);
        logger.info("FCM: Foreground message listener set up", {
          component: "useFCMListener",
          feature: "fcm",
        });
      }
    };

    setupListener();

    return () => {
      unsubscribe?.();
    };
  }, [handleNotification]);
};

export { CATEGORY_TO_ROUTE };
