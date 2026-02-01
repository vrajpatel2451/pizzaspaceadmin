import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { CATEGORY_TO_ROUTE } from "../types";
import { logger } from "@/logger/core";
import { useNavigate } from "react-router-dom";

export const useFCMListener = () => {
  const navigate = useNavigate();
  const { getCallbackForCategory } = useNotificationStore();

  // Handle background notification clicks (from service worker)
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_CLICK") {
        const { category, targetUrl } = event.data;

        logger.info("FCM: Handling background notification click", {
          category,
          targetUrl,
          component: "useFCMListener",
          feature: "fcm",
        });

        navigate(targetUrl);

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
      handleServiceWorkerMessage,
    );
    return () => {
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    };
  }, [navigate, getCallbackForCategory]);
};

export { CATEGORY_TO_ROUTE };
