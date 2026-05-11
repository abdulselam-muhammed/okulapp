/**
 * Creates the projects, project_images, and articles tables.
 *
 * Usage: npx tsx scripts/create-projects-articles.ts
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

async function createTables() {
  const conn = await pool.getConnection();
  try {
    console.log("Creating projects table...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        cover_image_url VARCHAR(500) NULL,
        start_date DATE NULL,
        end_date DATE NULL,
        status ENUM('upcoming', 'active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
        donation_goal DECIMAL(10, 2) NULL,
        donation_raised DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_by INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created (created_at DESC),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("projects table created.");

    console.log("Creating project_images table...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS project_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(255) NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_project (project_id),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);
    console.log("project_images table created.");

    console.log("Creating articles table...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NULL,
        title VARCHAR(200) NOT NULL,
        cover_image_url VARCHAR(500) NULL,
        content TEXT NOT NULL,
        author_id INT NULL,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_project (project_id),
        INDEX idx_published (published_at DESC),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log("articles table created.");

    console.log("\nAll tables created successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

createTables();
