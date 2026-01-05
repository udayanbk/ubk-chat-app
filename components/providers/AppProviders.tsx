"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import SocketProvider from "@/components/providers/SocketProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <SocketProvider>{children}</SocketProvider>
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
