/**
 * Database seed script for Hayvan Yardim
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Creates sample data for all 5 user roles and related entities.
 * Requires: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME env vars
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
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

async function seed() {
  const conn = await pool.getConnection();

  try {
    console.log("Seeding database...\n");

    // Hash password for all seed users (password: "123456")
    const hash = await bcrypt.hash("123456", 12);

    // ─── USERS ───────────────────────────────────────
    console.log("Creating users...");
    await conn.execute(`DELETE FROM users WHERE email LIKE '%@seed.test'`);

    const users = [
      ["admin@seed.test", hash, "admin", "Admin", "User", "+905001000001"],
      ["advisor@seed.test", hash, "advisor", "Advisor", "User", "+905001000002"],
      ["volunteer1@seed.test", hash, "volunteer", "Ali", "Yilmaz", "+905001000003"],
      ["volunteer2@seed.test", hash, "volunteer", "Ayse", "Demir", "+905001000004"],
      ["vet@seed.test", hash, "vet", "Dr. Mehmet", "Kaya", "+905001000005"],
      ["user@seed.test", hash, "user", "Zeynep", "Ozturk", "+905001000006"],
    ];

    for (const u of users) {
      await conn.execute(
        `INSERT INTO users (email, password_hash, role, first_name, last_name, phone, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [...u, 39.9208 + Math.random() * 0.05, 32.8541 + Math.random() * 0.05]
      );
    }

    // Get user IDs
    const [userRows] = await conn.execute<any[]>(
      `SELECT id, role, email FROM users WHERE email LIKE '%@seed.test' ORDER BY id`
    );
    const adminId = userRows.find((u: any) => u.role === "admin").id;
    const advisorId = userRows.find((u: any) => u.role === "advisor").id;
    const vol1Id = userRows.find((u: any) => u.email === "volunteer1@seed.test").id;
    const vol2Id = userRows.find((u: any) => u.email === "volunteer2@seed.test").id;
    const vetId = userRows.find((u: any) => u.role === "vet").id;
    const userId = userRows.find((u: any) => u.role === "user").id;

    console.log(`  Created ${users.length} users`);

    // ─── FEEDING POINTS ──────────────────────────────
    console.log("Creating feeding points...");
    const feedingPoints = [
      ["Park Besleme Noktasi", 39.925, 32.860, "Genclik Parki yaninda", "active", advisorId],
      ["Kampus Besleme Noktasi", 39.870, 32.750, "Universitesi kampusunde", "needs_refill", advisorId],
      ["Sokak Besleme", 39.940, 32.870, "Ulus caddesinde", "active", adminId],
    ];

    for (const fp of feedingPoints) {
      await conn.execute(
        `INSERT INTO feeding_points (name, latitude, longitude, description, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        fp
      );
    }
    const [fpRows] = await conn.execute<any[]>(
      `SELECT id FROM feeding_points ORDER BY id DESC LIMIT 3`
    );
    console.log(`  Created ${feedingPoints.length} feeding points`);

    // ─── REPORTS ─────────────────────────────────────
    console.log("Creating reports...");
    const reports = [
      [userId, "injured_animal", "Yarali kedi bulundu, sol on ayagi kirik gorunuyor", 39.922, 32.855, "Kizilay Meydani", "high", "pending"],
      [vol1Id, "injured_animal", "Hasta kopek, hareket edemiyor", 39.930, 32.862, "Tunali Hilmi Cad.", "urgent", "approved"],
      [userId, "feeding_point", "Besleme noktasi bos, mama lazim", 39.870, 32.750, "ODTU Kampus", "medium", "assigned"],
      [vol2Id, "injured_animal", "Kus kanadi kirik, ucamiyor", 39.945, 32.880, "Ulus Parki", "medium", "completed"],
      [userId, "injured_animal", "Sokak kedisi hasta gorunuyor", 39.918, 32.845, "Cankaya", "low", "pending"],
    ];

    for (const r of reports) {
      await conn.execute(
        `INSERT INTO reports (reporter_id, type, description, latitude, longitude, address, priority, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        r
      );
    }
    const [reportRows] = await conn.execute<any[]>(
      `SELECT id, type FROM reports ORDER BY id DESC LIMIT 5`
    );
    console.log(`  Created ${reports.length} reports`);

    // ─── ANIMALS ─────────────────────────────────────
    console.log("Creating animals...");
    const injuredReports = reportRows.filter((r: any) => r.type === "injured_animal");
    const animals = [
      [injuredReports[0]?.id, "Kedi", "Yarali kedi, sol on ayak kirik", "severe", "reported"],
      [injuredReports[1]?.id, "Kopek", "Hasta kopek, hareket edemiyor", "critical", "in_rescue"],
      [injuredReports[2]?.id, "Kus", "Kanadi kirik kus", "moderate", "at_vet"],
      [injuredReports[3]?.id, "Kedi", "Hasta sokak kedisi", "minor", "reported"],
    ];

    for (const a of animals) {
      if (a[0]) {
        await conn.execute(
          `INSERT INTO animals (report_id, species, description, condition_level, status)
           VALUES (?, ?, ?, ?, ?)`,
          a
        );
      }
    }
    const [animalRows] = await conn.execute<any[]>(
      `SELECT id FROM animals ORDER BY id DESC LIMIT 4`
    );
    console.log(`  Created ${animals.filter((a) => a[0]).length} animals`);

    // ─── TASKS ───────────────────────────────────────
    console.log("Creating tasks...");
    const tasks = [
      [reportRows[0]?.id, advisorId, vol1Id, "rescue", "pending", "high", "Kediyi kurtarip veterinere gotur"],
      [reportRows[1]?.id, advisorId, vol2Id, "vet_transport", "accepted", "urgent", "Kopegi veterinere tasi"],
      [reportRows[2]?.id, advisorId, vol1Id, "feeding", "completed", "medium", "Besleme noktasini doldur"],
    ];

    for (const t of tasks) {
      await conn.execute(
        `INSERT INTO tasks (report_id, assigned_by, assigned_to, type, status, priority, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        t
      );
    }
    const [taskRows] = await conn.execute<any[]>(
      `SELECT id FROM tasks ORDER BY id DESC LIMIT 3`
    );
    console.log(`  Created ${tasks.length} tasks`);

    // ─── VET AVAILABILITY ────────────────────────────
    console.log("Creating vet availability...");
    await conn.execute(
      `INSERT INTO vet_availability (vet_id, is_available, workload, note)
       VALUES (?, TRUE, 'light', 'Musait, vaka kabul ediyorum')
       ON DUPLICATE KEY UPDATE is_available = TRUE`,
      [vetId]
    );
    console.log("  Created 1 vet availability");

    // ─── VET CASES ───────────────────────────────────
    console.log("Creating vet cases...");
    if (animalRows.length >= 2) {
      await conn.execute(
        `INSERT INTO vet_cases (animal_id, vet_id, task_id, diagnosis, treatment, outcome, notes)
         VALUES (?, ?, ?, 'Kirik ayak', 'Alci ve istirahat', 'ongoing', 'Tedavi devam ediyor')`,
        [animalRows[0].id, vetId, taskRows[0]?.id]
      );
      await conn.execute(
        `INSERT INTO vet_cases (animal_id, vet_id, diagnosis, treatment, outcome, notes)
         VALUES (?, ?, 'Enfeksiyon', 'Antibiyotik tedavisi', 'recovered', 'Tedavi tamamlandi')`,
        [animalRows[1].id, vetId]
      );
    }
    console.log("  Created 2 vet cases");

    // ─── DONATIONS ───────────────────────────────────
    console.log("Creating donations...");
    const donations = [
      [vol1Id, 100.0, "credit_card", "Hayvan tedavisi icin"],
      [userId, 250.0, "bank_transfer", "Mama alimi icin bagis"],
      [vol2Id, 50.0, "credit_card", null],
    ];

    for (const d of donations) {
      await conn.execute(
        `INSERT INTO donations (donor_id, amount, payment_method, note)
         VALUES (?, ?, ?, ?)`,
        d
      );
    }
    console.log(`  Created ${donations.length} donations`);

    // ─── PURCHASES ───────────────────────────────────
    console.log("Creating purchases...");
    await conn.execute(
      `INSERT INTO purchases (admin_id, description, amount, receipt_url)
       VALUES (?, 'Kedi mamasi 20kg', 150.00, NULL)`,
      [adminId]
    );
    console.log("  Created 1 purchase");

    // ─── FEEDING POINT REFILLS ───────────────────────
    console.log("Creating feeding point refills...");
    if (fpRows.length > 0) {
      await conn.execute(
        `INSERT INTO feeding_point_refills (feeding_point_id, volunteer_id, refill_type, note, status, approved_by)
         VALUES (?, ?, 'both', 'Mama ve su dolduruldu', 'approved', ?)`,
        [fpRows[0].id, vol1Id, advisorId]
      );
      await conn.execute(
        `INSERT INTO feeding_point_refills (feeding_point_id, volunteer_id, refill_type, note, status)
         VALUES (?, ?, 'food', 'Mama eklendi', 'pending')`,
        [fpRows[1].id, vol2Id]
      );
    }
    console.log("  Created 2 feeding point refills");

    // ─── NOTIFICATIONS ───────────────────────────────
    console.log("Creating notifications...");
    const notifications = [
      [vol1Id, "Yeni Gorev", "Size yeni bir kurtarma gorevi atandi", "task_assigned"],
      [vol2Id, "Yeni Gorev", "Size yeni bir veteriner tasiama gorevi atandi", "task_assigned"],
      [userId, "Rapor Durumu", "1 numarali raporunuzun durumu guncellendi", "report_status"],
      [vetId, "Veteriner Talebi", "Yeni bir hayvan vakasi mevcut", "vet_request"],
    ];

    for (const n of notifications) {
      await conn.execute(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES (?, ?, ?, ?)`,
        n
      );
    }
    console.log(`  Created ${notifications.length} notifications`);

    console.log("\nSeed completed successfully!");
    console.log("\nTest accounts (password: 123456):");
    console.log("  admin@seed.test     — Admin");
    console.log("  advisor@seed.test   — Advisor");
    console.log("  volunteer1@seed.test — Volunteer");
    console.log("  volunteer2@seed.test — Volunteer");
    console.log("  vet@seed.test       — Vet");
    console.log("  user@seed.test      — User");
  } catch (err) {
    console.error("Seed failed:", err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
