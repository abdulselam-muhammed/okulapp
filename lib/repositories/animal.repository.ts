import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";
import type { AnimalCondition, AnimalStatus } from "@/lib/types/db";

export interface AnimalRow extends RowDataPacket {
  id: number;
  report_id: number;
  species: string | null;
  description: string | null;
  condition_level: AnimalCondition;
  photo_url: string | null;
  status: AnimalStatus;
  created_at: Date;
  updated_at: Date;
}

class AnimalRepository extends BaseRepository<AnimalRow> {
  constructor() {
    super("animals");
  }

  async findByReport(reportId: number): Promise<AnimalRow | null> {
    const rows = await this.findWhere({ report_id: reportId }, 1);
    return rows[0] ?? null;
  }

  async findByStatus(status: AnimalStatus): Promise<AnimalRow[]> {
    return this.findWhere({ status });
  }
}

export const animalRepository = new AnimalRepository();
