/**
 * Cleanup script — removes all seed data from the database.
 *
 * Usage: npx tsx scripts/cleanup-seed.ts
 *
 * Deletes users with @seed.test emails. Related records (donations, tasks,
 * reports, animals, vet cases, etc.) are removed automatically via
 * ON DELETE CASCADE on the foreign keys.
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
  waitForConnections: true,
  connectionLimit: 5,
});

async function cleanup() {
  const conn = await pool.getConnection();

  try {
    console.log("Cleaning up seed data...\n");

    // Find seed users first to report what will be deleted
    const [seedUsers] = await conn.execute<any[]>(
      `SELECT id, email, first_name, last_name FROM users WHERE email LIKE '%@seed.test'`
    );

    if (seedUsers.length === 0) {
      console.log("No seed users found. Nothing to clean up.");
      return;
    }

    console.log(`Found ${seedUsers.length} seed user(s):`);
    seedUsers.forEach((u: any) => {
      console.log(`  - ${u.first_name} ${u.last_name} (${u.email})`);
    });
    console.log();

    // Clean feeding_points explicitly (created_by has no CASCADE in some setups)
    await conn.execute(
      `DELETE FROM feeding_points WHERE created_by IN (SELECT id FROM users WHERE email LIKE '%@seed.test')`
    );

    // Delete the seed users — CASCADE will handle donations, tasks, reports, animals, etc.
    const [result] = await conn.execute<any>(
      `DELETE FROM users WHERE email LIKE '%@seed.test'`
    );

    console.log(`Deleted ${result.affectedRows} seed user(s) and all related records.`);
    console.log("\nCleanup complete.");
  } catch (err) {
    console.error("Cleanup failed:", err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

cleanup();
