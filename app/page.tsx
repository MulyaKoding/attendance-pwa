"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormValues } from "./lib/validation/authSchema";
import { useLogin } from "./hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      router.push("/dashboard");
    } catch {
      // error sudah ditangkap oleh hook `useLogin` (state `error`)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#087463] flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Attendance App</h1>
          <p className="text-sm text-slate-500 mt-1">Masuk untuk absen kehadiran Anda</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8"
          noValidate
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error.message}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="mobile_phone_no" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nomor HP
            </label>
            <input
              id="mobile_phone_no"
              type="tel"
              inputMode="numeric"
              placeholder="08xxxxxxxxxx"
              autoComplete="tel"
              {...register("mobile_phone_no")}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                errors.mobile_phone_no
                  ? "border-red-400 focus:ring-red-400"
                  : "border-slate-300 focus:ring-[#087463]"
              }`}
            />
            {errors.mobile_phone_no && (
              <p className="mt-1.5 text-xs text-red-600">{errors.mobile_phone_no.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  errors.password
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-300 focus:ring-[#087463]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-[#087463]"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#087463] py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#065f51] focus:outline-none focus:ring-2 focus:ring-[#087463] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} PT. Karya Anak Bangsa
        </p>
      </div>
    </div>
  );
}