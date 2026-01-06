"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import axios from "axios";
import socket from "@/lib/socket/socketClient";
import { addMessage, setMessages } from "@/store/slices/chatSlice";
import ChatBubble from "./ChatBubble";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function ChatWindow() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  // 🔹 Load messages on user change
  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser?._id) return;
      const res = await axios.get(`/api/messages?userId=${selectedUser._id}`);
      dispatch(setMessages(res.data.messages));
    }
    loadMessages();
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  async function sendMessage() {
    if (!text.trim() || !selectedUser || !session?.user) return;

    const res = await axios.post("/api/messages", {
      receiverId: selectedUser._id,
      message: text,
    });

    const msg = res.data.message;

    // ✅ IMMEDIATE UI UPDATE (sender)
    dispatch(addMessage(msg));

    // ❗ DO NOT dispatch here (socket will do it)
    socket.emit("send-message", msg);

    setText("");
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background ">
        <p className="text-gray-400 text-lg">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = 24;
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";

    setText(e.target.value);
  };

  function formatDateLabel(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }



  return (
    <div className="min-w-0 flex-1 overflow-hidden flex flex-col bg-background  dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-b bg-background">
        <img
          src={selectedUser.avatar || "/default_avatar.png"}
          className="w-10 h-10 rounded-full 
            bg-slate-200 dark:bg-slate-700 ring-2 ring-blue-500"
        />
        <div className="flex flex-col min-w-0">
          <p className="font-medium truncate">
            {selectedUser.username || selectedUser.name}
          </p>
          {selectedUser.status && (
            <p className="text-xs text-muted-foreground">
              {selectedUser.status}
            </p>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg: any, index: number) => {
          const isMe = msg.senderEmail === session?.user?.email;

          const prev = messages[index - 1];
          const showDate =
            !prev ||
            new Date(prev.createdAt).toDateString() !==
            new Date(msg.createdAt).toDateString();

          return (
            <div key={msg._id}>
              {/* DATE SEPARATOR */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100  dark:bg-slate-800 text-muted-foreground">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <ChatBubble
                message={msg.message}
                isMe={isMe}
                createdAt={msg.createdAt}
              />
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>


      {/* INPUT */}
      <div className="p-4 m-4 rounded-3xl border-4 border-border dark:border-slate-600
        bg-background flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          placeholder="Type a message..."
          className="
            flex-1 resize-none bg-transparent p-2
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            outline-none border-0
            focus:ring-0
            overflow-y-auto
            max-h-[120px]
          "
        />

        <Button
          size="lg"
          onClick={sendMessage}
          disabled={!text.trim()}
          className="rounded-full self-center"
        >
          <SendHorizontal />
        </Button>
      </div>

    </div>
  );
}
