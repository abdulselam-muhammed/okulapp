import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";

export type ProjectStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface ProjectRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  cover_image_url: string | null;
  start_date: Date | null;
  end_date: Date | null;
  status: ProjectStatus;
  donation_goal: number | null;
  donation_raised: number;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectImageRow extends RowDataPacket {
  id: number;
  project_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: Date;
}

export interface ProjectWithCounts extends ProjectRow {
  articles_count: number;
  images_count: number;
}

class ProjectRepository extends BaseRepository<ProjectRow> {
  constructor() {
    super("projects");
  }

  async findAllWithCounts(limit = 50, offset = 0): Promise<ProjectWithCounts[]> {
    return this.query<ProjectWithCounts[]>(
      `SELECT p.*,
        (SELECT COUNT(*) FROM articles a WHERE a.project_id = p.id) AS articles_count,
        (SELECT COUNT(*) FROM project_images i WHERE i.project_id = p.id) AS images_count
       FROM projects p
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async findImages(projectId: number): Promise<ProjectImageRow[]> {
    return this.query<ProjectImageRow[]>(
      `SELECT * FROM project_images
       WHERE project_id = ?
       ORDER BY sort_order ASC, id ASC`,
      [projectId]
    );
  }

  async addImage(projectId: number, imageUrl: string, caption?: string, sortOrder = 0): Promise<number> {
    const result = await this.execute(
      `INSERT INTO project_images (project_id, image_url, caption, sort_order)
       VALUES (?, ?, ?, ?)`,
      [projectId, imageUrl, caption ?? null, sortOrder]
    );
    return result.insertId;
  }

  async removeAllImages(projectId: number): Promise<void> {
    await this.execute(`DELETE FROM project_images WHERE project_id = ?`, [projectId]);
  }
}

export const projectRepository = new ProjectRepository();
