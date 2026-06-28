"use client";

import type { Toast } from "../types";

interface Props {
  toast: Toast;
}

export function Toast({ toast }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
        padding: "12px 20px",
        borderRadius: 6,
        background: toast.type === "success" ? "#1a4a3a" : "#4a1a1a",
        border: `1px solid ${toast.type === "success" ? "#5bbfbf" : "#cb6666"}`,
        color: toast.type === "success" ? "#5bbfbf" : "#cb6666",
        fontFamily: "monospace",
        fontSize: 13,
        animation: "fadeIn 0.2s ease",
      }}
    >
      {toast.message}
    </div>
  );
}
