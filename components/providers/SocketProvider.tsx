"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import socket from "@/lib/socket/socketClient";
import { useDispatch } from "react-redux";
import { addMessage, setOnlineUsers } from "@/store/slices/chatSlice";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
  if (!session?.user?.email) return;

  socket.connect();

  // ✅ JOIN USING EMAIL (single source of truth)
  socket.emit("join", session.user.email);

  socket.on("receive-message", (message) => {
    dispatch(addMessage(message));
  });

  socket.on("profile-updated", () => {
    window.dispatchEvent(new Event("profile-updated"));
  });

  return () => {
    socket.off("receive-message");
    socket.off("profile-updated");
    socket.disconnect();
  };
}, [session?.user?.email, dispatch]);


  return <>{children}</>;
}
