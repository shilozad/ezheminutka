import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ app: "ok", database: "not_configured" });
  }

  try {
    await getPool().query("SELECT 1");
    return NextResponse.json({ app: "ok", database: "ok" });
  } catch (error) {
    console.error("Database health check failed", error);
    return NextResponse.json({ app: "ok", database: "unavailable" }, { status: 503 });
  }
}
