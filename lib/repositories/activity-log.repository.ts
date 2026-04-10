import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";

export type ActivityAction = "create" | "update" | "delete" | "approve" | "status_change";

export interface ActivityLogRow extends RowDataPacket {
  id: number;
  user_id: number | null;
  action: ActivityAction;
  entity_type: string;
  entity_id: number | null;
  description: string;
  metadata: unknown;
  created_at: Date;
}

export interface ActivityLogWithUser extends ActivityLogRow {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;
}

class ActivityLogRepository extends BaseRepository<ActivityLogRow> {
  constructor() {
    super("activity_logs");
  }

  async findAllWithUser(limit = 100, offset = 0): Promise<ActivityLogWithUser[]> {
    return this.query<ActivityLogWithUser[]>(
      `SELECT al.*, u.first_name, u.last_name, u.email, u.role
       FROM activity_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async findByEntity(
    entityType: string,
    entityId: number,
    limit = 50
  ): Promise<ActivityLogWithUser[]> {
    return this.query<ActivityLogWithUser[]>(
      `SELECT al.*, u.first_name, u.last_name, u.email, u.role
       FROM activity_logs al
       LEFT JOIN users u ON u.id = al.user_id
       WHERE al.entity_type = ? AND al.entity_id = ?
       ORDER BY al.created_at DESC
       LIMIT ?`,
      [entityType, entityId, limit]
    );
  }
}

export const activityLogRepository = new ActivityLogRepository();
