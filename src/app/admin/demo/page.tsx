import type { Metadata } from "next";
import DemoAdmin from "@/components/admin/DemoAdmin";
export const metadata: Metadata = {
  title: "Demo админки — Ежеминутка",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <DemoAdmin />;
}
