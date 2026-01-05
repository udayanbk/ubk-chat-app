"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket/socketClient";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [profileStatus, setProfileStatus] = useState("");
  const [user, setUser] = useState<any>(null);
  // const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [editType, setEditType] = useState<EditType>(null);
  const [form, setForm] = useState({
    username: "",
    name: "",
    mobile: "",
  });
  const [inputValue, setInputValue] = useState("");
  const [viewPhoto, setViewPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const load = async () => {
      const res = await axios.get("/api/profile/me");
      setUser(res.data.user);
      setProfileStatus(res.data.user.status || "");
    };

    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, [session]);

  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        Loading...
      </div>
    );
  }


  if (!session) {
    router.replace("/login");
    return null;
  }

  async function uploadToS3(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await axios.post("/api/upload", form);
    return res.data.url;
  }

  // 🔹 Auto upload gallery photos
  async function handleGalleryChange(files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const photoUrls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadToS3(file);
        photoUrls.push(url);
      }

      await axios.post("/api/profile", {
        photos: photoUrls,
        status: profileStatus,
      });

      const res = await axios.get("/api/profile/me");
      setUser(res.data.user);
    } finally {
      setUploading(false);
    }
  }

  const saveStatus = async (newStatus?: string) => {
    const updatedStatus = newStatus ?? profileStatus;

    try {
      await axios.patch("/api/profile", {
        status: updatedStatus,
      });

      setUser((prev: any) => ({
        ...prev,
        status: updatedStatus,
      }));

      setProfileStatus(updatedStatus);
      toast({
        title: "Status updated",
        description: "Your status was updated successfully",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "error",
        title: "Update failed",
        description: "Could not update status",
      });
    }
  };


  const updateProfile = async () => {
    try {
      await axios.patch("/api/profile", form);
      const res = await axios.get("/api/profile/me");
      setUser(res.data.user);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved",
      });
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      console.error(err);
      toast({
        variant: "error",
        title: "Update failed",
        description: "Could not update profile",
      });
    }
  };

  const deletePhoto = async (url: string) => {
    if (!confirm("Delete this photo?")) return;

    try {
      await axios.patch("/api/profile", { deletePhoto: url });

      setUser((prev: any) => ({
        ...prev,
        photos: prev.photos.filter((p: string) => p !== url),
      }));
      toast({
        title: "Photo deleted",
        description: "The photo was removed from your profile",
      });

    } catch {
      toast({
        variant: "error",
        title: "Delete failed",
        description: "Could not delete photo",
      });
    }
  };


  const setAsAvatar = async (url: string) => {
    try {
      await axios.patch("/api/profile", { avatar: url });

      setUser((prev: any) => ({
        ...prev,
        avatar: url,
      }));
      toast({
        title: "Avatar updated",
        description: "Your profile picture was updated",
      });
      // Update header instantly
      window.dispatchEvent(new Event("profile-updated"));
    } catch {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update avatar",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SECTION – INFO */}
        <div>
          <div className="text-center">
            <img
              src={user.avatar || "/default_avatar.png"}
              className="w-28 h-28 rounded-full mx-auto border object-cover"
            />

            <h2 className="text-xl font-semibold mt-3">
              {user.username || user.name}
            </h2>

            <p className="text-gray-600 text-sm">{session.user.email}</p>
            <p className="text-gray-600 text-sm">{user.mobile}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <p className="text-gray-700 text-sm max-w-[70%] text-center">
                {user.status || "No status"}
              </p>

              <button
                onClick={() => setShowLikes(true)}
                className="flex items-center gap-1 text-rose-600 hover:scale-105 transition"
              >
                <Heart className="w-5 h-5 fill-rose-500" />
                <span className="text-sm font-medium">
                  {user.statusLikes?.length || 0}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEditType("profile");
                setForm({
                  username: user.username || "",
                  name: user.name || "",
                  mobile: user.mobile || "",
                });
              }}
              className="h-20 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded font-medium"
            >
              Update Profile
            </button>

            <button
              onClick={() => {
                setEditType("status");
                setInputValue(user.status || "");
              }}
              className="h-20 bg-slate-600 hover:bg-slate-700 transition text-white rounded font-medium"
            >
              Update Status
            </button>

            <button
              onClick={() => router.push("/chat")}
              className="h-16 col-span-2 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded font-semibold"
            >
              Start Chatting
            </button>
          </div>
        </div>

        {/* STATUS LIKES POPUP */}
        <Dialog open={showLikes} onOpenChange={setShowLikes}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>People who liked your status</DialogTitle>
              {console.log("user", user)}
            </DialogHeader>

            {user.statusLikes?.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {user.statusLikes.map((u: any) => (
                  <li key={u._id} className="flex items-center gap-2">
                    <img
                      src={u.avatar || "/default_avatar.png"}
                      className="w-7 h-7 rounded-full"
                    />
                    <span>{u.username || u.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No likes yet.</p>
            )}
          </DialogContent>
        </Dialog>


        <Dialog open={!!editType} onOpenChange={() => setEditType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editType === "profile" ? "Update Profile" : "Update Status"}
              </DialogTitle>
            </DialogHeader>

            {editType === "profile" ? (
              <div className="space-y-3 mt-2">
                <input
                  className="w-full border rounded p-2"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />

                <input
                  className="w-full border rounded p-2"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />

                <input
                  className="w-full border rounded p-2"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({ ...form, mobile: e.target.value })
                  }
                />
              </div>
            ) : (
              <>
                <input
                  className="w-full border rounded p-2 mt-2"
                  maxLength={100}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <p className="text-xs text-gray-500 text-right mt-1">
                  {inputValue.length}/100
                </p>
              </>
            )}

            <Button
              className="mt-4 w-full"
              onClick={async () => {
                if (editType === "profile") {
                  await updateProfile();
                } else {
                  await saveStatus(inputValue);
                }
                setEditType(null);
              }}
            >
              Save
            </Button>
          </DialogContent>
        </Dialog>


        {/* RIGHT SECTION – PHOTOS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Your Photos</h3>

            <label className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
              {uploading ? "Uploading..." : "Upload Photos"}
              <input
                type="file"
                multiple
                hidden
                onChange={(e) => handleGalleryChange(e.target.files)}
              />
            </label>
          </div>

          {/* PHOTO GRID */}
          {user.photos?.length === 0 ? (
            <div className="flex items-center justify-center h-48 border rounded text-gray-500 text-sm">
              No photos uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {user.photos.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setViewPhoto(url)}
                >
                  {/* Photo */}
                  <img
                    src={url}
                    className="w-full h-28 object-cover rounded"
                    alt="photo"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePhoto(url);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 text-xs hidden group-hover:block"
                  >
                    ✕
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAsAvatar(url);
                    }}
                    className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs py-1 rounded hidden group-hover:block"
                  >
                    Set as avatar
                  </button>
                </div>
              ))}
            </div>

          )}
        </div>
        <Dialog open={!!viewPhoto} onOpenChange={() => setViewPhoto(null)}>
          <DialogContent className="max-w-2xl p-2">
            <img
              src={viewPhoto || ""}
              className="w-full h-auto rounded"
              alt="full view"
            />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
