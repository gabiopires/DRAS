import mysql from "mysql2/promise";

// Só carrega dotenv LOCALMENTE (Vercel já injeta process.env)
if (process.env.NODE_ENV !== "production") {
  await import("dotenv/config");
}

const sslEnabled = String(process.env.DB_SSL).toLowerCase() === "true";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ...(sslEnabled
    ? { ssl: { rejectUnauthorized: false } }
    : {}),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function healthCheckDb() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows;
}

export default pool;
