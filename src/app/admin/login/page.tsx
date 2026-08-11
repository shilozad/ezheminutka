import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
export const dynamic = "force-dynamic";
export default async function Page() {
  let admin = null;
  try {
    admin = await getAdminContext();
  } catch {}
  if (admin) redirect("/admin");
  return (
    <div className="admin-login-page">
      <AdminLogin />
    </div>
  );
}
