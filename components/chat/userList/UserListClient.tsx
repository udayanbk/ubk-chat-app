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
    <div className="flex-[0_0_40%] min-w-[240px] max-w-[360px] h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
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
                ? "bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-600"
                : "hover:bg-blue-50 dark:hover:bg-slate-800"
            )}
          >
            <img
              src={u.avatar || "/default_avatar.png"}
              className="w-10 h-10 rounded-full object-cover
               bg-slate-200 dark:bg-slate-700 ring-2 ring-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                setProfileUser(u);
              }}
            />
            <div className="min-w-0">
              <p className="font-medium truncate">
                {u.username || u.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
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
