import useSWRMutation from "swr/mutation";
import { mutator, ApiError } from "../lib/api";
import { useAuthStore, AuthUser } from "../store/authStore";
import { LoginFormValues } from "../lib/validation/authSchema";

interface LoginResponseData {
  token: string;
  user: AuthUser;
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  const { trigger, isMutating, error } = useSWRMutation(
    "/auth/login",
    mutator
  );

  const login = async (values: LoginFormValues) => {
    const res = await trigger({ method: "POST", body: values });
    const data: LoginResponseData = res.data;
    setSession(data.token, data.user);
    return data;
  };

  return {
    login,
    isLoading: isMutating,
    error: error as ApiError | undefined,
  };
}