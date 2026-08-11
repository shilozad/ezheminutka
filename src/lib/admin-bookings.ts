import { getPool } from "@/lib/db";
import type { AdminContext } from "@/lib/admin-auth";
export type AdminBooking = {
  id: string;
  publicNumber: string;
  locationId: string;
  fullName: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  guestCount: number;
  visitType: string;
  comment: string | null;
  status: string;
  adminNote: string | null;
  source: string;
  createdAt: string;
};
export async function getAdminBookings(admin: AdminContext): Promise<AdminBooking[]> {
  const result = await getPool().query(
    `SELECT id, public_number "publicNumber", location_id "locationId", full_name "fullName", phone,
    visit_date::text "visitDate", to_char(visit_time,'HH24:MI') "visitTime", guest_count "guestCount", visit_type "visitType",
    comment, status, admin_note "adminNote", source, created_at::text "createdAt" FROM bookings
    WHERE ($1::boolean OR location_id = ANY($2::varchar[]))
    ORDER BY (visit_date < CURRENT_DATE), visit_date, visit_time LIMIT 300`,
    [admin.role === "SUPERADMIN", admin.allowedLocations],
  );
  return result.rows;
}
