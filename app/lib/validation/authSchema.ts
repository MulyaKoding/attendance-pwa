import { z } from "zod";

export const loginSchema = z.object({
  mobile_phone_no: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(/^[0-9+]+$/, "Nomor HP hanya boleh angka")
    .min(9, "Nomor HP minimal 9 digit")
    .max(15, "Nomor HP maksimal 15 digit"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(4, "Password minimal 4 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;