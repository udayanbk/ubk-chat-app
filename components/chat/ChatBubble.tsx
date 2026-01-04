"use client";

import { cn } from "@/lib/utils";

export default function ChatBubble({
  message,
  isMe,
}: {
  message: string;
  isMe: boolean;
}) {
  return (
    <div className={cn("whitespace-pre-wrap break-words flex", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[70%] px-3 py-2 text-sm leading-relaxed",
          "rounded-lg",
          isMe
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none border"
        )}
      >
        {message}

        {/* Tail */}
        <span
          className={cn(
            "absolute bottom-0 w-3 h-3",
            isMe
              ? "right-[-6px] bg-blue-600 clip-tail-right"
              : "left-[-6px] bg-muted border-l border-b clip-tail-left"
          )}
        />
      </div>
    </div>
  );
}
