import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher, mutator } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useTodayAttendance() {
  const token = useAuthStore((s) => s.token);
  const { data, error, isLoading, mutate } = useSWR(
    token ? ["/attendance-mobile/today", token] : null,
    ([url, t]) => fetcher(url, t)
  );
  return { today: data?.data, isLoading, error, mutate };
}

export function useAttendanceHistory(days = 30) {
  const token = useAuthStore((s) => s.token);
  const { data, error, isLoading } = useSWR(
    token ? [`/attendance-mobile/history?days=${days}`, token] : null,
    ([url, t]) => fetcher(url, t)
  );
  return { history: data?.data || [], isLoading, error };
}

export function useAttendanceCalendar(month: string, year: string) {
  const token = useAuthStore((s) => s.token);
  const { data, error, isLoading } = useSWR(
    token ? [`/attendance-mobile/calendar?month=${month}&year=${year}`, token] : null,
    ([url, t]) => fetcher(url, t)
  );
  return { calendar: data?.data, isLoading, error };
}

export function useClockIn() {
  const token = useAuthStore((s) => s.token);
  const { trigger, isMutating } = useSWRMutation("/attendance-mobile/clock-in", mutator);

  const clockIn = async (coords?: { latitude: number; longitude: number }) => {
    return trigger({ method: "POST", body: coords || {}, token });
  };
  return { clockIn, isLoading: isMutating };
}

export function useClockOut() {
  const token = useAuthStore((s) => s.token);
  const { trigger, isMutating } = useSWRMutation("/attendance-mobile/clock-out", mutator);

  const clockOut = async (coords?: { latitude: number; longitude: number }) => {
    return trigger({ method: "POST", body: coords || {}, token });
  };
  return { clockOut, isLoading: isMutating };
}