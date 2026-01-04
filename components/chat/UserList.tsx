"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "@/store/slices/chatSlice";
import ProfileModal from "@/components/ui/ProfileModal";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const res = await axios.get("/api/users");
      setUsers(res.data.users);
    }
    loadUsers();
  }, []);

  return (
    <div className="w-72 border-r h-full overflow-y-auto bg-white">
      <h2 className="font-bold text-lg px-4 py-3 border-b">Chats</h2>

      {
        users.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            No users available
          </div>
        ) :
          users.map((u: any) => (
            <div
              key={u._id}
              onClick={() => dispatch(setSelectedUser(u))}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <img
                src={u.avatar || "/default_avatar.png"}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileUser(u);
                }}
              />
              <div>
                <p className="font-medium">{u.username || u.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {u.status || "Hi, I'm on UBK Chat."}
                </p>
              </div>
            </div>
          ))}
      <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} />
    </div>
  );
}
