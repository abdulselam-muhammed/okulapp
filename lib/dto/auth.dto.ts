import { z } from "zod";

export const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "advisor", "volunteer", "vet", "user"]),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
});

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
