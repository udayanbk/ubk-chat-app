import type { Metadata } from "next";
import ChatPageClient from "./ChatPageClient";

export const metadata: Metadata = {
  title: "Chat | UBK Chat",
  description: "Real-time private chat built with Next.js",
};

export default function ChatPage() {
  // throw new Error("Testing error.tsx");
  return <ChatPageClient />;
}
