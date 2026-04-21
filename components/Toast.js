"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }) {
  const Icon =
    toast.type === "success"
      ? CheckCircle
      : toast.type === "error"
      ? XCircle
      : Info;

  return (
    <div className={`toast ${toast.type}`}>
      <Icon size={15} />
      <span>{toast.message}</span>
    </div>
  );
}
