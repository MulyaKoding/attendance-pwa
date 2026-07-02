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
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const { logout } = useLogout();
  const { today, isLoading: loadingToday, mutate } = useTodayAttendance();
  const { clockIn, isLoading: clockingIn } = useClockIn();
  const { clockOut, isLoading: clockingOut } = useClockOut();
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    // tunggu Zustand selesai rehydrate dari localStorage dulu
    if (!hasHydrated) return;
    if (!isAuthenticated) router.replace("/");
  }, [hasHydrated, isAuthenticated, router]);

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

  // tampilkan loading sampai store selesai rehydrate, biar tidak flash/redirect salah
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 border-2 border-[#087463] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const todayDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
  const initials = user.emp_nm.split(" ").slice(0, 2).map((n: string) => n[0]).join("");

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-[#087463] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {initials}
            </div>
            <div>
              <p className="text-xs text-slate-400">Selamat datang</p>
              <p className="font-semibold text-slate-800 leading-tight">{user.emp_nm}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="h-9 w-9 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">How's today?</h1>

        {/* Card Clock In/Out */}
        <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg mb-6 bg-[#087463]">
          {/* decorative circle */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -left-6 h-28 w-28 rounded-full bg-white/5" />

          <div className="relative flex items-center justify-between mb-4">
            <span className="text-xs font-medium tracking-wide text-white/70">{todayDate}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-white/15 rounded-full px-2.5 py-1">
              Today
            </span>
          </div>

          {actionError && (
            <div className="relative mb-3 text-xs text-red-100 bg-red-900/40 rounded-lg px-3 py-2">
              {actionError}
            </div>
          )}

          <div className="relative grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-white/70 mb-1">↓ Clock In</p>
              <p className="text-2xl font-semibold">
                {loadingToday ? "--:--" : today?.clock_in || "--:--"}
              </p>
              {today?.clock_in && (
                <p className="text-xs text-white/90 mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white inline-block" /> Tapped
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/70 mb-1">↑ Clock Out</p>
              <p className="text-2xl font-semibold">
                {loadingToday ? "--:--" : today?.clock_out || "--:--"}
              </p>
              {today?.clock_out && (
                <p className="text-xs text-white/90 mt-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white inline-block" /> Tapped
                </p>
              )}
            </div>
          </div>

          {today?.can_clock_in && (
            <button
              onClick={handleClockIn}
              disabled={clockingIn}
              className="relative w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#087463] hover:bg-white/90 disabled:opacity-60 transition"
            >
              {clockingIn ? "Memproses..." : "Clock In"}
            </button>
          )}
          {today?.can_clock_out && (
            <button
              onClick={handleClockOut}
              disabled={clockingOut}
              className="relative w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#087463] hover:bg-white/90 disabled:opacity-60 transition"
            >
              {clockingOut ? "Memproses..." : "Clock Out"}
            </button>
          )}
          {!today?.can_clock_in && !today?.can_clock_out && (
            <div className="relative text-center text-xs text-white/80 py-2">
              Absensi hari ini sudah lengkap ✓
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wide">QUICK ACTIONS</p>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/history"
            className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#087463]/40 hover:shadow-md transition"
          >
            <div className="h-9 w-9 rounded-lg bg-[#087463]/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#087463]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">My attendance</p>
            <p className="text-xs text-slate-400">Last 30 days</p>
          </Link>

          <Link
            href="/dashboard/calendar"
            className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#087463]/40 hover:shadow-md transition"
          >
            <div className="h-9 w-9 rounded-lg bg-[#087463]/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#087463]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Calendar</p>
            <p className="text-xs text-slate-400">Full month</p>
          </Link>

          <Link
            href="/dashboard/change-password"
            className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#087463]/40 hover:shadow-md transition col-span-2"
          >
            <div className="h-9 w-9 rounded-lg bg-[#087463]/10 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#087463]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">Change Password</p>
            <p className="text-xs text-slate-400">4-digit code</p>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}