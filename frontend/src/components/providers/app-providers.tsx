"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/components/auth/session-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthSessionProvider>
        {children}
      </AuthSessionProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
