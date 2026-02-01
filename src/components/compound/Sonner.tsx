import { toast as sonnerToast } from "sonner";
import CustomToast from "./CustomToast";
import notificationSoundUrl from "@/assets/sounds/notification.mp3";

type ToastType = "success" | "error" | "warning" | "info" | "default";

interface ToastOptions {
  description?: string;
  playSound?: boolean;
}

// Play notification sound from MP3 file
const playNotificationSound = () => {
  try {
    const audio = new Audio(notificationSoundUrl);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  } catch {
    // Silently fail if Audio is not available
  }
};

const showToast = (
  type: ToastType,
  message: string,
  options?: ToastOptions,
) => {
  // Play sound for info and warning toasts by default (notifications)
  if (options?.playSound !== false && (type === "info" || type === "warning")) {
    playNotificationSound();
  }

  sonnerToast.custom((t) => (
    <CustomToast
      type={type}
      message={message}
      description={options?.description}
      onClose={() => sonnerToast.dismiss(t)}
    />
  ));
};

export const toast = {
  success: (msg: string, opts?: ToastOptions) =>
    showToast("success", msg, opts),
  error: (msg: string, opts?: ToastOptions) => showToast("error", msg, opts),
  warning: (msg: string, opts?: ToastOptions) =>
    showToast("warning", msg, opts),
  info: (msg: string, opts?: ToastOptions) => showToast("info", msg, opts),
  default: (msg: string, opts?: ToastOptions) =>
    showToast("default", msg, opts),
};
