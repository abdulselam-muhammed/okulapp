import { userRepository } from "@/lib/repositories/user.repository";
import { ApiError } from "@/lib/helpers/api-error";
import {
  hashPassword,
  comparePassword,
  signToken,
  type JwtPayload,
} from "@/lib/helpers/auth";
import type { RegisterDto, LoginDto } from "@/lib/dto/auth.dto";

function stripPassword(user: Record<string, unknown>) {
  const { password_hash, ...safe } = user;
  return safe;
}

export const authService = {
  async register(dto: RegisterDto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw ApiError.conflict("Email already in use");

    const password_hash = await hashPassword(dto.password);
    const id = await userRepository.create({
      email: dto.email,
      password_hash,
      role: dto.role,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone ?? null,
    });

    const user = await userRepository.findById(id);
    const token = signToken({
      userId: user!.id,
      email: user!.email,
      role: user!.role,
    });

    return { user: stripPassword({ ...user }), token };
  },

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    if (!user.is_active) throw ApiError.forbidden("Account is deactivated");

    const valid = await comparePassword(dto.password, user.password_hash);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user: stripPassword({ ...user }), token };
  },

  async me(payload: JwtPayload) {
    const user = await userRepository.findById(payload.userId);
    if (!user) throw ApiError.notFound("User not found");
    if (!user.is_active) throw ApiError.forbidden("Account is deactivated");
    return stripPassword({ ...user });
  },
};
