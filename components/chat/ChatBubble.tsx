"use client";

import { cn } from "@/lib/utils";

export default function ChatBubble({
  message,
  isMe,
  createdAt,
}: {
  message: string;
  isMe: boolean;
  createdAt?: string;
}) {
  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[70%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-sm",
          isMe
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-blue-100  dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md border border-slate-200 dark:border-slate-700"
        )}
      >
        <p className="whitespace-pre-wrap break-words">
          {message}
        </p>

        {createdAt && (
          <div
            className={cn(
              "mt-1 text-[10px] text-right opacity-70 select-none",
              isMe
                ? "text-white/80"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {formatTime(createdAt)}
          </div>
        )}

        <span
          className={cn(
            "absolute bottom-0 w-3 h-3",
            isMe
              ? "right-[-6px] bg-blue-600 clip-tail-right"
              : "left-[-6px] bg-blue-100  dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700 clip-tail-left"
          )}
        />
      </div>
    </div>
  );
}
