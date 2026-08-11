import { randomUUID } from "node:crypto";
import { args, password, hash, pool } from "./admin-cli-common.mjs";
const a = args(),
  username = a.username?.trim().toLowerCase(),
  role = a.role,
  locations = a.locations?.split(",").filter(Boolean) ?? [];
if (!username || !a["display-name"] || !["SUPERADMIN", "LOCATION_ADMIN"].includes(role))
  throw new Error("Укажите --username, --display-name и корректный --role.");
if (
  role === "LOCATION_ADMIN" &&
  (!locations.length || locations.some((x) => !["moscow", "spb", "kazan"].includes(x)))
)
  throw new Error("LOCATION_ADMIN требует --locations moscow, spb или kazan.");
const db = await pool();
const client = await db.connect();
try {
  const id = randomUUID(),
    encoded = await hash(await password());
  await client.query("BEGIN");
  await client.query(
    "INSERT INTO admin_users(id,username,display_name,password_hash,role) VALUES($1,$2,$3,$4,$5)",
    [id, username, a["display-name"].trim(), encoded, role],
  );
  for (const location of locations)
    await client.query(
      "INSERT INTO admin_user_locations(admin_user_id,location_id) VALUES($1,$2)",
      [id, location],
    );
  await client.query("COMMIT");
  console.log(`Администратор ${username} создан.`);
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
  await db.end();
}
