import Link from "next/link";
import { Button } from "@/components/atoms";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/activities", label: "Activities" },
  { href: "/support", label: "Support Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-bold text-on-surface font-headline"
        >
          Campus Care
        </Link>

        <div className="hidden md:flex items-center space-x-8 font-headline text-sm tracking-tight">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/donate">
          <Button variant="primary">Donate Now</Button>
        </Link>
      </div>
    </nav>
  );
}
