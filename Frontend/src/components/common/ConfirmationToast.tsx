import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  title: string;
  message: string;
}

interface ConfirmationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 4500;

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 280);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 280);
  };

  const isSuccess = toast.type === "success";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-3 p-4 rounded-2xl shadow-2xl border min-w-72 max-w-sm
        ${exiting ? "toast-exit" : "toast-enter"}
        ${
          isSuccess
            ? "bg-white border-green-200 shadow-green-100"
            : "bg-white border-red-200 shadow-red-100"
        }
      `}
    >
      <div
        className={`shrink-0 mt-0.5 text-xl ${
          isSuccess ? "text-green-500 success-pop" : "text-red-500"
        }`}
      >
        {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold mb-0.5 ${
            isSuccess ? "text-green-800" : "text-red-800"
          }`}
        >
          {toast.title}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <FaTimes size={12} />
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-2xl ${
          isSuccess ? "bg-green-400" : "bg-red-400"
        }`}
        style={{
          animation: `shimmer-sweep ${AUTO_DISMISS_MS}ms linear forwards`,
          width: "100%",
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

const ConfirmationToast: React.FC<ConfirmationToastProps> = ({
  toasts,
  onDismiss,
}) => {
  return createPortal(
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto relative overflow-hidden">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default ConfirmationToast;

/** Helper to create a toast message */
export function makeToast(
  type: "success" | "error",
  title: string,
  message: string,
): ToastMessage {
  return { id: `${Date.now()}-${Math.random()}`, type, title, message };
}
