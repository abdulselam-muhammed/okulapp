import { z } from "zod";

export const createUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "advisor", "volunteer", "vet", "user"]),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
});

export const updateUserDto = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar_url: z.string().url().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  is_active: z.boolean().optional(),
});

export const updateLocationDto = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
export type UpdateUserDto = z.infer<typeof updateUserDto>;
export type UpdateLocationDto = z.infer<typeof updateLocationDto>;
