"use client";

import Modal from "./Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
// import { toast } from "../../hooks/use-toast";
import socket from "@/lib/socket/socketClient";
import { User } from "../../types/user";

export default function ProfileModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const myUserId = session?.user?._id;

  const [localUser, setLocalUser] = useState<User | null>(null);
  const [liking, setLiking] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log("user--aa", user)
      setLocalUser(user);
    }
  }, [user]);

  if (!localUser) return null;
  console.log("user bb", user)
  const alreadyLiked =
    Array.isArray(localUser.statusLikes) &&
    // localUser.statusLikes.includes(myUserId);
    localUser.statusLikes.some((id: any) => id === myUserId);

  console.log("alreadyLiked", alreadyLiked);

  /* ---------------- STATUS LIKE TOGGLE ---------------- */
async function toggleLikeStatus() {
  if (!myUserId || liking) return;

  setLiking(true);

  setLocalUser((prev: User) => ({
    ...prev,
    statusLikes: alreadyLiked
      ? prev.statusLikes.filter((id: any) => id !== myUserId)
      : [...(prev.statusLikes || []), myUserId],
  }));


  try {
    await axios.patch("/api/profile", {
      toggleStatusLike: true,
      targetUserId: localUser._id,
    });

    socket.emit("profile-updated");
  } catch (err) {
    console.error("Like toggle failed", err);

    setLocalUser(user);
  } finally {
    setLiking(false);
  }
}

if (!user) return null;

  return (
    <Modal open={!!user} onClose={onClose}>
        <div
          className="w-full max-w-md mx-auto text-center
            rounded-2xl p-6 bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xl"
        >

        <img
          src={localUser.avatar || "/default_avatar.png"}
          className="w-24 h-24 mx-auto rounded-full border border-slate-200 dark:border-slate-700 object-cover"
        />

        <h2 className="text-xl font-semibold mt-3">
          {localUser.username || localUser.name}
        </h2>
        <h2 className="text-base mt-2">
          {localUser.email || localUser.email}
        </h2>
        <h2 className="text-base">
          {localUser.mobile || localUser.mobile}
        </h2>

        <div className="border border-slate-200 dark:border-slate-700 border-gray-300 rounded-full p-3 mt-3">
          <p className="text-sm bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100">
            {localUser.status || "Hi I'm on UBK Chat"}
          </p>

          {localUser.status && (
            <button
              disabled={liking}
              onClick={toggleLikeStatus}
              className={`mx-auto mt-2 flex items-center gap-1 text-sm ${
                alreadyLiked ? "text-muted-foreground" : "text-rose-600"
              } ${liking ? "opacity-50" : ""}`}
            >
              <Heart
                className={`w-4 h-4 ${
                  alreadyLiked ? "fill-gray-400" : "fill-rose-500"
                }`}
              />
              {alreadyLiked ? "Unlike status" : "Like status"}
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {localUser.photos?.map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              className="w-full h-24 object-cover rounded cursor-pointer"
              onClick={() => setSelectedPhoto(url)}
            />
          ))}
        </div>

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
          >
            <img src={selectedPhoto} className="max-w-[90%] rounded" />
          </div>
        )}
      </div>
    </Modal>
  );
}
