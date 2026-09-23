"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const liens = [
  { href: "/", label: "Casino" },
  { href: "/empire", label: "Empire" },
  { href: "/catpack", label: "CatPack" },
];


export default function Navbar() {
  const pathname = usePathname();
  

  return (
    <nav className="flex bg-[#1e1e36] border-3 border-[#2a2a48] rounded-[999px] gap-[4px] p-[4px] w-max h-max">
      {liens.map(({ href, label }) => {
        const isActive = pathname === href
        const classLink = `font-lilitaone font-bold text-[14px] px-[22px] py-[8px] rounded-[999px] cursor-pointor ${
        isActive ? "bg-[#fcdc4d] text-[#0d0d1a] shadow-[3px_3px_0px_0px_#b89600] transition-transform duration-150 hover:-translate-y-[1px]"
        : "text-[#888888]"}`;


        return (
          <Link key={href} href={href} className={classLink}>
            {label}
          </Link>
        )
      })}
    </nav>
  );
}