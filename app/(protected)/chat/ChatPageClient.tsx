

import { Suspense } from "react";
import UserList from "@/components/chat/userList/UserList.server";
import ChatWindow from "@/components/chat/ChatWindow";
import UserListSkeleton from "@/components/chat/userList/UserListSkeleton";

export default function ChatPageClient() {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      <Suspense fallback={<UserListSkeleton />}>
        <UserList />
      </Suspense>
      <ChatWindow />
    </div>
  );
}
