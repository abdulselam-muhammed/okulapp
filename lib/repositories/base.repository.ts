import db from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class BaseRepository<T extends RowDataPacket> {
  constructor(protected table: string) {}

  async findAll(limit = 50, offset = 0): Promise<T[]> {
    const [rows] = await db.query<T[]>(
      `SELECT * FROM ${this.table} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async findById(id: number): Promise<T | null> {
    const [rows] = await db.query<T[]>(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }

  async findWhere(
    conditions: Record<string, unknown>,
    limit = 50,
    offset = 0
  ): Promise<T[]> {
    const keys = Object.keys(conditions);
    const where = keys.map((k) => `${k} = ?`).join(" AND ");
    const values = Object.values(conditions);

    const [rows] = await db.query<T[]>(
      `SELECT * FROM ${this.table} WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );
    return rows;
  }

  async count(conditions?: Record<string, unknown>): Promise<number> {
    let query = `SELECT COUNT(*) as total FROM ${this.table}`;
    const values: unknown[] = [];

    if (conditions && Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map((k) => `${k} = ?`)
        .join(" AND ");
      query += ` WHERE ${where}`;
      values.push(...Object.values(conditions));
    }

    const [rows] = await db.query<(RowDataPacket & { total: number })[]>(
      query,
      values
    );
    return rows[0].total;
  }

  async create(data: Record<string, unknown>): Promise<number> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const columns = keys.join(", ");

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders})`,
      Object.values(data)
    );
    return result.insertId;
  }

  async update(id: number, data: Record<string, unknown>): Promise<boolean> {
    const keys = Object.keys(data);
    const setClause = keys.map((k) => `${k} = ?`).join(", ");

    const [result] = await db.query<ResultSetHeader>(
      `UPDATE ${this.table} SET ${setClause} WHERE id = ?`,
      [...Object.values(data), id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  async query<R extends RowDataPacket[]>(
    sql: string,
    params?: unknown[]
  ): Promise<R> {
    const [rows] = await db.query<R>(sql, params);
    return rows;
  }

  async execute(sql: string, params?: unknown[]): Promise<ResultSetHeader> {
    const [result] = await db.query<ResultSetHeader>(sql, params);
    return result;
  }
}
