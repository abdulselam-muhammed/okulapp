import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { VetWorkload, VetCaseOutcome } from "@/lib/types/db";

export interface VetAvailabilityRow extends RowDataPacket {
  id: number;
  vet_id: number;
  is_available: boolean;
  workload: VetWorkload;
  note: string | null;
  updated_at: Date;
}

export interface VetCaseRow extends RowDataPacket {
  id: number;
  animal_id: number;
  vet_id: number;
  task_id: number | null;
  diagnosis: string | null;
  treatment: string | null;
  outcome: VetCaseOutcome;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

class VetRepository extends BaseRepository<VetAvailabilityRow> {
  constructor() {
    super("vet_availability");
  }

  async findAvailableVets(): Promise<VetAvailabilityRow[]> {
    return this.query<VetAvailabilityRow[]>(
      `SELECT va.*, u.first_name, u.last_name, u.phone, u.latitude, u.longitude
       FROM vet_availability va
       JOIN users u ON va.vet_id = u.id
       WHERE va.is_available = TRUE AND u.is_active = TRUE
       ORDER BY FIELD(va.workload, 'light', 'moderate', 'heavy')`
    );
  }

  async upsertAvailability(
    vetId: number,
    data: Record<string, unknown>
  ): Promise<void> {
    await this.execute(
      `INSERT INTO vet_availability (vet_id, is_available, workload, note)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE is_available = VALUES(is_available), workload = VALUES(workload), note = VALUES(note)`,
      [vetId, data.is_available, data.workload ?? "light", data.note ?? null]
    );
  }

  async createCase(data: Record<string, unknown>): Promise<number> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const result = await this.execute(
      `INSERT INTO vet_cases (${columns}) VALUES (${placeholders})`,
      Object.values(data)
    );
    return result.insertId;
  }

  async findCasesByVet(vetId: number): Promise<VetCaseRow[]> {
    return this.query<VetCaseRow[]>(
      `SELECT * FROM vet_cases WHERE vet_id = ? ORDER BY created_at DESC`,
      [vetId]
    );
  }

  async updateCase(
    caseId: number,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const keys = Object.keys(data);
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const result = await this.execute(
      `UPDATE vet_cases SET ${setClause} WHERE id = ?`,
      [...Object.values(data), caseId]
    );
    return result.affectedRows > 0;
  }
}

export const vetRepository = new VetRepository();
