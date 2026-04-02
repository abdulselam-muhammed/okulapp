import Link from "next/link";
import { Icon } from "@/components/atoms";

const QUICK_LINKS = [
  { href: "/donate", label: "Mama Bagisi" },
  { href: "/register", label: "Gonullu Ol" },
  { href: "/activities", label: "Istasyon Haritasi" },
  { href: "/support", label: "Sikca Sorulan Sorular" },
];

const LEGAL_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "/login", label: "Volunteer Login" },
];

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[2rem] mt-20 bg-zinc-100 font-body text-sm leading-relaxed">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full px-12 py-16 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="space-y-6">
          <div className="text-lg font-bold text-on-surface font-headline">
            Campus Care
          </div>
          <p className="text-zinc-500 max-w-xs">
            Universite kampuslerinde hayvan refahini ve ekosistem dengesini
            korumak icin calisan bir topluluk girismidir.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface transition-transform hover:scale-110"
            >
              <Icon name="share" className="text-sm" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface transition-transform hover:scale-110"
            >
              <Icon name="mail" className="text-sm" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs">
            Hizli Linkler
          </h4>
          <ul className="space-y-4">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-500 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-6">
          <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs">
            Yasal
          </h4>
          <ul className="space-y-4">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-zinc-500 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="pt-4 text-xs text-zinc-400">
            © 2024 Campus Animal Sanctuary. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
