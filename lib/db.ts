import mysql from "mysql2/promise";

/**
 * MySQL connection pool singleton.
 *
 * Cached on `globalThis` so Next.js hot-reload doesn't leak connections.
 * Without this, every code change creates a new pool while the old one's
 * connections are still held open — eventually triggering MySQL's
 * `ER_CON_COUNT_ERROR` (Too many connections).
 */
const globalForDb = globalThis as unknown as {
  __mysqlPool?: mysql.Pool;
};

const pool =
  globalForDb.__mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 60000,
    enableKeepAlive: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mysqlPool = pool;
}

export default pool;
