import useSWRMutation from "swr/mutation";
import { mutator } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export function useLogout() {
  const token = useAuthStore((s) => s.token);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { trigger, isMutating } = useSWRMutation("/auth/logout", mutator);

  const logout = async () => {
    try {
      await trigger({ method: "POST", token });
    } finally {
      clearSession();
    }
  };

  return { logout, isLoading: isMutating };
}