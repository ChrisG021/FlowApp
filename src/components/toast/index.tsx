// toast.ts
import { toast, type ToastOptions } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "dark",
};

export function showToast(type: ToastType, message: string) {
  switch (type) {
    case "success":
      toast.success(message, defaultOptions);
      break;

    case "error":
      toast.error(message, defaultOptions);
      break;

    case "info":
      toast.info(message, defaultOptions);
      break;

    case "warning":
      toast.warning(message, defaultOptions);
      break;

    default:
      toast(message, defaultOptions);
  }
}