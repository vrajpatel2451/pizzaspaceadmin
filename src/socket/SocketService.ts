import { io, type Socket } from "socket.io-client";
import { LocalStorageUtil } from "@/utils/localStorageUtil";
import { logger } from "@/logger/core";
import {
  NOTIFICATION_CHANNELS,
  type SocketNotificationPayload,
} from "./types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

type NotificationHandler = (payload: SocketNotificationPayload) => void;

class SocketService {
  private socket: Socket | null = null;
  private notificationHandler: NotificationHandler | null = null;

  connect(): void {
    if (!SOCKET_URL) {
      logger.warn("Socket: VITE_SOCKET_URL not configured, skipping", {
        component: "SocketService",
        feature: "socket",
      });
      return;
    }

    // If a socket instance already exists (connected or reconnecting), skip
    if (this.socket) {
      logger.info("Socket: Connection already exists", {
        component: "SocketService",
        feature: "socket",
        connected: this.socket.connected,
      });
      return;
    }

    const token = LocalStorageUtil.getItem("staff_access_token");
    if (!token) {
      logger.warn("Socket: No auth token available, skipping connection", {
        component: "SocketService",
        feature: "socket",
      });
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    });

    this.setupConnectionListeners();
    this.subscribeToChannels();
  }

  disconnect(): void {
    if (this.socket) {
      // Remove manager-level listeners (reconnect, reconnect_attempt)
      this.socket.io.removeAllListeners();
      // Remove socket-level listeners (connect, disconnect, channels)
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear the notification handler to prevent stale closures
    this.notificationHandler = null;

    logger.info("Socket: Disconnected and cleaned up", {
      component: "SocketService",
      feature: "socket",
    });
  }

  setNotificationHandler(handler: NotificationHandler | null): void {
    this.notificationHandler = handler;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private setupConnectionListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      logger.info("Socket: Connected", {
        component: "SocketService",
        feature: "socket",
      });
    });

    this.socket.on("disconnect", (reason) => {
      logger.info("Socket: Disconnected by server/network", {
        component: "SocketService",
        feature: "socket",
        reason,
      });

      // If the server forced the disconnect, don't auto-reconnect
      // "io server disconnect" means the server explicitly closed the connection
      if (reason === "io server disconnect") {
        logger.warn("Socket: Server forced disconnect, destroying connection", {
          component: "SocketService",
          feature: "socket",
        });
        this.destroySocket();
      }
    });

    this.socket.on("connect_error", (error) => {
      logger.error("Socket: Connection error", error, {
        component: "SocketService",
        feature: "socket",
      });
    });

    this.socket.io.on("reconnect", (attempt) => {
      logger.info("Socket: Reconnected", {
        component: "SocketService",
        feature: "socket",
        attempt,
      });
    });

    this.socket.io.on("reconnect_attempt", (attempt) => {
      // Refresh auth token on reconnection (may have been refreshed)
      const token = LocalStorageUtil.getItem("staff_access_token");
      if (token && this.socket) {
        this.socket.auth = { token };
      }
      logger.debug("Socket: Reconnection attempt", {
        component: "SocketService",
        feature: "socket",
        attempt,
      });
    });
  }

  private subscribeToChannels(): void {
    if (!this.socket) return;

    for (const channel of NOTIFICATION_CHANNELS) {
      this.socket.on(
        channel as string,
        (payload: SocketNotificationPayload) => {
          logger.info("Socket: Notification received", {
            component: "SocketService",
            feature: "socket",
            channel,
            title: payload.title,
          });

          if (this.notificationHandler) {
            this.notificationHandler(payload);
          }
        },
      );
    }
  }

  /**
   * Destroys the socket instance without clearing the notification handler.
   * Used when the server forces a disconnect — the handler stays intact
   * so the provider can re-establish the connection if still logged in.
   */
  private destroySocket(): void {
    if (this.socket) {
      this.socket.io.removeAllListeners();
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
