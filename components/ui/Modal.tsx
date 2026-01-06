"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  // 🔹 Close on ESC
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🔹 BACKDROP */}
      <div
        className="absolute inset-0 bg-background/60"
        onClick={onClose}
      />

      {/* 🔹 MODAL CARD */}
      <div
        className="relative z-10 w-full max-w-lg bg-background rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()} // ⭐ THIS IS THE KEY FIX
      >
        {/* 🔹 CLOSE ICON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
