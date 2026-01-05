"use client";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "@/store/slices/chatSlice";
import ProfileModal from "@/components/ui/ProfileModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";

export default function UserListClient({ users }: { users: any[] }) {
  const dispatch = useDispatch();
  const [profileUser, setProfileUser] = useState<any>(null);
  const selectedUser = useSelector((state: RootState) => state?.chat?.selectedUser);

  return (
    <div className="w-80 border-r h-full overflow-y-auto bg-white">
      <h2 className="font-bold text-lg px-4 py-3 border-b">Chats</h2>

      {users.length === 0 ? (
        <div className="text-center text-gray-400 mt-10 text-sm">
          No users available
        </div>
      ) : (
        users.map((u: any) => {
          const isActive = selectedUser?._id === u._id;
          return <div
            key={u._id}
            onClick={() => dispatch(setSelectedUser(u))}
            className={cn(
              "flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors",
              isActive
                ? "bg-blue-50 border-l-4 border-blue-600"
                : "hover:bg-gray-100"
            )}
          >
            <img
              src={u.avatar || "/default_avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
              onClick={(e) => {
                e.stopPropagation();
                setProfileUser(u);
              }}
            />
            <div className="min-w-0">
              <p className="font-medium truncate">
                {u.username || u.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {u.status || "Hi, I'm on UBK Chat"}
              </p>
            </div>
          </div>
        })
      )}

      <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} />
    </div>
  );
}
