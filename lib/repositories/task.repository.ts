import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { TaskType, TaskStatus, Priority } from "@/lib/types/db";

export interface TaskRow extends RowDataPacket {
  id: number;
  report_id: number | null;
  assigned_by: number | null;
  assigned_to: number | null;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  notes: string | null;
  rejection_reason: string | null;
  deadline: Date | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

class TaskRepository extends BaseRepository<TaskRow> {
  constructor() {
    super("tasks");
  }

  async findByVolunteer(
    volunteerId: number,
    status?: TaskStatus
  ): Promise<TaskRow[]> {
    if (status) {
      return this.findWhere({ assigned_to: volunteerId, status });
    }
    return this.findWhere({ assigned_to: volunteerId });
  }

  async findActiveByVolunteer(volunteerId: number): Promise<TaskRow[]> {
    return this.query<TaskRow[]>(
      `SELECT * FROM tasks
       WHERE assigned_to = ? AND status IN ('pending', 'accepted', 'in_progress')
       ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low'), created_at ASC`,
      [volunteerId]
    );
  }

  async hasConflict(volunteerId: number): Promise<boolean> {
    const rows = await this.query<TaskRow[]>(
      `SELECT id FROM tasks
       WHERE assigned_to = ? AND status IN ('accepted', 'in_progress')
       LIMIT 1`,
      [volunteerId]
    );
    return rows.length > 0;
  }
}

export const taskRepository = new TaskRepository();
