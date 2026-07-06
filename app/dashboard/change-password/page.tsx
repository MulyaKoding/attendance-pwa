"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import Link from "next/link"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { token } = useAuthStore() // sesuaikan dengan nama field token di store kamu

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Gagal mengubah password")
      }

      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="h-9 w-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Change Password</h1>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
        >
          {error && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
              Password berhasil diubah ✓
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#087463] focus:ring-2 focus:ring-[#087463]/40 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#087463] focus:ring-2 focus:ring-[#087463]/40 transition"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#087463] focus:ring-2 focus:ring-[#087463]/40 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#087463] py-3 text-sm font-semibold text-white hover:bg-[#087463]/90 disabled:opacity-60 transition"
          >
            {isLoading ? "Menyimpan..." : "Save New Password"}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
