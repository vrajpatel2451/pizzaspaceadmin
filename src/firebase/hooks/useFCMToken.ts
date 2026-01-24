import { useCallback, useEffect } from "react";
import { getToken, deleteToken } from "firebase/messaging";
import { getMessagingInstance, getFirebaseConfig } from "../config";
import { useNotificationStore } from "@/store/notificationStore";
import { logger } from "@/logger/core";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const useFCMToken = () => {
  const {
    fcmToken,
    tokenError,
    isTokenLoading,
    permissionStatus,
    setFcmToken,
    setTokenError,
    setTokenLoading,
    setPermissionStatus,
  } = useNotificationStore();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      return permission === "granted";
    } catch (error) {
      logger.error(
        "FCM: Permission request failed",
        error instanceof Error ? error : new Error(String(error)),
        { component: "useFCMToken", feature: "fcm" }
      );
      return false;
    }
  }, [setPermissionStatus]);

  const fetchToken = useCallback(async (): Promise<string | null> => {
    setTokenLoading(true);
    setTokenError(null);

    try {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        setTokenError("Messaging not supported");
        setTokenLoading(false);
        return null;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Get the active service worker (handle installing/waiting states)
      const serviceWorker =
        registration.active || registration.waiting || registration.installing;

      if (serviceWorker) {
        // If not yet active, wait for it to activate
        if (serviceWorker.state !== "activated") {
          await new Promise<void>((resolve) => {
            serviceWorker.addEventListener("statechange", function handler() {
              if (serviceWorker.state === "activated") {
                serviceWorker.removeEventListener("statechange", handler);
                resolve();
              }
            });
            // Also resolve if already activated
            if (serviceWorker.state === "activated") {
              resolve();
            }
          });
        }

        // Send config to service worker
        const activeWorker = registration.active;
        if (activeWorker) {
          activeWorker.postMessage({
            type: "FIREBASE_CONFIG",
            config: getFirebaseConfig(),
          });

          // Small delay to ensure service worker processes the config
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      setFcmToken(token);
      setTokenLoading(false);

      logger.info("FCM: Token obtained successfully", {
        component: "useFCMToken",
        feature: "fcm",
        tokenLength: token.length,
      });

      return token;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get FCM token";
      setTokenError(errorMessage);
      setTokenLoading(false);
      logger.error(
        "FCM: Token fetch failed",
        error instanceof Error ? error : new Error(String(error)),
        { component: "useFCMToken", feature: "fcm" }
      );
      return null;
    }
  }, [setFcmToken, setTokenError, setTokenLoading]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const messaging = await getMessagingInstance();
      if (messaging && fcmToken) {
        await deleteToken(messaging);
      }
      return await fetchToken();
    } catch (error) {
      logger.error(
        "FCM: Token refresh failed",
        error instanceof Error ? error : new Error(String(error)),
        { component: "useFCMToken", feature: "fcm" }
      );
      return null;
    }
  }, [fcmToken, fetchToken]);

  const initializeFCM = useCallback(async (): Promise<string | null> => {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      setTokenError("Notifications not supported in this browser");
      return null;
    }

    // Check if service workers are supported
    if (!("serviceWorker" in navigator)) {
      setTokenError("Service workers not supported in this browser");
      return null;
    }

    // Check/request permission
    if (Notification.permission === "denied") {
      setPermissionStatus("denied");
      setTokenError(
        "Notification permission denied. Please enable notifications in your browser settings."
      );
      return null;
    }

    if (Notification.permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        setTokenError("Notification permission not granted");
        return null;
      }
    }

    setPermissionStatus("granted");
    return await fetchToken();
  }, [fetchToken, requestPermission, setPermissionStatus, setTokenError]);

  // Check initial permission status
  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [setPermissionStatus]);

  return {
    fcmToken,
    tokenError,
    isTokenLoading,
    permissionStatus,
    initializeFCM,
    refreshToken,
    requestPermission,
  };
};
