import Link from "next/link";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function TextLink({ href, children, className = "" }: TextLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-semibold text-primary hover:text-primary-dim transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
