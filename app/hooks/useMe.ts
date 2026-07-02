import useSWR from "swr";
import { fetcher } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useMe() {
  const token = useAuthStore((s) => s.token);

  const { data, error, isLoading } = useSWR(
    token ? ["/auth/me", token] : null,
    ([url, t]) => fetcher(url, t)
  );

  return {
    user: data?.data,
    isLoading,
    error,
  };
}