"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminContext } from "@/lib/admin-auth";
const cities = { moscow: "Москва", spb: "Санкт-Петербург", kazan: "Казань" };
export function AdminHeader({ admin, subtitle }: { admin: AdminContext; subtitle: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }
  return (
    <header className="admin-header">
      <div>
        <b>Ежеминутка</b>
        <span>{subtitle}</span>
        <nav>
          <Link href="/admin">Брони</Link>
          <Link href="/admin/appearance">Внешний вид</Link>
        </nav>
      </div>
      <div>
        <span>
          {admin.displayName} ·{" "}
          {admin.role === "SUPERADMIN"
            ? "Все кафе"
            : admin.allowedLocations.map((x) => cities[x]).join(", ")}
        </span>
        <button onClick={logout}>Выйти</button>
      </div>
    </header>
  );
}
