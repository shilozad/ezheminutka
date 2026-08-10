import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Migration aborted: DATABASE_URL is required.");
  process.exit(1);
}

const migrationsDirectory = join(dirname(fileURLToPath(import.meta.url)), "..", "db", "migrations");
const pool = new pg.Pool({ connectionString });

try {
  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  for (const filename of files) {
    const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE filename = $1", [
      filename,
    ]);
    if (applied.rowCount) {
      console.log(`skip  ${filename}`);
      continue;
    }

    const client = await pool.connect();
    try {
      console.log(`apply ${filename}`);
      await client.query("BEGIN");
      await client.query(await readFile(join(migrationsDirectory, filename), "utf8"));
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
      await client.query("COMMIT");
      console.log(`done  ${filename}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  console.log("Migrations are up to date.");
} catch (error) {
  console.error("Migration failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
