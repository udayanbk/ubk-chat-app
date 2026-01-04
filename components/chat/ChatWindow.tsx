"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import socket from "@/lib/socket/socketClient";
import { addMessage, setMessages } from "@/store/slices/chatSlice";
import ChatBubble from "./ChatBubble";

export default function ChatWindow() {
  const selectedUser = useSelector((state: RootState) => state.chat.selectedUser);
  const messages = useSelector((state: RootState) => state.chat.messages);

  const dispatch = useDispatch();
  const [text, setText] = useState("");

  // Load messages when selecting a user
  useEffect(() => {
    async function loadMessages() {
      if (!selectedUser?._id) return;

      const res = await axios.get(`/api/messages?userId=${selectedUser._id}`);
      dispatch(setMessages(res.data.messages));
    }
    loadMessages();
  }, [selectedUser]);

  // Handle sending a message
  async function sendMessage() {
    if (!text.trim() || !selectedUser) return;

    const res = await axios.post("/api/messages", {
      receiverId: selectedUser._id,
      message: text,
    });

    // Add to Redux
    dispatch(addMessage(res.data.message));

    // Emit socket event
    socket.emit("send-message", {
      ...res.data.message,
      receiverId: selectedUser._id,
    });

    setText("");
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">
          Select a user to start chatting
        </p>
      </div>
    );
  }


  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* TOP BAR */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <img
          src={selectedUser.avatar || "/default_avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium">{selectedUser.username || selectedUser.name}</p>
          {selectedUser.status && (
            <p className="text-xs text-gray-500 max-w-sm break-words">
              {selectedUser.status}
            </p>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg: any) => {
          const isMe = msg.sender !== selectedUser._id;

          return (
            // <div
            //   key={msg._id}
            //   className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            // >
            //   <div
            //     className={`inline-block px-3 py-2 rounded-lg text-sm break-words max-w-[70%]
            //         ${isMe
            //         ? "bg-blue-600 text-white rounded-br-none"
            //         : "bg-white text-gray-800 rounded-bl-none border"
            //       }`}
            //   >
            //     {msg.message}
            //   </div>
            // </div>
            <ChatBubble
              key={msg._id}
              message={msg.message}
              isMe={isMe}
            />
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t bg-white flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none border rounded p-2 focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}
