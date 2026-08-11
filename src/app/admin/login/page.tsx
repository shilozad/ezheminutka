import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
export const dynamic = "force-dynamic";
export default async function Page() {
  try {
    if (await getAdminContext()) redirect("/admin");
  } catch {}
  return (
    <main className="admin-login-page">
      <AdminLogin />
    </main>
  );
}
