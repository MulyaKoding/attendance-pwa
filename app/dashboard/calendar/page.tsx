"use client";

import { useState } from "react";
import { useAttendanceCalendar } from "../../hooks/useAttendance";
import BottomNav from "../../components/BottomNav";

const statusColor: Record<string, string> = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  disputed: "bg-red-500",
  off: "bg-slate-300",
};

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));

  const { calendar, isLoading } = useAttendanceCalendar(month, year);

  const monthLabel = new Date(`${year}-${month}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
  const firstDayOfWeek = new Date(`${year}-${month}-01`).getDay();

  const changeMonth = (delta: number) => {
    let m = Number(month) + delta;
    let y = Number(year);
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setMonth(String(m).padStart(2, "0"));
    setYear(String(y));
  };

  const dayData = (day: number) => calendar?.days?.find((d: any) => d.day === day);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6">
        <p className="text-sm text-slate-500">Bulan ini</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Attendance calendar</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-semibold text-slate-800">{monthLabel}</span>
            <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Confirmed</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Pending</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300" />Off</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-2">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {!isLoading && Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const data = dayData(day);
              return (
                <div key={day} className="aspect-square rounded-lg border border-slate-100 p-1 flex flex-col items-center justify-start text-xs">
                  <div className="flex items-center gap-0.5">
                    <span className="text-slate-700">{day}</span>
                    {data && <span className={`h-1.5 w-1.5 rounded-full ${statusColor[data.status]}`} />}
                  </div>
                  {data?.clock_in && <span className="text-[9px] text-slate-400 mt-0.5">↓{data.clock_in}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}