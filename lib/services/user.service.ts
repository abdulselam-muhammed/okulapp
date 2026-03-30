import { userRepository } from "@/lib/repositories/user.repository";
import { ApiError } from "@/lib/helpers/api-error";
import { hashPassword } from "@/lib/helpers/auth";
import type { CreateUserDto, UpdateUserDto } from "@/lib/dto/user.dto";
import type { UserRole } from "@/lib/types/db";

export const userService = {
  async getAll(limit?: number, offset?: number) {
    return userRepository.findAll(limit, offset);
  },

  async getById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async getByRole(role: UserRole, limit?: number, offset?: number) {
    return userRepository.findByRole(role, limit, offset);
  },

  async create(dto: CreateUserDto) {
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

    return userRepository.findById(id);
  },

  async update(id: number, dto: UpdateUserDto) {
    await userService.getById(id); // ensure exists
    await userRepository.update(id, dto);
    return userRepository.findById(id);
  },

  async delete(id: number) {
    const deleted = await userRepository.delete(id);
    if (!deleted) throw ApiError.notFound("User not found");
  },

  async updateLocation(id: number, lat: number, lng: number) {
    await userRepository.update(id, { latitude: lat, longitude: lng });
  },

  async getNearbyVolunteers(lat: number, lng: number, radiusKm?: number) {
    return userRepository.findActiveVolunteersNear(lat, lng, radiusKm);
  },
};
