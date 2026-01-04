"use client";

import Modal from "./Modal";
import { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "../../hooks/use-toast";
import socket from "@/lib/socket/socketClient";

export default function ProfileModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  // const myEmail = session?.user?.email; // ✅ USE EMAIL
  const myUserId = session?.user?._id;

  const [localUser, setLocalUser] = useState<any>(null);
  const [liking, setLiking] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user) setLocalUser(user);
  }, [user]);

  if (!localUser) return null;

  const alreadyLiked =
    Array.isArray(localUser.statusLikes) &&
    // localUser.statusLikes.includes(myUserId);
    localUser.statusLikes.some((id: any) => id === myUserId);

  console.log("alreadyLiked", alreadyLiked);

  /* ---------------- STATUS LIKE TOGGLE ---------------- */
async function toggleLikeStatus() {
  if (!myUserId || liking) return;

  setLiking(true);

  setLocalUser((prev: any) => ({
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
      <div className="text-center">
        <img
          src={localUser.avatar || "/default_avatar.png"}
          className="w-24 h-24 mx-auto rounded-full border object-cover"
        />

        <h2 className="text-xl font-semibold mt-3">
          {localUser.username || localUser.name}
        </h2>

        <div className="border border-gray-300 rounded-full p-3 mt-3">
          <p className="text-gray-700 text-sm">
            {localUser.status || "Hi I'm on UBK Chat"}
          </p>

          {localUser.status && (
            <button
              disabled={liking}
              onClick={toggleLikeStatus}
              className={`mx-auto mt-2 flex items-center gap-1 text-sm ${
                alreadyLiked ? "text-gray-500" : "text-rose-600"
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
