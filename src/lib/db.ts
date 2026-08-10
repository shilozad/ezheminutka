import { Pool } from "pg";

let pool: Pool | undefined;

/** Returns a pool only when runtime code explicitly requests it. */
export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({ connectionString, connectionTimeoutMillis: 5_000, max: 5 });
  }

  return pool;
}
