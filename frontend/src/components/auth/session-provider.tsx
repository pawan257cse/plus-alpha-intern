"use client";

import { useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const { token, setAuth, updateUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (data.success) updateUser(data.data);
      })
      .catch(() => {
        logout();
      });
  }, [token, updateUser, logout]);

  return <>{children}</>;
}
