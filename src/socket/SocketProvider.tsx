import { useEffect, useRef, type FC, type ReactNode } from "react";
import { useAppSelector } from "@/store";
import { socketService } from "./SocketService";
import { useSocketListener } from "./hooks/useSocketListener";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketListenerComponent: FC = () => {
  useSocketListener();
  return null;
};

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  // Track intended connection state to handle StrictMode and rapid toggles
  const shouldBeConnected = useRef(false);

  useEffect(() => {
    if (isLoggedIn) {
      shouldBeConnected.current = true;
      socketService.connect();
    } else {
      shouldBeConnected.current = false;
      socketService.disconnect();
    }

    return () => {
      // Only disconnect on cleanup if we're not supposed to be connected.
      // This prevents StrictMode double-mount from killing a valid connection:
      // Mount(connect) → Cleanup(disconnect) → Mount(connect) would flash-disconnect.
      // With the ref guard: Mount(connect) → Cleanup(ref=true, skip) → Mount(ref=true, no-op).
      if (!shouldBeConnected.current) {
        socketService.disconnect();
      }
    };
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn && <SocketListenerComponent />}
      {children}
    </>
  );
};
