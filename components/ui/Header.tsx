"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import socket from "@/lib/socket/socketClient";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const pathname = usePathname();

  // 🔹 Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // 🔹 Fetch fresh profile
  useEffect(() => {
    if (status !== "authenticated") return;

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile/me");
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        console.error("Header profile load failed", err);
      }
    };

    loadProfile();
    window.addEventListener("profile-updated", loadProfile);

    return () => {
      window.removeEventListener("profile-updated", loadProfile);
    };
  }, [status]);

  useEffect(() => {
    if (!session?.user?.email) return;

    socket.on("profile-updated", () => {
      window.dispatchEvent(new Event("profile-updated"));
    });

    return () => {
      socket.off("profile-updated");
    };
  }, [session]);


  const user = profile ?? session?.user;

  if (status === "loading") {
    return <header className="w-full h-[64px] bg-background border-b" />;
  }

  return (
    <>
      {(pathname === "/login" || pathname === "/register" || pathname === "/") ?
        <header className="w-full bg-[#0061ff] border-b shadow-sm px-4 py-3 flex items-center justify-center">
          <Link href="/" className="text-xl font-bold text-blue-100">
            UBK Chat
          </Link>
        </header>
        :
        <header className="w-full bg-[#0061ff] text-blue-100 border-b shadow-sm px-4 py-3 flex items-center justify-between">

          <Link href="/" className="text-xl font-bold">
            UBK Chat
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              className="flex items-center gap-2 select-none"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="font-medium">
                {user?.username ?? user?.name ?? "User"}
              </span>

              <img
                src={user?.avatar ?? "/default_avatar.png"}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover mr-2"
              />
              <ThemeToggle />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-40 bg-background text-foreground
               rounded-md shadow-lg border border-border py-2 z-50 ">

                <Link href="/chat" className="block px-4 py-2 hover:bg-card  dark:bg-slate-800">
                  My Chat
                </Link>

                <Link href="/profile" className="block px-4 py-2 hover:bg-card  dark:bg-slate-800">
                  Profile
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full text-left px-4 py-2 hover:bg-card  dark:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </header>
      }
    </>

  );
}
