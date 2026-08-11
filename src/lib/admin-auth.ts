import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";
import type { LocationSlug } from "@/config/locations";

export type AdminContext = {
  id: string;
  username: string;
  displayName: string;
  role: "SUPERADMIN" | "LOCATION_ADMIN";
  allowedLocations: LocationSlug[];
};
const allLocations: LocationSlug[] = ["moscow", "spb", "kazan"];
export async function getAdminContext(): Promise<AdminContext | null> {
  if (!process.env.DATABASE_URL || !process.env.ADMIN_SESSION_SECRET) return null;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) return null;
  const result = await getPool().query(
    `SELECT u.id, u.username, u.display_name, u.role, u.active, u.session_version,
    COALESCE(array_agg(a.location_id) FILTER (WHERE a.location_id IS NOT NULL), '{}') locations
    FROM admin_users u LEFT JOIN admin_user_locations a ON a.admin_user_id=u.id WHERE u.id=$1 GROUP BY u.id`,
    [session.userId],
  );
  const user = result.rows[0];
  if (!user?.active || user.session_version !== session.sessionVersion) return null;
  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    role: user.role,
    allowedLocations: user.role === "SUPERADMIN" ? allLocations : user.locations,
  };
}
export function canAccessLocation(admin: AdminContext, location: string) {
  return admin.allowedLocations.includes(location as LocationSlug);
}
