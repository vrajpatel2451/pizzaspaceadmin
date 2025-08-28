import { toast as sonnerToast } from "sonner";
import CustomToast from "./CustomToast";

type ToastType = "success" | "error" | "warning" | "info" | "default";

interface ToastOptions {
  description?: string;
}

const showToast = (
  type: ToastType,
  message: string,
  options?: ToastOptions,
) => {
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
