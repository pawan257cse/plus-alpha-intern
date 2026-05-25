import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "company";
  status?: string;
  avatar?: string;
  profilePhoto?: string;
  phone?: string;
  college?: string;
  university?: string;
  degree?: string;
  branch?: string;
  year?: string;
  passingYear?: number;
  skills: string[];
  internshipDomain?: string;
  selectedDomain?: string;
  linkedin?: string;
  github?: string;
  resumeUrl?: string;
  isVerified: boolean;
  emailVerified?: boolean;
  approvedByAdmin?: boolean;
  companyName?: string;
  companyVerified?: boolean;
  profileCompletion: number;
  xp: number;
  coins?: number;
  dailyXp?: number;
  dailyCoins?: number;
  streak: number;
  badges?: string[];
  registrationPaymentStatus?: string;
  taskPaymentStatus?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user, token, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        }
        set({ user, token, refreshToken: refreshToken || null });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
        set({ user: null, token: null, refreshToken: null });
      },
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: "plus-alpha-auth" }
  )
);
