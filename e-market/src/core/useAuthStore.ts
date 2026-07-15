import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string) => void;
  register: (firstName: string, lastName: string, email: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (email) =>
        set({
          isAuthenticated: true,
          user: {
            firstName: "John",
            lastName: "Doe",
            email: email,
            phone: "+1 (555) 019-2834",
            avatarUrl: "",
          },
        }),

      register: (firstName, lastName, email) =>
        set({
          isAuthenticated: true,
          user: {
            firstName,
            lastName,
            email,
            phone: "+1 (555) 000-0000",
            avatarUrl: "",
          },
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),

      updateProfile: (updated) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),
    }),
    {
      name: "e_market_auth", // localStorage persistence key
    }
  )
);
