"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserList from "@/components/chat/UserList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 1️⃣ While auth is loading → show loader
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-500">
        Loading chats...
      </div>
    );
  }

  // 2️⃣ Not authenticated → redirect
  if (!session) {
    router.replace("/login");
    return null;
  }

  // 3️⃣ Authenticated → render chat UI
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <UserList />
      <ChatWindow />
    </div>
  );
}
