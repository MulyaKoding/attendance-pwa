"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useLogout";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { logout, isLoading } = useLogout();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Halo, {user.emp_nm}</h1>
            <p className="text-sm text-slate-500">{user.dept_nm} — {user.company_nm}</p>
          </div>
          <button onClick={handleLogout} disabled={isLoading} className="text-sm text-red-600 hover:underline disabled:opacity-50">
            {isLoading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}