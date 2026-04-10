import { userRepository } from "@/lib/repositories/user.repository";
import { activityLog } from "@/lib/services/activity-log.service";
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

  async create(dto: CreateUserDto, actorId: number | null = null) {
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

    await activityLog.log(
      actorId,
      "create",
      "user",
      id,
      `Created ${dto.role} account for ${dto.first_name} ${dto.last_name} (${dto.email})`,
      { role: dto.role, email: dto.email }
    );

    return userRepository.findById(id);
  },

  async update(id: number, dto: UpdateUserDto, actorId: number | null = null) {
    const existing = await userService.getById(id);
    await userRepository.update(id, dto);

    const changes = Object.keys(dto).filter((k) => k in dto);
    await activityLog.log(
      actorId,
      "update",
      "user",
      id,
      `Updated user ${existing.first_name} ${existing.last_name}: ${changes.join(", ")}`,
      { fields: changes }
    );

    return userRepository.findById(id);
  },

  async delete(id: number, actorId: number | null = null) {
    const existing = await userRepository.findById(id);
    const deleted = await userRepository.delete(id);
    if (!deleted) throw ApiError.notFound("User not found");

    await activityLog.log(
      actorId,
      "delete",
      "user",
      id,
      existing
        ? `Deleted user ${existing.first_name} ${existing.last_name} (${existing.email})`
        : `Deleted user #${id}`,
      existing ? { email: existing.email, role: existing.role } : undefined
    );
  },

  async updateLocation(id: number, lat: number, lng: number) {
    await userRepository.update(id, { latitude: lat, longitude: lng });
  },

  async getNearbyVolunteers(lat: number, lng: number, radiusKm?: number) {
    return userRepository.findActiveVolunteersNear(lat, lng, radiusKm);
  },
};
