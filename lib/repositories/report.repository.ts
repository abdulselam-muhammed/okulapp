import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { ReportType, Priority, ReportStatus } from "@/lib/types/db";

export interface ReportRow extends RowDataPacket {
  id: number;
  reporter_id: number;
  type: ReportType;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  photo_url: string | null;
  priority: Priority;
  status: ReportStatus;
  correction_note: string | null;
  created_at: Date;
  updated_at: Date;
}

class ReportRepository extends BaseRepository<ReportRow> {
  constructor() {
    super("reports");
  }

  async findByStatus(
    status: ReportStatus,
    limit = 50,
    offset = 0
  ): Promise<ReportRow[]> {
    return this.findWhere({ status }, limit, offset);
  }

  async findByReporter(
    reporterId: number,
    limit = 50,
    offset = 0
  ): Promise<ReportRow[]> {
    return this.findWhere({ reporter_id: reporterId }, limit, offset);
  }

  async findPending(limit = 50, offset = 0): Promise<ReportRow[]> {
    return this.query<ReportRow[]>(
      `SELECT r.*, u.first_name as reporter_name
       FROM reports r
       JOIN users u ON r.reporter_id = u.id
       WHERE r.status = 'pending'
       ORDER BY
         FIELD(r.priority, 'urgent', 'high', 'medium', 'low'),
         r.created_at ASC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async findNear(
    lat: number,
    lng: number,
    radiusKm = 10,
    limit = 20
  ): Promise<ReportRow[]> {
    return this.query<ReportRow[]>(
      `SELECT *,
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?))
          + sin(radians(?)) * sin(radians(latitude))
        )) AS distance
      FROM reports
      WHERE status IN ('pending', 'approved', 'assigned')
      HAVING distance < ?
      ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low'), distance ASC
      LIMIT ?`,
      [lat, lng, lat, radiusKm, limit]
    );
  }
}

export const reportRepository = new ReportRepository();
