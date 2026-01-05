"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket/socketClient";
import { useDispatch } from "react-redux";
import { addMessage } from "@/store/slices/chatSlice";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
  if (!session?.user?.email) return;

  fetch("/api/socket"); // 🔥 THIS BOOTS SERVER
  socket.connect();
  socket.emit("join", session.user.email);

  socket.on("receive-message", (msg) => {
    dispatch(addMessage(msg));
  });

  return () => {
    socket.off("receive-message");
  };
}, [session?.user?.email]);

  return <>{children}</>;
}
