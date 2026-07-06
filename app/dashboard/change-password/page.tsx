"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import Link from "next/link"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { token } = useAuthStore()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // pesan error khusus buat validasi konfirmasi password (real-time)
  const [confirmError, setConfirmError] = useState("")

  // state buat toggle show/hide tiap field
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // validasi real-time tiap newPassword atau confirmPassword berubah
  useEffect(() => {
    if (confirmPassword.length === 0) {
      setConfirmError("")
      return
    }
    if (newPassword !== confirmPassword) {
      setConfirmError("Password tidak cocok")
    } else {
      setConfirmError("")
    }
  }, [newPassword, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // validasi cukup panjang aja, boleh angka semua / huruf semua / campur
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

  // Icon mata terbuka & tertutup (SVG langsung, tanpa library tambahan)
  const EyeIcon = () => (
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
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )

  const EyeOffIcon = () => (
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
        d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.523 10.523 0 01-4.293 5.309M6.228 6.228A10.45 10.45 0 002.458 12c1.274 4.057 5.065 7 9.542 7a9.478 9.478 0 004.635-1.229"
      />
    </svg>
  )

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )

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
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#087463] focus:ring-2 focus:ring-[#087463]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#087463] focus:ring-2 focus:ring-[#087463]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className={`w-full rounded-xl border-2 px-3 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                  confirmError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-400/40"
                    : confirmPassword.length > 0
                      ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-400/40"
                      : "border-slate-300 focus:border-[#087463] focus:ring-[#087463]/40"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* pesan validasi real-time */}
            {confirmError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                {confirmError}
              </p>
            )}
            {!confirmError && confirmPassword.length > 0 && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                <CheckIcon /> Password cocok
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !!confirmError}
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
