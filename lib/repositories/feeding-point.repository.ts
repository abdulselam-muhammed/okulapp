import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { FeedingPointStatus } from "@/lib/types/db";

export interface FeedingPointRow extends RowDataPacket {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  status: FeedingPointStatus;
  last_refill_at: Date | null;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface RefillRow extends RowDataPacket {
  id: number;
  feeding_point_id: number;
  volunteer_id: number;
  refill_type: "food" | "water" | "both";
  note: string | null;
  photo_url: string | null;
  status: "pending" | "approved" | "rejected";
  approved_by: number | null;
  created_at: Date;
}

class FeedingPointRepository extends BaseRepository<FeedingPointRow> {
  constructor() {
    super("feeding_points");
  }

  async findActive(): Promise<FeedingPointRow[]> {
    return this.findWhere({ status: "active" });
  }

  async findNeedingRefill(): Promise<FeedingPointRow[]> {
    return this.findWhere({ status: "needs_refill" });
  }

  async createRefill(data: Record<string, unknown>): Promise<number> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const result = await this.execute(
      `INSERT INTO feeding_point_refills (${columns}) VALUES (${placeholders})`,
      Object.values(data)
    );
    return result.insertId;
  }

  async findRefillsByPoint(feedingPointId: number): Promise<RefillRow[]> {
    return this.query<RefillRow[]>(
      `SELECT * FROM feeding_point_refills WHERE feeding_point_id = ? ORDER BY created_at DESC`,
      [feedingPointId]
    );
  }
}

export const feedingPointRepository = new FeedingPointRepository();
