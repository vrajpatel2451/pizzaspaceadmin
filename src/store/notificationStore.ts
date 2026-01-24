import { create } from "zustand";
import type {
  NotificationCategory,
  ScreenRegistration,
  ScreenRefetchCallback,
} from "@/firebase/types";

interface NotificationState {
  // Screen registrations
  registeredScreens: Map<string, ScreenRegistration>;
  currentRoute: string;

  // FCM token
  fcmToken: string | null;
  tokenError: string | null;
  isTokenLoading: boolean;

  // Permission state
  permissionStatus: NotificationPermission;

  // Actions
  registerScreen: (registration: ScreenRegistration) => void;
  unregisterScreen: (route: string) => void;
  setCurrentRoute: (route: string) => void;
  setFcmToken: (token: string | null) => void;
  setTokenError: (error: string | null) => void;
  setTokenLoading: (loading: boolean) => void;
  setPermissionStatus: (status: NotificationPermission) => void;

  // Getters
  getCallbackForCategory: (
    category: NotificationCategory
  ) => ScreenRefetchCallback | null;
  shouldRefetchCurrentScreen: (category: NotificationCategory) => boolean;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  registeredScreens: new Map(),
  currentRoute: "",
  fcmToken: null,
  tokenError: null,
  isTokenLoading: false,
  permissionStatus: "default",

  registerScreen: (registration) => {
    set((state) => {
      const newMap = new Map(state.registeredScreens);
      newMap.set(registration.route, registration);
      return { registeredScreens: newMap };
    });
  },

  unregisterScreen: (route) => {
    set((state) => {
      const newMap = new Map(state.registeredScreens);
      newMap.delete(route);
      return { registeredScreens: newMap };
    });
  },

  setCurrentRoute: (route) => set({ currentRoute: route }),
  setFcmToken: (token) => set({ fcmToken: token }),
  setTokenError: (error) => set({ tokenError: error }),
  setTokenLoading: (loading) => set({ isTokenLoading: loading }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),

  getCallbackForCategory: (category) => {
    const { registeredScreens, currentRoute } = get();
    const registration = registeredScreens.get(currentRoute);

    if (registration && registration.categories.includes(category)) {
      return registration.onReset;
    }
    return null;
  },

  shouldRefetchCurrentScreen: (category) => {
    const { registeredScreens, currentRoute } = get();
    const registration = registeredScreens.get(currentRoute);

    return registration?.categories.includes(category) ?? false;
  },
}));
