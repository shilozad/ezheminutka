import Image from "next/image";
import Link from "next/link";
import { brandConfig } from "@/config/brand";
export function Logo() { return <Link className="logo" href="/" aria-label="Ежеминутка — на главную"><Image src={brandConfig.logoSrc} alt={brandConfig.logoAlt} width={218} height={48} priority /></Link>; }
