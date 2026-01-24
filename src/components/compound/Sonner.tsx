import { toast as sonnerToast } from "sonner";
import CustomToast from "./CustomToast";

type ToastType = "success" | "error" | "warning" | "info" | "default";

interface ToastOptions {
  description?: string;
  playSound?: boolean;
}

// Play notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    // Create a pleasant notification tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Use a pleasant frequency (E5 note)
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime);
    oscillator.type = "sine";

    // Fade in and out for a pleasant sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug("Could not play notification sound:", error);
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
