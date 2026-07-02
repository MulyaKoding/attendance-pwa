import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  unit_cd: string;
  company_cd: string;
  company_nm: string;
  emp_no: string;
  emp_nm: string;
  dept_cd: string;
  dept_nm: string;
  lang_cd: string;
  photo_file_nm_server: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setSession: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      clearSession: () =>
        set({ token: null, user: null, isAuthenticated: false }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "attn-auth-storage", // key di localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);