import React, { useEffect } from "react";

const TMAlert = ({
  open,
  message,
  severity = "info", // info | success | error | warning
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  // color mapping
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`${colors[severity]} text-white px-4 py-2 rounded shadow-lg flex items-center gap-3 min-w-[250px]`}
      >
        <span className="text-sm font-medium">{message}</span>

        <button
          onClick={onClose}
          className="ml-auto text-white font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TMAlert;