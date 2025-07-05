import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Fallback for local development if DATABASE_URL isn't set
if (!process.env.DATABASE_URL) {
  pool.options.user = process.env.DB_USER;
  pool.options.host = process.env.DB_HOST;
  pool.options.database = process.env.DB_NAME;
  pool.options.password = process.env.DB_PASSWORD;
  pool.options.port = parseInt(process.env.DB_PORT || "5432", 10);
}

// Test connection and log any errors during pool creation or connection
pool.on("connect", () => {
  console.log("Successfully connected to the PostgreSQL database pool");
});

export default pool;
