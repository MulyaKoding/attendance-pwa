"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useLogout";
import { useTodayAttendance, useClockIn, useClockOut } from "../hooks/useAttendance";
import { getCurrentPosition } from "../lib/geolocation";
import BottomNav from "../components/BottomNav";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useLogout();
  const { today, isLoading: loadingToday, mutate } = useTodayAttendance();
  const { clockIn, isLoading: clockingIn } = useClockIn();
  const { clockOut, isLoading: clockingOut } = useClockOut();
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleClockIn = async () => {
    setActionError("");
    try {
      const coords = await getCurrentPosition().catch(() => undefined);
      await clockIn(coords);
      mutate();
    } catch (err: any) {
      setActionError(err.message || "Clock In gagal");
    }
  };

  const handleClockOut = async () => {
    setActionError("");
    try {
      const coords = await getCurrentPosition().catch(() => undefined);
      await clockOut(coords);
      mutate();
    } catch (err: any) {
      setActionError(err.message || "Clock Out gagal");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  const todayDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold">
              {user.emp_nm.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            </div>
            <span className="font-semibold text-slate-800">{user.company_nm}</span>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-slate-500">Hi, {user.emp_nm}</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">How's today?</h1>

        {/* Card Clock In/Out */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-slate-400">{todayDate}</span>
          </div>

          {actionError && (
            <div className="mb-3 text-xs text-red-400 bg-red-950/40 rounded-lg px-3 py-2">
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">↓ IN</p>
              <p className="text-2xl font-semibold">
                {loadingToday ? "--:--" : today?.clock_in || "--:--"}
              </p>
              {today?.clock_in && <p className="text-xs text-emerald-400 mt-0.5">● Tapped</p>}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">↑ OUT</p>
              <p className="text-2xl font-semibold">
                {loadingToday ? "--:--" : today?.clock_out || "--:--"}
              </p>
              {today?.clock_out && <p className="text-xs text-emerald-400 mt-0.5">● Tapped</p>}
            </div>
          </div>

          {today?.can_clock_in && (
            <button
              onClick={handleClockIn}
              disabled={clockingIn}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60 transition"
            >
              {clockingIn ? "Memproses..." : "Clock In"}
            </button>
          )}
          {today?.can_clock_out && (
            <button
              onClick={handleClockOut}
              disabled={clockingOut}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60 transition"
            >
              {clockingOut ? "Memproses..." : "Clock Out"}
            </button>
          )}
          {!today?.can_clock_in && !today?.can_clock_out && (
            <div className="text-center text-xs text-slate-400 py-2">
              Absensi hari ini sudah lengkap ✓
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wide">QUICK ACTIONS</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard/history" className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">My attendance</p>
            <p className="text-xs text-slate-400">Last 30 days</p>
          </Link>

          <Link href="/dashboard/calendar" className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition">
            <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Calendar</p>
            <p className="text-xs text-slate-400">Full month</p>
          </Link>

          <Link href="/dashboard/change-pin" className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-sm transition col-span-2">
            <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Change PIN</p>
            <p className="text-xs text-slate-400">4-digit code</p>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}