const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic fetcher untuk SWR (GET)
export const fetcher = async (url: string, token?: string | null) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || "Terjadi kesalahan", res.status);
  }
  return data;
};

// Generic mutator untuk useSWRMutation (POST/PUT/DELETE)
export const mutator = async (
  url: string,
  { arg }: { arg: { method?: string; body?: unknown; token?: string | null } }
) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: arg.method || "POST",
    headers: {
      "Content-Type": "application/json",
      ...(arg.token ? { Authorization: `Bearer ${arg.token}` } : {}),
    },
    body: arg.body ? JSON.stringify(arg.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new ApiError(data.message || "Terjadi kesalahan", res.status);
  }
  return data;
};