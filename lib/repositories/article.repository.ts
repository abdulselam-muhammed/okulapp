import { BaseRepository } from "./base.repository";
import type { RowDataPacket } from "mysql2";

export interface ArticleRow extends RowDataPacket {
  id: number;
  project_id: number | null;
  title: string;
  cover_image_url: string | null;
  content: string;
  author_id: number | null;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ArticleWithDetails extends ArticleRow {
  project_title: string | null;
  author_first_name: string | null;
  author_last_name: string | null;
}

class ArticleRepository extends BaseRepository<ArticleRow> {
  constructor() {
    super("articles");
  }

  async findAllWithDetails(limit = 50, offset = 0): Promise<ArticleWithDetails[]> {
    return this.query<ArticleWithDetails[]>(
      `SELECT a.*,
        p.title AS project_title,
        u.first_name AS author_first_name,
        u.last_name AS author_last_name
       FROM articles a
       LEFT JOIN projects p ON p.id = a.project_id
       LEFT JOIN users u ON u.id = a.author_id
       ORDER BY a.published_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
  }

  async findByIdWithDetails(id: number): Promise<ArticleWithDetails | null> {
    const rows = await this.query<ArticleWithDetails[]>(
      `SELECT a.*,
        p.title AS project_title,
        u.first_name AS author_first_name,
        u.last_name AS author_last_name
       FROM articles a
       LEFT JOIN projects p ON p.id = a.project_id
       LEFT JOIN users u ON u.id = a.author_id
       WHERE a.id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }

  async findByProject(projectId: number): Promise<ArticleRow[]> {
    return this.query<ArticleRow[]>(
      `SELECT * FROM articles
       WHERE project_id = ?
       ORDER BY published_at DESC`,
      [projectId]
    );
  }
}

export const articleRepository = new ArticleRepository();
