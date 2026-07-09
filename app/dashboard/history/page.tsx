"use client"

import { useAttendanceHistory } from "../../hooks/useAttendance"
import BottomNav from "../../components/BottomNav"

function formatDateLabel(dateStr: string) {
  const y = dateStr.substring(0, 4)
  const m = dateStr.substring(4, 6)
  const d = dateStr.substring(6, 8)
  const date = new Date(`${y}-${m}-${d}`)
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  })
}

type AttendanceItem = {
  date: string
  clock_in: string | null
  clock_in_source: "log" | "manual" | null
  clock_out: string | null
  clock_out_source: "log" | "manual" | null
  keterangan?: string | null
  final_attn_cd?: string | null
}

function StatusBadge({ item }: { item: AttendanceItem }) {
  // Ada keterangan dari attncodemst (hadir, sakit, izin, cuti, dll)
  if (item.keterangan) {
    const isHadir = item.keterangan.trim().toLowerCase() === "hadir"
    return (
      <span
        className={`inline-block text-[10px] font-medium rounded-full px-2.5 py-1 ${
          isHadir ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
        }`}
      >
        {item.keterangan.toUpperCase()}
      </span>
    )
  }

  // Gak ada clock in/out sama sekali & gak ada keterangan -> hari kosong (libur/off)
  if (!item.clock_in && !item.clock_out) {
    return (
      <span className="inline-block text-[10px] font-medium text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
        TIDAK ADA DATA
      </span>
    )
  }

  // Salah satu sisi diinput manual
  if (item.clock_in_source === "manual" || item.clock_out_source === "manual") {
    return (
      <span className="inline-block text-[10px] font-medium text-violet-700 bg-violet-50 rounded-full px-2.5 py-1">
        MANUAL
      </span>
    )
  }

  // Ada clock in & out tapi gak ada keterangan spesifik dari BE -> tetap "Hadir" biasa,
  // disamakan tampilannya dengan kasus keterangan="Hadir" dari data manual di atas
  return (
    <span className="inline-block text-[10px] font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-1">
      HADIR
    </span>
  )
}

export default function HistoryPage() {
  const { history, isLoading } = useAttendanceHistory(30)

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <p className="text-sm text-slate-500">Last 30 days</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          My Attendance
        </h1>

        {isLoading && <p className="text-sm text-slate-400">Memuat...</p>}

        {!isLoading && history.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada data absensi</p>
        )}

        <div className="space-y-3">
          {history.map((item: AttendanceItem) => {
            const isEmptyDay = !item.clock_in && !item.clock_out

            return (
              <div
                key={item.date}
                className={`bg-white rounded-xl border p-4 ${
                  isEmptyDay ? "border-slate-100" : "border-slate-200"
                }`}
              >
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  {formatDateLabel(item.date)}
                </p>

                {!isEmptyDay && (
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                        CLOCK IN
                      </p>
                      <p className="text-lg font-semibold text-slate-800">
                        {item.clock_in || "--:--"}
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                        CLOCK OUT
                      </p>
                      <p className="text-lg font-semibold text-slate-800">
                        {item.clock_out || "--:--"}
                      </p>
                    </div>
                  </div>
                )}

                <div className={isEmptyDay ? "" : "mt-3"}>
                  <StatusBadge item={item} />
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Only the last 30 days shown. Contact HR for older records.
        </p>
      </div>
      <BottomNav />
    </div>
  )
}
