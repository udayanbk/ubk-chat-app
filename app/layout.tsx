import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import AppProviders from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/toaster";
import Footer from "../components/ui/Footer";

export const metadata: Metadata = {
  title: "Chat App",
  description: "Chat application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-500">
        <AppProviders>
          <div className="mx-auto max-w-[50%] h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">{children}</main>
            <Footer />
          </div>
          {/* 🔥 Toasts live OUTSIDE layout container */}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
