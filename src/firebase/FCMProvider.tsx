import { useEffect, type FC, type ReactNode } from "react";
import { useFCMToken } from "./hooks/useFCMToken";
import { useFCMListener } from "./hooks/useFCMListener";
import { useAppSelector } from "@/store";

interface FCMProviderProps {
  children: ReactNode;
}

const FCMListenerComponent: FC = () => {
  useFCMListener();
  return null;
};

export const FCMProvider: FC<FCMProviderProps> = ({ children }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { initializeFCM, fcmToken } = useFCMToken();

  // Initialize FCM when user logs in (if not already initialized)
  useEffect(() => {
    if (isLoggedIn && !fcmToken) {
      initializeFCM();
    }
  }, [isLoggedIn, fcmToken, initializeFCM]);

  return (
    <>
      {isLoggedIn && <FCMListenerComponent />}
      {children}
    </>
  );
};
