"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import SocketProvider from "@/components/providers/SocketProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <SocketProvider>{children}</SocketProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
