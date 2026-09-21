import Link from "next/link";

const liens = [
  { href: "/casino", label: "Casino" },
  { href: "/empire", label: "Empire" },
  { href: "/catpack", label: "CatPack" },
  { href: "/signin", label: "Se connecter"}
];

export default function Navbar() {
  return (
    <nav>
      {liens.map(({ href, label }) => (
        <Link key={href} href={href}>{label}</Link>
      ))}
    </nav>
  );
}