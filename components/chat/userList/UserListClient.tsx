"use client";

import { useDispatch } from "react-redux";
import { setSelectedUser } from "@/store/slices/chatSlice";
import { useState } from "react";
import ProfileModal from "@/components/ui/ProfileModal";

export default function UserListClient({ users }: { users: any[] }) {
  const dispatch = useDispatch();
  const [profileUser, setProfileUser] = useState(null);

  return (
    <div className="w-72 border-r h-full bg-white overflow-y-auto">
      <h2 className="font-bold text-lg px-4 py-3 border-b">Chats</h2>

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => dispatch(setSelectedUser(u))}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <img
            src={u.avatar || "/default_avatar.png"}
            className="w-10 h-10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setProfileUser(u);
            }}
          />
          <div className="min-w-0">
            <p className="font-medium truncate">{u.username || u.name}</p>
            <p className="text-xs text-gray-500 truncate">{u.status}</p>
          </div>
        </div>
      ))}

      <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} />
    </div>
  );
}
