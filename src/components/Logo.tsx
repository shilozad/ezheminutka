import Link from "next/link";
import { brandConfig } from "@/config/brand";
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Ежеминутка — на главную">
      {/* The endpoint safely falls back to the bundled logo when CMS/DB is unavailable. */}
      <img src="/api/public/brand/logo" alt={brandConfig.logoAlt} width={218} height={48} />
    </Link>
  );
}
