import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { UserRole } from "@/lib/types/db";

export interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  latitude: number | null;
  longitude: number | null;
  reliability_score: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

class UserRepository extends BaseRepository<UserRow> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await this.query<UserRow[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] ?? null;
  }

  async findByRole(role: UserRole, limit = 50, offset = 0): Promise<UserRow[]> {
    return this.findWhere({ role }, limit, offset);
  }

  async findActiveVolunteersNear(
    lat: number,
    lng: number,
    radiusKm = 10,
    limit = 20
  ): Promise<UserRow[]> {
    return this.query<UserRow[]>(
      `SELECT *,
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?))
          + sin(radians(?)) * sin(radians(latitude))
        )) AS distance
      FROM users
      WHERE role = 'volunteer' AND is_active = TRUE AND latitude IS NOT NULL
      HAVING distance < ?
      ORDER BY distance ASC
      LIMIT ?`,
      [lat, lng, lat, radiusKm, limit]
    );
  }

  async updateReliability(userId: number, score: number): Promise<boolean> {
    return this.update(userId, { reliability_score: score });
  }
}

export const userRepository = new UserRepository();
