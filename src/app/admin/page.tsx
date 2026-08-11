import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import { getAdminBookings } from "@/lib/admin-bookings";
import AdminDashboard from "@/components/admin/AdminDashboard";
export const dynamic = "force-dynamic";
export default async function Page() {
  let admin;
  try {
    admin = await getAdminContext();
  } catch {
    redirect("/admin/login");
  }
  if (!admin) redirect("/admin/login");
  const bookings = await getAdminBookings(admin);
  return <AdminDashboard admin={admin} initialBookings={bookings} />;
}
