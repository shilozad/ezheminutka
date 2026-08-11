import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
export const dynamic = "force-dynamic";
export default async function Page() {
  try {
    if (await getAdminContext()) redirect("/admin");
  } catch {}
  return (
    <div className="admin-login-page">
      <AdminLogin />
    </div>
  );
}
