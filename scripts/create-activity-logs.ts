/**
 * Creates the activity_logs table.
 *
 * Usage: npx tsx scripts/create-activity-logs.ts
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "okulapp",
});

async function createTable() {
  const conn = await pool.getConnection();
  try {
    console.log("Creating activity_logs table...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        action VARCHAR(20) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INT NULL,
        description VARCHAR(500) NOT NULL,
        metadata JSON NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_entity (entity_type, entity_id),
        INDEX idx_created (created_at DESC),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("activity_logs table created successfully.");
  } catch (err) {
    console.error("Failed to create table:", err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

createTable();
